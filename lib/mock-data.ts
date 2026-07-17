// ============================================================================
// SmartCOMM GenAI Platform — Mock Data Layer
// Deterministic mock data used across the app (no external services).
// ============================================================================

export type HealthStatus = "healthy" | "degraded" | "down";
export type AgentCategory =
  | "OCR"
  | "Translation"
  | "Validation"
  | "Compliance"
  | "Classification"
  | "Template Generation"
  | "Summarization"
  | "Knowledge Agents";

export interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: AgentCategory;
  capabilities: string[];
  health: HealthStatus;
  version: string;
  owner: string;
  ownerTeam: string;
  model: string;
  icon: string;
  rating: number;
  installs: number;
  latencyMs: number;
  successRate: number;
  costPerCall: number;
  reviewsTriggered: number;
  availability: number;
  tokensPerCall: number;
  featured?: boolean;
  tags: string[];
  updatedAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  status: "running" | "draft" | "paused" | "failed";
  nodes: number;
  runsToday: number;
  successRate: number;
  avgRuntime: string;
  owner: string;
  updatedAt: string;
  cost: number;
}

export type RiskLevel = "high" | "medium" | "low";
export interface ReviewTask {
  id: string;
  agent: string;
  agentId: string;
  documentType: string;
  risk: RiskLevel;
  confidentialityScore: number;
  confidenceScore: number;
  reasons: string[];
  submittedAt: string;
  submittedBy: string;
  status: "pending" | "approved" | "rejected";
  originalOutput: string;
  suggestedOutput: string;
  slaHours: number;
}

