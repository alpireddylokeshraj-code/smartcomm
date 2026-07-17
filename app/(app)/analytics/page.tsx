"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Download,
  Gauge,
  Lightbulb,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  AXIS_PROPS,
  CHART_COLORS,
  ChartTooltip,
} from "@/components/charts/chart-kit";
import {
  agents,
  latencyTrend,
  throughputTrend,
  tokenConsumption,
  usageTrend,
} from "@/lib/mock-data";
import { cn, formatCompact } from "@/lib/utils";

export default function AnalyticsPage() {
  const [range, setRange] = useState("7d");

  // Leaderboard: top 8 agents by installs.
  const leaderboard = useMemo(
    () => [...agents].sort((a, b) => b.installs - a.installs).slice(0, 8),
    []
  );
  const maxInstalls = leaderboard[0]?.installs ?? 1;

  // Category distribution: count agents per category.
  const categoryData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of agents) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  // Top performing agents by success rate.
  const topPerformers = useMemo(
    () => [...agents].sort((a, b) => b.successRate - a.successRate).slice(0, 6),
    []
  );

  const insights = [
    {
      icon: TrendingUp,
      title: "Peak traffic on Fridays",
      body: "Request volume spikes ~24% on Fridays between 12–4pm. Consider pre-warming gateway replicas ahead of the window.",
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Gauge,
      title: "Tail latency creeping up",
      body: "p99 latency climbed to 2.4s at midday. Compliance agents drive most of the tail — enable prompt caching to shave ~30%.",
      accent: "text-warning",
      bg: "bg-warning/10",
    },
    {
      icon: Sparkles,
      title: "OCR & Knowledge lead adoption",
      body: "OCR and Knowledge Agents account for the largest share of installs, signaling strong demand for document intelligence.",
      accent: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Platform-wide product and usage analytics across agents, requests, tokens, and reliability."
        actions={
          <>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          index={0}
          label="Total Requests"
          value={formatCompact(1243900)}
          delta={18}
          icon={TrendingUp}
          hint="vs last period"
        />
        <StatCard
          index={1}
          label="Avg Latency"
          value="512ms"
          delta={-4}
          accent="success"
          icon={Timer}
          hint="p50 across agents"
        />
        <StatCard
          index={2}
          label="Success Rate"
          value="98.4%"
          delta={1}
          accent="success"
          icon={CheckCircle2}
          hint="gateway-wide"
        />
        <StatCard
          index={3}
          label="Active Users"
          value="1,284"
          delta={9}
          icon={Users}
          hint="7-day active"
        />
        <StatCard
          index={4}
          label="Token Usage"
          value="24.8M"
          delta={12}
          accent="accent"
          icon={Cpu}
          hint="input + output"
        />
      </div>

      {/* Row: Request Volume (2/3) + Token Consumption (1/3) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Request Volume</CardTitle>
            <CardDescription>Total requests processed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={usageTrend} margin={{ left: -8, right: 8, top: 4 }}>
                <defs>
                  <linearGradient id="reqFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis dataKey="day" {...AXIS_PROPS} />
                <YAxis
                  {...AXIS_PROPS}
                  tickFormatter={(v: any) => formatCompact(v)}
                />
                <Tooltip
                  content={
                    <ChartTooltip
                      formatter={(value: number) => formatCompact(value)}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  name="Requests"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2}
                  fill="url(#reqFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Consumption</CardTitle>
            <CardDescription>Input vs output tokens (millions)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={tokenConsumption} margin={{ left: -12, right: 8, top: 4 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis dataKey="day" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} tickFormatter={(v: any) => `${v}M`} />
                <Tooltip
                  content={
                    <ChartTooltip formatter={(value: number) => `${value}M`} />
                  }
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
                <Bar
                  dataKey="input"
                  name="Input"
                  stackId="tokens"
                  fill={CHART_COLORS[0]}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="output"
                  name="Output"
                  stackId="tokens"
                  fill={CHART_COLORS[1]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row: Leaderboard + Category Distribution */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Agent Usage Leaderboard</CardTitle>
            <CardDescription>Top agents ranked by installs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.map((agent, i) => (
              <div key={agent.id} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-sm font-medium text-muted-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {agent.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatCompact(agent.installs)}
                    </span>
                  </div>
                  <Progress
                    value={(agent.installs / maxInstalls) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Agents grouped by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                >
                  {categoryData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  layout="horizontal"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row: Latency Percentiles + Throughput */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latency Percentiles</CardTitle>
            <CardDescription>p50 / p95 / p99 over the day (ms)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={latencyTrend} margin={{ left: -8, right: 8, top: 4 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis dataKey="t" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} tickFormatter={(v: any) => `${v}ms`} />
                <Tooltip
                  content={
                    <ChartTooltip formatter={(value: number) => `${value}ms`} />
                  }
                />
                <Legend
                  iconType="circle"
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
                  stroke={CHART_COLORS[4]}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="p99"
                  name="p99"
                  stroke={CHART_COLORS[5]}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Throughput</CardTitle>
            <CardDescription>Successful vs failed requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart
                data={throughputTrend}
                margin={{ left: -8, right: 8, top: 4 }}
              >
                <defs>
                  <linearGradient id="successFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[3]} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CHART_COLORS[3]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis dataKey="t" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} tickFormatter={(v: any) => formatCompact(v)} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="success"
                  name="Success"
                  stroke={CHART_COLORS[3]}
                  strokeWidth={2}
                  fill="url(#successFill)"
                />
                <Bar
                  dataKey="error"
                  name="Errors"
                  fill={CHART_COLORS[5]}
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insight callouts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="h-full">
              <CardContent className="flex gap-3 p-5">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    insight.bg
                  )}
                >
                  <insight.icon className={cn("h-5 w-5", insight.accent)} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      {insight.title}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {insight.body}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top performing agents table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <CardTitle>Top Performing Agents</CardTitle>
          </div>
          <CardDescription>Ranked by success rate over the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Agent</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Success Rate</th>
                  <th className="px-3 py-2 text-right font-medium">Latency</th>
                  <th className="px-3 py-2 text-right font-medium">Installs</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((agent) => (
                  <tr
                    key={agent.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-3 py-3 font-medium text-foreground">
                      {agent.name}
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="secondary">{agent.category}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-success"
                            style={{ width: `${agent.successRate}%` }}
                          />
                        </div>
                        <span className="tabular-nums text-muted-foreground">
                          {agent.successRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                      {agent.latencyMs}ms
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                      {formatCompact(agent.installs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
