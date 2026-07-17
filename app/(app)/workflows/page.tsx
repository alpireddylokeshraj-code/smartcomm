"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Upload,
  ScanText,
  Languages,
  Scale,
  ShieldCheck,
  LayoutTemplate,
  ClipboardCheck,
  Download,
  Plus,
  Trash2,
  Play,
  Save,
  Settings2,
  Clock,
  DollarSign,
  Gauge,
  X,
  GripVertical,
  Zap,
  RotateCw,
  type LucideIcon,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NodeType {
  type: string;
  label: string;
  icon: LucideIcon;
  color: string;
  cost: number;
  runtime: number;
}

const NODE_TYPES: NodeType[] = [
  { type: "upload", label: "Document Upload", icon: Upload, color: "from-slate-500 to-slate-600", cost: 0, runtime: 0.5 },
  { type: "ocr", label: "OCR Agent", icon: ScanText, color: "from-indigo-500 to-blue-500", cost: 0.014, runtime: 3.2 },
  { type: "translate", label: "Translation Agent", icon: Languages, color: "from-sky-500 to-cyan-500", cost: 0.009, runtime: 2.4 },
  { type: "compliance", label: "Compliance Agent", icon: Scale, color: "from-purple-500 to-fuchsia-500", cost: 0.021, runtime: 4.1 },
  { type: "validation", label: "Validation Agent", icon: ShieldCheck, color: "from-emerald-500 to-green-500", cost: 0.004, runtime: 0.8 },
  { type: "template", label: "Template Agent", icon: LayoutTemplate, color: "from-amber-500 to-orange-500", cost: 0.012, runtime: 2.1 },
  { type: "review", label: "Human Review", icon: ClipboardCheck, color: "from-rose-500 to-pink-500", cost: 0, runtime: 0 },
  { type: "export", label: "Export", icon: Download, color: "from-teal-500 to-emerald-500", cost: 0, runtime: 0.3 },
];

interface WFNode {
  id: string;
  type: string;
  x: number;
  y: number;
  retries: number;
  timeout: number;
  costProfile: string;
}

const nodeMeta = (type: string) => NODE_TYPES.find((n) => n.type === type)!;

let idCounter = 100;

const initialNodes: WFNode[] = [
  { id: "n1", type: "upload", x: 60, y: 60, retries: 0, timeout: 30, costProfile: "standard" },
  { id: "n2", type: "ocr", x: 320, y: 60, retries: 2, timeout: 30, costProfile: "standard" },
  { id: "n3", type: "translate", x: 580, y: 60, retries: 1, timeout: 20, costProfile: "economy" },
  { id: "n4", type: "compliance", x: 320, y: 240, retries: 1, timeout: 40, costProfile: "premium" },
  { id: "n5", type: "review", x: 580, y: 240, retries: 0, timeout: 0, costProfile: "standard" },
  { id: "n6", type: "export", x: 840, y: 150, retries: 1, timeout: 15, costProfile: "standard" },
];

const initialEdges: [string, string][] = [
  ["n1", "n2"],
  ["n2", "n3"],
  ["n3", "n4"],
  ["n4", "n5"],
  ["n5", "n6"],
];

const NODE_W = 200;
const NODE_H = 84;

