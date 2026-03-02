"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">
        An unexpected error occurred. Please try again.
      </p>
      {error.digest && (
        <p className="text-sm text-gray-400 mb-6">Error ID: {error.digest}</p>
      )}
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
