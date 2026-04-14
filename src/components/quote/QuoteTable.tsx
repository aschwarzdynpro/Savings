import clsx from 'clsx';
import type { SymbolSeed } from '@/data/types';
import { useChartModalStore } from '@/store/chart-modal-store';

interface Props {
  rows: SymbolSeed[];
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
            // Deterministic mock values derived from the symbol hash so the
            // list doesn't jitter on every render. Replaced by real quotes in
            // Sprint 1 / Sprint 2.
            const seed = hash(row.symbol);
            const price = 50 + (seed % 500) + (seed % 97) / 100;
            const changePct = ((seed % 700) - 350) / 100;
            const change = (price * changePct) / 100;
            const up = change >= 0;

            return (
              <tr
                key={row.symbol}
                className="table-row-hover"
                onClick={() => openChart({ symbol: row.symbol, name: row.name })}
              >
                <td className="px-4 py-3 font-mono font-semibold text-white">{row.symbol}</td>
                <td className="px-4 py-3 text-slate-300">{row.name}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-100">{fmtPrice(price)}</td>
                <td
                  className={clsx(
                    'px-4 py-3 text-right font-mono',
                    up ? 'text-up' : 'text-down',
                  )}
                >
                  {up ? '+' : ''}
                  {fmtPrice(change)}
                </td>
                <td
                  className={clsx(
                    'px-4 py-3 text-right font-mono',
                    up ? 'text-up' : 'text-down',
                  )}
                >
                  {fmtPct(changePct)}
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

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
