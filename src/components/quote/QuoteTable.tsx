import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';
import { useChartModalStore } from '@/store/chart-modal-store';

/**
 * Pure-presentational row contract used by every tab. Pages are responsible
 * for building this from either live hooks (`useQuotes`) or mock data.
 */
export interface QuoteRow {
  symbol: string;
  name: string;
  subtitle?: string;
  price?: number;
  change?: number;
  changePct?: number;
  marketCap?: number;
  loading?: boolean;
  error?: boolean;
}

interface Props {
  rows: QuoteRow[];
  showMarketCap?: boolean;
}

const fmtPrice = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

const fmtMarketCap = (n: number) => {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} M`;
  return n.toString();
};

export function QuoteTable({ rows, showMarketCap = false }: Props) {
  const openChart = useChartModalStore((s) => s.open);

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-bg-raised/40 text-left text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-2 font-medium">Symbol</th>
            <th className="px-4 py-2 font-medium">Name</th>
            <th className="px-4 py-2 text-right font-medium">Price</th>
            <th className="px-4 py-2 text-right font-medium">Change</th>
            <th className="px-4 py-2 text-right font-medium">% Change</th>
            {showMarketCap && (
              <th className="px-4 py-2 text-right font-medium">Market Cap</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row) => {
            const up = (row.changePct ?? 0) >= 0;
            const colorClass = row.error
              ? 'text-slate-500'
              : up
                ? 'text-up'
                : 'text-down';

            return (
              <tr
                key={row.symbol}
                className="table-row-hover"
                onClick={() =>
                  openChart({ symbol: row.symbol, name: row.name })
                }
              >
                <td className="px-4 py-3 font-mono font-semibold text-white">
                  {row.symbol}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  <div>{row.name}</div>
                  {row.subtitle && (
                    <div className="text-xs text-slate-500">{row.subtitle}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-100">
                  {row.error ? (
                    <span
                      className="inline-flex items-center gap-1 text-slate-500"
                      title="Failed to load"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      error
                    </span>
                  ) : row.price === undefined ? (
                    <Skeleton className="ml-auto h-4 w-16" />
                  ) : (
                    fmtPrice(row.price)
                  )}
                </td>
                <td className={clsx('px-4 py-3 text-right font-mono', colorClass)}>
                  {row.change === undefined ? (
                    row.error ? (
                      '—'
                    ) : (
                      <Skeleton className="ml-auto h-4 w-14" />
                    )
                  ) : (
                    `${up ? '+' : ''}${fmtPrice(row.change)}`
                  )}
                </td>
                <td className={clsx('px-4 py-3 text-right font-mono', colorClass)}>
                  {row.changePct === undefined ? (
                    row.error ? (
                      '—'
                    ) : (
                      <Skeleton className="ml-auto h-4 w-14" />
                    )
                  ) : (
                    fmtPct(row.changePct)
                  )}
                </td>
                {showMarketCap && (
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {row.marketCap ? fmtMarketCap(row.marketCap) : '—'}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'inline-block animate-pulse rounded bg-slate-700/60 align-middle',
        className,
      )}
    />
  );
}
