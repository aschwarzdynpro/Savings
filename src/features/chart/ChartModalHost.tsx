import { useEffect } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useChartModalStore } from '@/store/chart-modal-store';
import { useQuote } from '@/hooks/useMarketData';
import { LightweightChart } from './LightweightChart';

export function ChartModalHost() {
  const target = useChartModalStore((s) => s.target);
  const close = useChartModalStore((s) => s.close);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [target, close]);

  if (!target) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={close}
    >
      <div
        className="card w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader symbol={target.symbol} name={target.name} onClose={close} />
        <div className="p-4">
          <LightweightChart symbol={target.symbol} />
        </div>
      </div>
    </div>
  );
}

function ModalHeader({
  symbol,
  name,
  onClose,
}: {
  symbol: string;
  name?: string;
  onClose: () => void;
}) {
  const { data: quote, isLoading, isError } = useQuote(symbol);
  const up = (quote?.changePct ?? 0) >= 0;

  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
      <div>
        <div className="font-mono text-xs text-slate-400">{symbol}</div>
        <div className="text-lg font-semibold text-white">{name ?? symbol}</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          {isLoading && <div className="text-sm text-slate-500">loading…</div>}
          {isError && <div className="text-sm text-slate-500">unavailable</div>}
          {quote && (
            <>
              <div className="font-mono text-lg text-white">
                {fmt(quote.price)}
              </div>
              <div
                className={clsx(
                  'font-mono text-xs',
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
        <button className="btn-ghost" onClick={onClose} aria-label="Close chart">
          <X className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
