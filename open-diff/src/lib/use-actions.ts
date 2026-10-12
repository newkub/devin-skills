import { createSignal } from 'solid-js';

export function useActions(setError: (msg: string | null) => void) {
  const [actionOutput, setActionOutput] = createSignal<string | null>(null);
  const [actionBusy, setActionBusy] = createSignal<string | null>(null);

  async function runAction(action: string, extra: any = {}) {
    setActionBusy(action);
    setActionOutput(null);
    setError(null);
    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Action failed');
      setActionOutput(`${action}: ${json.output || 'ok'}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActionBusy(null);
    }
  }

  const busy = () => actionBusy() !== null;

  return { actionOutput, actionBusy, busy, runAction };
}
