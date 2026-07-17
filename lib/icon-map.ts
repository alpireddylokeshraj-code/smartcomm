import {
  ScanText,
  Languages,
  ShieldCheck,
  Scale,
  Tags,
  LayoutTemplate,
  FileText,
  BrainCircuit,
  ReceiptText,
  EyeOff,
  Gavel,
  BookOpenCheck,
  Bot,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  ScanText,
  Languages,
  ShieldCheck,
  Scale,
  Tags,
  LayoutTemplate,
  FileText,
  BrainCircuit,
  ReceiptText,
  EyeOff,
  Gavel,
  BookOpenCheck,
};

export function getAgentIcon(name: string): LucideIcon {
  return iconMap[name] ?? Bot;
}
