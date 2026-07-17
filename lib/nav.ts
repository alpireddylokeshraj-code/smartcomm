import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Store,
  Workflow,
  ClipboardCheck,
  DollarSign,
  Boxes,
  Activity,
  BarChart3,
  Settings,
  Bell,
  ScrollText,
  Sparkles,
  User,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  section: string;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "Overview" },
  { label: "AI Copilot", href: "/copilot", icon: Sparkles, section: "Overview", badge: "New" },
  { label: "Marketplace", href: "/marketplace", icon: Store, section: "Build" },
  { label: "Workflow Builder", href: "/workflows", icon: Workflow, section: "Build" },
  { label: "Registry", href: "/registry", icon: Boxes, section: "Build" },
  { label: "Human Review", href: "/reviews", icon: ClipboardCheck, section: "Govern", badge: "4" },
  { label: "Cost Governance", href: "/cost", icon: DollarSign, section: "Govern" },
  { label: "Audit Trail", href: "/audit", icon: ScrollText, section: "Govern" },
  { label: "Monitoring", href: "/monitoring", icon: Activity, section: "Observe" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, section: "Observe" },
  { label: "Notifications", href: "/notifications", icon: Bell, section: "Account" },
  { label: "Profile", href: "/profile", icon: User, section: "Account" },
  { label: "Settings", href: "/settings", icon: Settings, section: "Account" },
];

export const navSections = ["Overview", "Build", "Govern", "Observe", "Account"];
