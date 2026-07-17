"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  Star,
  Download,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  Users,
  Check,
} from "lucide-react";
import { agents, agentCategories, type Agent } from "@/lib/mock-data";
import { getAgentIcon } from "@/lib/icon-map";
import { cn, formatCompact } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { HealthBadge } from "@/components/shared/health-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type View = "grid" | "list";

export default function MarketplacePage() {
  const [view, setView] = React.useState<View>("grid");
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("All");
  const [sort, setSort] = React.useState("popular");

  const filtered = React.useMemo(() => {
    let list = agents.filter((a) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.capabilities.some((c) => c.toLowerCase().includes(q));
      const matchesCat = category === "All" || a.category === category;
      return matchesQuery && matchesCat;
    });
    list = [...list].sort((a, b) => {
      if (sort === "popular") return b.installs - a.installs;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "latency") return a.latencyMs - b.latencyMs;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [query, category, sort]);

  const featured = agents.filter((a) => a.featured).slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Discover"
        title="Agent Marketplace"
        description="Browse, evaluate, and deploy production-ready AI agents across your enterprise."
        actions={
          <Button variant="gradient">
            <Sparkles className="h-4 w-4" /> Submit an Agent
          </Button>
        }
      />

      {/* Featured */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {featured.map((a, i) => {
          const Icon = getAgentIcon(a.icon);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/marketplace/${a.slug}`}>
                <Card className="group relative h-full overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/20 blur-2xl" />
                  <div className="relative flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="accent">Featured</Badge>
                  </div>
                  <p className="relative mt-3 font-semibold">{a.name}</p>
                  <p className="relative line-clamp-2 text-sm text-muted-foreground">
                    {a.description}
                  </p>
                  <div className="relative mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {a.rating}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Download className="h-3 w-3" /> {formatCompact(a.installs)}
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, capabilities…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="latency">Fastest</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setView("list")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {["All", ...agentCategories.map((c) => c.name)].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              category === c
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} agent{filtered.length !== 1 && "s"}
        {category !== "All" && ` in ${category}`}
      </p>

      {/* Results */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a, i) => (
            <AgentGridCard key={a.id} agent={a} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a, i) => (
            <AgentListRow key={a.id} agent={a} index={i} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Search className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No agents found</p>
          <p className="text-sm text-muted-foreground">
            Try a different search or category.
          </p>
        </div>
      )}
    </div>
  );
}

function AgentGridCard({ agent, index }: { agent: Agent; index: number }) {
  const Icon = getAgentIcon(agent.icon);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
    >
      <Card className="group flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary/10">
            <Icon className="h-5 w-5" />
          </div>
          <HealthBadge status={agent.health} />
        </div>
        <div className="mt-3 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{agent.name}</p>
            <Badge variant="outline" className="font-mono text-[10px]">
              v{agent.version}
            </Badge>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {agent.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {agent.capabilities.slice(0, 3).map((c) => (
              <Badge key={c} variant="secondary" className="text-[10px]">
                {c}
              </Badge>
            ))}
            {agent.capabilities.length > 3 && (
              <Badge variant="secondary" className="text-[10px]">
                +{agent.capabilities.length - 3}
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {agent.rating}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" /> {agent.ownerTeam}
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button variant="gradient" size="sm" className="flex-1">
            <Check className="h-3.5 w-3.5" /> Use Agent
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/marketplace/${agent.slug}`}>Details</Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function AgentListRow({ agent, index }: { agent: Agent; index: number }) {
  const Icon = getAgentIcon(agent.icon);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
    >
      <Card className="flex flex-col gap-4 p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{agent.name}</p>
            <Badge variant="outline" className="font-mono text-[10px]">
              v{agent.version}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {agent.category}
            </Badge>
            <HealthBadge status={agent.health} />
          </div>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
            {agent.description}
          </p>
        </div>
        <div className="hidden items-center gap-6 text-xs text-muted-foreground lg:flex">
          <div className="text-center">
            <p className="font-semibold text-foreground">{agent.successRate}%</p>
            <p>Success</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">{agent.latencyMs}ms</p>
            <p>Latency</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">
              {formatCompact(agent.installs)}
            </p>
            <p>Installs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="gradient" size="sm">
            Use Agent
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/marketplace/${agent.slug}`}>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
