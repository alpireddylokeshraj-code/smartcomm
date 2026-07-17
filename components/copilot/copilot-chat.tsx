"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { useAuth } from "@/store/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "Build a workflow to process multilingual invoices",
  "Which agents are triggering the most reviews?",
  "Summarize this month's cost trend",
  "Recommend cost optimizations",
];

const cannedReplies: Record<string, string> = {
  invoice:
    "I can scaffold that for you. Here's a proposed pipeline:\n\n1. Document Upload → 2. DocuVision OCR → 3. PolyglotTranslate → 4. SchemaGuard Validator → 5. Human Review (conditional) → 6. Export\n\nEstimated cost ≈ $0.043/run, runtime ≈ 12s. Want me to open this in the Workflow Builder?",
  review:
    "Over the last 7 days, the top review triggers are:\n\n• RegSense Compliance — 88 reviews (PHI + regulated jurisdictions)\n• PII Redactor — 47 (incomplete redaction)\n• SchemaGuard Validator — 61 (tax mismatches)\n\nRegSense drives ~34% of high-risk reviews. Consider enabling prompt caching to reduce latency-driven low-confidence flags.",
  cost:
    "July spend is $20,300 against a $26,000 budget (78%). Opus 4.8 accounts for 48% of spend. You're trending $2,100 under budget vs. June. Three optimizations could save ~$1,530/mo — want the breakdown?",
  optim:
    "Top optimizations:\n\n1. Downgrade BriefGen summaries to Haiku → save $430/mo\n2. Enable prompt caching on RegSense → save $780/mo\n3. Batch invoice OCR overnight → save $320/mo\n\nApplying all three keeps quality within SLA. Shall I create the change requests?",
};

function reply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("invoice") || q.includes("workflow")) return cannedReplies.invoice;
  if (q.includes("review")) return cannedReplies.review;
  if (q.includes("cost") || q.includes("spend") || q.includes("budget"))
    return cannedReplies.cost;
  if (q.includes("optim") || q.includes("save") || q.includes("recommend"))
    return cannedReplies.optim;
  return "Great question. Based on your platform telemetry, I'd recommend starting from the Marketplace to compose agents, then wiring them in the Workflow Builder. I can also draft governance policies or analyze cost. What would you like to focus on?";
}

export function CopilotChat({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your SmartCOMM Copilot. I can help you build agents & workflows, analyze cost, and surface governance insights. What would you like to build today?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `u-${messages.length}`,
      role: "user",
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: `a-${m.length}`, role: "assistant", content: reply(text) },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="flex h-full flex-col">
      <div
        data-lenis-prevent
        className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4"
      >
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3",
              m.role === "user" && "flex-row-reverse"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                m.role === "assistant"
                  ? "bg-gradient-to-br from-primary to-accent text-white"
                  : "bg-secondary"
              )}
            >
              {m.role === "assistant" ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <span className="text-xs font-semibold">
                  {initials(user?.name ?? "U")}
                </span>
              )}
            </div>
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "assistant"
                  ? "rounded-tl-sm bg-secondary text-foreground"
                  : "rounded-tr-sm bg-primary text-primary-foreground"
              )}
            >
              {m.content}
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="grid grid-cols-1 gap-2 px-4 pb-2 sm:grid-cols-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-lg border border-border bg-background/40 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-1.5 focus-within:border-primary/50"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Copilot anything…"
            className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" size="icon-sm" variant="gradient" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-1.5 px-1 text-center text-[10px] text-muted-foreground">
          Copilot can make mistakes. Verify important outputs.
        </p>
      </div>
    </div>
  );
}