export interface ActivityItem {
  id: string;
  type: "deployment" | "onboarding" | "execution" | "review" | "alert";
  title: string;
  description: string;
  user: string;
  time: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  time: string;
  category: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  resourceType: string;
  ip: string;
  status: "success" | "denied" | "warning";
  time: string;
}

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------
export const agents: Agent[] = [
  {
    id: "agt-ocr-01",
    name: "DocuVision OCR",
    slug: "docuvision-ocr",
    description: "High-accuracy OCR for structured and unstructured documents with layout awareness.",
    longDescription:
      "DocuVision OCR extracts text, tables, and key-value pairs from PDFs, scans, and images with 99.2% character accuracy. It preserves reading order, detects layout regions, and outputs structured JSON ready for downstream agents.",
    category: "OCR",
    capabilities: ["Layout detection", "Table extraction", "Handwriting", "150+ languages", "PDF/Image"],
    health: "healthy",
    version: "4.2.1",
    owner: "Priya Nair",
    ownerTeam: "Document Intelligence",
    model: "claude-opus-4-8",
    icon: "ScanText",
    rating: 4.9,
    installs: 3421,
    latencyMs: 820,
    successRate: 99.2,
    costPerCall: 0.014,
    reviewsTriggered: 42,
    availability: 99.98,
    tokensPerCall: 3200,
    featured: true,
    tags: ["Popular", "Enterprise"],
    updatedAt: "2026-07-12",
  },
  {
    id: "agt-trn-01",
    name: "PolyglotTranslate",
    slug: "polyglot-translate",
    description: "Context-aware neural translation across 120 languages with tone preservation.",
    longDescription:
      "PolyglotTranslate delivers domain-tuned translation preserving tone, formatting, and terminology. Supports glossaries, do-not-translate lists, and back-translation validation for regulated content.",
    category: "Translation",
    capabilities: ["120 languages", "Glossary", "Tone control", "Batch mode", "Back-translation"],
    health: "healthy",
    version: "3.8.0",
    owner: "Marco Rossi",
    ownerTeam: "Localization",
    model: "claude-sonnet-5",
    icon: "Languages",
    rating: 4.7,
    installs: 2870,
    latencyMs: 640,
    successRate: 98.4,
    costPerCall: 0.009,
    reviewsTriggered: 18,
    availability: 99.95,
    tokensPerCall: 1800,
    featured: true,
    tags: ["Popular"],
    updatedAt: "2026-07-10",
  },
  {
    id: "agt-val-01",
    name: "SchemaGuard Validator",
    slug: "schemaguard-validator",
    description: "Validates extracted data against business rules, schemas, and reference data.",
    longDescription:
      "SchemaGuard runs deterministic and LLM-assisted validation, checking field formats, cross-field consistency, and reference lookups. Emits confidence scores and remediation hints.",
    category: "Validation",
    capabilities: ["JSON Schema", "Cross-field rules", "Reference lookup", "Confidence scoring"],
    health: "degraded",
    version: "2.5.3",
    owner: "Aisha Khan",
    ownerTeam: "Data Quality",
    model: "claude-haiku-4-5",
    icon: "ShieldCheck",
    rating: 4.5,
    installs: 1980,
    latencyMs: 310,
    successRate: 97.1,
    costPerCall: 0.004,
    reviewsTriggered: 61,
    availability: 99.4,
    tokensPerCall: 900,
    tags: ["Reliable"],
    updatedAt: "2026-07-09",
  },
  {
    id: "agt-cmp-01",
    name: "RegSense Compliance",
    slug: "regsense-compliance",
    description: "Scans content for regulatory, PII, and policy violations with jurisdiction awareness.",
    longDescription:
      "RegSense detects PII/PHI, checks against GDPR, HIPAA, SOC2, and internal policy packs, and produces an auditable compliance report with severity and citations.",
    category: "Compliance",
    capabilities: ["PII/PHI detection", "GDPR", "HIPAA", "Policy packs", "Redaction"],
    health: "healthy",
    version: "5.1.0",
    owner: "David Chen",
    ownerTeam: "Risk & Compliance",
    model: "claude-opus-4-8",
    icon: "Scale",
    rating: 4.8,
    installs: 2540,
    latencyMs: 1100,
    successRate: 99.6,
    costPerCall: 0.021,
    reviewsTriggered: 88,
    availability: 99.99,
    tokensPerCall: 4200,
    featured: true,
    tags: ["Enterprise", "Regulated"],
    updatedAt: "2026-07-14",
  },
  {
    id: "agt-cls-01",
    name: "IntentClassify",
    slug: "intent-classify",
    description: "Multi-label document and message classification with taxonomy management.",
    longDescription:
      "IntentClassify assigns documents and messages to custom taxonomies with calibrated confidence, supporting hierarchical labels and few-shot customization.",
    category: "Classification",
    capabilities: ["Multi-label", "Hierarchical", "Few-shot", "Taxonomy editor"],
    health: "healthy",
    version: "3.0.4",
    owner: "Lena Weber",
    ownerTeam: "ML Platform",
    model: "claude-haiku-4-5",
    icon: "Tags",
    rating: 4.4,
    installs: 1610,
    latencyMs: 280,
    successRate: 96.8,
    costPerCall: 0.003,
    reviewsTriggered: 24,
    availability: 99.9,
    tokensPerCall: 700,
    tags: ["Fast"],
    updatedAt: "2026-07-08",
  },
  {
    id: "agt-tpl-01",
    name: "TemplateForge",
    slug: "template-forge",
    description: "Generates branded, compliant communication templates from structured intent.",
    longDescription:
      "TemplateForge composes emails, letters, and statements from data and brand guidelines, enforcing tone, layout, and mandatory disclosures.",
    category: "Template Generation",
    capabilities: ["Brand kit", "Multi-channel", "Merge fields", "Disclosure rules"],
    health: "healthy",
    version: "2.2.0",
    owner: "Sofia Alvarez",
    ownerTeam: "Customer Comms",
    model: "claude-sonnet-5",
    icon: "LayoutTemplate",
    rating: 4.6,
    installs: 1330,
    latencyMs: 900,
    successRate: 98.0,
    costPerCall: 0.012,
    reviewsTriggered: 15,
    availability: 99.8,
    tokensPerCall: 2600,
    tags: ["Creative"],
    updatedAt: "2026-07-11",
  },
  {
    id: "agt-sum-01",
    name: "BriefGen Summarizer",
    slug: "briefgen-summarizer",
    description: "Abstractive and extractive summarization with citation-backed highlights.",
    longDescription:
      "BriefGen produces executive summaries, bullet digests, and citation-linked highlights across long documents and transcripts, with configurable length and reading level.",
    category: "Summarization",
    capabilities: ["Abstractive", "Extractive", "Citations", "Length control"],
    health: "healthy",
    version: "4.0.1",
    owner: "Tom Becker",
    ownerTeam: "Knowledge Systems",
    model: "claude-sonnet-5",
    icon: "FileText",
    rating: 4.7,
    installs: 2190,
    latencyMs: 720,
    successRate: 98.6,
    costPerCall: 0.01,
    reviewsTriggered: 12,
    availability: 99.92,
    tokensPerCall: 2100,
    tags: ["Popular"],
    updatedAt: "2026-07-13",
  },
  {
    id: "agt-knw-01",
    name: "InsightRAG Knowledge",
    slug: "insightrag-knowledge",
    description: "Retrieval-augmented Q&A over enterprise knowledge bases with source grounding.",
    longDescription:
      "InsightRAG answers questions grounded in your document stores with inline citations, hybrid search, and freshness controls. Includes hallucination guardrails.",
    category: "Knowledge Agents",
    capabilities: ["Hybrid search", "Citations", "Guardrails", "Freshness", "Multi-source"],
    health: "healthy",
    version: "1.9.2",
    owner: "Nina Patel",
    ownerTeam: "Knowledge Systems",
    model: "claude-opus-4-8",
    icon: "BrainCircuit",
    rating: 4.8,
    installs: 2760,
    latencyMs: 980,
    successRate: 98.9,
    costPerCall: 0.018,
    reviewsTriggered: 33,
    availability: 99.96,
    tokensPerCall: 3800,
    featured: true,
    tags: ["Enterprise", "RAG"],
    updatedAt: "2026-07-15",
  },
  {
    id: "agt-ocr-02",
    name: "InvoiceExtract Pro",
    slug: "invoice-extract-pro",
    description: "Specialized invoice and receipt extraction with line-item normalization.",
    longDescription:
      "Purpose-built for AP automation: extracts vendors, totals, tax, and line items, normalizing to your chart of accounts.",
    category: "OCR",
    capabilities: ["Line items", "Tax detection", "COA mapping", "Multi-currency"],
    health: "healthy",
    version: "2.7.0",
    owner: "Priya Nair",
    ownerTeam: "Document Intelligence",
    model: "claude-haiku-4-5",
    icon: "ReceiptText",
    rating: 4.6,
    installs: 1470,
    latencyMs: 540,
    successRate: 98.1,
    costPerCall: 0.008,
    reviewsTriggered: 29,
    availability: 99.9,
    tokensPerCall: 1600,
    tags: ["Finance"],
    updatedAt: "2026-07-07",
  },
  {
    id: "agt-cmp-02",
    name: "PII Redactor",
    slug: "pii-redactor",
    description: "Real-time PII/PHI redaction for text, documents, and transcripts.",
    longDescription:
      "Detects and redacts sensitive entities with reversible tokenization and audit logging for regulated workflows.",
    category: "Compliance",
    capabilities: ["Reversible tokens", "40+ entity types", "Audit log", "Streaming"],
    health: "down",
    version: "1.4.6",
    owner: "David Chen",
    ownerTeam: "Risk & Compliance",
    model: "claude-haiku-4-5",
    icon: "EyeOff",
    rating: 4.3,
    installs: 990,
    latencyMs: 200,
    successRate: 95.4,
    costPerCall: 0.005,
    reviewsTriggered: 47,
    availability: 97.2,
    tokensPerCall: 800,
    tags: ["Security"],
    updatedAt: "2026-07-06",
  },
  {
    id: "agt-trn-02",
    name: "LegalTranslate",
    slug: "legal-translate",
    description: "Certified-grade legal translation with terminology consistency guarantees.",
    longDescription:
      "Tuned for contracts and legal filings, with translation memory, clause alignment, and reviewer workflows.",
    category: "Translation",
    capabilities: ["Translation memory", "Clause alignment", "Certified output"],
    health: "healthy",
    version: "2.1.0",
    owner: "Marco Rossi",
    ownerTeam: "Localization",
    model: "claude-opus-4-8",
    icon: "Gavel",
    rating: 4.5,
    installs: 720,
    latencyMs: 1200,
    successRate: 97.7,
    costPerCall: 0.024,
    reviewsTriggered: 21,
    availability: 99.7,
    tokensPerCall: 4600,
    tags: ["Legal"],
    updatedAt: "2026-07-05",
  },
  {
    id: "agt-knw-02",
    name: "PolicyNavigator",
    slug: "policy-navigator",
    description: "Conversational assistant grounded in HR and corporate policy documents.",
    longDescription:
      "Answers employee policy questions with citations, escalation paths, and multilingual support.",
    category: "Knowledge Agents",
    capabilities: ["Citations", "Escalation", "Multilingual", "Access control"],
    health: "degraded",
    version: "1.2.3",
    owner: "Nina Patel",
    ownerTeam: "Knowledge Systems",
    model: "claude-sonnet-5",
    icon: "BookOpenCheck",
    rating: 4.2,
    installs: 640,
    latencyMs: 860,
    successRate: 96.2,
    costPerCall: 0.011,
    reviewsTriggered: 9,
    availability: 99.1,
    tokensPerCall: 2400,
    tags: ["HR"],
    updatedAt: "2026-07-04",
  },
];

