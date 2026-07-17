"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { navItems } from "@/lib/nav";
import { agents } from "@/lib/mock-data";
import { useUI } from "@/store/use-ui";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Store } from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const { commandOpen, setCommandOpen } = useUI();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandOpen, setCommandOpen]);

  const results = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    const pages = navItems
      .filter((i) => !q || i.label.toLowerCase().includes(q))
      .map((i) => ({
        type: "Page" as const,
        label: i.label,
        href: i.href,
        icon: i.icon,
      }));
    const agentResults = agents
      .filter((a) => q && a.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((a) => ({
        type: "Agent" as const,
        label: a.name,
        href: `/marketplace/${a.slug}`,
        icon: Store,
      }));
    return [...pages, ...agentResults];
  }, [query]);

  React.useEffect(() => setActive(0), [query]);

  const go = (href: string) => {
    setCommandOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
      <DialogContent className="top-[20%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown")
                setActive((a) => Math.min(a + 1, results.length - 1));
              if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
              if (e.key === "Enter" && results[active]) go(results[active].href);
            }}
            placeholder="Search agents, workflows, pages…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
            ESC
          </kbd>
        </div>
        <div data-lenis-prevent className="max-h-80 overflow-y-auto scrollbar-thin p-2">
          {results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No results for “{query}”
            </p>
          )}
          {results.map((r, i) => (
            <button
              key={r.href + r.label}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r.href)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                active === i ? "bg-primary/10 text-primary" : "text-foreground"
              )}
            >
              <r.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1">{r.label}</span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {r.type}
              </span>
              {active === i && (
                <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
