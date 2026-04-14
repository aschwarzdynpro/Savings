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

## Sprint 1 — Live Indices (Tab 2)

**Goal**: Tab 2 shows real-time quotes for the major world indices, and
clicking a row opens a real candlestick chart.

- [ ] Implement `FinnhubProvider.getQuote(symbol)` with real HTTP
- [ ] Implement `FinnhubProvider.getCandles(symbol, resolution, from, to)`
- [ ] React Query hooks: `useQuote`, `useQuotes(symbols[])`, `useCandles`
- [ ] Polling interval: 10s while tab visible, pause on hidden
- [ ] Replace mock data on Indices page with live hook
- [ ] Price change color coding (green / red / neutral)
- [ ] Chart modal uses `useCandles` with daily resolution
- [ ] Loading skeletons + error states
- [ ] Handle Finnhub rate-limit errors gracefully (exponential backoff)
- [ ] Research index coverage in Finnhub free tier; document fallbacks
  (some indices need ETF proxies, e.g. `^GSPC` → `SPY`)

**DoD**: Indices tab updates every 10s with real values; chart loads real
history; no console errors when API key is set.

---

## Sprint 2 — Live Top 50 (Tab 3)

**Goal**: Tab 3 shows real-time quotes for the top 50 mega-caps with
sort/filter and sparklines.

- [ ] Extract shared `QuoteRow` component (Indices + Top 50)
- [ ] Sortable columns: symbol, name, price, %chg, market cap, volume
- [ ] Client-side filter input
- [ ] Mini sparkline per row (7d) via `useCandles`
- [ ] Batch quote fetching with React Query parallel queries + throttle
- [ ] Document rate-limit budget per tab
- [ ] Add market cap source (may need a second API or curated static)

**DoD**: Top 50 tab shows live data with sparklines and sort/filter; page
remains responsive under continuous polling.

---

## Sprint 3 — Global Search + Detail View

**Goal**: Search any symbol, open a proper detail view (not just modal).

- [ ] Implement `FinnhubProvider.searchSymbols(query)`
- [ ] `GlobalSearch` with debounce (300ms) + dropdown results
- [ ] Keyboard nav in dropdown (arrow keys + enter)
- [ ] New route `/symbol/:symbol` with full detail view
- [ ] Timeframe switcher: 1D / 5D / 1M / 6M / 1Y / 5Y / All
- [ ] Quote header: price, change, day range, 52w range, volume
- [ ] Favorites (localStorage) — star icon in detail view
- [ ] Recently viewed list (localStorage)

**DoD**: Any supported symbol can be searched and opened; detail view has
working timeframe switcher and favorite toggle.

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
