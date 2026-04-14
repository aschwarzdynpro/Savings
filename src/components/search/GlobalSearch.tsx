import { useState } from 'react';
import { Search } from 'lucide-react';

/**
 * Global symbol search input.
 *
 * Sprint 0: UI-only placeholder. In Sprint 3 this wires up to
 * `FinnhubProvider.searchSymbols()` with a debounced dropdown.
 */
export function GlobalSearch() {
  const [value, setValue] = useState('');

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search symbol (e.g. AAPL, MSFT, ^GSPC)…"
        className="w-full rounded-md border border-slate-700 bg-bg-raised py-2 pl-9 pr-3
                   text-sm text-slate-100 placeholder:text-slate-500
                   focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}
