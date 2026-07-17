"use client";

import * as React from "react";
import { AlertTriangle, RotateCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Surface for observability; never crashes the UI.
    console.error("App section error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        An unexpected error occurred while rendering this view. You can retry, or
        head back to the dashboard.
      </p>
      {error?.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground/60">
          Ref: {error.digest}
        </p>
      )}
      <div className="mt-6 flex gap-2">
        <Button variant="gradient" onClick={reset}>
          <RotateCw className="h-4 w-4" /> Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <Home className="h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
