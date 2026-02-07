/**
 * IndexedDB wrapper for offline data storage
 * Provides methods for storing and retrieving course data, enrollments, and user progress
 */

import type { Bundle, BundleItem, Enrollment, Session, Profile, TeacherProfile } from '@/types/database';

const DB_NAME = 'SacredChainOfflineDB';
const DB_VERSION = 1;

// Store names
export const STORES = {
  BUNDLES: 'bundles',
  BUNDLE_ITEMS: 'bundle_items',
  ENROLLMENTS: 'enrollments',
  SESSIONS: 'sessions',
  PROFILES: 'profiles',
  TEACHER_PROFILES: 'teacher_profiles',
  PENDING_ACTIONS: 'pending_actions',
  COURSE_CONTENT: 'course_content',
  SYNC_METADATA: 'sync_metadata',
} as const;

// Pending action types
export interface PendingAction {
  id: string;
  type: 'enrollment' | 'progress_update' | 'session_booking' | 'payment' | 'journal_entry';
  payload: unknown;
  createdAt: string;
  retryCount: number;
  lastError?: string;
}

// Sync metadata
export interface SyncMetadata {
  key: string;
  lastSyncedAt: string;
  syncStatus: 'pending' | 'syncing' | 'completed' | 'error';
}

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInit();
    return this.initPromise;
  }

  private doInit(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Bundles store
        if (!db.objectStoreNames.contains(STORES.BUNDLES)) {
          const bundleStore = db.createObjectStore(STORES.BUNDLES, { keyPath: 'id' });
          bundleStore.createIndex('teacher_id', 'teacher_id', { unique: false });
          bundleStore.createIndex('category', 'category', { unique: false });
          bundleStore.createIndex('status', 'status', { unique: false });
        }

        // Bundle items store
        if (!db.objectStoreNames.contains(STORES.BUNDLE_ITEMS)) {
          const itemStore = db.createObjectStore(STORES.BUNDLE_ITEMS, { keyPath: 'id' });
          itemStore.createIndex('bundle_id', 'bundle_id', { unique: false });
        }

        // Enrollments store
        if (!db.objectStoreNames.contains(STORES.ENROLLMENTS)) {
          const enrollmentStore = db.createObjectStore(STORES.ENROLLMENTS, { keyPath: 'id' });
          enrollmentStore.createIndex('student_id', 'student_id', { unique: false });
          enrollmentStore.createIndex('bundle_id', 'bundle_id', { unique: false });
          enrollmentStore.createIndex('status', 'status', { unique: false });
        }

        // Sessions store
        if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
          const sessionStore = db.createObjectStore(STORES.SESSIONS, { keyPath: 'id' });
          sessionStore.createIndex('student_id', 'student_id', { unique: false });
          sessionStore.createIndex('teacher_id', 'teacher_id', { unique: false });
          sessionStore.createIndex('enrollment_id', 'enrollment_id', { unique: false });
        }

        // Profiles store
        if (!db.objectStoreNames.contains(STORES.PROFILES)) {
          db.createObjectStore(STORES.PROFILES, { keyPath: 'id' });
        }

        // Teacher profiles store
        if (!db.objectStoreNames.contains(STORES.TEACHER_PROFILES)) {
          const teacherStore = db.createObjectStore(STORES.TEACHER_PROFILES, { keyPath: 'id' });
          teacherStore.createIndex('user_id', 'user_id', { unique: true });
        }

        // Pending actions store
        if (!db.objectStoreNames.contains(STORES.PENDING_ACTIONS)) {
          const actionStore = db.createObjectStore(STORES.PENDING_ACTIONS, { keyPath: 'id' });
          actionStore.createIndex('type', 'type', { unique: false });
          actionStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Course content store (for caching lesson content)
        if (!db.objectStoreNames.contains(STORES.COURSE_CONTENT)) {
          const contentStore = db.createObjectStore(STORES.COURSE_CONTENT, { keyPath: 'id' });
          contentStore.createIndex('bundle_id', 'bundle_id', { unique: false });
          contentStore.createIndex('cachedAt', 'cachedAt', { unique: false });
        }

        // Sync metadata store
        if (!db.objectStoreNames.contains(STORES.SYNC_METADATA)) {
          db.createObjectStore(STORES.SYNC_METADATA, { keyPath: 'key' });
        }
      };
    });
  }

  // Generic get method
  async get<T>(storeName: string, id: string): Promise<T | null> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Generic get all method
  async getAll<T>(storeName: string): Promise<T[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Generic get by index
  async getByIndex<T>(storeName: string, indexName: string, value: IDBValidKey): Promise<T[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Generic put method
  async put<T>(storeName: string, value: T): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Generic delete method
  async delete(storeName: string, id: string): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Generic clear method
  async clear(storeName: string): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Count method
  async count(storeName: string): Promise<number> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // ===== Bundle Methods =====
  async saveBundle(bundle: Bundle): Promise<void> {
    await this.put(STORES.BUNDLES, { ...bundle, cachedAt: new Date().toISOString() });
  }

  async saveBundles(bundles: Bundle[]): Promise<void> {
    await Promise.all(bundles.map(bundle => this.saveBundle(bundle)));
  }

  async getBundle(id: string): Promise<Bundle | null> {
    return this.get<Bundle>(STORES.BUNDLES, id);
  }

  async getAllBundles(): Promise<Bundle[]> {
    return this.getAll<Bundle>(STORES.BUNDLES);
  }

  async getBundlesByTeacher(teacherId: string): Promise<Bundle[]> {
    return this.getByIndex<Bundle>(STORES.BUNDLES, 'teacher_id', teacherId);
  }

  // ===== Bundle Items Methods =====
  async saveBundleItem(item: BundleItem): Promise<void> {
    await this.put(STORES.BUNDLE_ITEMS, { ...item, cachedAt: new Date().toISOString() });
  }

  async saveBundleItems(items: BundleItem[]): Promise<void> {
    await Promise.all(items.map(item => this.saveBundleItem(item)));
  }

  async getBundleItems(bundleId: string): Promise<BundleItem[]> {
    return this.getByIndex<BundleItem>(STORES.BUNDLE_ITEMS, 'bundle_id', bundleId);
  }

  // ===== Enrollment Methods =====
  async saveEnrollment(enrollment: Enrollment): Promise<void> {
    await this.put(STORES.ENROLLMENTS, { ...enrollment, cachedAt: new Date().toISOString() });
  }

  async saveEnrollments(enrollments: Enrollment[]): Promise<void> {
    await Promise.all(enrollments.map(enrollment => this.saveEnrollment(enrollment)));
  }

  async getEnrollment(id: string): Promise<Enrollment | null> {
    return this.get<Enrollment>(STORES.ENROLLMENTS, id);
  }

  async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    return this.getByIndex<Enrollment>(STORES.ENROLLMENTS, 'student_id', studentId);
  }

  async updateEnrollmentProgress(id: string, progressPercent: number, sessionsCompleted: number): Promise<void> {
    const enrollment = await this.getEnrollment(id);
    if (enrollment) {
      await this.saveEnrollment({
        ...enrollment,
        progress_percent: progressPercent,
        sessions_completed: sessionsCompleted,
        updated_at: new Date().toISOString(),
      });
    }
  }

  // ===== Session Methods =====
  async saveSession(session: Session): Promise<void> {
    await this.put(STORES.SESSIONS, { ...session, cachedAt: new Date().toISOString() });
  }

  async saveSessions(sessions: Session[]): Promise<void> {
    await Promise.all(sessions.map(session => this.saveSession(session)));
  }

  async getSessionsByEnrollment(enrollmentId: string): Promise<Session[]> {
    return this.getByIndex<Session>(STORES.SESSIONS, 'enrollment_id', enrollmentId);
  }

  // ===== Profile Methods =====
  async saveProfile(profile: Profile): Promise<void> {
    await this.put(STORES.PROFILES, { ...profile, cachedAt: new Date().toISOString() });
  }

  async getProfile(id: string): Promise<Profile | null> {
    return this.get<Profile>(STORES.PROFILES, id);
  }

  // ===== Teacher Profile Methods =====
  async saveTeacherProfile(profile: TeacherProfile): Promise<void> {
    await this.put(STORES.TEACHER_PROFILES, { ...profile, cachedAt: new Date().toISOString() });
  }

  async getTeacherProfile(userId: string): Promise<TeacherProfile | null> {
    const profiles = await this.getByIndex<TeacherProfile>(STORES.TEACHER_PROFILES, 'user_id', userId);
    return profiles[0] || null;
  }

  // ===== Pending Actions Methods =====
  async addPendingAction(action: Omit<PendingAction, 'id' | 'createdAt' | 'retryCount'>): Promise<string> {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const pendingAction: PendingAction = {
      ...action,
      id,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    await this.put(STORES.PENDING_ACTIONS, pendingAction);
    return id;
  }

  async getPendingActions(): Promise<PendingAction[]> {
    return this.getAll<PendingAction>(STORES.PENDING_ACTIONS);
  }

  async getPendingActionsByType(type: PendingAction['type']): Promise<PendingAction[]> {
    return this.getByIndex<PendingAction>(STORES.PENDING_ACTIONS, 'type', type);
  }

  async updatePendingAction(id: string, updates: Partial<PendingAction>): Promise<void> {
    const action = await this.get<PendingAction>(STORES.PENDING_ACTIONS, id);
    if (action) {
      await this.put(STORES.PENDING_ACTIONS, { ...action, ...updates });
    }
  }

  async incrementRetryCount(id: string, error?: string): Promise<void> {
    const action = await this.get<PendingAction>(STORES.PENDING_ACTIONS, id);
    if (action) {
      await this.put(STORES.PENDING_ACTIONS, {
        ...action,
        retryCount: action.retryCount + 1,
        lastError: error,
      });
    }
  }

  async removePendingAction(id: string): Promise<void> {
    await this.delete(STORES.PENDING_ACTIONS, id);
  }

  async clearPendingActions(): Promise<void> {
    await this.clear(STORES.PENDING_ACTIONS);
  }

  // ===== Course Content Methods =====
  async saveCourseContent(content: { id: string; bundle_id: string; data: unknown }): Promise<void> {
    await this.put(STORES.COURSE_CONTENT, {
      ...content,
      cachedAt: new Date().toISOString(),
    });
  }

  async getCourseContent(bundleId: string): Promise<unknown | null> {
    const items = await this.getByIndex<{ id: string; bundle_id: string; data: unknown; cachedAt: string }>(
      STORES.COURSE_CONTENT,
      'bundle_id',
      bundleId
    );
    return items[0]?.data || null;
  }

  async clearOldCourseContent(maxAgeDays: number = 30): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxAgeDays);
    
    const allContent = await this.getAll<{ id: string; cachedAt: string }>(STORES.COURSE_CONTENT);
    const oldItems = allContent.filter(item => new Date(item.cachedAt) < cutoff);
    
    await Promise.all(oldItems.map(item => this.delete(STORES.COURSE_CONTENT, item.id)));
  }

  // ===== Sync Metadata Methods =====
  async updateSyncMetadata(key: string, status: SyncMetadata['syncStatus']): Promise<void> {
    await this.put(STORES.SYNC_METADATA, {
      key,
      lastSyncedAt: new Date().toISOString(),
      syncStatus: status,
    });
  }

  async getSyncMetadata(key: string): Promise<SyncMetadata | null> {
    return this.get<SyncMetadata>(STORES.SYNC_METADATA, key);
  }

  // ===== Utility Methods =====
  async clearAllData(): Promise<void> {
    const stores = Object.values(STORES);
    await Promise.all(stores.map(store => this.clear(store)));
  }

  async getStorageStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    for (const storeName of Object.values(STORES)) {
      stats[storeName] = await this.count(storeName);
    }
    return stats;
  }
}

// Export singleton instance
export const indexedDBService = new IndexedDBService();
export default indexedDBService;
