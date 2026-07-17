"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Timer,
  AlertTriangle,
  Gauge,
  SlidersHorizontal,
  ChevronRight,
  Bell,
  ShieldAlert,
  Zap,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { HealthBadge } from "@/components/shared/health-badge";
import { CHART_COLORS, AXIS_PROPS, ChartTooltip } from "@/components/charts/chart-kit";
import { cn, formatCurrency, formatNumber, relativeTime } from "@/lib/utils";
import {
  services,
  traces,
  latencyTrend,
  throughputTrend,
} from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Types & helpers
// ---------------------------------------------------------------------------
type Trace = (typeof traces)[number];

const fmtDuration = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

// Mock waterfall spans for the trace detail sheet.
const SPAN_TEMPLATE: { name: string; ms: number; offset: number }[] = [
  { name: "Gateway Ingress", ms: 400, offset: 0 },
  { name: "OCR Agent", ms: 3200, offset: 4 },
  { name: "Translation", ms: 4100, offset: 30 },
  { name: "Validation", ms: 800, offset: 66 },
  { name: "Compliance", ms: 1100, offset: 72 },
  { name: "PII Redactor", ms: 900, offset: 82 },
  { name: "Export", ms: 400, offset: 92 },
];

const recentAlerts: {
  id: string;
  title: string;
  detail: string;
  severity: "destructive" | "warning" | "secondary";
  sevLabel: string;
  time: string;
}[] = [
  {
    id: "al-1",
    title: "PII Redactor circuit breaker tripped",
    detail: "Gateway node us-east-2 · 3 consecutive failures",
    severity: "destructive",
    sevLabel: "Critical",
    time: "2 min ago",
  },
  {
    id: "al-2",
    title: "Review Queue p95 latency above SLA",
    detail: "112ms sustained for 8 minutes on high-risk lane",
    severity: "warning",
    sevLabel: "Warning",
    time: "14 min ago",
  },
  {
    id: "al-3",
    title: "Error rate spike on Ticket Triage",
    detail: "5.9% errors in the last 5-minute window",
    severity: "warning",
    sevLabel: "Warning",
    time: "38 min ago",
  },
  {
    id: "al-4",
    title: "Vector Store index rebuild completed",
    detail: "4.2M embeddings re-indexed · no downtime",
    severity: "secondary",
    sevLabel: "Info",
    time: "1 hr ago",
  },
];

