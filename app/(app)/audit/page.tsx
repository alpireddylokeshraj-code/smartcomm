"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ScrollText,
  CheckCircle2,
  ShieldX,
  AlertTriangle,
  Search,
  Download,
  Lock,
  ChevronDown,
  ChevronRight,
  User,
  Globe,
  Clock,
  Filter,
} from "lucide-react";
import { cn, relativeTime } from "@/lib/utils";
import { auditEntries } from "@/lib/mock-data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";

type AuditStatus = "success" | "denied" | "warning";

const statusMeta: Record<
  AuditStatus,
  {
    label: string;
    dot: string;
    badge: "success" | "destructive" | "warning";
  }
> = {
  success: { label: "Success", dot: "bg-success", badge: "success" },
  denied: { label: "Denied", dot: "bg-destructive", badge: "destructive" },
  warning: { label: "Warning", dot: "bg-warning", badge: "warning" },
};

function exactTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function detailFor(id: string) {
  return {
    requestId: `req_${id}_${id.slice(-1)}f4c92a8`,
    session: `sess_${id.toUpperCase()}${id.length}b71`,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SmartCOMM-Console/4.2 Chrome/126.0",
    before: { state: "pending", version: "prev", validated: false },
    after: { state: "committed", version: "current", validated: true },
  };
}

export default function AuditPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [resourceType, setResourceType] = useState<string>("all");
  const [range, setRange] = useState<string>("7d");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const resourceTypes = useMemo(
    () => Array.from(new Set(auditEntries.map((e) => e.resourceType))).sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditEntries.filter((e) => {
      const matchesQuery =
        q === "" ||
        e.actor.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.resource.toLowerCase().includes(q);
      const matchesStatus = status === "all" || e.status === status;
      const matchesType =
        resourceType === "all" || e.resourceType === resourceType;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [query, status, resourceType]);

  const counts = useMemo(
    () => ({
      total: auditEntries.length,
      success: auditEntries.filter((e) => e.status === "success").length,
      denied: auditEntries.filter((e) => e.status === "denied").length,
      warning: auditEntries.filter((e) => e.status === "warning").length,
    }),
    []
  );

  const topActors = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of auditEntries) map.set(e.actor, (map.get(e.actor) ?? 0) + 1);
    return Array.from(map.entries())
      .map(([actor, count]) => ({ actor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Compliance"
        title="Audit Trail"
        description="Immutable, tamper-evident record of every privileged action across the SmartCOMM GenAI platform — searchable, filterable, and export-ready for auditors."
        actions={
          <>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Total Events"
          value={String(counts.total)}
          icon={ScrollText}
          hint="in range"
        />
        <StatCard
          index={1}
          label="Successful"
          value={String(counts.success)}
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard
          index={2}
          label="Denied"
          value={String(counts.denied)}
          icon={ShieldX}
          accent="destructive"
        />
        <StatCard
          index={3}
          label="Warnings"
          value={String(counts.warning)}
          icon={AlertTriangle}
          accent="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main log */}
        <Card className="xl:col-span-2">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Event Log</CardTitle>
                <CardDescription>
                  {filtered.length} of {auditEntries.length} events shown
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="w-fit gap-1.5 border-success/40 text-success"
              >
                <Lock className="h-3 w-3" />
                Immutable · Signed
              </Badge>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search actor, action, or resource…"
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-3">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={resourceType} onValueChange={setResourceType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All resources</SelectItem>
                    {resourceTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              {/* header row */}
              <div className="hidden grid-cols-[1.4fr_1.6fr_1.4fr_0.9fr_1fr] gap-4 border-b border-border bg-secondary/40 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid">
                <span>Status / Action</span>
                <span>Actor</span>
                <span>Resource</span>
                <span>IP</span>
                <span>Time</span>
              </div>

              {filtered.length === 0 && (
                <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No events match your filters.
                </div>
              )}

              {filtered.map((e) => {
                const meta = statusMeta[e.status];
                const isOpen = expandedId === e.id;
                const detail = detailFor(e.id);
                return (
                  <div key={e.id} className="border-b border-border last:border-b-0">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(isOpen ? null : e.id)
                      }
                      className={cn(
                        "grid w-full grid-cols-1 gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50 lg:grid-cols-[1.4fr_1.6fr_1.4fr_0.9fr_1fr] lg:items-center lg:gap-4",
                        isOpen && "bg-secondary/40"
                      )}
                    >
                      {/* status + action */}
                      <div className="flex items-center gap-2.5">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <span
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full",
                            meta.dot
                          )}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{e.action}</p>
                          <Badge
                            variant={meta.badge}
                            className="mt-1 lg:hidden"
                          >
                            {meta.label}
                          </Badge>
                        </div>
                      </div>

                      {/* actor */}
                      <div className="flex items-center gap-2">
                        <User className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground lg:block" />
                        <span className="truncate font-mono text-xs text-muted-foreground">
                          {e.actor}
                        </span>
                      </div>

                      {/* resource */}
                      <div className="min-w-0">
                        <p className="truncate text-sm">{e.resource}</p>
                        <Badge
                          variant="secondary"
                          className="mt-1 text-[10px] font-normal"
                        >
                          {e.resourceType}
                        </Badge>
                      </div>

                      {/* ip */}
                      <div className="flex items-center gap-1.5">
                        <Globe className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground lg:block" />
                        <span className="font-mono text-xs text-muted-foreground">
                          {e.ip}
                        </span>
                      </div>

                      {/* time */}
                      <div
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                        title={exactTime(e.time)}
                      >
                        <Clock className="hidden h-3.5 w-3.5 shrink-0 lg:block" />
                        <span>{relativeTime(e.time)}</span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">
                            <div className="rounded-lg bg-secondary/40 p-4">
                              <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Event Detail
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  {exactTime(e.time)}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                                <DetailRow label="Request ID" value={detail.requestId} mono />
                                <DetailRow label="Session" value={detail.session} mono />
                                <DetailRow
                                  label="User Agent"
                                  value={detail.userAgent}
                                  mono
                                  className="sm:col-span-2"
                                />
                              </div>
                              <Separator className="my-3" />
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                  <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                                    Before
                                  </p>
                                  <pre className="overflow-x-auto rounded-md bg-muted p-2.5 font-mono text-[11px] text-foreground">
                                    {JSON.stringify(detail.before, null, 2)}
                                  </pre>
                                </div>
                                <div>
                                  <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                                    After
                                  </p>
                                  <pre className="overflow-x-auto rounded-md bg-muted p-2.5 font-mono text-[11px] text-foreground">
                                    {JSON.stringify(detail.after, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Actors</CardTitle>
              <CardDescription>Most active identities in range</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topActors.map((a) => {
                const max = topActors[0]?.count || 1;
                return (
                  <div key={a.actor} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-xs text-muted-foreground">
                        {a.actor}
                      </span>
                      <span className="shrink-0 text-xs font-medium text-foreground">
                        {a.count}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{ width: `${(a.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Chronological event stream</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 border-l border-border pl-5">
                {auditEntries.map((e) => {
                  const meta = statusMeta[e.status];
                  return (
                    <li key={e.id} className="relative">
                      <span
                        className={cn(
                          "absolute -left-[26px] top-1 h-3 w-3 rounded-full ring-4 ring-card",
                          meta.dot
                        )}
                      />
                      <p className="text-sm font-medium leading-tight">
                        {e.action}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                        {e.actor}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {relativeTime(e.time)}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "break-all text-xs text-foreground",
          mono && "font-mono"
        )}
      >
        {value}
      </span>
    </div>
  );
}
