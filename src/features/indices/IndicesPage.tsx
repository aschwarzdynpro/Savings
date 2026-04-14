import { INDICES } from '@/data/indices';
import { QuoteTable } from '@/components/quote/QuoteTable';

export function IndicesPage() {
  return (
    <section className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Major Indices</h1>
          <p className="text-sm text-slate-400">
            Real-time overview of the world&apos;s major equity indices.
          </p>
        </div>
        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">
          mock data · live in Sprint 1
        </span>
      </header>

      <QuoteTable rows={INDICES} />
    </section>
  );
}