export const agentCategories: { name: AgentCategory; icon: string }[] = [
  { name: "OCR", icon: "ScanText" },
  { name: "Translation", icon: "Languages" },
  { name: "Validation", icon: "ShieldCheck" },
  { name: "Compliance", icon: "Scale" },
  { name: "Classification", icon: "Tags" },
  { name: "Template Generation", icon: "LayoutTemplate" },
  { name: "Summarization", icon: "FileText" },
  { name: "Knowledge Agents", icon: "BrainCircuit" },
];

// ---------------------------------------------------------------------------
// Workflows
// ---------------------------------------------------------------------------
export const workflows: Workflow[] = [
  { id: "wf-01", name: "Invoice Intake & Validation", status: "running", nodes: 7, runsToday: 1240, successRate: 98.7, avgRuntime: "12.4s", owner: "AP Automation", updatedAt: "2026-07-16", cost: 342 },
  { id: "wf-02", name: "Multilingual Claims Processing", status: "running", nodes: 9, runsToday: 860, successRate: 97.2, avgRuntime: "18.1s", owner: "Claims Ops", updatedAt: "2026-07-15", cost: 511 },
  { id: "wf-03", name: "Contract Compliance Review", status: "running", nodes: 6, runsToday: 320, successRate: 99.1, avgRuntime: "24.6s", owner: "Legal", updatedAt: "2026-07-15", cost: 288 },
  { id: "wf-04", name: "Customer Statement Generation", status: "paused", nodes: 5, runsToday: 0, successRate: 98.0, avgRuntime: "9.8s", owner: "Customer Comms", updatedAt: "2026-07-12", cost: 0 },
  { id: "wf-05", name: "KYC Document Verification", status: "running", nodes: 8, runsToday: 540, successRate: 96.4, avgRuntime: "15.2s", owner: "Onboarding", updatedAt: "2026-07-14", cost: 219 },
  { id: "wf-06", name: "Knowledge Base Refresh", status: "draft", nodes: 4, runsToday: 0, successRate: 0, avgRuntime: "—", owner: "Knowledge Systems", updatedAt: "2026-07-11", cost: 0 },
  { id: "wf-07", name: "Support Ticket Triage", status: "failed", nodes: 6, runsToday: 74, successRate: 82.1, avgRuntime: "6.4s", owner: "Support", updatedAt: "2026-07-16", cost: 41 },
];

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
export const reviewTasks: ReviewTask[] = [
  {
    id: "REV-4821",
    agent: "RegSense Compliance",
    agentId: "agt-cmp-01",
    documentType: "Insurance Policy",
    risk: "high",
    confidentialityScore: 92,
    confidenceScore: 61,
    reasons: ["Possible PHI exposure", "Low model confidence", "Regulated jurisdiction (EU)"],
    submittedAt: "2026-07-16T08:20:00Z",
    submittedBy: "wf-02 · Multilingual Claims",
    status: "pending",
    originalOutput:
      "Claimant John D. (DOB 1984-03-11, SSN ***-**-4821) is eligible for reimbursement of $4,210 under policy EU-PH-99231. Diagnosis code Z79.4 noted.",
    suggestedOutput:
      "Claimant [REDACTED] is eligible for reimbursement of $4,210 under policy EU-PH-99231. Clinical details withheld pending review.",
    slaHours: 4,
  },
  {
    id: "REV-4822",
    agent: "DocuVision OCR",
    agentId: "agt-ocr-01",
    documentType: "Loan Application",
    risk: "high",
    confidentialityScore: 88,
    confidenceScore: 58,
    reasons: ["Handwritten fields", "Ambiguous income figures", "High-value transaction"],
    submittedAt: "2026-07-16T07:55:00Z",
    submittedBy: "wf-05 · KYC Verification",
    status: "pending",
    originalOutput:
      "Applicant declared annual income of $1,250,000 with employer 'Nexa Holdings'. Requested loan amount: $480,000.",
    suggestedOutput:
      "Applicant declared annual income of $125,000 (OCR corrected from handwriting) with employer 'Nexa Holdings'. Requested loan amount: $480,000.",
    slaHours: 2,
  },
  {
    id: "REV-4823",
    agent: "LegalTranslate",
    agentId: "agt-trn-02",
    documentType: "Contract Clause",
    risk: "medium",
    confidentialityScore: 64,
    confidenceScore: 74,
    reasons: ["Ambiguous legal term", "Terminology mismatch with memory"],
    submittedAt: "2026-07-16T06:40:00Z",
    submittedBy: "wf-03 · Contract Compliance",
    status: "pending",
    originalOutput:
      "The party of the first part shall indemnify and hold harmless the second party from any 'reasonable' liabilities.",
    suggestedOutput:
      "The party of the first part shall indemnify and hold harmless the second party from any liabilities deemed reasonable under applicable law.",
    slaHours: 8,
  },
  {
    id: "REV-4824",
    agent: "SchemaGuard Validator",
    agentId: "agt-val-01",
    documentType: "Invoice",
    risk: "medium",
    confidentialityScore: 41,
    confidenceScore: 69,
    reasons: ["Tax total mismatch", "Currency ambiguity"],
    submittedAt: "2026-07-16T05:10:00Z",
    submittedBy: "wf-01 · Invoice Intake",
    status: "pending",
    originalOutput: "Subtotal: 1,000.00 · Tax: 200.00 · Total: 1,180.00 (EUR)",
    suggestedOutput: "Subtotal: 1,000.00 · Tax: 180.00 · Total: 1,180.00 (EUR) — tax rate corrected to 18%",
    slaHours: 6,
  },
  {
    id: "REV-4810",
    agent: "TemplateForge",
    agentId: "agt-tpl-01",
    documentType: "Customer Letter",
    risk: "low",
    confidentialityScore: 22,
    confidenceScore: 91,
    reasons: ["Tone check passed", "Manual spot-check"],
    submittedAt: "2026-07-15T14:00:00Z",
    submittedBy: "wf-04 · Statements",
    status: "approved",
    originalOutput: "Dear valued customer, your statement is ready...",
    suggestedOutput: "Dear valued customer, your statement is ready...",
    slaHours: 24,
  },
  {
    id: "REV-4809",
    agent: "PII Redactor",
    agentId: "agt-cmp-02",
    documentType: "Support Transcript",
    risk: "high",
    confidentialityScore: 95,
    confidenceScore: 55,
    reasons: ["Credit card number detected", "Redaction incomplete"],
    submittedAt: "2026-07-15T11:30:00Z",
    submittedBy: "wf-07 · Ticket Triage",
    status: "rejected",
    originalOutput: "Customer card 4111 1111 1111 1111 exp 08/29 was charged.",
    suggestedOutput: "Customer card [REDACTED] was charged.",
    slaHours: 2,
  },
];

