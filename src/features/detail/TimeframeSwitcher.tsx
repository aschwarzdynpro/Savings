import clsx from 'clsx';
import { TIMEFRAMES, type Timeframe } from './timeframes';

interface Props {
  value: Timeframe;
  onChange: (tf: Timeframe) => void;
}

export function TimeframeSwitcher({ value, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Chart timeframe"
      className="inline-flex overflow-hidden rounded-md border border-slate-700 bg-bg-subtle"
    >
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          type="button"
          role="tab"
          aria-selected={value === tf}
          onClick={() => onChange(tf)}
          className={clsx(
            'px-3 py-1.5 text-xs font-medium transition-colors',
            value === tf
              ? 'bg-accent text-white'
              : 'text-slate-400 hover:bg-bg-raised hover:text-slate-200',
          )}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
