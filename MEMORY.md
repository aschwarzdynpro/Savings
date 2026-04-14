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

The app uses a `CompositeProvider` (`src/services/market-data/composite.ts`)
that routes calls to the best-fit adapter:

| Call             | Adapter            | Notes                               |
| ---------------- | ------------------ | ----------------------------------- |
| `getQuote`       | Finnhub            | fast, 60 req/min free tier          |
| `searchSymbols`  | Finnhub            | wired in Sprint 3                   |
| `getCandles`     | Twelve Data*       | *if `VITE_TWELVE_DATA_API_KEY` set  |
|                  | Finnhub (fallback) | free tier throws 403 → UI demo-data |

Every adapter holds its own `SlidingWindowLimiter`
(`src/services/market-data/throttle.ts`). The limiter smooths bursts so
React Query poll cycles never exceed the provider's free-tier budget.

### Rate-limit budget (per tab, worst case)

| Tab     | Symbols | Poll   | req/min | Notes                          |
| ------- | ------- | ------ | ------- | ------------------------------ |
| Indices | 16      | 15 s   | 64      | Throttler caps at 55/min       |
| Top 50  | 50      | 60 s   | 50      | Comfortably under 55/min cap   |

Only the active tab polls (React Query un-subscribes on unmount), so the
two tabs never run simultaneously. When the browser tab is hidden,
`refetchIntervalInBackground: false` pauses polling altogether.

Sparklines use a separate Twelve Data budget (7 req/min limiter, 60 min
`staleTime`, no polling). A fresh Top 50 load issues 50 sparkline
requests which the throttler trickles in over ~7 min; subsequent mounts
are served from React Query cache for an hour.

### Finnhub

- Docs: https://finnhub.io/docs/api
- Auth: API key as `?token=…` query param
- Free tier: 60 calls/min
- Env var: `VITE_FINNHUB_API_KEY` (exposed to client at build time)
- Adapter: `src/services/market-data/finnhub.ts`
- Typed errors (throw from the adapter, caught by hooks/UI):
  `RateLimitError`, `AuthError`, `NoDataError`
- **Endpoint coverage (verified Sprint 1)**:
  - `GET /quote?symbol=…`          ✅ US stocks + ETFs
  - `GET /search?q=…`              ✅ (wired in Sprint 3)
  - `GET /stock/candle?…`          ❌ **premium only** — returns `403`.
    UI falls back to a deterministic demo series with a visible
    "fallback" status label. Revisit in Sprint 2 via a second provider
    (Twelve Data or Polygon) if real historical candles are required.
- **Index symbols (Sprint 1 decision)**: Finnhub free tier does not serve
  raw index symbols like `^GSPC` / `^GDAXI` — `/quote` returns all zeros.
  We fetch indices via US-listed **ETF proxies** instead. The proxy →
  index mapping lives in `src/data/indices.ts` (field `proxyFor`):

  | Display                | Fetched (ETF) | Tracks       |
  | ---------------------- | ------------- | ------------ |
  | S&P 500                | `SPY`         | `^GSPC`      |
  | Dow Jones Industrial   | `DIA`         | `^DJI`       |
  | NASDAQ 100             | `QQQ`         | `^NDX`       |
  | Russell 2000           | `IWM`         | `^RUT`       |
  | VIX Short-Term (VXX)   | `VXX`         | `^VIX`       |
  | Germany (DAX proxy)    | `EWG`         | `^GDAXI`     |
  | UK (FTSE proxy)        | `EWU`         | `^FTSE`      |
  | France (CAC proxy)     | `EWQ`         | `^FCHI`      |
  | Euro Stoxx 50          | `FEZ`         | `^STOXX50E`  |
  | Japan (Nikkei proxy)   | `EWJ`         | `^N225`      |
  | Hong Kong (HSI proxy)  | `EWH`         | `^HSI`       |
  | China (CSI300 proxy)   | `MCHI`        | `000300.SS`  |
  | Australia (ASX proxy)  | `EWA`         | `^AXJO`      |
  | India (Nifty proxy)    | `INDA`        | `^NSEI`      |
  | Brazil (Bovespa proxy) | `EWZ`         | `^BVSP`      |
  | Canada (TSX proxy)     | `EWC`         | `^GSPTSE`    |

  The ETF price deviates slightly from the underlying index level but
  tracks it 1:1 in percent. For traders the change % is what matters.
