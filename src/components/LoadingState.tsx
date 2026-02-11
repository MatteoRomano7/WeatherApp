"use client";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border border-foreground/[0.06]" />
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '2s' }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 -translate-y-0.5 rounded-full bg-accent-sky"
            style={{ boxShadow: '0 0 12px rgba(94,174,247,0.6)' }}
          />
        </div>
        <div className="absolute inset-3 rounded-full border border-foreground/[0.04]" />
        <div
          className="absolute inset-3 animate-spin"
          style={{ animationDuration: '3s', animationDirection: 'reverse' }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 -translate-y-0.5 rounded-full bg-accent-amber"
            style={{ boxShadow: '0 0 8px rgba(245,185,66,0.5)' }}
          />
        </div>
      </div>
      <p className="text-muted text-sm font-medium tracking-wide">Loading...</p>
    </div>
  );
}