// ---------------------------------------------------------------------------
// Activity feed
// ---------------------------------------------------------------------------
export const activityFeed: ActivityItem[] = [
  { id: "a1", type: "deployment", title: "InsightRAG Knowledge v1.9.2 deployed", description: "Rolled out to production gateway", user: "Nina Patel", time: "2026-07-16T09:05:00Z" },
  { id: "a2", type: "onboarding", title: "New agent onboarded: InvoiceExtract Pro", description: "Approved by governance board", user: "Priya Nair", time: "2026-07-16T08:30:00Z" },
  { id: "a3", type: "execution", title: "Workflow 'Invoice Intake' completed 1,240 runs", description: "98.7% success rate today", user: "System", time: "2026-07-16T08:10:00Z" },
  { id: "a4", type: "review", title: "3 high-risk reviews queued", description: "SLA breach risk on REV-4822", user: "System", time: "2026-07-16T07:58:00Z" },
  { id: "a5", type: "alert", title: "PII Redactor health degraded to DOWN", description: "Gateway circuit breaker tripped", user: "System", time: "2026-07-16T07:20:00Z" },
  { id: "a6", type: "deployment", title: "RegSense Compliance policy pack updated", description: "Added EU AI Act ruleset", user: "David Chen", time: "2026-07-15T18:45:00Z" },
  { id: "a7", type: "execution", title: "Contract Compliance Review scaled up", description: "Auto-scaled to 6 replicas", user: "System", time: "2026-07-15T16:12:00Z" },
];

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const notifications: Notification[] = [
  { id: "n1", title: "High-risk review awaiting you", body: "REV-4822 breaches SLA in 42 minutes.", type: "warning", read: false, time: "2026-07-16T09:10:00Z", category: "Reviews" },
  { id: "n2", title: "Agent down: PII Redactor", body: "Circuit breaker tripped on gateway node us-east-2.", type: "error", read: false, time: "2026-07-16T07:20:00Z", category: "Health" },
  { id: "n3", title: "Deployment successful", body: "InsightRAG Knowledge v1.9.2 is live.", type: "success", read: false, time: "2026-07-16T09:05:00Z", category: "Deployments" },
  { id: "n4", title: "Monthly budget at 78%", body: "Projected to exceed by $2,100 at current rate.", type: "warning", read: true, time: "2026-07-16T06:00:00Z", category: "Cost" },
  { id: "n5", title: "New agent submitted for approval", body: "InvoiceExtract Pro v2.7.0 pending governance review.", type: "info", read: true, time: "2026-07-15T22:15:00Z", category: "Registry" },
  { id: "n6", title: "Optimization available", body: "Switch summarization to Haiku to save ~$430/mo.", type: "info", read: true, time: "2026-07-15T12:00:00Z", category: "Cost" },
];

