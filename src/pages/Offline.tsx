import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Offline() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
          <CardDescription className="text-base">
            It looks like you've lost your internet connection. Don't worry, we've saved your progress!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">What you can still do:</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Browse previously loaded pages</li>
              <li>• View cached course content</li>
              <li>• Access your downloaded materials</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
              Coming back online?
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Once you reconnect, all your data will sync automatically.
            </p>
          </div>

          <Button onClick={handleRetry} className="w-full" size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            Check your WiFi or mobile data connection
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
