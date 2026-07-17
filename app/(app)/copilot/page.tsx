"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Bot,
  Workflow as WorkflowIcon,
  DollarSign,
  ShieldCheck,
  Zap,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopilotChat } from "@/components/copilot/copilot-chat";

const capabilities = [
  { icon: Bot, title: "Compose Agents", desc: "Draft and configure new agents from a plain-English brief." },
  { icon: WorkflowIcon, title: "Design Workflows", desc: "Generate multi-step orchestration pipelines instantly." },
  { icon: DollarSign, title: "Optimize Cost", desc: "Surface savings across models, caching, and batching." },
  { icon: ShieldCheck, title: "Govern & Audit", desc: "Explain reviews, policies, and compliance posture." },
];

const examples = [
  "Draft a compliance workflow for EU insurance claims",
  "Which agent has the highest review rate this week?",
  "Compare Opus vs Haiku cost for summarization",
  "Generate a governance policy for PII handling",
];

export default function CopilotPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Chat */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-primary/10 via-accent/5 to-transparent p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">SmartCOMM Copilot</h1>
              <Badge variant="accent">Beta</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Your AI partner for building and governing the platform
            </p>
          </div>
          <Badge variant="success" className="hidden sm:inline-flex">
            <Zap className="h-3 w-3" /> claude-opus-4-8
          </Badge>
        </div>
        <div className="min-h-0 flex-1">
          <CopilotChat />
        </div>
      </motion.div>

      {/* Sidebar */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-primary" /> Capabilities
            </h2>
            <div className="space-y-3">
              {capabilities.map((c) => (
                <div key={c.title} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="mb-3 text-sm font-semibold">Try asking</h2>
            <div className="space-y-2">
              {examples.map((e) => (
                <div
                  key={e}
                  className="rounded-lg border border-border bg-background/40 px-3 py-2 text-xs text-muted-foreground"
                >
                  {e}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-5">
          <Sparkles className="mb-2 h-5 w-5 text-accent" />
          <p className="text-sm font-semibold">Powered by SmartCOMM AI</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Copilot is grounded in your platform telemetry, registry, and
            governance policies. Always verify important outputs.
          </p>
        </div>
      </div>
    </div>
  );
}
