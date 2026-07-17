"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, navSections } from "@/lib/nav";
import { useUI } from "@/store/use-ui";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, setCopilotOpen } = useUI();

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 md:flex",
        sidebarCollapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {sidebarCollapsed ? (
          <Logo showText={false} className="mx-auto" />
        ) : (
          <Logo />
        )}
      </div>

      <nav
        data-lenis-prevent
        className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-3 py-2"
      >
        {navSections.map((section) => {
          const items = navItems.filter((i) => i.section === section);
          return (
            <div key={section}>
              {!sidebarCollapsed && (
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  {section}
                </p>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
                  const link = (
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-sidebar-foreground hover:bg-accent/10 hover:text-foreground",
                        sidebarCollapsed && "justify-center"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                        />
                      )}
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <Badge
                              variant={
                                item.badge === "New" ? "accent" : "default"
                              }
                              className="h-5 px-1.5 text-[10px]"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  );
                  return sidebarCollapsed ? (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={item.href}>{link}</div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-sidebar-border p-3">
        {!sidebarCollapsed && (
          <button
            onClick={() => setCopilotOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg bg-gradient-to-r from-primary/10 via-accent/10 to-transparent px-3 py-2.5 text-left transition-colors hover:from-primary/20"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">Ask Copilot</p>
              <p className="truncate text-[10px] text-muted-foreground">
                Build with AI
              </p>
            </div>
          </button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center text-muted-foreground"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="ml-1">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