// ---------------------------------------------------------------------------
// Audit trail
// ---------------------------------------------------------------------------
export const auditEntries: AuditEntry[] = [
  { id: "au1", actor: "david.chen@smartcomm.ai", action: "Updated policy pack", resource: "RegSense Compliance", resourceType: "Agent", ip: "10.4.22.11", status: "success", time: "2026-07-16T08:44:00Z" },
  { id: "au2", actor: "system", action: "Circuit breaker tripped", resource: "PII Redactor", resourceType: "Gateway", ip: "10.4.9.2", status: "warning", time: "2026-07-16T07:20:00Z" },
  { id: "au3", actor: "priya.nair@smartcomm.ai", action: "Published agent version", resource: "InvoiceExtract Pro v2.7.0", resourceType: "Registry", ip: "10.4.18.7", status: "success", time: "2026-07-16T06:12:00Z" },
  { id: "au4", actor: "guest.user@partner.io", action: "Attempted admin access", resource: "Cost Governance", resourceType: "RBAC", ip: "203.0.113.9", status: "denied", time: "2026-07-16T05:50:00Z" },
  { id: "au5", actor: "nina.patel@smartcomm.ai", action: "Deployed workflow", resource: "Knowledge Base Refresh", resourceType: "Workflow", ip: "10.4.30.4", status: "success", time: "2026-07-15T18:02:00Z" },
  { id: "au6", actor: "aisha.khan@smartcomm.ai", action: "Rotated API key", resource: "SchemaGuard Validator", resourceType: "Secret", ip: "10.4.11.9", status: "success", time: "2026-07-15T14:20:00Z" },
  { id: "au7", actor: "marco.rossi@smartcomm.ai", action: "Exported audit log", resource: "Q3 Compliance", resourceType: "Report", ip: "10.4.7.3", status: "success", time: "2026-07-15T10:05:00Z" },
];

