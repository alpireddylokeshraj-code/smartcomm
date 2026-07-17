"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  Check,
  X,
  Pencil,
  Eye,
  ChevronRight,
  FileText,
  AlertTriangle,
  Gauge,
  Lock,
  History,
  Bot,
  CircleCheck,
  CircleX,
} from "lucide-react";
import {
  reviewTasks as seed,
  type ReviewTask,
  type RiskLevel,
} from "@/lib/mock-data";
import { cn, relativeTime } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const riskConfig: Record<
  RiskLevel,
  { label: string; badge: "destructive" | "warning" | "success"; icon: typeof ShieldAlert }
> = {
  high: { label: "High Risk", badge: "destructive", icon: ShieldAlert },
  medium: { label: "Medium Risk", badge: "warning", icon: AlertTriangle },
  low: { label: "Low Risk", badge: "success", icon: ShieldCheck },
};

function ScoreBar({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  const good = invert ? value < 50 : value >= 75;
  const mid = value >= 50 && value < 75;
  const color = good ? "bg-success" : mid ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex-1">
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [tasks, setTasks] = React.useState<ReviewTask[]>(seed);
  const [active, setActive] = React.useState<ReviewTask | null>(null);
  const [edited, setEdited] = React.useState("");

  const decide = (id: string, status: "approved" | "rejected") => {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, status } : x)));
    setActive(null);
  };

  const openDrawer = (task: ReviewTask) => {
    setActive(task);
    setEdited(task.suggestedOutput);
  };

  const pending = tasks.filter((t) => t.status === "pending");
  const high = pending.filter((t) => t.risk === "high");
  const medium = pending.filter((t) => t.risk === "medium" || t.risk === "low");
  const completed = tasks.filter((t) => t.status !== "pending");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Govern"
        title="Human Review Center"
        description="Review, edit, and approve high-stakes AI outputs before they reach production."
        actions={
          <Badge variant="outline" className="gap-1.5">
            <Lock className="h-3 w-3" /> SLA-tracked queue
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="High Risk" value={String(high.length)} icon={ShieldAlert} accent="destructive" index={0} />
        <StatCard label="Medium / Low" value={String(medium.length)} icon={AlertTriangle} accent="warning" index={1} />
        <StatCard label="Completed Today" value={String(completed.length)} icon={CircleCheck} accent="success" index={2} />
        <StatCard label="Avg Confidence" value={`${Math.round(pending.reduce((s, t) => s + t.confidenceScore, 0) / (pending.length || 1))}%`} icon={Gauge} accent="accent" index={3} />
      </div>

      <Tabs defaultValue="high">
        <TabsList>
          <TabsTrigger value="high">
            High Risk
            {high.length > 0 && <Badge variant="destructive" className="ml-1.5 h-5 px-1.5 text-[10px]">{high.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="medium">
            Medium Risk
            {medium.length > 0 && <Badge variant="warning" className="ml-1.5 h-5 px-1.5 text-[10px]">{medium.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completed.length > 0 && <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[10px]">{completed.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="high">
          <ReviewList tasks={high} onOpen={openDrawer} onDecide={decide} />
        </TabsContent>
        <TabsContent value="medium">
          <ReviewList tasks={medium} onOpen={openDrawer} onDecide={decide} />
        </TabsContent>
        <TabsContent value="completed">
          <ReviewList tasks={completed} onOpen={openDrawer} onDecide={decide} completed />
        </TabsContent>
      </Tabs>

      {/* Detail drawer */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          {active && (
            <>
              <SheetHeader className="border-b border-border">
                <div className="flex items-center gap-2">
                  <Badge variant={riskConfig[active.risk].badge}>
                    {riskConfig[active.risk].label}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">{active.id}</span>
                </div>
                <SheetTitle>{active.documentType}</SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <Bot className="h-3.5 w-3.5" /> {active.agent} · {active.submittedBy}
                </SheetDescription>
              </SheetHeader>

              <div
                data-lenis-prevent
                className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-6"
              >
                <div className="flex gap-4">
                  <ScoreBar label="Confidentiality" value={active.confidentialityScore} invert />
                  <ScoreBar label="Confidence" value={active.confidenceScore} />
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Reasons flagged
                  </p>
                  <div className="space-y-1.5">
                    {active.reasons.map((r) => (
                      <div key={r} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                        <AlertTriangle className="h-3.5 w-3.5 text-warning" /> {r}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Original Output
                  </p>
                  <div className="rounded-lg border border-border bg-destructive/5 p-3 text-sm leading-relaxed">
                    {active.originalOutput}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Modified Output (editable)
                  </p>
                  <Textarea
                    value={edited}
                    onChange={(e) => setEdited(e.target.value)}
                    className="min-h-28 bg-success/5 text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <History className="h-3.5 w-3.5" /> Review History
                  </p>
                  <div className="space-y-3 border-l border-border pl-4">
                    {[
                      { t: "Submitted for review", by: active.submittedBy, time: active.submittedAt, dot: "bg-primary" },
                      { t: "Auto-flagged by policy engine", by: "RegSense policy pack", time: active.submittedAt, dot: "bg-warning" },
                      { t: `Assigned · SLA ${active.slaHours}h`, by: "Review orchestrator", time: active.submittedAt, dot: "bg-accent" },
                    ].map((h, i) => (
                      <div key={i} className="relative">
                        <span className={cn("absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-background", h.dot)} />
                        <p className="text-sm font-medium">{h.t}</p>
                        <p className="text-xs text-muted-foreground">{h.by} · {relativeTime(h.time)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {active.status === "pending" && (
                <div className="grid grid-cols-3 gap-2 border-t border-border p-4">
                  <Button variant="outline" className="text-destructive" onClick={() => decide(active.id, "rejected")}>
                    <X className="h-4 w-4" /> Reject
                  </Button>
                  <Button variant="outline" onClick={() => decide(active.id, "approved")}>
                    <Pencil className="h-4 w-4" /> Edit & Approve
                  </Button>
                  <Button variant="gradient" onClick={() => decide(active.id, "approved")}>
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                </div>
              )}
              {active.status !== "pending" && (
                <div className="border-t border-border p-4">
                  <Badge variant={active.status === "approved" ? "success" : "destructive"} className="w-full justify-center py-2">
                    {active.status === "approved" ? (
                      <><CircleCheck className="h-4 w-4" /> Approved</>
                    ) : (
                      <><CircleX className="h-4 w-4" /> Rejected</>
                    )}
                  </Badge>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ReviewList({
  tasks,
  onOpen,
  onDecide,
  completed,
}: {
  tasks: ReviewTask[];
  onOpen: (t: ReviewTask) => void;
  onDecide: (id: string, status: "approved" | "rejected") => void;
  completed?: boolean;
}) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <ShieldCheck className="mb-3 h-8 w-8 text-success" />
        <p className="font-medium">All caught up</p>
        <p className="text-sm text-muted-foreground">No tasks in this queue.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => {
          const rc = riskConfig[task.risk];
          return (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <Card className="flex h-full flex-col p-5 transition-all hover:border-primary/40 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      task.risk === "high" ? "bg-destructive/10 text-destructive" : task.risk === "medium" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                    )}>
                      <rc.icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{task.documentType}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{task.id}</p>
                    </div>
                  </div>
                  {completed ? (
                    <Badge variant={task.status === "approved" ? "success" : "destructive"}>
                      {task.status === "approved" ? "Approved" : "Rejected"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" /> SLA {task.slaHours}h
                    </Badge>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Bot className="h-3.5 w-3.5" /> {task.agent}
                </div>

                <div className="mt-4 flex gap-4">
                  <ScoreBar label="Confidentiality" value={task.confidentialityScore} invert />
                  <ScoreBar label="Confidence" value={task.confidenceScore} />
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {task.reasons.slice(0, 2).map((r) => (
                    <Badge key={r} variant="secondary" className="text-[10px]">
                      {r}
                    </Badge>
                  ))}
                  {task.reasons.length > 2 && (
                    <Badge variant="secondary" className="text-[10px]">
                      +{task.reasons.length - 2}
                    </Badge>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="mt-auto flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => onOpen(task)}>
                    <Eye className="h-3.5 w-3.5" /> Review
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                  {!completed && (
                    <>
                      <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => onDecide(task.id, "rejected")}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button variant="gradient" size="icon-sm" onClick={() => onDecide(task.id, "approved")}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
