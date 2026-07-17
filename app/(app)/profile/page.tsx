"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bot,
  Workflow,
  ClipboardCheck,
  Award,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Clock,
  Share2,
  Pencil,
  Rocket,
  Star,
  Trophy,
  Zap,
  ShieldCheck,
  UserPlus,
  Play,
  Activity as ActivityIcon,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/store/use-auth";
import { agents, activityFeed, usageTrend } from "@/lib/mock-data";
import { cn, initials, relativeTime } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import { HealthBadge } from "@/components/shared/health-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ChartTooltip, AXIS_PROPS } from "@/components/charts/chart-kit";

const activityIcon: Record<string, LucideIcon> = {
  deployment: Rocket,
  onboarding: UserPlus,
  execution: Play,
  review: ClipboardCheck,
  alert: ActivityIcon,
};

const skills = [
  "AI Governance",
  "Workflow Design",
  "FinOps",
  "OCR",
  "Compliance",
  "RAG",
  "Prompt Engineering",
  "Observability",
];

const achievements: {
  title: string;
  subtext: string;
  icon: LucideIcon;
  accent: string;
}[] = [
  {
    title: "Top Reviewer Q2",
    subtext: "248 reviews cleared",
    icon: Trophy,
    accent: "from-amber-500 to-orange-500",
  },
  {
    title: "1000 Runs",
    subtext: "Workflows orchestrated",
    icon: Zap,
    accent: "from-indigo-500 to-blue-500",
  },
  {
    title: "Zero SLA Breaches",
    subtext: "Perfect quarter",
    icon: ShieldCheck,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Star Contributor",
    subtext: "9.4 impact score",
    icon: Star,
    accent: "from-purple-500 to-fuchsia-500",
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const name = user?.name ?? "Lokesh Raj";
  const email = user?.email ?? "user@cognizant.com";
  const role = user?.role ?? "Platform Administrator";
  const team = user?.team ?? "AI Operations";

  const contributionTrend = usageTrend.map((d) => ({
    day: d.day,
    contributions: Math.round(d.requests / 900),
  }));

  const ownedAgents = agents.slice(0, 4);

  const infoRows: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "Role", value: role, icon: Award },
    { label: "Team", value: team, icon: Building2 },
    { label: "Email", value: email, icon: Mail },
    { label: "Timezone", value: "CET (UTC+1)", icon: Clock },
    { label: "Manager", value: "David Chen", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Hero / banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          <div className="relative h-40 bg-gradient-to-r from-primary via-accent to-sky-500 md:h-48">
            <div className="absolute inset-0 dot-bg opacity-40" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
            <Badge
              variant="secondary"
              className="absolute right-4 top-4 bg-white/15 text-white backdrop-blur"
            >
              <ShieldCheck className="h-3 w-3" /> Enterprise Workspace
            </Badge>
          </div>

          <CardContent className="pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <Avatar className="-mt-12 h-24 w-24 ring-4 ring-background">
                  <AvatarFallback className="text-2xl">
                    {initials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                      {name}
                    </h1>
                    <Badge variant="accent">{team}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{role}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {email}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> Remote · EU
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Joined Jan 2025
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="gradient">
                  <Pencil className="h-4 w-4" /> Edit Profile
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Agents Owned" value="6" delta={2} icon={Bot} index={0} />
        <StatCard
          label="Workflows Created"
          value="12"
          delta={4}
          icon={Workflow}
          accent="accent"
          index={1}
        />
        <StatCard
          label="Reviews Completed"
          value="248"
          delta={11}
          icon={ClipboardCheck}
          accent="success"
          index={2}
        />
        <StatCard
          label="Contribution Score"
          value="9.4"
          delta={3}
          icon={Award}
          accent="accent"
          hint="A+ tier"
          index={3}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Activity chart */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Activity</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Contributions over the last 7 days
                </p>
              </div>
              <Badge variant="success">+14% WoW</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={contributionTrend}
                  margin={{ left: -12, right: 6 }}
                >
                  <defs>
                    <linearGradient id="contrib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis dataKey="day" {...AXIS_PROPS} />
                  <YAxis {...AXIS_PROPS} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="contributions"
                    name="Contributions"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#contrib)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent activity timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your latest actions across the platform
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 pl-2">
                <div className="absolute bottom-2 left-[15px] top-2 w-px bg-border" />
                {activityFeed.slice(0, 6).map((a) => {
                  const Icon = activityIcon[a.type] ?? ActivityIcon;
                  return (
                    <div key={a.id} className="relative flex gap-4">
                      <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-background">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1 pb-1">
                        <p className="text-sm font-medium text-foreground">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {a.description}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                          {relativeTime(a.time)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Platform administrator and AI governance lead focused on scaling
                trustworthy GenAI operations. Passionate about workflow
                automation, cost optimization, and building the guardrails that
                let teams ship agents with confidence.
              </p>
              <Separator />
              <div className="space-y-3">
                {infoRows.map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      <row.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {row.label}
                    </span>
                    <span className="ml-auto truncate text-sm font-medium text-foreground">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Focus Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <Badge
                    key={s}
                    variant={i % 2 === 0 ? "default" : "accent"}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Owned agents */}
          <Card>
            <CardHeader>
              <CardTitle>Owned Agents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ownedAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {agent.name}
                    </p>
                    <Badge variant="outline" className="mt-0.5">
                      {agent.category}
                    </Badge>
                  </div>
                  <HealthBadge status={agent.health} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <p className="text-sm text-muted-foreground">
            Milestones and recognition earned
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-secondary/30 p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br shadow-md",
                    ach.accent
                  )}
                >
                  <ach.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {ach.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{ach.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
