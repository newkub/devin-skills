import { createSignal, onCleanup } from 'solid-js';

export type Checks = {
  summary: 'pass' | 'fail' | 'pending' | 'none' | 'error';
  checks: { name: string; bucket: string }[];
  failing?: string[];
  pending?: number;
};

export function useChecks() {
  const [checks, setChecks] = createSignal<Checks | null>(null);
  let checksTimer: ReturnType<typeof setTimeout> | undefined;

  async function pollChecks() {
    clearTimeout(checksTimer);
    try {
      const res = await fetch('/api/checks');
      const json = await res.json();
      setChecks(json);
      if (json.summary === 'pending') checksTimer = setTimeout(pollChecks, 8000);
    } catch {
      setChecks({ summary: 'error', checks: [] });
    }
  }
  onCleanup(() => clearTimeout(checksTimer));

  const ciBlocked = () => {
    const c = checks();
    return !!c && (c.summary === 'fail' || c.summary === 'pending');
  };
  const ciLabel = () => {
    const c = checks();
    if (!c || c.summary === 'none') return '';
    if (c.summary === 'pass') return `CI ✓ ${c.checks.length} checks`;
    if (c.summary === 'pending') return `CI ⏳ ${c.pending} pending`;
    if (c.summary === 'fail') return `CI ✗ ${c.failing?.length ?? 0} failing`;
    return 'CI error';
  };
  const ciTitle = () => {
    const c = checks();
    if (!c) return '';
    if (c.summary === 'fail') return `Failing: ${(c.failing ?? []).join(', ')}`;
    if (c.summary === 'pending') return `${c.pending} check(s) still running — merge blocked until green`;
    return 'All checks passed';
  };

  return { checks, setChecks, pollChecks, ciBlocked, ciLabel, ciTitle };
}
