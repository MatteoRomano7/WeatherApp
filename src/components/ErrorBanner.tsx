"use client";

import type { AppError } from '@/lib/domain/errors';

export interface ErrorBannerProps {
  error: AppError;
  onRetry?: () => void;
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-2xl p-5 backdrop-blur-xl animate-fade-in-up"
      style={{
        background: 'rgba(240, 112, 104, 0.07)',
        border: '1px solid rgba(240, 112, 104, 0.18)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{'\u26A0\uFE0F'}</span>
          <div>
            <h2 className="text-sm font-semibold text-accent-rose mb-0.5">Error</h2>
            <p className="text-sm text-foreground/60">{error.message}</p>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 px-5 py-2.5 bg-accent-rose/15 text-accent-rose text-sm font-semibold rounded-xl hover:bg-accent-rose/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-rose focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
