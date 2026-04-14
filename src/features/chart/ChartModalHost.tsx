import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useChartModalStore } from '@/store/chart-modal-store';
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
        <header className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
          <div>
            <div className="font-mono text-sm text-slate-400">{target.symbol}</div>
            <div className="text-lg font-semibold text-white">{target.name ?? target.symbol}</div>
          </div>
          <button className="btn-ghost" onClick={close} aria-label="Close chart">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-4">
          <LightweightChart symbol={target.symbol} />
          <p className="mt-3 text-xs text-slate-500">
            Demo data only. Real candles arrive in Sprint 1.
          </p>
        </div>
      </div>
    </div>
  );
}
