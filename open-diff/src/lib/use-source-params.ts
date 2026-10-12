import { useNavigate, useSearch } from '@tanstack/solid-router';
import type { SourceKind } from '../types';

export function useSourceParams() {
  const navigate = useNavigate();
  const search: any = useSearch({ strict: false });

  const getSource = () => (search().source as SourceKind) || 'pr';
  const params = () => search() as Record<string, string>;

  function setField(key: string, value: string) {
    navigate({ search: { ...params(), [key]: value } as any, replace: true });
  }

  // Remember params per tab — switching back restores the previous selection
  const paramCache = new Map<SourceKind, Record<string, string>>();
  function setSource(kind: SourceKind) {
    paramCache.set(getSource(), { ...params() });
    navigate({ search: { source: kind, ...(paramCache.get(kind) ?? {}) } as any, replace: true });
  }

  return { getSource, params, setField, setSource };
}
