# SmartCOMM GenAI Platform — Complete End-to-End Guide

> A plain-English explanation of the **entire** application: what it is, what each
> screen is for, how to use it, and how it works under the hood. No prior
> knowledge assumed — read top to bottom.

---

## Table of Contents

1. [The Big Picture — What Is This?](#1-the-big-picture--what-is-this)
2. [Key Terms (in plain English)](#2-key-terms-in-plain-english)
3. [The Technology (and why we chose it)](#3-the-technology-and-why-we-chose-it)
4. [How to Run It](#4-how-to-run-it)
5. [How the App Is Organized (Architecture)](#5-how-the-app-is-organized-architecture)
6. [How Data Flows](#6-how-data-flows)
7. [The App Shell (things on every screen)](#7-the-app-shell-things-on-every-screen)
8. [The 15 Pages — Explained One by One](#8-the-15-pages--explained-one-by-one)
9. [Design System & Theming](#9-design-system--theming)
10. [How It All Fits Together (a real journey)](#10-how-it-all-fits-together-a-real-journey)
11. [Turning Mock Data into a Real Product](#11-turning-mock-data-into-a-real-product)
12. [Quick Reference](#12-quick-reference)

---

## 1. The Big Picture — What Is This?

The **SmartCOMM GenAI Platform** is a **control center for a company's AI**.

Large companies now use many **AI agents** — small, specialized AI workers. One
reads scanned documents, one translates languages, one checks legal compliance,
one summarizes reports, and so on. Once you have dozens of these agents running
thousands of times a day, you need one place to **manage, connect, watch, and
govern** them all.

That "one place" is this platform. In everyday language, it lets a team:

- **Discover & deploy AI agents** — like an app store for AI.
- **Connect agents into pipelines** — e.g. "read invoice → translate → validate →
  export" — without writing code.
- **Keep humans in control** — risky AI outputs get sent to a person for approval
  before they go live.
- **Watch performance** — speed, errors, uptime, live traces.
- **Control money** — see spending, forecast budgets, get savings tips.
- **Stay compliant** — full audit logs of who did what, and when.

Think of it as **"mission control for enterprise AI."** It's inspired by tools
like Microsoft Copilot Studio, Azure AI Foundry, Vercel, Linear, and Datadog.

> **This project is the frontend** — the screens, buttons, charts, and
> interactions. Right now it runs on realistic **sample data**, so you can click
> through the whole product. It's built so real live data can be connected later
> without redesigning anything.

---

## 2. Key Terms (in plain English)

| Term | What it means here |
|------|--------------------|
| **Agent** | A single AI worker that does one job (OCR, translation, compliance…). |
| **Workflow** | Several agents wired together into an automated pipeline. |
| **Gateway** | The traffic controller that routes every AI request. |
| **Registry** | The versioned catalog of all agents (like an app store backend). |
| **Human Review** | A step where a person approves/edits/rejects an AI output. |
| **Governance** | The rules & guardrails: cost limits, compliance, approvals. |
| **Trace** | A detailed timeline of one workflow run (for debugging). |
| **Copilot** | The built-in AI assistant that helps you use the platform. |
| **Mock data** | Realistic fake data used so the UI works without a live backend. |

---

## 3. The Technology (and why we chose it)

| Technology | What it does | Why |
|------------|--------------|-----|
| **React 19** | Builds the interactive UI from components | Industry standard for app UIs |
| **Next.js 15 (App Router)** | The framework: routing, pages, builds | Fast, structured, production-ready |
| **TypeScript** | JavaScript with type safety | Catches bugs before they ship |
| **Tailwind CSS** | Styling via utility classes | Fast, consistent styling |
| **shadcn-style UI** | Reusable building blocks (buttons, cards…) | Accessible, polished, consistent |
| **Framer Motion** | Animations | Smooth, premium feel |
| **Recharts** | Charts and graphs | Clean, responsive data viz |
| **Lucide** | Icons | Crisp, consistent icon set |
| **React Query** | Manages data fetching/caching | Ready for real APIs |
| **Zustand** | Small global state store | Simple app-wide state (login, UI) |
| **next-themes** | Dark/Light mode switching | Full theme support |

**The simple idea:** Next.js gives us pages; React builds each page from small
components; Tailwind styles them; Recharts draws charts; Framer Motion animates
them; Zustand remembers things like "am I logged in?"; and mock data fills it all
with realistic content.

---

## 4. How to Run It

```bash
# 1. Install dependencies (the --legacy-peer-deps flag avoids version conflicts)
npm install --legacy-peer-deps

# 2. Start the development server
npm run dev
# Now open http://localhost:3000
```

Other commands:

```bash
npm run build      # Build the optimized production version
npm run start      # Run that production build
npm run typecheck  # Check the code for type errors
```

**Logging in:** The login is **mocked** — type anything (or use the pre-filled
email) and click **Sign In**, or click **Sign In with Microsoft**. Either way you
enter the workspace. Your logged-in state is saved in the browser, so a refresh
keeps you signed in until you click **Sign out**.

---

## 5. How the App Is Organized (Architecture)

Everything is built from small, reusable pieces. Here's the folder map:

```
SmartCOMM GenAI Platform/
├── app/                        ← THE PAGES (each folder = one URL/route)
│   ├── layout.tsx              ← Wraps every page (theme + data providers)
│   ├── page.tsx                ← Root: sends you to /login or /dashboard
│   ├── login/page.tsx          ← The login screen
│   └── (app)/                  ← All signed-in pages live in here
│       ├── layout.tsx          ← The "shell": sidebar + topbar + guard
│       ├── dashboard/page.tsx
│       ├── marketplace/page.tsx
│       ├── marketplace/[slug]/page.tsx   ← Agent detail (dynamic URL)
│       ├── workflows/page.tsx
│       ├── reviews/page.tsx
│       └── ... (all other pages)
│
├── components/                 ← THE REUSABLE BUILDING BLOCKS
│   ├── ui/                     ← Buttons, cards, inputs, dialogs, tabs…
│   ├── layout/                 ← Sidebar, topbar, command palette, copilot drawer
│   ├── shared/                 ← StatCard, PageHeader, HealthBadge
│   ├── charts/                 ← Chart styling toolkit
│   └── copilot/                ← The AI chat component
│
├── lib/                        ← THE HELPERS & DATA
│   ├── mock-data.ts            ← ALL the sample data lives here
│   ├── utils.ts                ← Formatting helpers (money, dates…)
│   ├── nav.ts                  ← The sidebar menu definition
│   └── icon-map.ts             ← Maps agent names to icons
│
└── store/                      ← APP-WIDE MEMORY (Zustand)
    ├── use-auth.ts             ← Are you logged in? Who are you?
    └── use-ui.ts               ← Sidebar open? Notifications? Copilot open?
```

**The two most important ideas:**

1. **One folder = one page = one URL.** The folder `app/(app)/cost/` becomes the
   page at `/cost`. Simple and predictable.

2. **The `(app)` group shares a "shell."** Every signed-in page automatically
   gets the sidebar, the topbar, the command palette, and a login check —
   because they're all defined once in `app/(app)/layout.tsx`. You never rebuild
   those per page.

---

## 6. How Data Flows

Right now, data flows like this:

```
lib/mock-data.ts   →   the page component   →   charts, cards, tables on screen
   (sample data)          (reads the data)          (what you see)
```

For **things the app must remember across pages** (like your login or whether the
sidebar is collapsed), we use **Zustand stores**:

- **`use-auth.ts`** — remembers if you're signed in and your profile. Saved to the
  browser so it survives refresh.
- **`use-ui.ts`** — remembers UI state: sidebar collapsed, command palette open,
  copilot open, and your notifications list (with read/unread status).

**React Query** is already set up in the background. When you later connect real
APIs, you swap "read from mock-data" for "fetch from server" — and React Query
handles loading, caching, and refreshing automatically. **The UI doesn't change.**

---

## 7. The App Shell (things on every screen)

Once you're signed in, every page shares the same frame. These pieces are always
there:

### The Sidebar (left)
- Groups the menu into sections: **Overview, Build, Govern, Observe, Account.**
- Highlights the page you're on with a sliding indicator (animated).
- Has badges — e.g. "New" on Copilot, a count on Human Review.
- **Collapsible** — click "Collapse" to shrink it to icons only (saves space, and
  it remembers your choice).
- On mobile, it becomes a slide-out drawer via the ☰ menu.

### The Topbar (top)
- **Search bar** — click it (or press `⌘K` / `Ctrl+K`) to open the **command palette**.
- **Copilot button** — opens the AI assistant in a side drawer.
- **Theme toggle** — switch Dark ↔ Light instantly.
- **Notifications bell** — shows unread count; click for a dropdown preview.
- **Your avatar** — dropdown with Profile, Settings, and Sign out.

### The Command Palette (`⌘K`)
A fast search box (like Spotlight on Mac). Type to jump to any page or find any
agent. Navigate with arrow keys, press Enter to go. This is the power-user way to
move around instantly.

### The Copilot Drawer
A slide-in AI chat available **anywhere** in the app (also has its own full page).
Ask it to build workflows, analyze cost, or explain reviews. It "types" back
realistic answers based on what you ask.

### The Auth Guard
`app/(app)/layout.tsx` checks: *"Is this person logged in?"* If not, it instantly
redirects to `/login`. This protects every signed-in page automatically.

---

## 8. The 15 Pages — Explained One by One

For each page below: **what it's for → how to use it → how it works.**

---

### 1) Login — `/login`

**What it's for:** The front door. Sign in to enter the workspace.

**How to use it:**
- Enter email + password (pre-filled for convenience), toggle "show password" with
  the eye icon, tick "Remember me."
- Click **Sign In**, or **Sign In with Microsoft**.
- Either takes you to the Dashboard.

**How it works:**
- The **left side** is a branded showcase: an **animated neural network** (SVG dots
  and lines that draw themselves and pulse), **floating particles**, and three
  live **stat cards** (24 Agents, 120 Workflows, 99.99% Availability).
- The **right side** is the login form.
- Clicking Sign In calls `login()` in the auth store, marks you as authenticated,
  and navigates to `/dashboard`. (No real password check — it's a demo.)

---

### 2) Dashboard — `/dashboard`

**What it's for:** Your executive home screen — a quick health-and-activity
snapshot of the whole platform.

**How to use it:**
- Read the **welcome hero** ("Welcome back, [name]").
- Use the **4 action cards** (Create Agent, Create Workflow, Explore Marketplace,
  Review Tasks) as shortcuts to jump into work.
- Scan the **6 KPI cards** (Total Agents, Active Workflows, Today's Requests,
  Pending Reviews, Gateway Cost, Success Rate) — each shows a trend arrow.
- Explore the **charts**, check the **Platform Health** panel, and read the
  **Recent Activity** feed.

**How it works:**
- KPIs come from `platformStats` in mock-data and render via the reusable
  **StatCard** component (which animates in and shows a colored trend badge).
- The three charts (Agent Usage, Cost Trend, Review Trend) are **Recharts** graphs
  fed by `usageTrend`, `costTrend`, `reviewTrend`.
- The Health panel maps over `services`, each showing a pulsing **HealthBadge**.
- The activity feed maps over `activityFeed`, picking an icon per event type.

---

### 3) Agent Marketplace — `/marketplace`

**What it's for:** Browse and pick AI agents — like an app store.

**How to use it:**
- See **Featured** agents at the top.
- **Search** by name or capability in the search box.
- Filter by **category** using the pills (OCR, Translation, Compliance…).
- **Sort** (Most Popular, Top Rated, Fastest, Name).
- Toggle **Grid ↔ List** view with the buttons.
- On each card: **Use Agent** to deploy, or **Details** to learn more.

**How it works:**
- All agents come from the `agents` array in mock-data.
- Search + category + sort are combined in a single `useMemo` filter that
  re-runs whenever you type or click — so results update instantly.
- Each agent's icon string (e.g. `"ScanText"`) is turned into a real icon by
  `getAgentIcon()` in `lib/icon-map.ts`.
- Cards show live health, version, capabilities, rating, and owner team.

---

### 4) Agent Details — `/marketplace/[slug]`

**What it's for:** A deep dive into one specific agent.

**How to use it:**
- Reach it by clicking **Details** on any marketplace card (the URL includes the
  agent's "slug", e.g. `/marketplace/docuvision-ocr`).
- Read the header (name, version, health, rating, owner).
- Click the **tabs**: **Overview, Metrics, Usage, Configurations, Audit Logs.**
- Use **Use Agent** or **Try in Playground**.

**How it works:**
- The `[slug]` in the folder name makes this a **dynamic route** — one page
  template serves every agent. It reads the slug from the URL and finds the
  matching agent; if none exists, it shows "not found."
- **Overview** = description, capabilities, tags, and a details sidebar.
- **Metrics** = success vs failed bar chart, latency line chart, and reliability/
  quality/efficiency progress bars.
- **Usage** = request history area chart + token consumption bar chart.
- **Configurations** = the runtime settings (model, temperature, timeouts…) with
  copy buttons.
- **Audit Logs** = recent lifecycle events for this agent.

---

### 5) Workflow Builder — `/workflows`

**What it's for:** Visually build an automated pipeline by connecting agents —
no code needed.

**How to use it:**
- **Add nodes:** click any item in the **Node Library** (left) — Document Upload,
  OCR, Translation, Compliance, Validation, Template, Human Review, Export.
- **Move nodes:** drag them around the canvas.
- **Connect:** new nodes auto-connect to the previous one; connections are drawn
  as flowing arrows.
- **Configure:** click a node → the **Properties** panel (right) lets you set its
  **Cost Profile** (Economy/Standard/Premium), **Retry Count**, and **Timeout**.
- **Delete:** trash icon in Properties.
- **Watch the stats:** the **Workflow Statistics** panel live-updates Estimated
  Cost, Estimated Runtime, and a Complexity Score as you build.

**How it works:**
- Nodes and connections ("edges") are stored in React state. Positions are `x/y`
  coordinates.
- **Dragging** uses pointer events: press a node (records where you grabbed it),
  move (updates its position, clamped inside the canvas), release (stops).
- **Connections** are drawn with an **SVG layer** using smooth bezier curves and
  arrowheads between the right edge of one node and the left edge of the next.
- **Statistics** are recalculated with `useMemo` every time nodes/edges change:
  it sums each node type's cost and runtime, and derives a complexity score.

---

### 6) Human Review Center — `/reviews`

**What it's for:** The safety net. When AI output is risky or low-confidence, a
human checks it here before it's finalized.

**How to use it:**
- Switch between **High Risk / Medium Risk / Completed** tabs.
- Each review card shows: Task ID, agent, **Confidentiality** and **Confidence**
  score bars, and the **reasons** it was flagged.
- **Quick actions on the card:** ✓ Approve or ✗ Reject.
- Click **Review** to open the **side drawer** with full detail:
  - **Original Output** (what the AI produced) in a red-tinted box.
  - **Modified Output** — an **editable** text box you can correct.
  - **Review History** — a timeline of what happened.
  - Big buttons: **Reject / Edit & Approve / Approve.**

**How it works:**
- Reviews start from `reviewTasks` mock data, held in local state so your
  decisions actually take effect.
- Approving/rejecting updates that task's status; **Framer Motion** animates it
  out of the pending list and into Completed.
- Score bars color themselves green/amber/red based on the value (and
  confidentiality is "inverted" — high confidentiality = risky = red).
- The drawer is the **Sheet** component (a slide-in panel).

---

### 7) Cost Governance — `/cost`

**What it's for:** The finance view — track and optimize AI spending (FinOps).

**How to use it:**
- Pick a **time range** and **Export** a report from the header.
- Read the KPIs: Monthly Spend, Daily Spend, Cost per Agent, Cost per 1K Requests.
- Study the charts: **Cost Trend** (spend vs budget), **Agent Cost Distribution**,
  **Model Spend Distribution** (donut with %).
- Review **Top Expensive Agents** (table with budget-share bars).
- Act on **Optimization Recommendations** — each shows the savings, effort, and
  impact, plus an **Apply** button. A banner totals your potential savings.

**How it works:**
- Values are computed from `agentCostDistribution`, `modelSpend`, `costTrend`,
  and `optimizationRecs`.
- Charts use the shared **CHART_COLORS** palette so every chart matches.
- The donut's legend calculates each model's percentage of total spend.

---

### 8) Registry Management — `/registry`

**What it's for:** The catalog & version control for all agents (like a container
or model registry). It answers "which versions exist, and where are they running?"

**How to use it:**
- See KPIs: Published, Staging, Deprecated, Total Versions.
- **Search** and **filter** by status and visibility — the table updates live.
- Each row shows name, version, category, owner, model, visibility, status, and a
  **⋯ actions menu** (View, Promote, Deprecate, Rollback, Delete).
- Check the **Version History** timeline and the **Deployment Environments** card
  (Dev / Staging / Production with health and capacity bars).

**How it works:**
- Data comes from `registryItems` (derived from the agents list).
- Search + both filters are combined in state so the table reflects your choices
  immediately.

---

### 9) Monitoring & Tracing — `/monitoring`

**What it's for:** Live observability — is everything healthy, fast, and
error-free right now? And when something breaks, trace exactly what happened.

**How to use it:**
- See the **service health strip** and a **Live** indicator.
- Read KPIs: Uptime, p95 Latency, Error Rate, Requests/min.
- Study **Latency Percentiles** (p50/p95/p99) and **Throughput vs Errors** charts.
- Browse the **Traces table**; **click a trace** to open a drawer showing a
  **waterfall** — a timeline of each step (span) in that run, with durations.
- Check **Recent Alerts.**

**How it works:**
- Charts use `latencyTrend` and `throughputTrend`.
- The traces come from `traces`; clicking one stores it in state and opens the
  **Sheet** drawer, which renders each span as a positioned colored bar (like a
  Gantt chart) to visualize where time was spent.

---

### 10) Analytics — `/analytics`

**What it's for:** The insights view — usage patterns, adoption, and performance
across the whole platform.

**How to use it:**
- Pick a time range, Export.
- Read KPIs (Total Requests, Avg Latency, Success Rate, Active Users, Token Usage).
- Explore charts: **Request Volume, Token Consumption, Agent Usage Leaderboard,
  Category Distribution, Latency Percentiles, Throughput.**
- Read the **Top Performing Agents** table and the short **insight callouts**.

**How it works:**
- Pulls from `usageTrend`, `tokenConsumption`, `latencyTrend`, `throughputTrend`,
  and computes category counts by grouping the `agents` list.

---

### 11) Settings — `/settings`

**What it's for:** Configure your workspace.

**How to use it:** Click through the tabs:
- **General** — workspace name/URL, region, default model, timezone.
- **AI & Gateway** — toggles for prompt caching, auto-scaling, streaming, PII
  redaction, safety filters, fallback routing; plus token & rate limits.
- **Notifications** — choose channels (Email/Slack/In-app/SMS) and which events
  notify you.
- **Security** — 2FA, SSO/SAML, session timeout, IP allowlist, and **API keys**
  (with a Revoke button).
- **Billing** — current plan, usage bar, payment method.

**How it works:**
- Every toggle, dropdown, and field is **interactive** (wired to React state), so
  the page behaves like a real settings screen. In a live app, "Save" would send
  these to the backend.

---

### 12) User Profile — `/profile`

**What it's for:** Your personal account overview and contribution record.

**How to use it:** View your banner, avatar, role, and team; scan your stats
(Agents Owned, Workflows Created, Reviews Completed, Contribution Score); read
your activity timeline, About info, skills, owned agents, and achievements.

**How it works:** Reads your identity from the auth store and mixes in mock
activity/agent data plus a personal contribution chart.

---

### 13) Notifications — `/notifications`

**What it's for:** Your inbox for platform alerts.

**How to use it:**
- Filter with tabs: **All / Unread / Alerts / by category.**
- Unread items are highlighted with a colored left border and a dot.
- **Mark read** individually, or **Mark all read** in the header.

**How it works:**
- Notifications live in the **UI store** (`use-ui.ts`) so the **same list** powers
  both this page and the topbar bell — mark something read here and the bell's
  count updates everywhere instantly.

---

### 14) Audit Trail — `/audit`

**What it's for:** The compliance record — a tamper-evident log of every important
action (who did what, from where, and whether it was allowed).

**How to use it:**
- See KPIs (Total Events, Successful, Denied, Warnings).
- **Search** and **filter** by status and resource type.
- **Click a row** to expand it and see extra detail (request id, session, before/
  after, user agent).
- Export to CSV/PDF; note the "Immutable · Signed" badge.

**How it works:**
- Data is `auditEntries`. Filters and the expand/collapse are driven by React
  state, with a smooth expand animation.

---

### 15) AI Copilot — `/copilot`

**What it's for:** Your AI partner for using the platform — ask it to build things,
analyze data, or explain what's happening.

**How to use it:**
- Type a question, or click a **suggestion chip**.
- Ask things like "Build a workflow to process multilingual invoices," "Which
  agents trigger the most reviews?", or "Recommend cost optimizations."
- The side panel lists its **capabilities** and example prompts.
- You can also open Copilot as a **drawer** from anywhere (sidebar/topbar button).

**How it works:**
- The chat is the reusable **CopilotChat** component (used by both the full page
  and the drawer).
- It shows a realistic **typing indicator**, then returns a smart canned answer
  matched to keywords in your question. In a live app, this is where a real AI
  model would respond.

---

## 9. Design System & Theming

- **One consistent look** — every button, card, badge, and chart is built from the
  same set of components in `components/ui/`, so the whole app feels unified.
- **Colors are variables, not hardcoded.** We define a palette (indigo → purple →
  azure gradients) as CSS variables. Because of this, **Dark and Light mode both
  work everywhere** — flipping the theme just swaps variable values; no screen
  needs special handling.
- **Motion** — subtle Framer Motion animations (cards fading in, the sidebar
  indicator sliding, reviews animating out) give it a premium feel without being
  distracting.
- **Responsive** — layouts adapt from phone to widescreen. The sidebar collapses
  into a mobile menu; grids reflow from 1 column to many.

---

## 10. How It All Fits Together (a real journey)

Here's a realistic end-to-end story that touches most of the platform:

1. **Sign in** at `/login`.
2. Land on the **Dashboard** — you notice "4 Pending Reviews" and rising cost.
3. Open **Marketplace**, search "invoice," open **InvoiceExtract Pro** details,
   review its metrics, and click **Use Agent**.
4. Go to the **Workflow Builder**. Add Document Upload → OCR → Translation →
   Compliance → Human Review → Export. Set the Compliance node to "Premium." Watch
   the **cost and runtime estimates** update. Save.
5. The workflow runs. A risky output appears in the **Human Review Center**. You
   open it, read the flagged reasons, **edit** the corrected output, and
   **Approve** it.
6. Check **Monitoring** — you click a **trace** to see the run's waterfall and
   confirm which step was slow.
7. Visit **Cost Governance** — you see spend is up, so you **Apply** a
   recommendation to cache a compliance prompt, saving ~$780/mo.
8. **Audit Trail** records every one of those actions with your name and time.
9. The **bell** shows new notifications; you **mark all read.**
10. Throughout, you can press **⌘K** to jump anywhere, or ask **Copilot** for help.

That's the entire platform working as one connected product.

---

## 11. Turning Mock Data into a Real Product

The app is intentionally built so going live is straightforward:

1. **Data** — today every page reads from `lib/mock-data.ts`. Replace those reads
   with **React Query** hooks that call your real APIs. Loading and caching are
   already handled.
2. **Auth** — swap the mock `login()` in `store/use-auth.ts` for real
   authentication (e.g. Microsoft SSO — the button is already there).
3. **Copilot** — connect `components/copilot/copilot-chat.tsx` to a real AI model
   endpoint instead of the canned replies.
4. **Actions** — wire the buttons (Approve, Apply, Save, Publish) to real
   backend calls.

Because the UI, layout, and styling never depended on the data source, **none of
the visual code has to change.**

---

## 12. Quick Reference

**Keyboard shortcut:** `⌘K` / `Ctrl+K` → command palette (jump anywhere).

**Routes:**

| URL | Page |
|-----|------|
| `/login` | Login |
| `/dashboard` | Landing Dashboard |
| `/marketplace` | Agent Marketplace |
| `/marketplace/[slug]` | Agent Details |
| `/workflows` | Workflow Builder |
| `/reviews` | Human Review Center |
| `/cost` | Cost Governance |
| `/registry` | Registry Management |
| `/monitoring` | Monitoring & Tracing |
| `/analytics` | Analytics |
| `/settings` | Settings |
| `/profile` | User Profile |
| `/notifications` | Notifications |
| `/audit` | Audit Trail |
| `/copilot` | AI Copilot |

**Where to change things:**

| I want to… | Edit this |
|------------|-----------|
| Change the sample data | `lib/mock-data.ts` |
| Add/rename a sidebar link | `lib/nav.ts` |
| Adjust colors/theme | `app/globals.css` + `tailwind.config.ts` |
| Change a reusable button/card | `components/ui/` |
| Change the login logic | `store/use-auth.ts` |
| Change what a page shows | `app/(app)/<page>/page.tsx` |

---

*Built as a production-grade frontend: React 19 · Next.js 15 · TypeScript ·
Tailwind · shadcn-style UI · Framer Motion · Recharts · React Query · Zustand.
Full dark/light mode, responsive, enterprise-grade architecture.*