export default function WorkflowBuilderPage() {
  const [nodes, setNodes] = React.useState<WFNode[]>(initialNodes);
  const [edges, setEdges] = React.useState<[string, string][]>(initialEdges);
  const [selected, setSelected] = React.useState<string | null>("n2");
  const dragState = React.useRef<{ id: string; dx: number; dy: number } | null>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const addNode = (type: string) => {
    const id = `n${idCounter++}`;
    const last = nodes[nodes.length - 1];
    const newNode: WFNode = {
      id,
      type,
      x: (last ? last.x + 60 : 80) % 900,
      y: (last ? last.y + 120 : 80) % 360,
      retries: 1,
      timeout: 30,
      costProfile: "standard",
    };
    setNodes((n) => [...n, newNode]);
    if (last) setEdges((e) => [...e, [last.id, id]]);
    setSelected(id);
  };

  const removeNode = (id: string) => {
    setNodes((n) => n.filter((x) => x.id !== id));
    setEdges((e) => e.filter(([a, b]) => a !== id && b !== id));
    if (selected === id) setSelected(null);
  };

  const updateNode = (id: string, patch: Partial<WFNode>) => {
    setNodes((n) => n.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const onPointerDown = (e: React.PointerEvent, node: WFNode) => {
    e.stopPropagation();
    setSelected(node.id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragState.current = {
      id: node.id,
      dx: e.clientX - rect.left - node.x,
      dy: e.clientY - rect.top - node.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(e.clientX - rect.left - dragState.current.dx, rect.width - NODE_W));
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragState.current.dy, rect.height - NODE_H));
    updateNode(dragState.current.id, { x, y });
  };

  const onPointerUp = () => {
    dragState.current = null;
  };

  // Stats
  const stats = React.useMemo(() => {
    const cost = nodes.reduce((s, n) => s + nodeMeta(n.type).cost, 0);
    const runtime = nodes.reduce((s, n) => s + nodeMeta(n.type).runtime, 0);
    const complexity = Math.min(100, nodes.length * 8 + edges.length * 6);
    return { cost, runtime, complexity };
  }, [nodes, edges]);

  const selectedNode = nodes.find((n) => n.id === selected);

  const edgePath = (from: WFNode, to: WFNode) => {
    const x1 = from.x + NODE_W;
    const y1 = from.y + NODE_H / 2;
    const x2 = to.x;
    const y2 = to.y + NODE_H / 2;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Orchestrate"
        title="Workflow Builder"
        description="Drag agents onto the canvas and connect them into an orchestration pipeline."
        actions={
          <>
            <Button variant="outline">
              <Save className="h-4 w-4" /> Save Draft
            </Button>
            <Button variant="gradient">
              <Play className="h-4 w-4" /> Run Workflow
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr_300px]">
        {/* Palette */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Node Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {NODE_TYPES.map((nt) => (
              <button
                key={nt.type}
                onClick={() => addNode(nt.type)}
                className="group flex w-full items-center gap-2.5 rounded-lg border border-border bg-background/40 p-2 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br", nt.color)}>
                  <nt.icon className="h-4 w-4 text-white" />
                </div>
                <span className="flex-1 text-xs font-medium">{nt.label}</span>
                <Plus className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Input
                defaultValue="Invoice Intake & Validation"
                className="h-8 w-56 border-none bg-transparent px-0 text-sm font-semibold shadow-none focus-visible:ring-0"
              />
              <Badge variant="success" className="text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Draft
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Button variant="ghost" size="icon-sm"><RotateCw className="h-3.5 w-3.5" /></Button>
              <span>{nodes.length} nodes · {edges.length} edges</span>
            </div>
          </div>
          <div
            ref={canvasRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={() => setSelected(null)}
            className="relative h-[520px] w-full overflow-hidden grid-bg"
            style={{ touchAction: "none" }}
          >
            {/* Edges */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" />
                </marker>
              </defs>
              {edges.map(([a, b], i) => {
                const from = nodes.find((n) => n.id === a);
                const to = nodes.find((n) => n.id === b);
                if (!from || !to) return null;
                return (
                  <path
                    key={i}
                    d={edgePath(from, to)}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeOpacity={0.5}
                    markerEnd="url(#arrow)"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const meta = nodeMeta(node.type);
              const isSel = selected === node.id;
              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => onPointerDown(e, node)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(node.id);
                  }}
                  className={cn(
                    "absolute flex cursor-grab select-none flex-col rounded-xl border bg-card shadow-md transition-shadow active:cursor-grabbing",
                    isSel ? "border-primary ring-2 ring-primary/30" : "border-border hover:shadow-lg"
                  )}
                  style={{ left: node.x, top: node.y, width: NODE_W }}
                >
                  <div className="flex items-center gap-2 border-b border-border p-2.5">
                    <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br", meta.color)}>
                      <meta.icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="flex-1 truncate text-xs font-semibold">{meta.label}</span>
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between px-2.5 py-2 text-[10px] text-muted-foreground">
                    <span className="font-mono">{node.id}</span>
                    <div className="flex items-center gap-2">
                      {meta.cost > 0 && <span>{formatCurrency(meta.cost, { maximumFractionDigits: 3, minimumFractionDigits: 3 })}</span>}
                      <span className="inline-flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {meta.runtime}s
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Properties + Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Settings2 className="h-4 w-4 text-primary" /> Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br", nodeMeta(selectedNode.type).color)}>
                        {React.createElement(nodeMeta(selectedNode.type).icon, { className: "h-4 w-4 text-white" })}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{nodeMeta(selectedNode.type).label}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{selectedNode.id}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon-sm" onClick={() => removeNode(selectedNode.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Cost Profile</Label>
                    <Select
                      value={selectedNode.costProfile}
                      onValueChange={(v) => updateNode(selectedNode.id, { costProfile: v })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy (Haiku)</SelectItem>
                        <SelectItem value="standard">Standard (Sonnet)</SelectItem>
                        <SelectItem value="premium">Premium (Opus)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Retry Count</Label>
                      <Input
                        type="number"
                        min={0}
                        max={5}
                        value={selectedNode.retries}
                        onChange={(e) => updateNode(selectedNode.id, { retries: Number(e.target.value) })}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Timeout (s)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={selectedNode.timeout}
                        onChange={(e) => updateNode(selectedNode.id, { timeout: Number(e.target.value) })}
                        className="h-9"
                      />
                    </div>
                  </div>

                  <Separator />
                  <div className="rounded-lg bg-secondary/50 p-3 text-xs">
                    <p className="font-medium">Agent Configuration</p>
                    <p className="mt-1 text-muted-foreground">
                      This node executes the {nodeMeta(selectedNode.type).label} with the
                      selected cost profile and retry policy.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <Settings2 className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Select a node to configure it
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-accent" /> Workflow Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatRow icon={DollarSign} label="Estimated Cost" value={`${formatCurrency(stats.cost, { maximumFractionDigits: 3, minimumFractionDigits: 3 })}/run`} accent="text-success" />
              <StatRow icon={Clock} label="Estimated Runtime" value={`${stats.runtime.toFixed(1)}s`} accent="text-primary" />
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Gauge className="h-4 w-4" /> Complexity Score
                  </span>
                  <span className="font-semibold">{stats.complexity}/100</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-sky-500 transition-all"
                    style={{ width: `${stats.complexity}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <span className={cn("text-sm font-semibold", accent)}>{value}</span>
    </div>
  );
}
