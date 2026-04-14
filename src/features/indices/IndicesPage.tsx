import { useMemo } from 'react';
import { INDICES } from '@/data/indices';
import { QuoteTable, type QuoteRow } from '@/components/quote/QuoteTable';
import { useQuotes } from '@/hooks/useMarketData';
import { ApiKeyBanner } from '@/components/system/ApiKeyBanner';

export function IndicesPage() {
  const symbols = useMemo(() => INDICES.map((i) => i.symbol), []);
  const results = useQuotes(symbols);

  const rows: QuoteRow[] = INDICES.map((idx, i) => {
    const r = results[i];
    return {
      symbol: idx.symbol,
      name: idx.name,
      subtitle: idx.proxyFor ? `proxy for ${idx.proxyFor}` : undefined,
      price: r.data?.price,
      change: r.data?.change,
      changePct: r.data?.changePct,
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
          <h1 className="text-xl font-semibold text-white">Major Indices</h1>
          <p className="text-sm text-slate-400">
            Real-time overview of major world indices via US-listed ETF proxies.
          </p>
        </div>
        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">
          live · Finnhub · polls every 15s
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
        showFilter
        showSparkline
        defaultSort={{ key: 'changePct', dir: 'desc' }}
      />
    </section>
  );
}
