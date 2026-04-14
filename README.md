# Trading Dashboard

A growing trading cockpit that runs as a static web app on GitHub Pages.

- **Tab 1 — Dashboard**: configurable widget grid *(placeholder in Sprint 0)*
- **Tab 2 — Indices**: real-time quotes of major world indices
- **Tab 3 — Top 50**: real-time quotes of the 50 largest listed companies
- **Global search**: find any symbol (stock, ETF, index, crypto)
- **Charts**: click any row to open an interactive TradingView-style chart

> See [`PLAN.md`](./PLAN.md) for the sprint roadmap and [`MEMORY.md`](./MEMORY.md)
> for architecture decisions and project context.

## Tech stack

- React 18 + Vite + TypeScript
- TailwindCSS
- TanStack Query + Zustand
- React Router (HashRouter for GitHub Pages)
- TradingView `lightweight-charts`
- Market data: [Finnhub](https://finnhub.io/) (free tier)

## Local development

```bash
# 1. Clone
git clone https://github.com/aschwarzdynpro/savings.git
cd savings

# 2. Environment
cp .env.example .env.local
# edit .env.local:
#   VITE_FINNHUB_API_KEY=<required — live quotes & search>
#   VITE_TWELVE_DATA_API_KEY=<optional — historical candles & sparklines>
# get free keys at https://finnhub.io/register and
# https://twelvedata.com/pricing

# 3. Install & run
npm install
npm run dev        # http://localhost:5173

# 4. Production build (optional)
npm run build
npm run preview
```

## Running in GitHub Codespaces (iPad-friendly)

The repo ships a `.devcontainer/devcontainer.json` that pre-installs Node
20, runs `npm install`, forwards port 5173 and configures the editor —
ideal for developing directly from Safari on an iPad.

1. On github.com → green **Code** button → tab **Codespaces** →
   **Create codespace on this branch**.
2. Open a terminal and either create `.env.local` with your Finnhub key
   *or* set `VITE_FINNHUB_API_KEY` as a **Codespace secret** in
   **Settings → Codespaces → Repository secrets** (Vite reads it
   automatically).
3. `npm run dev` — Codespaces prompts you to open the forwarded Vite
   URL in the browser.

## Deployment (GitHub Pages)

Deployment is automated via GitHub Actions
(`.github/workflows/deploy.yml`).

1. In the repository, open **Settings → Pages** and set the source to
   **GitHub Actions**.
2. Add a repository secret **VITE_FINNHUB_API_KEY**
   (**Settings → Secrets and variables → Actions → New repository secret**).
3. Push to `main` *or* run the workflow manually from the **Actions** tab.
4. The app will be live at `https://aschwarzdynpro.github.io/savings/`.

> The Vite `base` is set to `/Savings/` in `vite.config.ts`. If you rename
> or fork the repo, update that value.

## Project structure

```
src/
├─ components/       # shared UI (layout, search, …)
├─ data/             # static seed data (indices, top50)
├─ features/         # feature-first modules
│  ├─ dashboard/
│  ├─ indices/
│  ├─ top50/
│  └─ chart/
├─ services/
│  └─ market-data/   # provider abstraction + Finnhub adapter
├─ store/            # Zustand stores
├─ App.tsx
├─ main.tsx
└─ index.css
```

## Status

**Sprint 0 — Foundation** is complete: scaffolding, three navigable tabs,
global search input, chart modal skeleton, mock data, and the GH-Pages
deploy workflow. Live data lands in Sprint 1. See [`PLAN.md`](./PLAN.md).

## License

Personal project. No license granted yet.
