import clsx from 'clsx';
import type { Quote } from '@/services/market-data';

interface Props {
  symbol: string;
  name?: string;
  quote?: Quote;
  isLoading: boolean;
  isError: boolean;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function QuoteHeader({ symbol, name, quote, isLoading, isError }: Props) {
  const up = (quote?.changePct ?? 0) >= 0;

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="font-mono text-xs uppercase tracking-wide text-slate-500">
            {symbol}
          </div>
          <div className="text-2xl font-semibold text-white">{name ?? symbol}</div>
        </div>

        <div className="text-right">
          {isLoading && <div className="text-sm text-slate-500">Loading quote…</div>}
          {isError && !quote && (
            <div className="text-sm text-slate-500">Quote unavailable</div>
          )}
          {quote && (
            <>
              <div className="font-mono text-3xl font-semibold text-white">
                {fmt(quote.price)}
              </div>
              <div
                className={clsx(
                  'font-mono text-sm',
                  up ? 'text-up' : 'text-down',
                )}
              >
                {up ? '+' : ''}
                {fmt(quote.change)} ({up ? '+' : ''}
                {quote.changePct.toFixed(2)}%)
              </div>
            </>
          )}
        </div>
      </div>

      {quote && (
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
          <Stat label="Open" value={fmt(quote.open)} />
          <Stat label="Prev Close" value={fmt(quote.previousClose)} />
          <Stat label="Day High" value={fmt(quote.high)} />
          <Stat label="Day Low" value={fmt(quote.low)} />
        </dl>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="font-mono text-slate-100">{value}</dd>
    </div>
  );
}
