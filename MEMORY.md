# Project Memory — Trading Dashboard

> Persistent context for humans and future Claude sessions. **Update this file
> whenever an architectural decision is made, a provider is added/changed, or a
> sprint is completed.**

## 1. What this project is

A static single-page web app (deployable via GitHub Pages) that helps the user
trade: it shows real-time quotes for major indices and mega-cap equities, lets
the user search any symbol, and opens interactive charts. Over time it will
grow into a full trading cockpit (watchlists, alerts, news, portfolio,
indicators, backtesting).

Repository: `aschwarzdynpro/savings` · Dev branch: `claude/trading-dashboard-app-M2nWh`

## 2. Architecture at a glance

```
┌──────────────────────────────────────────────┐
│  React SPA (Vite + TS + Tailwind)            │
│  ├─ HashRouter (/#/dashboard, /#/indices …)  │
│  ├─ AppShell (header + tab-nav + outlet)     │
│  ├─ features/                                │
│  │   ├─ dashboard/   (Tab 1, widget grid)    │
│  │   ├─ indices/     (Tab 2, live indices)   │
│  │   ├─ top50/       (Tab 3, mega-caps)      │
│  │   ├─ search/      (global symbol search)  │
│  │   └─ chart/       (lightweight-charts)    │
│  ├─ services/market-data/                    │
│  │   ├─ types.ts            (provider IF)    │
│  │   ├─ finnhub.ts          (adapter)        │
│  │   └─ index.ts            (singleton)      │
│  ├─ store/           (Zustand)               │
│  └─ data/            (static seed lists)     │
└──────────────────────────────────────────────┘
          │ HTTPS (client-side, CORS)
          ▼
      Finnhub REST / WS API
```

- **No backend.** 100 % static hosting. API calls go directly from the
  browser to the provider using a public API key. If key-hiding becomes a
  requirement later, we introduce a small serverless proxy.
- **Provider abstraction.** All market-data access goes through the
  `MarketDataProvider` interface. Swapping Finnhub for Twelve Data or adding
  a crypto provider means writing another adapter — no feature code changes.

## 3. Decisions log

| Date       | Decision                           | Rationale / Alternatives rejected                                   |
| ---------- | ---------------------------------- | ------------------------------------------------------------------- |
| 2026-04-14 | React + Vite + TS + Tailwind       | DX, ecosystem, scales with project size. Rejected: Vanilla, Vue, Svelte. |
| 2026-04-14 | HashRouter                          | GH-Pages 404 safe, no `404.html` hack needed.                       |
| 2026-04-14 | Finnhub as first provider          | Free tier, CORS-ok, WS upgrade path, symbol search, candles. Rejected: Yahoo (CORS), Alpha Vantage (too limited), Twelve Data (kept as fallback). |
| 2026-04-14 | `lightweight-charts`                | Apache 2.0, performant, TradingView look. Rejected: Chart.js (non-financial feel), Recharts (SVG, slower for financial data). |
| 2026-04-14 | Zustand + TanStack Query            | Minimal boilerplate. Rejected: Redux Toolkit (too heavy), plain Context (no caching). |
| 2026-04-14 | Tailwind over CSS Modules          | Speed of iteration; Trading dashboards benefit from utility-first. |
| 2026-04-14 | UI language = English              | International default; trading terms are native English.           |
| 2026-04-14 | Polling before WebSockets          | Simpler for Sprint 1; WS upgrade tracked in Sprint 5+ backlog.     |

## 4. Provider details

### Finnhub

- Docs: https://finnhub.io/docs/api
- Auth: API key as `?token=…` query param (also supports header)
- Free tier: 60 calls/min. No WS on free tier for some asset classes — to
  be verified in Sprint 1.
- Env var: `VITE_FINNHUB_API_KEY` (exposed to client at build time)
- Endpoints we will use:
  - `GET /quote?symbol=…` — current price, day change, open, high, low, pc
  - `GET /search?q=…` — symbol lookup
  - `GET /stock/candle?symbol=…&resolution=…&from=…&to=…` — OHLC history
- **Known quirks to watch for**:
  - Index symbols differ across providers (`^GSPC` vs `SPX` vs ETF proxy
    `SPY`). Maintain a mapping table in `src/data/indices.ts`.
  - Some endpoints return 403 on free tier — code must degrade gracefully.
  - Rate-limit response is `429`; implement exponential backoff.

## 5. Conventions

- **TypeScript strict** on (`"strict": true` in `tsconfig.json`).
- **Folder structure**: feature-first (`src/features/<feature>/`), shared
  primitives in `src/components/ui/`.
- **Component naming**: PascalCase files, one component per file.
- **State**: local UI state → `useState`. Cross-feature → Zustand store.
  Remote data → TanStack Query (never in Zustand).
- **Imports**: absolute paths from `src/` via `@/*` TS path alias.
- **Commits**: conventional-commits style (`feat:`, `fix:`, `chore:`, …).
- **Branches**: feature branches off `main`, dev currently on
  `claude/trading-dashboard-app-M2nWh`.

## 6. Build & Deploy

### Local
```bash
cp .env.example .env.local        # add your Finnhub key
npm install
npm run dev                       # http://localhost:5173
npm run build                     # dist/
npm run preview                   # serve dist/ locally
```

### GitHub Pages
- Workflow: `.github/workflows/deploy.yml`
- Trigger: manual (`workflow_dispatch`) + push on `main`
- `VITE_FINNHUB_API_KEY` must be set as a repo secret
  (`Settings → Secrets and variables → Actions`)
- Vite `base` is set to `/Savings/` — if the repo is renamed, update both
  `vite.config.ts` and this note.
- Hash-router means GH-Pages 404s never bite us.

## 7. Sprint status

- **Sprint 0 — Foundation**: ✅ done (this session)
- **Sprint 1 — Live Indices**: ⏭ next
- **Sprint 2 — Live Top 50**: pending
- **Sprint 3 — Global Search + Detail**: pending
- **Sprint 4 — Configurable Dashboard**: pending
- **Sprint 5+ — Expansion Backlog**: see `PLAN.md`

## 8. Known issues / TODOs

- Finnhub free tier does not cover every index directly — we may need ETF
  proxies for DAX, Nikkei, etc. Verify in Sprint 1.
- Market-cap data for Top 50 is not in the Finnhub `/quote` endpoint —
  either use `/stock/profile2` or maintain a curated static list until a
  proper source is added.
- No tests yet. Consider Vitest + React Testing Library starting Sprint 2.
- No error boundary yet — add in Sprint 1 together with loading skeletons.

## 9. Glossary (for future context)

- **Index proxy**: an ETF that tracks an index, used when the raw index
  symbol is unavailable (e.g. `SPY` for S&P 500).
- **Mega-cap**: market capitalization > $200 B.
- **Candle / OHLC**: Open-High-Low-Close bar at a given resolution.
- **Resolution**: time frame of one candle (`1`, `5`, `15`, `30`, `60`,
  `D`, `W`, `M` in Finnhub).
