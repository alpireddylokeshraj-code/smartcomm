"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  Star,
  Download,
  Check,
  Play,
  Timer,
  CheckCircle2,
  DollarSign,
  ClipboardCheck,
  Activity,
  Cpu,
  GitBranch,
  User,
  Building2,
  Copy,
  Shield,
} from "lucide-react";
import { agents, usageTrend, tokenConsumption, auditEntries } from "@/lib/mock-data";
import { getAgentIcon } from "@/lib/icon-map";
import { formatCompact, formatCurrency, relativeTime } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { HealthBadge } from "@/components/shared/health-badge";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ChartTooltip, AXIS_PROPS } from "@/components/charts/chart-kit";

export default function AgentDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const agent = agents.find((a) => a.slug === slug);

  if (!agent) return notFound();
  const Icon = getAgentIcon(agent.icon);

  const execData = usageTrend.map((d) => ({
    day: d.day,
    success: Math.round(d.requests * (agent.successRate / 100) * 0.02),
    failed: Math.round(d.requests * (1 - agent.successRate / 100) * 0.02),
  }));

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit text-muted-foreground">
        <Link href="/marketplace">
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </Link>
      </Button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-6"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{agent.name}</h1>
              <Badge variant="outline" className="font-mono">
                v{agent.version}
              </Badge>
              <HealthBadge status={agent.health} />
            </div>
            <p className="mt-1 max-w-2xl text-muted-foreground">{agent.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {agent.rating} rating
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Download className="h-4 w-4" /> {formatCompact(agent.installs)} installs
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4" /> {agent.ownerTeam}
              </span>
              <Badge variant="secondary">{agent.category}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="gradient" size="lg">
              <Check className="h-4 w-4" /> Use Agent
            </Button>
            <Button variant="outline" size="lg">
              <Play className="h-4 w-4" /> Try in Playground
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Latency (p50)" value={`${agent.latencyMs}ms`} delta={-4} icon={Timer} accent="success" index={0} />
        <StatCard label="Success Rate" value={`${agent.successRate}%`} delta={1} icon={CheckCircle2} accent="success" index={1} />
        <StatCard label="Cost / Call" value={formatCurrency(agent.costPerCall, { maximumFractionDigits: 3, minimumFractionDigits: 3 })} icon={DollarSign} index={2} />
        <StatCard label="Reviews Triggered" value={String(agent.reviewsTriggered)} delta={-6} icon={ClipboardCheck} accent="warning" index={3} />
        <StatCard label="Availability" value={`${agent.availability}%`} icon={Activity} accent="accent" index={4} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="flex w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="config">Configurations</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>About this agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {agent.longDescription}
                </p>
                <div>
                  <p className="mb-2 text-sm font-medium">Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((c) => (
                      <Badge key={c} variant="secondary">
                        <Check className="h-3 w-3" /> {c}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.tags.map((t) => (
                      <Badge key={t} variant="accent">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  { icon: Cpu, label: "Model", value: agent.model, mono: true },
                  { icon: GitBranch, label: "Version", value: `v${agent.version}`, mono: true },
                  { icon: User, label: "Owner", value: agent.owner },
                  { icon: Building2, label: "Team", value: agent.ownerTeam },
                  { icon: Activity, label: "Tokens / call", value: formatCompact(agent.tokensPerCall) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <row.icon className="h-4 w-4" /> {row.label}
                    </span>
                    <span className={row.mono ? "font-mono text-xs" : "font-medium"}>
                      {row.value}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="text-xs text-muted-foreground">
                  Last updated {agent.updatedAt}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Metrics */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Execution Success</CardTitle>
                <p className="text-sm text-muted-foreground">Success vs failed runs</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={execData} margin={{ left: -18, right: 6 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" {...AXIS_PROPS} />
                    <YAxis {...AXIS_PROPS} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
                    <Bar dataKey="success" name="Success" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="failed" name="Failed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Latency Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Percentiles over time</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={usageTrend.map((d, i) => ({
                      day: d.day,
                      p50: agent.latencyMs - 40 + i * 8,
                      p95: agent.latencyMs + 260 + i * 12,
                    }))}
                    margin={{ left: -18, right: 6 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" {...AXIS_PROPS} />
                    <YAxis {...AXIS_PROPS} />
                    <Tooltip content={<ChartTooltip formatter={(v) => `${v}ms`} />} />
                    <Line type="monotone" dataKey="p50" name="p50" stroke="#6366f1" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="p95" name="p95" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Reliability", value: agent.availability, color: "bg-success" },
              { label: "Quality Score", value: agent.successRate, color: "bg-primary" },
              { label: "Efficiency", value: Math.min(99, 100 - agent.latencyMs / 20), color: "bg-accent" },
            ].map((m) => (
              <Card key={m.label} className="p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-semibold">{m.value.toFixed(1)}%</span>
                </div>
                <Progress value={m.value} className="mt-3" />
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Usage */}
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage History</CardTitle>
              <p className="text-sm text-muted-foreground">Requests routed to this agent</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={usageTrend} margin={{ left: -12, right: 6 }}>
                  <defs>
                    <linearGradient id="agentUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} tickFormatter={(v) => formatCompact(v)} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="requests" name="Requests" stroke="#6366f1" strokeWidth={2} fill="url(#agentUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Token Consumption</CardTitle>
              <p className="text-sm text-muted-foreground">Input vs output tokens (millions)</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={tokenConsumption} margin={{ left: -18, right: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} />
                  <Tooltip content={<ChartTooltip formatter={(v) => `${v}M`} />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
                  <Bar dataKey="input" name="Input" stackId="t" fill="#6366f1" />
                  <Bar dataKey="output" name="Output" stackId="t" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurations */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Runtime Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">Applied at the gateway for this agent</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { k: "model", v: agent.model },
                { k: "temperature", v: "0.2" },
                { k: "max_tokens", v: "4096" },
                { k: "timeout_ms", v: "30000" },
                { k: "retry_count", v: "2" },
                { k: "prompt_caching", v: "enabled" },
                { k: "pii_redaction", v: agent.category === "Compliance" ? "enabled" : "auto" },
              ].map((c) => (
                <div
                  key={c.k}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-2.5"
                >
                  <code className="font-mono text-xs text-muted-foreground">{c.k}</code>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs font-medium">{c.v}</code>
                    <Button variant="ghost" size="icon-sm">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-3 p-5">
              <Shield className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Governance policy attached</p>
                <p className="text-sm text-muted-foreground">
                  This agent inherits the “Regulated Content” policy pack. High-risk
                  outputs are automatically routed to Human Review.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Logs</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configuration and lifecycle events
              </p>
            </CardHeader>
            <CardContent className="space-y-1">
              {auditEntries.slice(0, 6).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 rounded-lg border-b border-border px-2 py-2.5 last:border-0 hover:bg-secondary/50"
                >
                  <span
                    className={
                      e.status === "success"
                        ? "h-2 w-2 rounded-full bg-success"
                        : e.status === "denied"
                          ? "h-2 w-2 rounded-full bg-destructive"
                          : "h-2 w-2 rounded-full bg-warning"
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.action}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {e.actor} · {e.ip}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {relativeTime(e.time)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
