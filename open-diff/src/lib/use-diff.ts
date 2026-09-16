import { createSignal, type Accessor, type Setter } from 'solid-js';
import { parsePatchFiles, type FileDiffMetadata } from '@pierre/diffs';
import { splitPatch } from './split';
import type { DiffResult, SourceKind } from '../types';

export function useDiff(
  params: () => Record<string, string>,
  getSource: () => SourceKind,
  theme: Accessor<'dark' | 'light'>,
  onPrLoaded: () => void,
  onNoChecks: () => void
) {
  const [data, setData] = createSignal<DiffResult | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [selected, setSelected] = createSignal(0);
  const [fileQuery, setFileQuery] = createSignal('');

  const metaCache = new Map<number, FileDiffMetadata>();

  const visibleIndices = () => {
    const files = data()?.files ?? [];
    const q = fileQuery().trim().toLowerCase();
    if (!q) return files.map((_, i) => i);
    return files.map((f, i) => ({ f, i })).filter(({ f }) => f.name.toLowerCase().includes(q)).map(({ i }) => i);
  };

  const getMeta = (i: number): FileDiffMetadata | undefined => {
    const files = data()?.files;
    const entry = files?.[i];
    if (!entry) return undefined;
    let m = metaCache.get(i);
    if (!m) {
      try {
        m = parsePatchFiles(entry.chunk)[0]?.files?.[0];
        if (m) metaCache.set(i, m);
      } catch {
        return undefined;
      }
    }
    return m;
  };

  const missingParams = () => {
    const p = params();
    return (
      (p.source === 'pr' && !p.pr) ||
      (p.source === 'git' && !p.ref) ||
      (p.source === 'branch' && !(p.base && p.head)) ||
      (p.source === 'file' && !(p.old && p.new)) ||
      !p.source
    );
  };

  async function load() {
    if (missingParams()) return;
    setLoading(true);
    setError(null);
    const source = getSource();
    const p = params();
    const body: any = { kind: source, theme: theme() };
    if (source === 'pr') {
      body.pr = Number(p.pr || 0);
      body.repo = p.repo;
    } else if (source === 'git') {
      body.ref = p.ref;
      body.repo = p.repo;
    } else if (source === 'branch') {
      body.base = p.base;
      body.head = p.head;
      body.repo = p.repo;
    } else if (source === 'file') {
      body.old = p.old;
      body.new = p.new;
    }

    try {
      const res = await fetch('/api/diff', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Unknown error');

      metaCache.clear();
      setData({ source: json.source, files: splitPatch(json.raw), raw: json.raw, prMeta: json.prMeta });
      setSelected(0);
      setFileQuery('');
      if (json.source?.kind === 'pr') onPrLoaded();
      else onNoChecks();
    } catch (e: any) {
      setError(e.message);
      setData(null);
      onNoChecks();
    } finally {
      setLoading(false);
    }
  }

  return {
    data, setData, loading, error, setError, selected, setSelected,
    fileQuery, setFileQuery, visibleIndices, getMeta, missingParams, load,
  };
}

export type UseDiff = ReturnType<typeof useDiff>;
