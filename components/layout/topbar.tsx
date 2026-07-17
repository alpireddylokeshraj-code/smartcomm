"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut, User, Settings, Sparkles, Menu } from "lucide-react";
import { useAuth } from "@/store/use-auth";
import { useUI } from "@/store/use-ui";
import { initials, relativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setCommandOpen, setCopilotOpen, notifications, markAllRead } = useUI();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <MobileNav />

      <button
        onClick={() => setCommandOpen(true)}
        className="group flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-background/60 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 md:max-w-md"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search agents, workflows…</span>
        <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCopilotOpen(true)}
          className="hidden gap-1.5 sm:flex"
        >
          <Sparkles className="h-4 w-4 text-accent" />
          Copilot
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-[1.15rem] w-[1.15rem]" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2.5 py-1.5">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-primary hover:underline"
              >
                Mark all read
              </button>
            </div>
            <DropdownMenuSeparator />
            <div data-lenis-prevent className="max-h-80 overflow-y-auto scrollbar-thin">
              {notifications.slice(0, 5).map((n) => (
                <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5">
                  <div className="flex w-full items-center gap-2">
                    <span
                      className={
                        n.type === "error"
                          ? "h-2 w-2 rounded-full bg-destructive"
                          : n.type === "warning"
                            ? "h-2 w-2 rounded-full bg-warning"
                            : n.type === "success"
                              ? "h-2 w-2 rounded-full bg-success"
                              : "h-2 w-2 rounded-full bg-primary"
                      }
                    />
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="pl-4 text-xs text-muted-foreground">{n.body}</span>
                  <span className="pl-4 text-[10px] text-muted-foreground/70">
                    {relativeTime(n.time)}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications" className="justify-center text-primary">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-accent/10">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials(user?.name ?? "U")}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left leading-tight lg:block">
                <p className="text-xs font-semibold">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground">{user?.role}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2.5 py-2">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <Badge variant="accent" className="mt-2">
                {user?.team}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
