import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-950 px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <WifiOff className="h-5 w-5" />
        <p className="font-medium">
          You are currently offline. Some features may be limited.
        </p>
      </div>
    </div>
  );
}
