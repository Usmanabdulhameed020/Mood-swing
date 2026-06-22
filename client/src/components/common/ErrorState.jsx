import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function ErrorState({
  message = "Something went wrong while fetching details.",
  onRetry
}) {
  return (
    <Card className="max-w-md mx-auto text-center py-8 px-6 border-red-200/50 dark:border-red-900/30 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mb-4 text-red-500 dark:text-red-400 animate-pulse">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-md font-bold text-slate-800 dark:text-zinc-150 mb-2">Error Occurred</h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 max-w-xs leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
      )}
    </Card>
  );
}