// ---------------------------------------------------------------------------
// Time series (charts)
// ---------------------------------------------------------------------------
export const usageTrend = [
  { day: "Mon", requests: 42000, agents: 18 },
  { day: "Tue", requests: 48500, agents: 19 },
  { day: "Wed", requests: 51200, agents: 21 },
  { day: "Thu", requests: 47800, agents: 20 },
  { day: "Fri", requests: 58900, agents: 23 },
  { day: "Sat", requests: 31200, agents: 22 },
  { day: "Sun", requests: 28400, agents: 24 },
];

export const costTrend = [
  { month: "Feb", cost: 18200, budget: 22000 },
  { month: "Mar", cost: 19800, budget: 22000 },
  { month: "Apr", cost: 21100, budget: 24000 },
  { month: "May", cost: 20400, budget: 24000 },
  { month: "Jun", cost: 23600, budget: 26000 },
  { month: "Jul", cost: 20300, budget: 26000 },
];

export const reviewTrend = [
  { day: "Mon", high: 12, medium: 22, low: 40 },
  { day: "Tue", high: 9, medium: 18, low: 44 },
  { day: "Wed", high: 15, medium: 25, low: 38 },
  { day: "Thu", high: 11, medium: 20, low: 42 },
  { day: "Fri", high: 18, medium: 28, low: 50 },
  { day: "Sat", high: 6, medium: 12, low: 20 },
  { day: "Sun", high: 4, medium: 9, low: 16 },
];

