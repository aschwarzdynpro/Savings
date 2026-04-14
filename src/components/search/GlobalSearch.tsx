import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounced } from '@/hooks/useDebounced';
import { useSymbolSearch } from '@/hooks/useMarketData';

const MAX_RESULTS = 10;
const DEBOUNCE_MS = 300;

/**
 * Global symbol search with debounced dropdown + keyboard navigation.
 * Picks a result → navigates to `/symbol/:symbol` and forwards the
 * description via router state so the detail view shows a friendly
 * name while the quote is still loading.
 */
export function GlobalSearch() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const debounced = useDebounced(value, DEBOUNCE_MS);
  const { data: results, isFetching } = useSymbolSearch(debounced);

  const visible = useMemo(() => (results ?? []).slice(0, MAX_RESULTS), [results]);

  // Reset highlighted index when the result list changes.
  useEffect(() => {
    setActiveIdx(0);
  }, [debounced, results]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const openSymbol = (symbol: string, name?: string) => {
    navigate(`/symbol/${encodeURIComponent(symbol)}`, { state: { name } });
    setOpen(false);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(visible.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = visible[activeIdx];
      if (pick) openSymbol(pick.symbol, pick.description);
    }
  };

  const showDropdown = open && debounced.trim().length >= 1;

  return (
    <div ref={containerRef} className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      {isFetching && (
        <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-500" />
      )}
      <input
        type="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => value && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search symbol (e.g. AAPL, MSFT, SPY)…"
        className="w-full rounded-md border border-slate-700 bg-bg-raised py-2 pl-9 pr-9
                   text-sm text-slate-100 placeholder:text-slate-500
                   focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-controls="global-search-list"
      />

      {showDropdown && (
        <ul
          id="global-search-list"
          role="listbox"
          className="card absolute left-0 right-0 top-full z-40 mt-1 max-h-80 overflow-y-auto py-1"
        >
          {!isFetching && visible.length === 0 && (
            <li className="px-4 py-3 text-sm text-slate-500">No matches.</li>
          )}
          {visible.map((r, i) => (
            <li
              key={`${r.symbol}-${i}`}
              role="option"
              aria-selected={i === activeIdx}
              className={clsx(
                'cursor-pointer px-4 py-2 transition-colors',
                i === activeIdx ? 'bg-bg-raised' : 'hover:bg-bg-raised/60',
              )}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseDown={(e) => {
                // Prevent blur firing before click.
                e.preventDefault();
                openSymbol(r.symbol, r.description);
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono font-semibold text-white">
                  {r.symbol}
                </span>
                {r.type && (
                  <span className="text-[10px] uppercase tracking-wide text-slate-500">
                    {r.type}
                  </span>
                )}
              </div>
              <div className="truncate text-xs text-slate-400">{r.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
