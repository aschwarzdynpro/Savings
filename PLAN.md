# Trading Dashboard — Sprint Plan

This document is the execution roadmap for the Trading Dashboard web app.
Sprints are intentionally small and shippable. Each sprint ends with a working
GitHub Pages deploy.

Legend: `[ ]` todo  ·  `[~]` in progress  ·  `[x]` done

---

## Sprint 0 — Foundation

**Goal**: A deployable static SPA skeleton with three empty tabs, a global
search input, a routed chart modal, and CI/CD to GitHub Pages.

- [x] Decide stack: React 18 + Vite + TypeScript + Tailwind
- [x] Decide market data provider: Finnhub (abstracted behind interface)
- [x] Decide charting library: TradingView `lightweight-charts`
- [x] Decide state: Zustand + TanStack Query
- [x] Decide router: `HashRouter` (GH-Pages friendly)
- [x] Write `PLAN.md`, `MEMORY.md`, `README.md`
- [x] Scaffold Vite + React + TS project
- [x] Configure Tailwind + PostCSS
- [x] Configure `vite.config.ts` with correct `base` for GH-Pages
- [x] App shell: header with logo + global search, tab nav, content outlet
- [x] Route: `/dashboard` — placeholder "configurable dashboard"
- [x] Route: `/indices` — static list of major indices (mock quotes)
- [x] Route: `/top50` — static table of top 50 mega-caps (mock quotes)
- [x] Chart modal skeleton using `lightweight-charts` + demo data
- [x] `MarketDataProvider` interface + Finnhub stub adapter
- [x] GitHub Actions workflow for GH-Pages deploy
- [x] `.env.example` with `VITE_FINNHUB_API_KEY`
- [x] First commit & push to feature branch

**Definition of Done**: `npm run dev` shows the app with three navigable
tabs and a chart modal openable from any row. Mock data only.

---

## Sprint 1 — Live Indices (Tab 2) ✅

**Goal**: Tab 2 shows real-time quotes for the major world indices, and
clicking a row opens a candlestick chart.

- [x] Implement `FinnhubProvider.getQuote(symbol)` with real HTTP
- [x] Implement `FinnhubProvider.getCandles(symbol, resolution, from, to)`
      (free tier blocks `/stock/candle` → graceful fallback to demo series)
- [x] React Query hooks: `useQuote`, `useQuotes(symbols[])`, `useCandles`
- [x] Polling interval: 10s, paused when the window is in the background
- [x] Replace mock data on Indices page with live hook
- [x] Price change color coding (green / red / neutral)
- [x] Chart modal uses `useCandles` (daily resolution) with fallback
- [x] Loading skeletons + error states
- [x] Handle Finnhub `429` / `401` / `403` explicitly via typed errors
- [x] Research index coverage — Finnhub free tier doesn't serve raw index
      symbols, so indices are fetched via US-listed ETF proxies
      (`SPY`, `DIA`, `QQQ`, `EWG`, …). See `MEMORY.md` §4 for the mapping.
- [x] `ApiKeyBanner` prompts the user when `VITE_FINNHUB_API_KEY` is unset.

**DoD**: Indices tab updates every 10s with real values; chart modal shows
live quote header + daily chart (real when available, demo fallback when
the endpoint is premium-gated).

---

## Sprint 2 — Live Top 50 (Tab 3) ✅

**Goal**: Tab 3 shows real-time quotes for the top 50 mega-caps with
sort/filter and sparklines.

- [x] Shared `QuoteRow` contract (already extracted in Sprint 1)
- [x] Sortable columns: symbol, name, price, %chg, market cap
- [x] Client-side filter input (symbol + name, case-insensitive)
- [x] Mini sparkline per row (7d) via `useSparkline` → Twelve Data
- [x] Batch quote fetching through parallel React Query queries
- [x] Provider-level throttling (sliding-window limiter,
      Finnhub 55/60s, Twelve Data 7/60s)
- [x] Rate-limit budget documented in `MEMORY.md` §4
- [x] Market cap source: curated static list in `src/data/top50.ts`
      (Finnhub `/stock/profile2` deferred to a future sprint)
- [x] Secondary provider **Twelve Data** added for historical candles
      (bypasses Finnhub's premium-only `/stock/candle`). Optional —
      without a Twelve Data key sparklines are hidden and the chart
      modal falls back to demo data.
- [x] `CompositeProvider` routes quotes/search to Finnhub and candles
      to Twelve Data.

**DoD**: Top 50 tab shows live quotes, sortable columns, filter and
sparklines; Indices tab gained the same sparkline + filter + sort UX;
both stay within the free-tier rate-limit budget.

---

## Sprint 3 — Global Search + Detail View ✅

**Goal**: Search any symbol, open a proper detail view (not just a modal).

- [x] `FinnhubProvider.searchSymbols(query)` (already wired in Sprint 1)
- [x] `GlobalSearch` with debounce (300 ms) + dropdown results
- [x] Keyboard nav in dropdown (↑ / ↓ / Enter / Esc, outside-click close)
- [x] New route `/symbol/:symbol` with a full-page detail view
- [x] Timeframe switcher: 1D / 5D / 1M / 6M / 1Y / 5Y / All
- [x] Quote header: price, change, open, prev close, day high, day low
      *(52-week range + volume deferred — see §8 in MEMORY.md)*
- [x] Favorites stored in localStorage via `zustand/persist`
      (star icon in the detail header)
- [x] Recently viewed list stored in localStorage (LRU, max 20)
- [x] Row clicks on all quote tables now navigate to the detail view
      (chart modal removed entirely — files purged)

**DoD**: Any supported symbol can be searched and opened; detail view has
a working timeframe switcher, favorite toggle, and writes to recently
viewed on mount.

---

## Sprint 4 — Configurable Dashboard (Tab 1)

**Goal**: Tab 1 becomes a real drag-and-drop widget dashboard.

- [ ] Add `react-grid-layout` (or equivalent)
- [ ] Widget registry pattern: `QuoteWidget`, `MiniChartWidget`,
  `WatchlistWidget`, `MarketMoversWidget`
- [ ] "Add widget" modal
- [ ] Per-widget config (symbol, timeframe, …)
- [ ] Layout persistence in localStorage (per device)
- [ ] Export/Import layout as JSON
- [ ] Dark/Light theme toggle

**DoD**: User can build a custom dashboard with ≥3 widget types, and the
layout survives page reload.

---

## Sprint 5+ — Expansion Backlog

Unordered pool of future sprints. To be pulled into a numbered sprint when
prioritized.

- [ ] Watchlists (named groups, reorder, drag from search)
- [ ] Price alerts (browser notifications)
- [ ] News feed (Finnhub `/news` or additional provider)
- [ ] Sentiment & earnings calendar
- [ ] Portfolio tracking (manual trades, P&L, cost basis)
- [ ] Technical indicators: SMA, EMA, RSI, MACD, Bollinger
- [ ] Drawing tools on charts (trendlines, fib)
- [ ] Backtesting module (simple strategy runner)
- [ ] Crypto coverage via a second provider adapter
- [ ] FX / commodities coverage
- [ ] WebSocket live-tick upgrade (replace polling)
- [ ] i18n (EN + DE)
- [ ] PWA install + offline shell
- [ ] Optional backend (serverless) for API-key proxying & caching

---

## Working Agreements

- Keep each sprint **deployable**. Never leave `main` broken.
- New features land behind a feature flag (env or simple const) when
  unstable.
- Each sprint must update `MEMORY.md` with new decisions & provider quirks.
- Never commit real API keys; use `.env.local` + GitHub Actions secrets.
