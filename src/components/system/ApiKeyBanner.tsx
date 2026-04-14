import { KeyRound } from 'lucide-react';

/**
 * Shown when `VITE_FINNHUB_API_KEY` is missing at runtime. Points the user
 * to the setup docs without leaking anything about the key itself.
 */
export function ApiKeyBanner() {
  const hasKey = Boolean(import.meta.env.VITE_FINNHUB_API_KEY);
  if (hasKey) return null;

  return (
    <div className="card flex items-start gap-3 border-amber-700/50 bg-amber-900/10 p-4 text-sm">
      <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      <div className="text-slate-200">
        <div className="font-medium text-amber-300">Finnhub API key missing</div>
        <div className="mt-1 text-slate-400">
          Set <code className="font-mono text-slate-300">VITE_FINNHUB_API_KEY</code> in
          your <code className="font-mono">.env.local</code> (or as a Codespace secret)
          and restart the dev server. Get a free key at{' '}
          <a
            href="https://finnhub.io/register"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            finnhub.io/register
          </a>
          .
        </div>
      </div>
    </div>
  );
}
