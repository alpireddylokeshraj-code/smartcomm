"use client";

import { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  CreditCard,
  Cpu,
  KeyRound,
  Save,
  Plus,
  Trash2,
  Globe,
  Check,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/use-auth";

interface SettingRowProps {
  label: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

function SettingRow({ label, description, children, className }: SettingRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-3 border-b border-border last:border-0",
        className
      )}
    >
      <div className="space-y-0.5">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

interface ApiKey {
  id: string;
  name: string;
  masked: string;
  created: string;
}

const initialApiKeys: ApiKey[] = [
  { id: "1", name: "Production", masked: "sk-...4821", created: "Mar 12, 2026" },
  { id: "2", name: "Staging", masked: "sk-...9d07", created: "Apr 03, 2026" },
  { id: "3", name: "CI / CD Pipeline", masked: "sk-...1f6a", created: "Jun 28, 2026" },
];

export default function SettingsPage() {
  const { user } = useAuth();

  // General
  const [workspaceName, setWorkspaceName] = useState("SmartCOMM GenAI");
  const [workspaceUrl, setWorkspaceUrl] = useState("smartcomm");
  const [region, setRegion] = useState("us-east");
  const [defaultModel, setDefaultModel] = useState("claude-opus-4-8");
  const [timezone, setTimezone] = useState("utc");

  // AI & Gateway
  const [promptCaching, setPromptCaching] = useState(true);
  const [autoScaling, setAutoScaling] = useState(true);
  const [streaming, setStreaming] = useState(true);
  const [piiRedaction, setPiiRedaction] = useState(false);
  const [contentSafety, setContentSafety] = useState(true);
  const [fallbackRouting, setFallbackRouting] = useState(false);
  const [maxTokens, setMaxTokens] = useState("8192");
  const [rateLimit, setRateLimit] = useState("600");

  // Notifications - channels
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSlack, setChannelSlack] = useState(true);
  const [channelInApp, setChannelInApp] = useState(true);
  const [channelSms, setChannelSms] = useState(false);
  // Notifications - events
  const [evtReviewAssigned, setEvtReviewAssigned] = useState(true);
  const [evtAgentDown, setEvtAgentDown] = useState(true);
  const [evtBudgetThreshold, setEvtBudgetThreshold] = useState(true);
  const [evtDeployComplete, setEvtDeployComplete] = useState(false);
  const [evtWeeklyDigest, setEvtWeeklyDigest] = useState(true);

  // Security
  const [twoFactor, setTwoFactor] = useState(true);
  const [sso, setSso] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30m");
  const [ipAllowlist, setIpAllowlist] = useState(
    "10.0.0.0/8\n192.168.1.0/24"
  );
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);

  const revokeKey = (id: string) =>
    setApiKeys((keys) => keys.filter((k) => k.id !== id));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description={`Manage workspace preferences, AI gateway behavior, security, and billing for ${user?.name ?? "your team"}.`}
        actions={
          <Button variant="gradient">
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        }
      />

      <Tabs defaultValue="general" className="space-y-2">
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <TabsList className="w-max">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Cpu className="h-4 w-4" />
              AI &amp; Gateway
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>
        </div>

        {/* GENERAL ------------------------------------------------------- */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>
                Basic identity and addressing for this workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ws-name">Workspace name</Label>
                <Input
                  id="ws-name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ws-url">Workspace URL</Label>
                <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                  <span className="flex items-center gap-1.5 whitespace-nowrap border-r border-border px-3 text-sm text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    app.smartcomm.ai/
                  </span>
                  <input
                    id="ws-url"
                    value={workspaceUrl}
                    onChange={(e) => setWorkspaceUrl(e.target.value)}
                    className="flex h-10 w-full rounded-r-md bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="workspace"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional &amp; defaults</CardTitle>
              <CardDescription>
                Where your data lives and which model runs by default.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east">US East</SelectItem>
                    <SelectItem value="eu-west">EU West</SelectItem>
                    <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default model</Label>
                <Select value={defaultModel} onValueChange={setDefaultModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-opus-4-8">claude-opus-4-8</SelectItem>
                    <SelectItem value="claude-sonnet-5">claude-sonnet-5</SelectItem>
                    <SelectItem value="claude-haiku-4-5">claude-haiku-4-5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="et">Eastern (ET)</SelectItem>
                    <SelectItem value="pt">Pacific (PT)</SelectItem>
                    <SelectItem value="cet">Central Europe (CET)</SelectItem>
                    <SelectItem value="ist">India (IST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Theme</Label>
                <p className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
                  Theme follows the toggle in the top navigation bar. Both light
                  and dark modes are fully supported.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t border-border">
              <Button variant="gradient">
                <Save className="h-4 w-4" />
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* AI & GATEWAY -------------------------------------------------- */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gateway behavior</CardTitle>
              <CardDescription>
                Control how requests are routed, cached, and secured.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              <SettingRow
                label="Enable prompt caching"
                description="Reuse cached prefixes to cut latency and token cost."
              >
                <Switch checked={promptCaching} onCheckedChange={setPromptCaching} />
              </SettingRow>
              <SettingRow
                label="Auto-scaling"
                description="Automatically scale gateway capacity with demand."
              >
                <Switch checked={autoScaling} onCheckedChange={setAutoScaling} />
              </SettingRow>
              <SettingRow
                label="Streaming responses"
                description="Stream tokens to clients as they are generated."
              >
                <Switch checked={streaming} onCheckedChange={setStreaming} />
              </SettingRow>
              <SettingRow
                label="PII redaction by default"
                description="Redact detected personal data before model calls."
              >
                <Switch checked={piiRedaction} onCheckedChange={setPiiRedaction} />
              </SettingRow>
              <SettingRow
                label="Content safety filters"
                description="Apply guardrails to inbound and outbound content."
              >
                <Switch checked={contentSafety} onCheckedChange={setContentSafety} />
              </SettingRow>
              <SettingRow
                label="Fallback model routing"
                description="Route to a backup model when the primary is unavailable."
              >
                <Switch
                  checked={fallbackRouting}
                  onCheckedChange={setFallbackRouting}
                />
              </SettingRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limits</CardTitle>
              <CardDescription>
                Per-request and throughput ceilings for the gateway.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max tokens per request</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate-limit">Rate limit (req/min)</Label>
                <Input
                  id="rate-limit"
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t border-border">
              <Button variant="gradient">
                <Save className="h-4 w-4" />
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS ------------------------------------------------- */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery channels</CardTitle>
              <CardDescription>
                Choose where notifications are delivered.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              <SettingRow label="Email" description="alerts@smartcomm.ai and per-user inboxes.">
                <Switch checked={channelEmail} onCheckedChange={setChannelEmail} />
              </SettingRow>
              <SettingRow label="Slack" description="Post to your connected Slack workspace.">
                <Switch checked={channelSlack} onCheckedChange={setChannelSlack} />
              </SettingRow>
              <SettingRow label="In-app" description="Show alerts in the notification center.">
                <Switch checked={channelInApp} onCheckedChange={setChannelInApp} />
              </SettingRow>
              <SettingRow label="SMS" description="Critical alerts to on-call phone numbers.">
                <Switch checked={channelSms} onCheckedChange={setChannelSms} />
              </SettingRow>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event types</CardTitle>
              <CardDescription>
                Pick which events trigger a notification.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-x-8 sm:grid-cols-2">
              <SettingRow
                label="Review assigned"
                description="A new review is routed to you or your team."
              >
                <Switch
                  checked={evtReviewAssigned}
                  onCheckedChange={setEvtReviewAssigned}
                />
              </SettingRow>
              <SettingRow
                label="Agent down"
                description="An agent stops responding or errors out."
              >
                <Switch checked={evtAgentDown} onCheckedChange={setEvtAgentDown} />
              </SettingRow>
              <SettingRow
                label="Budget threshold"
                description="Monthly spend crosses a configured limit."
              >
                <Switch
                  checked={evtBudgetThreshold}
                  onCheckedChange={setEvtBudgetThreshold}
                />
              </SettingRow>
              <SettingRow
                label="Deployment complete"
                description="A workflow or agent finishes deploying."
              >
                <Switch
                  checked={evtDeployComplete}
                  onCheckedChange={setEvtDeployComplete}
                />
              </SettingRow>
              <SettingRow
                label="Weekly digest"
                description="A summary of activity every Monday."
                className="sm:border-b-0"
              >
                <Switch
                  checked={evtWeeklyDigest}
                  onCheckedChange={setEvtWeeklyDigest}
                />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY ------------------------------------------------------ */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Protect access to your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              <SettingRow
                label="Two-factor authentication"
                description="Require a second factor for all sign-ins."
              >
                <div className="flex items-center gap-3">
                  {twoFactor && (
                    <Badge variant="success">
                      <Check className="h-3 w-3" />
                      Enabled
                    </Badge>
                  )}
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
              </SettingRow>
              <SettingRow
                label="SSO / SAML"
                description="Federate identity through your provider."
              >
                <Switch checked={sso} onCheckedChange={setSso} />
              </SettingRow>
              <SettingRow
                label="Session timeout"
                description="Automatically sign out idle sessions."
              >
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">15 minutes</SelectItem>
                    <SelectItem value="30m">30 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="8h">8 hours</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <div className="space-y-2 py-4">
                <Label htmlFor="ip-allowlist">IP allowlist</Label>
                <Textarea
                  id="ip-allowlist"
                  value={ipAllowlist}
                  onChange={(e) => setIpAllowlist(e.target.value)}
                  rows={4}
                  className="font-mono text-xs"
                  placeholder="One CIDR range per line"
                />
                <p className="text-sm text-muted-foreground">
                  Only requests from these ranges may access the workspace. Leave
                  empty to allow all.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  API keys
                </CardTitle>
                <CardDescription>
                  Manage keys used to authenticate with the gateway.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
                Generate new key
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Name</th>
                      <th className="px-4 py-2.5 font-medium">Key</th>
                      <th className="px-4 py-2.5 font-medium">Created</th>
                      <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-muted-foreground"
                        >
                          No API keys. Generate one to get started.
                        </td>
                      </tr>
                    ) : (
                      apiKeys.map((key) => (
                        <tr
                          key={key.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-4 py-3 font-medium">{key.name}</td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-muted-foreground">
                              {key.masked}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {key.created}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => revokeKey(key.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Revoke
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BILLING ------------------------------------------------------- */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent" />
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <CardTitle>Enterprise</CardTitle>
                  <Badge variant="accent">Current plan</Badge>
                </div>
                <CardDescription>
                  Unlimited seats, priority gateway routing, and a dedicated SLA.
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">$4,800</p>
                <p className="text-sm text-muted-foreground">/ month</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Usage this month</span>
                  <span className="font-medium">
                    24.6M / 40M tokens
                  </span>
                </div>
                <Progress value={62} />
                <p className="text-xs text-muted-foreground">
                  62% of your included monthly token allowance used.
                </p>
              </div>
              <Separator />
              <SettingRow
                label="Payment method"
                description="Visa ending in 4242 · expires 09/28"
              >
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </SettingRow>
            </CardContent>
            <CardFooter className="justify-end border-t border-border">
              <Button variant="gradient">
                <CreditCard className="h-4 w-4" />
                Manage billing
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