export const agentCostDistribution = [
  { name: "RegSense Compliance", value: 5340 },
  { name: "InsightRAG Knowledge", value: 4120 },
  { name: "DocuVision OCR", value: 3480 },
  { name: "LegalTranslate", value: 2260 },
  { name: "PolyglotTranslate", value: 1980 },
  { name: "Others", value: 3120 },
];

export const modelSpend = [
  { name: "claude-opus-4-8", value: 9800 },
  { name: "claude-sonnet-5", value: 6400 },
  { name: "claude-haiku-4-5", value: 2100 },
  { name: "embeddings", value: 1400 },
];

export const latencyTrend = [
  { t: "00:00", p50: 420, p95: 980, p99: 1600 },
  { t: "04:00", p50: 380, p95: 900, p99: 1500 },
  { t: "08:00", p50: 520, p95: 1200, p99: 2100 },
  { t: "12:00", p50: 610, p95: 1400, p99: 2400 },
  { t: "16:00", p50: 560, p95: 1300, p99: 2200 },
  { t: "20:00", p50: 460, p95: 1050, p99: 1800 },
];

export const throughputTrend = [
  { t: "00:00", success: 3200, error: 40 },
  { t: "04:00", success: 2800, error: 22 },
  { t: "08:00", success: 5400, error: 90 },
  { t: "12:00", success: 6100, error: 140 },
  { t: "16:00", success: 5600, error: 70 },
  { t: "20:00", success: 4200, error: 38 },
];

