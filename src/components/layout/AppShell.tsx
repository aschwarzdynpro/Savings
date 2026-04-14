import { Outlet } from 'react-router-dom';
import { LineChart } from 'lucide-react';
import { TabNav } from './TabNav';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { ChartModalHost } from '@/features/chart/ChartModalHost';

export function AppShell() {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-slate-800 bg-bg-subtle/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <div className="flex items-center gap-2 text-accent">
            <LineChart className="h-6 w-6" />
            <span className="text-lg font-semibold text-white">Trading Dashboard</span>
          </div>
          <div className="flex-1" />
          <div className="w-full max-w-md">
            <GlobalSearch />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4">
          <TabNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800 px-4 py-3 text-center text-xs text-slate-500">
        Sprint 0 · Foundation · Data: mock · See <code>PLAN.md</code> for the roadmap
      </footer>

      <ChartModalHost />
    </div>
  );
}