- **Rate-limit strategy**: `429` → typed error, React Query `retry: 1`.
  No exponential backoff yet (good enough at 10 s polling). Upgrade when
  Top 50 goes live in Sprint 2.
- **Polling**: `refetchIntervalInBackground: false` — React Query pauses
  polling when the browser tab is hidden. See §4 rate-limit budget for
  the per-tab numbers.

### Twelve Data

- Docs: https://twelvedata.com/docs
- Auth: `?apikey=…` query param
- Free tier: 800 credits/day, 8 credits/minute
- Env var: `VITE_TWELVE_DATA_API_KEY` (optional — app degrades gracefully
  without it)
- Adapter: `src/services/market-data/twelvedata.ts`
- Endpoint used: `GET /time_series?symbol=…&interval=1day&start_date=…&end_date=…`
- **Why it exists**: Finnhub's free tier blocks `/stock/candle`; Twelve
  Data's `/time_series` covers the same use case for free.
- Used for: chart-modal candles, Top 50 / Indices sprint 7-day sparklines.
- Throttled at 7 req/min to stay under the 8/min free-tier cap.

### Routes

| Path               | Component        | Notes                              |
| ------------------ | ---------------- | ---------------------------------- |
| `/dashboard`       | `DashboardPage`  | placeholder until Sprint 4         |
| `/indices`         | `IndicesPage`    | live 16 ETF proxies                |
| `/top50`           | `Top50Page`      | live 50 mega-caps                  |
| `/symbol/:symbol`  | `DetailPage`     | full chart + quote header          |

`DetailPage` accepts an optional `state: { name }` via router navigation
so list/search entry points can render a friendly name before the live
quote resolves.

### Persisted client state

- **Favorites** — `store/favorites-store.ts`, localStorage key
  `trading-dashboard:favorites`, zustand `persist` middleware.
- **Recently viewed** — `store/recently-viewed-store.ts`, localStorage
  key `trading-dashboard:recently-viewed`, LRU capped at 20 entries.
  `DetailPage` calls `touch()` on mount.

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

- **Sprint 0 — Foundation**: ✅ done
- **Sprint 1 — Live Indices**: ✅ done
- **Sprint 2 — Live Top 50**: ✅ done
- **Sprint 3 — Global Search + Detail**: ✅ done
- **Sprint 4 — Configurable Dashboard**: ⏭ next
- **Sprint 5+ — Expansion Backlog**: see `PLAN.md`

## 8. Known issues / TODOs

- **Twelve Data is optional**. Without the key, sparklines are hidden
  and the detail chart falls back to deterministic demo candles.
- **Market cap** for Top 50 is still a curated static list. Swap for
  Finnhub `/stock/profile2` (or another source) when needed.
- **Quote header** does not show 52-week range or volume yet —
  neither field is in Finnhub `/quote`. Sprint 4+ candidate: pull
  `/stock/metric?metric=all` (free for US stocks) for 52w high/low,
  and use the last candle's volume as the volume fallback.
- **Volume column** is not yet shown in `QuoteTable`. Data is already
  in the `Quote` shape (optional); add a column when useful.
- **Sparkline first load is slow** for Top 50: the Twelve Data limiter
  trickles 50 requests through at 7/min (~7 minutes). The `useSparkline`
  cache (60 min stale) keeps repeat loads instant. Batch-mode (up to 8
  symbols per `/time_series` call) is a possible optimization.
- **No tests yet.** Vitest + React Testing Library starting Sprint 4+.
- **No global error boundary** — React Query handles per-query errors
  inline; good enough until portfolio/alerts ship.

## 9. Glossary (for future context)

- **Index proxy**: an ETF that tracks an index, used when the raw index
  symbol is unavailable (e.g. `SPY` for S&P 500).
- **Mega-cap**: market capitalization > $200 B.
- **Candle / OHLC**: Open-High-Low-Close bar at a given resolution.
- **Resolution**: time frame of one candle (`1`, `5`, `15`, `30`, `60`,
  `D`, `W`, `M` in Finnhub).
