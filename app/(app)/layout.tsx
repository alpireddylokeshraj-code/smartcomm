"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { CopilotDrawer } from "@/components/layout/copilot-drawer";
import { Logo } from "@/components/logo";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Zustand persist hydrates on client; wait a tick then guard.
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [isAuthenticated, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">
          <Logo size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="scrollbar-thin flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
      <CopilotDrawer />
    </div>
  );
}
