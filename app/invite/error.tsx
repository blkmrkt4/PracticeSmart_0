"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Invite Error</h2>
      <p className="text-gray-400 mb-6">{error.message || "An unexpected error occurred in the invite page."}</p>
      <Button
        onClick={reset}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Try again
      </Button>
    </div>
  );
}
