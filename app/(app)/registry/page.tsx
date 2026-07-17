"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  FlaskConical,
  Archive,
  GitBranch,
  Upload,
  RefreshCw,
  Search,
  MoreHorizontal,
  Rocket,
  RotateCcw,
  Trash2,
  Eye,
  ArrowUpCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { registryItems } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { HealthBadge } from "@/components/shared/health-badge";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// ---------------------------------------------------------------------------
// Types & static config
// ---------------------------------------------------------------------------
type RegistryItem = (typeof registryItems)[number];
type RegistryStatus = RegistryItem["status"];
type RegistryVisibility = RegistryItem["visibility"];

type StatusFilter = "all" | RegistryStatus;
type VisibilityFilter = "all" | RegistryVisibility;

const statusBadge: Record<
  RegistryStatus,
  { variant: "success" | "warning" | "destructive"; label: string }
> = {
  published: { variant: "success", label: "Published" },
  staging: { variant: "warning", label: "Staging" },
  deprecated: { variant: "destructive", label: "Deprecated" },
};

const visibilityBadge: Record<
  RegistryVisibility,
  { variant: "accent" | "secondary"; label: string }
> = {
  public: { variant: "accent", label: "Public" },
  internal: { variant: "secondary", label: "Internal" },
};

// ---------------------------------------------------------------------------
// Invented inline data — version history timeline
// ---------------------------------------------------------------------------
const versionHistory: {
  version: string;
  action: string;
  author: string;
  date: string;
  dot: string;
}[] = [
  {
    version: "v4.2.1",
    action: "Promoted to prod",
    author: "Priya Nair",
    date: "2026-07-14",
    dot: "bg-success",
  },
  {
    version: "v4.2.0",
    action: "Published",
    author: "Priya Nair",
    date: "2026-07-11",
    dot: "bg-primary",
  },
  {
    version: "v4.1.3",
    action: "Staged for review",
    author: "David Chen",
    date: "2026-07-08",
    dot: "bg-warning",
  },
  {
    version: "v4.1.2",
    action: "Rolled back",
    author: "System",
    date: "2026-07-05",
    dot: "bg-destructive",
  },
  {
    version: "v4.1.1",
    action: "Published",
    author: "Nina Patel",
    date: "2026-07-02",
    dot: "bg-primary",
  },
  {
    version: "v4.1.0",
    action: "Deprecated",
    author: "Aisha Khan",
    date: "2026-06-28",
    dot: "bg-muted-foreground",
  },
];

// ---------------------------------------------------------------------------
// Invented inline data — deployment environments
// ---------------------------------------------------------------------------
const environments: {
  name: string;
  health: "healthy" | "degraded" | "down";
  activeVersions: number;
  capacity: number;
}[] = [
  { name: "Development", health: "healthy", activeVersions: 14, capacity: 38 },
  { name: "Staging", health: "degraded", activeVersions: 6, capacity: 71 },
  { name: "Production", health: "healthy", activeVersions: 9, capacity: 88 },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function RegistryPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [visibility, setVisibility] = useState<VisibilityFilter>("all");

  const publishedCount = registryItems.filter((i) => i.status === "published").length;
  const stagingCount = registryItems.filter((i) => i.status === "staging").length;
  const deprecatedCount = registryItems.filter((i) => i.status === "deprecated").length;
  const totalVersions = registryItems.length + 27;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return registryItems.filter((item) => {
      const matchesQuery = q === "" || item.name.toLowerCase().includes(q);
      const matchesStatus = status === "all" || item.status === status;
      const matchesVisibility = visibility === "all" || item.visibility === visibility;
      return matchesQuery && matchesStatus && matchesVisibility;
    });
  }, [query, status, visibility]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title="Registry Management"
        description="Publish, version, and govern every agent and model artifact across your environments — a single source of truth from staging to production."
        actions={
          <>
            <Button variant="gradient">
              <Upload className="h-4 w-4" />
              Publish Version
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4" />
              Sync
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Published"
          value={String(publishedCount)}
          icon={Boxes}
          accent="success"
          hint="Live in production"
          index={0}
        />
        <StatCard
          label="Staging"
          value={String(stagingCount)}
          icon={FlaskConical}
          accent="warning"
          hint="Awaiting promotion"
          index={1}
        />
        <StatCard
          label="Deprecated"
          value={String(deprecatedCount)}
          icon={Archive}
          accent="destructive"
          hint="Scheduled for removal"
          index={2}
        />
        <StatCard
          label="Total Versions"
          value={String(totalVersions)}
          icon={GitBranch}
          accent="accent"
          hint="Across all artifacts"
          index={3}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="xl:col-span-2"
        >
          <Card className="overflow-hidden">
            <CardHeader className="gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle>Registry Artifacts</CardTitle>
                <CardDescription>
                  {filtered.length} of {registryItems.length} versions shown
                </CardDescription>
              </div>
              {/* Toolbar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name…"
                    className="pl-9"
                  />
                </div>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as StatusFilter)}
                >
                  <SelectTrigger className="sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={visibility}
                  onValueChange={(v) => setVisibility(v as VisibilityFilter)}
                >
                  <SelectTrigger className="sm:w-40">
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Visibility</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Version</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Owner</th>
                      <th className="px-4 py-3 font-medium">Model</th>
                      <th className="px-4 py-3 font-medium">Visibility</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Updated</th>
                      <th className="px-4 py-3 text-right font-medium">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => {
                      const sb = statusBadge[item.status];
                      const vb = visibilityBadge[item.visibility];
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-border transition-colors last:border-0 hover:bg-secondary/50"
                        >
                          <td className="px-4 py-3">
                            <div className="font-semibold text-foreground">
                              {item.name}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              {item.id}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="font-mono">
                              v{item.version}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary">{item.category}</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.owner}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {item.model}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={vb.variant}>{vb.label}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={sb.variant}>{sb.label}</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.updatedAt}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ArrowUpCircle className="h-4 w-4" />
                                  Promote
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Archive className="h-4 w-4" />
                                  Deprecate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RotateCcw className="h-4 w-4" />
                                  Rollback
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-12 text-center text-sm text-muted-foreground"
                        >
                          No artifacts match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Version history timeline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
                <CardDescription>Recent registry activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="relative ml-1.5 space-y-5 border-l border-border pl-6">
                  {versionHistory.map((entry, i) => (
                    <li key={i} className="relative">
                      <span
                        className={cn(
                          "absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-card",
                          entry.dot
                        )}
                      />
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-medium text-foreground">
                          {entry.version}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.date}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-foreground">
                        {entry.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {entry.author}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* Deployment environments */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Deployment Environments</CardTitle>
                <CardDescription>Active versions & capacity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {environments.map((env, i) => (
                  <div key={env.name}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {env.name}
                        </span>
                      </div>
                      <HealthBadge status={env.health} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        <span className="font-medium text-foreground">
                          {env.activeVersions}
                        </span>{" "}
                        active versions
                      </span>
                      <span>{env.capacity}% capacity</span>
                    </div>
                    <Progress value={env.capacity} className="mt-2 h-1.5" />
                    {i < environments.length - 1 && (
                      <Separator className="mt-5" />
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <Rocket className="h-3.5 w-3.5" />
                  Continuous delivery enabled across all environments
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
