# SmartCOMM GenAI Platform

An enterprise-grade frontend for AI Operations, an Agent Marketplace, Workflow
Orchestration, and Human Review — built with a premium, AI-first design language
inspired by Copilot Studio, Azure AI Foundry, Vercel, Linear, and Datadog.

## Tech Stack

- **React 19** + **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS** + **shadcn-style** UI primitives (Radix)
- **Framer Motion** (animation)
- **Recharts** (data viz)
- **Lucide** (icons)
- **React Query** + **Zustand** (data & state)
- **next-themes** — full **Dark / Light** mode
- Fully **responsive**

## Getting Started

```bash
npm install --legacy-peer-deps
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run typecheck`.

> Sign-in is mocked — click **Sign In** (or **Sign In with Microsoft**) on the
> login page to enter the workspace. Auth state persists via Zustand.

## Pages (15)

| Route | Page |
|-------|------|
| `/login` | Enterprise login — animated neural network, particles, stat cards |
| `/dashboard` | Executive landing dashboard — hero, KPIs, charts, health, activity |
| `/marketplace` | Agent Marketplace — grid/list, search, category filters |
| `/marketplace/[slug]` | Agent Details — overview, metrics, usage, config, audit tabs |
| `/workflows` | Workflow Builder — drag-and-drop canvas, node library, properties |
| `/reviews` | Human Review Center — risk queues, score bars, review drawer |
| `/cost` | Cost Governance — spend charts, top agents, optimizations |
| `/registry` | Registry Management — versioned catalog, filters, environments |
| `/monitoring` | Monitoring & Tracing — health, latency, trace waterfall |
| `/analytics` | Analytics — usage, tokens, leaderboards, distributions |
| `/settings` | Settings — general, gateway, notifications, security, billing |
| `/profile` | User Profile — banner, stats, activity, achievements |
| `/notifications` | Notifications Center — filters, mark-read |
| `/audit` | Audit Trail — compliance log, filters, expandable rows |
| `/copilot` | AI Copilot — full chat assistant (also available as a global drawer) |

## Architecture

```
app/
  layout.tsx            Root layout + providers (theme, react-query)
  page.tsx              Auth-aware redirect
  login/                Standalone login route
  (app)/                Authenticated shell (sidebar + topbar + guard)
    layout.tsx
    <route>/page.tsx    One file per page
components/
  ui/                   Reusable primitives (button, card, dialog, sheet, …)
  layout/               Sidebar, topbar, command palette, copilot drawer
  shared/               StatCard, PageHeader, HealthBadge
  charts/               Chart theming kit (colors, axes, tooltip)
  copilot/              Copilot chat component
lib/                    utils, mock-data, nav config, icon map
store/                  Zustand stores (auth, ui/notifications)
```

## Notes

- **Global shortcuts:** `⌘K` / `Ctrl+K` opens the command palette.
- **Copilot** is reachable from the sidebar/topbar (drawer) or the `/copilot` page.
- All data is deterministic **mock data** in `lib/mock-data.ts` — swap for real
  APIs via the React Query layer without touching the UI.
- Theming is driven entirely by CSS variables, so every screen works in both
  light and dark mode.
