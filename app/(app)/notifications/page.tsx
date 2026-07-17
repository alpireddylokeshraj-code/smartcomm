"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  BellOff,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Settings,
  MoreHorizontal,
  Check,
  Trash2,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { cn, relativeTime } from "@/lib/utils";
import { useUI } from "@/store/use-ui";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type NotificationType = "info" | "success" | "warning" | "error";

const typeStyles: Record<
  NotificationType,
  { icon: LucideIcon; chip: string }
> = {
  error: { icon: AlertTriangle, chip: "bg-destructive/10 text-destructive" },
  warning: { icon: AlertCircle, chip: "bg-warning/10 text-warning" },
  success: { icon: CheckCircle2, chip: "bg-success/10 text-success" },
  info: { icon: Info, chip: "bg-primary/10 text-primary" },
};

const CATEGORIES = ["Reviews", "Health", "Deployments", "Cost", "Registry"];

export default function NotificationsPage() {
  const { notifications, markAllRead, markRead } = useUI();
  const [filter, setFilter] = useState("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );
  const alertCount = useMemo(
    () =>
      notifications.filter((n) => n.type === "error" || n.type === "warning")
        .length,
    [notifications]
  );

  const filtered = useMemo(() => {
    switch (filter) {
      case "all":
        return notifications;
      case "unread":
        return notifications.filter((n) => !n.read);
      case "alerts":
        return notifications.filter(
          (n) => n.type === "error" || n.type === "warning"
        );
      default:
        return notifications.filter((n) => n.category === filter);
    }
  }, [notifications, filter]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread notification${
                unreadCount === 1 ? "" : "s"
              }.`
            : "You're all caught up — no unread notifications."
        }
        actions={
          <>
            <Button
              variant="outline"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <Check className="h-4 w-4" />
              Mark all read
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Settings">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Unread"
          value={String(unreadCount)}
          icon={Bell}
          accent="primary"
        />
        <StatCard
          index={1}
          label="Total"
          value={String(notifications.length)}
          icon={Inbox}
          accent="primary"
        />
        <StatCard
          index={2}
          label="Alerts"
          value={String(alertCount)}
          icon={AlertTriangle}
          accent="warning"
        />
        <StatCard
          index={3}
          label="This Week"
          value={String(notifications.length)}
          icon={CheckCircle2}
          accent="accent"
        />
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
          </TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <BellOff className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">
                Nothing here
              </p>
              <p className="text-sm text-muted-foreground">
                No notifications match this filter.
              </p>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {filtered.map((n) => {
            const style = typeStyles[n.type as NotificationType];
            const Icon = style.icon;
            return (
              <motion.div
                key={n.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={cn(
                    "flex items-start gap-4 p-4 transition-colors hover:border-primary/30",
                    !n.read && "border-l-2 border-l-primary bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      style.chip
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                      <p className="truncate font-medium text-foreground">
                        {n.title}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <Badge variant="secondary">{n.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {relativeTime(n.time)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {!n.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markRead(n.id)}
                      >
                        <Check className="h-4 w-4" />
                        Mark read
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => markRead(n.id)}>
                          <Check className="h-4 w-4" />
                          Mark read
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BellOff className="h-4 w-4" />
                          Mute category
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
