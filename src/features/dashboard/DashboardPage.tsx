import { LayoutDashboard } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="card flex min-h-[60vh] flex-col items-center justify-center gap-4 p-10 text-center">
      <div className="rounded-full bg-bg-raised p-4 text-accent">
        <LayoutDashboard className="h-10 w-10" />
      </div>
      <h1 className="text-2xl font-semibold text-white">Configurable Dashboard</h1>
      <p className="max-w-md text-sm text-slate-400">
        This tab will host your personal, drag-and-drop widget dashboard. Widgets,
        layouts and persistence land in <span className="font-mono text-slate-300">Sprint 4</span>.
      </p>
    </div>
  );
}
