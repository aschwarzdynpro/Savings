import { useMemo } from 'react';
import { TOP_50 } from '@/data/top50';
import { QuoteTable, type QuoteRow } from '@/components/quote/QuoteTable';
import { SLOW_POLL_MS, useQuotes } from '@/hooks/useMarketData';
import { ApiKeyBanner } from '@/components/system/ApiKeyBanner';

export function Top50Page() {
  const symbols = useMemo(() => TOP_50.map((t) => t.symbol), []);
  const results = useQuotes(symbols, { pollInterval: SLOW_POLL_MS });

  const rows: QuoteRow[] = TOP_50.map((t, i) => {
    const r = results[i];
    return {
      symbol: t.symbol,
      name: t.name,
      price: r.data?.price,
      change: r.data?.change,
      changePct: r.data?.changePct,
      marketCap: t.marketCap,
      loading: r.isLoading,
      error: !!r.error,
    };
  });

  const anyLoaded = results.some((r) => r.isSuccess);
  const allErrored = results.length > 0 && results.every((r) => r.isError);

  return (
    <section className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Top 50 by Market Cap</h1>
          <p className="text-sm text-slate-400">
            The 50 largest publicly listed companies in the world. Click any
            row for a full chart.
          </p>
        </div>
        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">
          live · Finnhub · polls every 60s
        </span>
      </header>

      <ApiKeyBanner />

      {allErrored && !anyLoaded && (
        <div className="card flex items-center gap-3 border-down/40 bg-down/5 p-4 text-sm text-slate-200">
          <span className="font-medium text-down">All quote requests failed.</span>
          <span className="text-slate-400">
            Check your Finnhub API key and rate-limit budget.
          </span>
        </div>
      )}

      <QuoteTable
        rows={rows}
        showMarketCap
        showFilter
        showSparkline
        defaultSort={{ key: 'marketCap', dir: 'desc' }}
      />
    </section>
  );
}
