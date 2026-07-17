"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/use-auth";
import { Logo } from "@/components/logo";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse">
        <Logo size="lg" />
      </div>
    </div>
  );
}