export const tokenConsumption = [
  { day: "Mon", input: 4.2, output: 1.8 },
  { day: "Tue", input: 4.8, output: 2.1 },
  { day: "Wed", input: 5.1, output: 2.4 },
  { day: "Thu", input: 4.6, output: 2.0 },
  { day: "Fri", input: 6.2, output: 2.9 },
  { day: "Sat", input: 3.1, output: 1.4 },
  { day: "Sun", input: 2.8, output: 1.2 },
];

export const traces = [
  { id: "trc-9f2a", workflow: "Invoice Intake & Validation", status: "success", duration: 12400, spans: 7, cost: 0.043, time: "2026-07-16T09:12:00Z" },
  { id: "trc-8b1c", workflow: "Multilingual Claims Processing", status: "success", duration: 18100, spans: 9, cost: 0.061, time: "2026-07-16T09:10:00Z" },
  { id: "trc-7d3e", workflow: "KYC Document Verification", status: "error", duration: 8600, spans: 5, cost: 0.028, time: "2026-07-16T09:08:00Z" },
  { id: "trc-6a4f", workflow: "Contract Compliance Review", status: "success", duration: 24600, spans: 6, cost: 0.088, time: "2026-07-16T09:04:00Z" },
  { id: "trc-5c5a", workflow: "Support Ticket Triage", status: "error", duration: 6400, spans: 6, cost: 0.019, time: "2026-07-16T09:01:00Z" },
  { id: "trc-4e6b", workflow: "Invoice Intake & Validation", status: "success", duration: 11800, spans: 7, cost: 0.041, time: "2026-07-16T08:58:00Z" },
];

export const optimizationRecs = [
  { id: "opt1", title: "Downgrade summarization to Haiku", detail: "BriefGen runs 92% simple summaries — Haiku meets quality bar.", savings: 430, effort: "Low", impact: "High" },
  { id: "opt2", title: "Enable prompt caching on RegSense", detail: "Policy packs are static; cache system prompt for 90% of calls.", savings: 780, effort: "Medium", impact: "High" },
  { id: "opt3", title: "Batch invoice OCR overnight", detail: "Shift 40% of AP volume to off-peak batch pricing.", savings: 320, effort: "Low", impact: "Medium" },
  { id: "opt4", title: "Deduplicate KYC lookups", detail: "18% of KYC calls repeat within 24h — add result cache.", savings: 210, effort: "Medium", impact: "Medium" },
];

export const registryItems = agents.map((a) => ({
  id: a.id,
  name: a.name,
  version: a.version,
  category: a.category,
  owner: a.ownerTeam,
  model: a.model,
  status: a.health === "down" ? "deprecated" : a.health === "degraded" ? "staging" : "published",
  visibility: a.featured ? "public" : "internal",
  updatedAt: a.updatedAt,
}));

export const platformStats = {
  totalAgents: agents.length,
  activeWorkflows: workflows.filter((w) => w.status === "running").length,
  requestsToday: 58900,
  pendingReviews: reviewTasks.filter((r) => r.status === "pending").length,
  gatewayCost: 20300,
  successRate: 98.4,
  availability: 99.99,
  runningAgents: agents.filter((a) => a.health === "healthy").length,
};

export const services: { name: string; status: HealthStatus; latency: string; detail: string }[] = [
  { name: "AI Gateway", status: "healthy", latency: "48ms", detail: "6 nodes · us-east, eu-west" },
  { name: "Agent Registry", status: "healthy", latency: "22ms", detail: "12 agents published" },
  { name: "MCP Services", status: "healthy", latency: "31ms", detail: "8 tool servers" },
  { name: "Review Queue", status: "degraded", latency: "112ms", detail: "SLA pressure on high-risk" },
  { name: "Vector Store", status: "healthy", latency: "18ms", detail: "4.2M embeddings" },
  { name: "Orchestrator", status: "healthy", latency: "27ms", detail: "5 workflows running" },
];