export default function MonitoringPage() {
  const [live, setLive] = useState(true);
  const [refresh, setRefresh] = useState("30s");
  const [selected, setSelected] = useState<Trace | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Observability"
        title="Monitoring & Tracing"
        description="Real-time application performance, distributed traces, and service health across the SmartCOMM GenAI platform."
        actions={
          <>
            <button
              type="button"
              onClick={() => setLive((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                live
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              <span className="relative flex h-2 w-2">
                {live && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                )}
                <span
                  className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    live ? "bg-success" : "bg-muted-foreground"
                  )}
                />
              </span>
              {live ? "Live" : "Paused"}
            </button>
            <Select value={refresh} onValueChange={setRefresh}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Auto-refresh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Auto-refresh off</SelectItem>
                <SelectItem value="10s">Every 10s</SelectItem>
                <SelectItem value="30s">Every 30s</SelectItem>
                <SelectItem value="1m">Every 1m</SelectItem>
                <SelectItem value="5m">Every 5m</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </>
        }
      />

      {/* Service health strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {services.map((svc, i) => (
          <motion.div
            key={svc.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Card className="h-full p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{svc.name}</p>
                <HealthBadge status={svc.status} />
              </div>
              <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                {svc.latency}
              </p>
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {svc.detail}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Uptime (30d)"
          value="99.99%"
          icon={Activity}
          accent="success"
          hint="SLA 99.9%"
          index={0}
        />
        <StatCard
          label="p95 Latency"
          value="1.2s"
          delta={-8}
          icon={Timer}
          accent="success"
          index={1}
        />
        <StatCard
          label="Error Rate"
          value="0.8%"
          delta={-2}
          icon={AlertTriangle}
          accent="warning"
          index={2}
        />
        <StatCard
          label="Requests / min"
          value="4.2K"
          delta={5}
          icon={Gauge}
          accent="primary"
          index={3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Latency Percentiles</CardTitle>
            <CardDescription>
              Response time distribution (ms) over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyTrend} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="t" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} width={44} />
                  <Tooltip
                    content={
                      <ChartTooltip formatter={(v: number) => `${v} ms`} />
                    }
                    cursor={{ stroke: "hsl(var(--border))" }}
                  />
                  <Legend
                    iconType="plainline"
                    wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p50"
                    name="p50"
                    stroke={CHART_COLORS[3]}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="p95"
                    name="p95"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="p99"
                    name="p99"
                    stroke={CHART_COLORS[4]}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Throughput vs Errors</CardTitle>
            <CardDescription>Successful requests and error volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={throughputTrend}
                  margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="successFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS[2]} stopOpacity={0.7} />
                      <stop offset="100%" stopColor={CHART_COLORS[2]} stopOpacity={0.15} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="t" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} width={44} />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  <Bar
                    dataKey="success"
                    name="Success"
                    fill="url(#successFill)"
                    radius={[4, 4, 0, 0]}
                    barSize={22}
                  />
                  <Line
                    type="monotone"
                    dataKey="error"
                    name="Errors"
                    stroke={CHART_COLORS[5]}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traces + Alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle>Distributed Traces</CardTitle>
              <CardDescription>
                Recent end-to-end workflow executions — click a row to inspect spans
              </CardDescription>
            </div>
            <Badge variant="accent">{traces.length} traces</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Trace ID</th>
                    <th className="px-3 py-2 font-medium">Workflow</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 text-right font-medium">Duration</th>
                    <th className="px-3 py-2 text-right font-medium">Spans</th>
                    <th className="px-3 py-2 text-right font-medium">Cost</th>
                    <th className="px-3 py-2 text-right font-medium">Time</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {traces.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className="group cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-3 py-3">
                        <span className="font-mono text-xs text-primary">{t.id}</span>
                      </td>
                      <td className="max-w-[220px] px-3 py-3">
                        <span className="line-clamp-1 text-foreground">{t.workflow}</span>
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          variant={t.status === "success" ? "success" : "destructive"}
                        >
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-foreground">
                        {fmtDuration(t.duration)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                        {t.spans}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-foreground">
                        {formatCurrency(t.cost, {
                          maximumFractionDigits: 3,
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-3 py-3 text-right text-xs text-muted-foreground">
                        {relativeTime(t.time)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="space-y-1.5">
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Active incidents & notices</CardDescription>
            </div>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((a) => (
              <div
                key={a.id}
                className="rounded-lg border border-border/70 bg-secondary/40 p-3 transition-colors hover:bg-secondary"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                        a.severity === "destructive"
                          ? "bg-destructive/10 text-destructive"
                          : a.severity === "warning"
                            ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {a.severity === "destructive" ? (
                        <ShieldAlert className="h-4 w-4" />
                      ) : a.severity === "warning" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Zap className="h-4 w-4" />
                      )}
                    </span>
                    <Badge variant={a.severity}>{a.sevLabel}</Badge>
                  </div>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {a.time}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium leading-snug text-foreground">
                  {a.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Trace detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o: boolean) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span className="font-mono text-sm text-primary">{selected?.id}</span>
              {selected && (
                <Badge
                  variant={selected.status === "success" ? "success" : "destructive"}
                >
                  {selected.status}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription>{selected?.workflow}</SheetDescription>
          </SheetHeader>

          {selected && (
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-secondary/40 p-3">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {fmtDuration(selected.duration)}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-3">
                  <p className="text-xs text-muted-foreground">Spans</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {selected.spans}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-3">
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatCurrency(selected.cost, {
                      maximumFractionDigits: 3,
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {relativeTime(selected.time)}
              </div>

              <Separator className="my-4" />

              {/* Waterfall */}
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Span Waterfall</p>
                <span className="font-mono text-xs text-muted-foreground">
                  {fmtDuration(selected.duration)} total
                </span>
              </div>

              <div className="space-y-3">
                {SPAN_TEMPLATE.map((span, i) => {
                  const isLast = i === SPAN_TEMPLATE.length - 1;
                  const failed = selected.status === "error" && isLast;
                  const color = CHART_COLORS[i % CHART_COLORS.length];
                  const widthPct = Math.min(100 - span.offset, (span.ms / 5000) * 100);
                  return (
                    <div key={span.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{span.name}</span>
                        <span className="flex items-center gap-2">
                          <span className="tabular-nums text-muted-foreground">
                            {fmtDuration(span.ms)}
                          </span>
                          <Badge variant={failed ? "destructive" : "secondary"}>
                            {failed ? "error" : "ok"}
                          </Badge>
                        </span>
                      </div>
                      <div className="h-6 w-full rounded-md bg-muted/60">
                        <div
                          className="flex h-6 items-center rounded-md px-2 text-[10px] font-medium text-white shadow-sm"
                          style={{
                            width: `${widthPct}%`,
                            marginLeft: `${span.offset}%`,
                            backgroundColor: failed ? "hsl(var(--destructive))" : color,
                          }}
                        >
                          <span className="truncate">
                            {span.name} {fmtDuration(span.ms)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
                Trace sampled at 100% · Propagated via W3C traceparent ·{" "}
                {formatNumber(selected.spans * 3)} attributes captured
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
