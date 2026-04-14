import { TOP_50 } from '@/data/top50';
import { QuoteTable } from '@/components/quote/QuoteTable';

export function Top50Page() {
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

      <QuoteTable rows={TOP_50} showMarketCap />
    </section>
  );
}
