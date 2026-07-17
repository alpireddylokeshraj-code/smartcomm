"use client";

import Link from "next/link";
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
  Bot,
  Workflow as WorkflowIcon,
  Store,
  ClipboardCheck,
  Activity,
  DollarSign,
  CheckCircle2,
  Rocket,
  UserPlus,
  Play,
  ArrowRight,
  ShieldCheck,
  Boxes,
  Server,
  Cpu,
} from "lucide-react";
import { useAuth } from "@/store/use-auth";
import { useUI } from "@/store/use-ui";
import {
  platformStats,
  usageTrend,
  costTrend,
  reviewTrend,
  activityFeed,
  services,
} from "@/lib/mock-data";
import { formatCompact, formatCurrency, relativeTime } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { HealthBadge } from "@/components/shared/health-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartTooltip, AXIS_PROPS } from "@/components/charts/chart-kit";

const actions = [
  { title: "Create Agent", desc: "Compose a new AI agent", icon: Bot, href: "/marketplace", accent: "from-indigo-500 to-blue-500" },
  { title: "Create Workflow", desc: "Orchestrate agents visually", icon: WorkflowIcon, href: "/workflows", accent: "from-purple-500 to-fuchsia-500" },
  { title: "Explore Marketplace", desc: "Browse 12+ agents", icon: Store, href: "/marketplace", accent: "from-sky-500 to-cyan-500" },
  { title: "Review Tasks", desc: "4 pending human reviews", icon: ClipboardCheck, href: "/reviews", accent: "from-amber-500 to-orange-500" },
];

const activityIcon = {
  deployment: Rocket,
  onboarding: UserPlus,
  execution: Play,
  review: ClipboardCheck,
  alert: Activity,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { setCopilotOpen } = useUI();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-6 md:p-8"
      >
        <div className="absolute inset-0 dot-bg opacity-40" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <Badge variant="accent" className="mb-3">
            <ShieldCheck className="h-3 w-3" /> Enterprise Workspace
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 max-w-xl text-muted-foreground">
            What would you like to build today? Compose agents, orchestrate
            workflows, and govern your AI operations from one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="gradient" onClick={() => setCopilotOpen(true)}>
              <Bot className="h-4 w-4" /> Ask Copilot
            </Button>
            <Button variant="outline" asChild>
              <Link href="/workflows">
                <WorkflowIcon className="h-4 w-4" /> New Workflow
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Action cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={a.href}>
              <Card className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${a.accent} shadow-md`}
                >
                  <a.icon className="h-5 w-5 text-white" />
                </div>
                <p className="flex items-center gap-1 font-semibold">
                  {a.title}
                  <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </p>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Agents" value={String(platformStats.totalAgents)} delta={8} icon={Bot} index={0} />
        <StatCard label="Active Workflows" value={String(platformStats.activeWorkflows)} delta={12} icon={WorkflowIcon} accent="accent" index={1} />
        <StatCard label="Today's Requests" value={formatCompact(platformStats.requestsToday)} delta={5} icon={Activity} accent="success" index={2} />
        <StatCard label="Pending Reviews" value={String(platformStats.pendingReviews)} delta={-3} icon={ClipboardCheck} accent="warning" index={3} />
        <StatCard label="Gateway Cost" value={formatCurrency(platformStats.gatewayCost)} delta={-6} icon={DollarSign} accent="success" index={4} />
        <StatCard label="Success Rate" value={`${platformStats.successRate}%`} delta={1} icon={CheckCircle2} accent="success" index={5} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Agent Usage Trend</CardTitle>
              <p className="text-sm text-muted-foreground">Requests over the last 7 days</p>
            </div>
            <Badge variant="success">+14% WoW</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={usageTrend} margin={{ left: -12, right: 6 }}>
                <defs>
                  <linearGradient id="usage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} tickFormatter={(v) => formatCompact(v)} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="requests" name="Requests" stroke="#6366f1" strokeWidth={2} fill="url(#usage)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Spend vs. budget</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={costTrend} margin={{ left: -12, right: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} tickFormatter={(v) => formatCompact(v)} />
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} />
                <Line type="monotone" dataKey="cost" name="Spend" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="budget" name="Budget" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Review trend */}
        <Card>
          <CardHeader>
            <CardTitle>Review Trend</CardTitle>
            <p className="text-sm text-muted-foreground">By risk level</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reviewTrend} margin={{ left: -18, right: 6 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
                <Bar dataKey="high" name="High" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" name="Medium" stackId="a" fill="#f59e0b" />
                <Bar dataKey="low" name="Low" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Health panel */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Platform Health</CardTitle>
            <HealthBadge status="healthy" label="Operational" />
          </CardHeader>
          <CardContent className="space-y-3">
            {services.slice(0, 5).map((s) => {
              const Icon =
                s.name === "AI Gateway" ? Server : s.name === "Agent Registry" ? Boxes : s.name === "MCP Services" ? Cpu : s.name === "Review Queue" ? ClipboardCheck : Activity;
              return (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                  <div className="text-right">
                    <HealthBadge status={s.status} />
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{s.latency}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/audit">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {activityFeed.slice(0, 6).map((a) => {
              const Icon = activityIcon[a.type];
              return (
                <div key={a.id} className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.description}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                      {a.user} · {relativeTime(a.time)}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
