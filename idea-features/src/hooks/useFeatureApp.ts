import { createMemo, createSignal } from 'solid-js';
import type { Feature } from '../types';

export type GroupKey = 'none' | 'type' | 'impact' | 'phase' | 'effort' | 'risk';
export type SortKey = 'number' | 'feature' | 'mvpScore';

const filterableKeys: (keyof Feature)[] = ['type', 'impact', 'phase', 'effort', 'risk'];

export const useFeatureApp = (features: () => Feature[]) => {
  const [search, setSearch] = createSignal('');
  const [activeFilters, setActiveFilters] = createSignal<Record<string, Set<string>>>({});
  const [groupBy, setGroupBy] = createSignal<GroupKey>('none');
  const [sortBy, setSortBy] = createSignal<SortKey>('mvpScore');
  const [sortDesc, setSortDesc] = createSignal(true);
  const [selectedDetailId, setSelectedDetailId] = createSignal<number | null>(null);
  const [selectedIds, setSelectedIds] = createSignal<Set<number>>(new Set());
  const [copied, setCopied] = createSignal(false);

  const filterCategories = createMemo(() => {
    const cats: Record<string, Set<string>> = {};
    for (const key of filterableKeys) cats[key] = new Set();
    for (const f of features()) {
      for (const key of filterableKeys) {
        const v = f[key];
        if (v !== undefined) cats[key].add(String(v));
      }
    }
    return cats;
  });

  const visibleFeatures = createMemo(() => {
    let list = features();
    const q = search().trim().toLowerCase();
    if (q) {
      list = list.filter(f =>
        [f.feature, f.description, f.type, f.impact, f.phase, f.effort, f.risk, f.reason, f.how, f.riskDetail]
          .some(v => v && String(v).toLowerCase().includes(q))
      );
    }
    const af = activeFilters();
    list = list.filter(f =>
      Object.entries(af).every(([key, set]) => {
        if (set.size === 0) return true;
        return set.has(String(f[key as keyof Feature]));
      })
    );
    list = [...list].sort((a, b) => {
      const key = sortBy();
      let cmp = 0;
      if (key === 'number') cmp = a.number - b.number;
      else if (key === 'feature') cmp = a.feature.localeCompare(b.feature);
      else if (key === 'mvpScore') cmp = a.mvpScore - b.mvpScore;
      return sortDesc() ? -cmp : cmp;
    });
    return list;
  });

  const groupedFeatures = createMemo(() => {
    const list = visibleFeatures();
    const key = groupBy();
    if (key === 'none') return [{ key: 'all', label: 'ทั้งหมด', features: list }];
    const groups = new Map<string, Feature[]>();
    for (const f of list) {
      const v = String(f[key as keyof Feature] ?? '-');
      if (!groups.has(v)) groups.set(v, []);
      groups.get(v)!.push(f);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, items]) => ({ key: k, label: `${key}: ${k}`, features: items }));
  });

  const selectedFeature = createMemo(() => {
    const list = visibleFeatures();
    if (list.length === 0) return null;
    const id = selectedDetailId();
    if (id !== null) {
      const found = list.find(f => f.number === id);
      if (found) return found;
    }
    return list[0];
  });

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const next: Record<string, Set<string>> = { ...prev };
      if (!next[key]) next[key] = new Set();
      const set = new Set(next[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      next[key] = set;
      return next;
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearch('');
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set<number>(visibleFeatures().map(f => f.number)));
  const clearSelection = () => setSelectedIds(new Set<number>());

  const selectedCount = createMemo(() => selectedIds().size);

  const copySelected = async () => {
    const ids = selectedIds();
    const list = features().filter(f => ids.has(f.number));
    if (list.length === 0) return;
    const text = list.map((f, i) => `${i + 1}. ${f.feature} — ${f.description}`).join('\n');
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const counts = createMemo(() => {
    const all = features();
    return {
      all: all.length,
      selected: selectedIds().size,
      mvp: all.filter(f => f.phase === 'MVP').length,
      high: all.filter(f => f.impact === 'สูง').length,
    };
  });

  return {
    search,
    setSearch,
    activeFilters,
    toggleFilter,
    clearFilters,
    groupBy,
    setGroupBy,
    sortBy,
    setSortBy,
    sortDesc,
    setSortDesc,
    filterCategories,
    groupedFeatures,
    visibleFeatures,
    selectedFeature,
    selectedDetailId,
    setSelectedDetailId,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    selectedCount,
    copySelected,
    copied,
    counts,
  };
};
