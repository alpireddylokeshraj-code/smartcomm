"use client";

import { Sparkles } from "lucide-react";
import { useUI } from "@/store/use-ui";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CopilotChat } from "@/components/copilot/copilot-chat";

export function CopilotDrawer() {
  const { copilotOpen, setCopilotOpen } = useUI();
  return (
    <Sheet open={copilotOpen} onOpenChange={setCopilotOpen}>
      <SheetContent side="right" className="w-full p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            SmartCOMM Copilot
            <Badge variant="accent" className="ml-1">
              Beta
            </Badge>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <CopilotChat compact />
        </div>
      </SheetContent>
    </Sheet>
  );
}
