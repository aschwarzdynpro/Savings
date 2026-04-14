import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Globe2, Building2 } from 'lucide-react';

const TABS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/indices', label: 'Indices', icon: Globe2 },
  { to: '/top50', label: 'Top 50', icon: Building2 },
] as const;

export function TabNav() {
  return (
    <nav className="flex gap-1">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-accent text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200',
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
