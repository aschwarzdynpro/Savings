import { TOP_50 } from '@/data/top50';
import { QuoteTable, type QuoteRow } from '@/components/quote/QuoteTable';

/**
 * Sprint 1: Top 50 still uses deterministic mock data (60 parallel live
 * quotes would eat the Finnhub free-tier budget in minutes). Sprint 2 will
 * batch live data with a throttled polling scheme.
 */
export function Top50Page() {
  const rows: QuoteRow[] = TOP_50.map((t) => {
    const seed = hash(t.symbol);
    const price = 50 + (seed % 500) + (seed % 97) / 100;
    const changePct = ((seed % 700) - 350) / 100;
    const change = (price * changePct) / 100;
    return {
      symbol: t.symbol,
      name: t.name,
      price,
      change,
      changePct,
      marketCap: t.marketCap,
    };
  });

  return (
    <section className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Top 50 by Market Cap</h1>
          <p className="text-sm text-slate-400">
            The 50 largest publicly listed companies in the world.
          </p>
        </div>
        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">
          mock data · live in Sprint 2
        </span>
      </header>

      <QuoteTable rows={rows} showMarketCap />
    </section>
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
