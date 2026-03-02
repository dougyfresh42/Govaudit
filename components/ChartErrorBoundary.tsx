"use client";

import { ErrorBoundary, FallbackProps } from "react-error-boundary";

function ChartErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <p className="text-gray-600 mb-2">Failed to load chart</p>
      <p className="text-sm text-gray-400 mb-4">{errorMessage}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

export function ChartErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      FallbackComponent={ChartErrorFallback}
      onReset={() => {}}
    >
      {children}
    </ErrorBoundary>
  );
}
