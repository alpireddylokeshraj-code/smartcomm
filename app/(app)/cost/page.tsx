"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarDays,
  DollarSign,
  Download,
  Lightbulb,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import {
  agents,
  agentCostDistribution,
  costTrend,
  modelSpend,
  optimizationRecs,
  platformStats,
} from "@/lib/mock-data";
import { cn, formatCompact, formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AXIS_PROPS, CHART_COLORS, ChartTooltip } from "@/components/charts/chart-kit";

const effortVariant: Record<string, "success" | "warning" | "destructive"> = {
  Low: "success",
  Medium: "warning",
  High: "destructive",
};

const impactVariant: Record<string, "accent" | "secondary"> = {
  High: "accent",
  Medium: "secondary",
};

export default function CostPage() {
  const monthlySpend = platformStats.gatewayCost;
  const dailySpend = Math.round(monthlySpend / 30);
  const costPerAgent = Math.round(monthlySpend / platformStats.totalAgents);

  // Top expensive agents ranked by projected monthly spend.
  const topAgents = useMemo(() => {
    const ranked = agents
      .map((a) => ({ ...a, monthlyEst: a.costPerCall * a.installs }))
      .sort((x, y) => y.monthlyEst - x.monthlyEst);
    const maxEst = ranked[0]?.monthlyEst ?? 1;
    return ranked.slice(0, 6).map((a) => ({
      ...a,
      share: Math.round((a.monthlyEst / maxEst) * 100),
    }));
  }, []);

  const totalModelSpend = useMemo(
    () => modelSpend.reduce((sum, m) => sum + m.value, 0),
    []
  );

  const totalSavings = useMemo(
    () => optimizationRecs.reduce((sum, r) => sum + r.savings, 0),
    []
  );

  // Cost per 1K requests from projected monthly volume.
  const costPer1k = useMemo(() => {
    const monthlyRequests = platformStats.requestsToday * 30;
    return (monthlySpend / (monthlyRequests / 1000)).toFixed(2);
  }, [monthlySpend]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="FinOps"
        title="Cost Governance"
        description="Track spend, forecast budget, and act on optimization opportunities across every agent and model in the platform."
        actions={
          <>
            <Select defaultValue="30d">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="quarter">This quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4" /> Export Report
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly Spend"
          value={formatCurrency(monthlySpend)}
          delta={-6}
          icon={DollarSign}
          accent="success"
          hint="vs. last month"
          index={0}
        />
        <StatCard
          label="Daily Spend"
          value={formatCurrency(dailySpend)}
          delta={4}
          icon={CalendarDays}
          accent="primary"
          hint="30-day average"
          index={1}
        />
        <StatCard
          label="Cost per Agent"
          value={formatCurrency(costPerAgent)}
          delta={-2}
          icon={Bot}
          accent="warning"
          hint="monthly average"
          index={2}
        />
        <StatCard
          label="Cost per 1K Requests"
          value={`$${costPer1k}`}
          delta={-9}
          icon={Activity}
          accent="accent"
          hint="blended rate"
          index={3}
        />
      </div>

      {/* Cost trend + Model spend */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Cost Trend</CardTitle>
              <CardDescription>Actual spend vs. allocated budget</CardDescription>
            </div>
            <Badge variant="success">
              <TrendingDown className="h-3 w-3" /> Under budget
            </Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={costTrend} margin={{ left: -8, right: 8 }}>
                <defs>
                  <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis dataKey="month" {...AXIS_PROPS} />
                <YAxis {...AXIS_PROPS} tickFormatter={(v) => formatCompact(v as number)} />
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  name="Spend"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2.5}
                  fill="url(#spendFill)"
                />
                <Line
                  type="monotone"
                  dataKey="budget"
                  name="Budget"
                  stroke={CHART_COLORS[7]}
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Spend Distribution</CardTitle>
            <CardDescription>Spend by model family</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={modelSpend}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                >
                  {modelSpend.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={(v) => formatCurrency(v)} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-2">
              {modelSpend.map((m, i) => (
                <div key={m.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="truncate text-muted-foreground">{m.name}</span>
                  <span className="ml-auto font-medium">{formatCurrency(m.value)}</span>
                  <span className="w-10 text-right text-xs text-muted-foreground">
                    {Math.round((m.value / totalModelSpend) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent cost distribution + Top expensive agents */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Agent Cost Distribution</CardTitle>
            <CardDescription>Monthly spend by agent</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={agentCostDistribution}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  {...AXIS_PROPS}
                  tickFormatter={(v) => formatCompact(v as number)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  {...AXIS_PROPS}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                  content={<ChartTooltip formatter={(v) => formatCurrency(v)} />}
                />
                <Bar dataKey="value" name="Spend" radius={[0, 4, 4, 0]}>
                  {agentCostDistribution.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Expensive Agents</CardTitle>
            <CardDescription>Ranked by projected monthly spend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Agent</th>
                    <th className="pb-2 pr-3 font-medium">Model</th>
                    <th className="pb-2 pr-3 text-right font-medium">Cost / Call</th>
                    <th className="pb-2 pr-3 text-right font-medium">Monthly Est.</th>
                    <th className="hidden pb-2 font-medium sm:table-cell">Budget Share</th>
                  </tr>
                </thead>
                <tbody>
                  {topAgents.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-border/60 transition-colors hover:bg-secondary/40"
                    >
                      <td className="py-3 pr-3">
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.ownerTeam}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {a.model}
                        </Badge>
                      </td>
                      <td className="py-3 pr-3 text-right tabular-nums">
                        ${a.costPerCall.toFixed(3)}
                      </td>
                      <td className="py-3 pr-3 text-right font-medium tabular-nums">
                        {formatCurrency(a.monthlyEst)}
                      </td>
                      <td className="hidden py-3 sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Progress value={a.share} className="h-1.5 w-24" />
                          <span className="w-9 text-right text-xs text-muted-foreground">
                            {a.share}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization recommendations */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" /> Optimization Recommendations
            </CardTitle>
            <CardDescription>Actionable ways to reduce spend without impacting quality</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-4 rounded-xl border border-success/30 bg-gradient-to-br from-success/10 to-transparent p-4"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total potential monthly savings</p>
              <p className="text-2xl font-semibold tracking-tight text-success">
                {formatCurrency(totalSavings)}
              </p>
            </div>
            <div className="ml-auto hidden text-right sm:block">
              <p className="text-sm text-muted-foreground">Across</p>
              <p className="text-lg font-semibold">{optimizationRecs.length} recommendations</p>
            </div>
          </motion.div>

          <Separator />

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {optimizationRecs.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{r.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{r.detail}</p>
                  </div>
                  <p className="shrink-0 text-right font-semibold text-success">
                    {formatCurrency(r.savings)}
                    <span className="block text-[10px] font-normal text-muted-foreground">
                      / mo
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={effortVariant[r.effort] ?? "secondary"}>
                      {r.effort} effort
                    </Badge>
                    <Badge variant={impactVariant[r.impact] ?? "secondary"}>
                      {r.impact} impact
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Apply <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
