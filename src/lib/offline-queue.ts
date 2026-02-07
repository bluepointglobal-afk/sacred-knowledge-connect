/**
 * Offline Queue Service
 * Manages pending actions that need to be synced when the user comes back online
 */

import { indexedDBService, type PendingAction } from './indexeddb';
import { supabase } from './supabase';
import type { EnrollmentInsert, SessionInsert } from '@/types/database';
import { toast } from 'sonner';

// Action handlers for different types
export interface QueueSyncResult {
  success: boolean;
  error?: string;
  shouldRetry: boolean;
}

class OfflineQueueService {
  private isSyncing = false;
  private syncListeners: Array<(isSyncing: boolean) => void> = [];
  private lastSyncResult: { success: number; failed: number; timestamp: Date } | null = null;

  constructor() {
    // Listen for online events to trigger sync
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.triggerSync();
      });
    }
  }

  // Register a sync state listener
  onSyncStateChange(listener: (isSyncing: boolean) => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener);
    };
  }

  private setSyncing(syncing: boolean) {
    this.isSyncing = syncing;
    this.syncListeners.forEach(listener => listener(syncing));
  }

  isCurrentlySyncing(): boolean {
    return this.isSyncing;
  }

  getLastSyncResult() {
    return this.lastSyncResult;
  }

  // Queue an enrollment action
  async queueEnrollment(bundleId: string): Promise<string> {
    const actionId = await indexedDBService.addPendingAction({
      type: 'enrollment',
      payload: { bundleId },
    });

    toast.info('Enrollment saved. Will sync when you\'re back online.');
    
    // Try to sync immediately if online
    if (navigator.onLine) {
      this.triggerSync();
    }

    return actionId;
  }

  // Queue a progress update
  async queueProgressUpdate(
    enrollmentId: string,
    progressPercent: number,
    sessionsCompleted: number
  ): Promise<string> {
    const actionId = await indexedDBService.addPendingAction({
      type: 'progress_update',
      payload: { enrollmentId, progressPercent, sessionsCompleted },
    });

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.triggerSync();
    }

    return actionId;
  }

  // Queue a session booking
  async queueSessionBooking(sessionData: Omit<SessionInsert, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const actionId = await indexedDBService.addPendingAction({
      type: 'session_booking',
      payload: sessionData,
    });

    toast.info('Session booking saved. Will sync when you\'re back online.');

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.triggerSync();
    }

    return actionId;
  }

  // Queue a payment action
  async queuePayment(paymentData: {
    bundleId?: string;
    teacherId?: string;
    amount: number;
    currency: string;
    paymentType: 'bundle' | 'session' | 'tip';
  }): Promise<string> {
    const actionId = await indexedDBService.addPendingAction({
      type: 'payment',
      payload: paymentData,
    });

    toast.info('Payment queued. Will process when you\'re back online.', {
      description: 'Don\'t worry, your spot is reserved.',
    });

    return actionId;
  }

  // Queue a journal entry
  async queueJournalEntry(entryData: {
    bundleId?: string;
    sessionId?: string;
    title: string;
    content: string;
    mood?: string;
    tags?: string[];
    isPrivate?: boolean;
  }): Promise<string> {
    const actionId = await indexedDBService.addPendingAction({
      type: 'journal_entry',
      payload: entryData,
    });

    toast.info('Journal entry saved locally. Will sync when you\'re back online.');

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.triggerSync();
    }

    return actionId;
  }

  // Get count of pending actions
  async getPendingCount(): Promise<number> {
    const actions = await indexedDBService.getPendingActions();
    return actions.length;
  }

  // Get all pending actions
  async getPendingActions(): Promise<PendingAction[]> {
    return indexedDBService.getPendingActions();
  }

  // Main sync method
  async triggerSync(): Promise<{ success: number; failed: number }> {
    if (this.isSyncing || !navigator.onLine) {
      return { success: 0, failed: 0 };
    }

    this.setSyncing(true);
    let successCount = 0;
    let failedCount = 0;

    try {
      const pendingActions = await indexedDBService.getPendingActions();
      
      if (pendingActions.length === 0) {
        this.setSyncing(false);
        return { success: 0, failed: 0 };
      }

      console.log(`[OfflineQueue] Starting sync of ${pendingActions.length} pending actions`);

      // Sort by creation date (oldest first)
      const sortedActions = pendingActions.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      for (const action of sortedActions) {
        // Skip if max retries reached
        if (action.retryCount >= 5) {
          console.warn(`[OfflineQueue] Action ${action.id} exceeded max retries, removing`);
          await indexedDBService.removePendingAction(action.id);
          failedCount++;
          continue;
        }

        try {
          const result = await this.processAction(action);
          
          if (result.success) {
            await indexedDBService.removePendingAction(action.id);
            successCount++;
          } else if (result.shouldRetry) {
            await indexedDBService.incrementRetryCount(action.id, result.error);
            failedCount++;
          } else {
            // Permanent failure, remove it
            await indexedDBService.removePendingAction(action.id);
            failedCount++;
            console.error(`[OfflineQueue] Permanent failure for action ${action.id}:`, result.error);
          }
        } catch (error) {
          await indexedDBService.incrementRetryCount(
            action.id,
            error instanceof Error ? error.message : 'Unknown error'
          );
          failedCount++;
        }
      }

      this.lastSyncResult = {
        success: successCount,
        failed: failedCount,
        timestamp: new Date(),
      };

      if (successCount > 0) {
        toast.success(`Synced ${successCount} item${successCount > 1 ? 's' : ''}`);
      }

      if (failedCount > 0) {
        const remaining = await indexedDBService.getPendingActions();
        if (remaining.length > 0) {
          toast.warning(`${remaining.length} item(s) will retry later`);
        }
      }

      console.log(`[OfflineQueue] Sync complete: ${successCount} success, ${failedCount} failed`);

    } catch (error) {
      console.error('[OfflineQueue] Sync error:', error);
    } finally {
      this.setSyncing(false);
    }

    return { success: successCount, failed: failedCount };
  }

  // Process individual actions
  private async processAction(action: PendingAction): Promise<QueueSyncResult> {
    switch (action.type) {
      case 'enrollment':
        return this.processEnrollment(action.payload as { bundleId: string });
      case 'progress_update':
        return this.processProgressUpdate(action.payload as {
          enrollmentId: string;
          progressPercent: number;
          sessionsCompleted: number;
        });
      case 'session_booking':
        return this.processSessionBooking(action.payload as SessionInsert);
      case 'payment':
        return this.processPayment(action.payload as {
          bundleId?: string;
          teacherId?: string;
          amount: number;
          currency: string;
          paymentType: 'bundle' | 'session' | 'tip';
        });
      case 'journal_entry':
        return this.processJournalEntry(action.payload as {
          bundleId?: string;
          sessionId?: string;
          title: string;
          content: string;
          mood?: string;
          tags?: string[];
          isPrivate?: boolean;
        });
      default:
        return { success: false, shouldRetry: false, error: 'Unknown action type' };
    }
  }

  private async processEnrollment(payload: { bundleId: string }): Promise<QueueSyncResult> {
    try {
      // Check if enrollment already exists
      const { data: existing, error: checkError } = await supabase
        .from('enrollments')
        .select('id, status')
        .eq('bundle_id', payload.bundleId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        if (existing.status === 'active') {
          // Already enrolled, consider this a success
          return { success: true, shouldRetry: false };
        }
        // Reactivate enrollment
        const { error } = await supabase
          .from('enrollments')
          .update({
            status: 'active',
            started_at: new Date().toISOString(),
            progress_percent: 0,
            sessions_completed: 0,
            completed_at: null,
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new enrollment
        const { error } = await supabase.from('enrollments').insert({
          bundle_id: payload.bundleId,
          status: 'active',
          started_at: new Date().toISOString(),
        });

        if (error) throw error;
      }

      return { success: true, shouldRetry: false };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Enrollment failed';
      // Retry on network errors, not on auth or validation errors
      const shouldRetry = !errorMessage.includes('auth') && !errorMessage.includes('permission');
      return { success: false, shouldRetry, error: errorMessage };
    }
  }

  private async processProgressUpdate(payload: {
    enrollmentId: string;
    progressPercent: number;
    sessionsCompleted: number;
  }): Promise<QueueSyncResult> {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({
          progress_percent: payload.progressPercent,
          sessions_completed: payload.sessionsCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payload.enrollmentId);

      if (error) throw error;
      return { success: true, shouldRetry: false };
    } catch (error) {
      return {
        success: false,
        shouldRetry: true,
        error: error instanceof Error ? error.message : 'Progress update failed',
      };
    }
  }

  private async processSessionBooking(payload: SessionInsert): Promise<QueueSyncResult> {
    try {
      const { error } = await supabase.from('sessions').insert(payload);

      if (error) throw error;
      return { success: true, shouldRetry: false };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Session booking failed';
      // Don't retry if session time is already booked
      const shouldRetry = !errorMessage.includes('unique') && !errorMessage.includes('conflict');
      return { success: false, shouldRetry, error: errorMessage };
    }
  }

  private async processPayment(payload: {
    bundleId?: string;
    teacherId?: string;
    amount: number;
    currency: string;
    paymentType: 'bundle' | 'session' | 'tip';
  }): Promise<QueueSyncResult> {
    try {
      // Payments require user interaction - redirect to checkout
      // Store the payment intent in local storage for when user comes back
      const pendingPayment = {
        ...payload,
        queuedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('pending_payment', JSON.stringify(pendingPayment));
      
      // Return failure but don't remove from queue
      // The payment flow needs user interaction
      return {
        success: false,
        shouldRetry: false,
        error: 'Payment requires user confirmation - redirecting to checkout',
      };
    } catch (error) {
      return {
        success: false,
        shouldRetry: true,
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  }

  private async processJournalEntry(payload: {
    bundleId?: string;
    sessionId?: string;
    title: string;
    content: string;
    mood?: string;
    tags?: string[];
    isPrivate?: boolean;
  }): Promise<QueueSyncResult> {
    try {
      const { error } = await supabase.from('journal_entries').insert({
        bundle_id: payload.bundleId,
        session_id: payload.sessionId,
        title: payload.title,
        content: payload.content,
        mood: payload.mood,
        tags: payload.tags || [],
        is_private: payload.isPrivate ?? true,
      });

      if (error) throw error;
      return { success: true, shouldRetry: false };
    } catch (error) {
      return {
        success: false,
        shouldRetry: true,
        error: error instanceof Error ? error.message : 'Journal entry sync failed',
      };
    }
  }

  // Clear all pending actions (use with caution)
  async clearAllPending(): Promise<void> {
    await indexedDBService.clearPendingActions();
    toast.info('All pending actions cleared');
  }

  // Retry a specific action
  async retryAction(actionId: string): Promise<QueueSyncResult> {
    const action = await indexedDBService.get<PendingAction>('pending_actions', actionId);
    if (!action) {
      return { success: false, shouldRetry: false, error: 'Action not found' };
    }

    const result = await this.processAction(action);
    
    if (result.success) {
      await indexedDBService.removePendingAction(actionId);
    } else {
      await indexedDBService.incrementRetryCount(actionId, result.error);
    }

    return result;
  }
}

// Export singleton instance
export const offlineQueue = new OfflineQueueService();
export default offlineQueue;
