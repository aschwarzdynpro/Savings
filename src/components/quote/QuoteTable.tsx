import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { AlertCircle, ArrowDown, ArrowUp, ChevronsUpDown, Search } from 'lucide-react';
import { useChartModalStore } from '@/store/chart-modal-store';
import { Sparkline } from './Sparkline';

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

type SortKey = 'symbol' | 'name' | 'price' | 'changePct' | 'marketCap';
type SortDir = 'asc' | 'desc';

interface Column {
  key: SortKey;
  label: string;
  align?: 'left' | 'right';
  sortable?: boolean;
}

interface Props {
  rows: QuoteRow[];
  showMarketCap?: boolean;
  showFilter?: boolean;
  showSparkline?: boolean;
  /** Default sort — falls back to marketCap desc if available, else symbol asc. */
  defaultSort?: { key: SortKey; dir: SortDir };
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

export function QuoteTable({
  rows,
  showMarketCap = false,
  showFilter = false,
  showSparkline = false,
  defaultSort,
}: Props) {
  const openChart = useChartModalStore((s) => s.open);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(
    defaultSort?.key ?? (showMarketCap ? 'marketCap' : 'symbol'),
  );
  const [sortDir, setSortDir] = useState<SortDir>(
    defaultSort?.dir ?? (showMarketCap ? 'desc' : 'asc'),
  );

  const columns: Column[] = useMemo(() => {
    const cols: Column[] = [
      { key: 'symbol', label: 'Symbol', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'price', label: 'Price', align: 'right', sortable: true },
      { key: 'changePct', label: '% Change', align: 'right', sortable: true },
    ];
    if (showMarketCap) {
      cols.push({ key: 'marketCap', label: 'Market Cap', align: 'right', sortable: true });
    }
    return cols;
  }, [showMarketCap]);

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return rows;
    return rows.filter(
      (r) =>
        r.symbol.toLowerCase().includes(f) || r.name.toLowerCase().includes(f),
    );
  }, [rows, filter]);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => dir * compare(a, b, sortKey));
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'symbol' || key === 'name' ? 'asc' : 'desc');
    }
  };

  return (
    <div className="space-y-3">
      {showFilter && (
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter symbol or name…"
            className="w-full rounded-md border border-slate-700 bg-bg-raised py-1.5 pl-9 pr-3
                       text-sm text-slate-100 placeholder:text-slate-500
                       focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-raised/40 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-2 font-medium select-none',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer hover:text-slate-200',
                  )}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1',
                      col.align === 'right' && 'flex-row-reverse',
                    )}
                  >
                    {col.label}
                    {col.sortable && (
                      <SortIcon
                        active={sortKey === col.key}
                        dir={sortKey === col.key ? sortDir : undefined}
                      />
                    )}
                  </span>
                </th>
              ))}
              {showSparkline && (
                <th className="px-4 py-2 text-right font-medium">7d</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (showSparkline ? 1 : 0)}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  No results.
                </td>
              </tr>
            )}
            {sorted.map((row) => {
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
                    <div className="truncate">{row.name}</div>
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
                    {row.changePct === undefined ? (
                      row.error ? (
                        '—'
                      ) : (
                        <Skeleton className="ml-auto h-4 w-14" />
                      )
                    ) : (
                      <div>
                        <div>{fmtPct(row.changePct)}</div>
                        {row.change !== undefined && (
                          <div className="text-[10px] opacity-70">
                            {up ? '+' : ''}
                            {fmtPrice(row.change)}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  {showMarketCap && (
                    <td className="px-4 py-3 text-right font-mono text-slate-300">
                      {row.marketCap ? fmtMarketCap(row.marketCap) : '—'}
                    </td>
                  )}
                  {showSparkline && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end">
                        <Sparkline symbol={row.symbol} />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function compare(a: QuoteRow, b: QuoteRow, key: SortKey): number {
  const av = a[key];
  const bv = b[key];
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  if (typeof av === 'number' && typeof bv === 'number') return av - bv;
  return String(av).localeCompare(String(bv));
}

function SortIcon({ active, dir }: { active: boolean; dir?: SortDir }) {
  if (!active) return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
  return dir === 'asc' ? (
    <ArrowUp className="h-3 w-3" />
  ) : (
    <ArrowDown className="h-3 w-3" />
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
