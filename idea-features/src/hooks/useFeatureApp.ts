import { createMemo, createSignal } from 'solid-js';
import type { Feature } from '../types';

export type SortKey = 'number' | 'feature' | 'impact' | 'mvpScore';

const filterableKeys: (keyof Feature)[] = ['type', 'impact', 'phase', 'effort', 'risk'];

const impactRank: Record<string, number> = { 'สูง': 3, 'กลาง': 2, 'ต่ำ': 1 };

export const useFeatureApp = (features: () => Feature[]) => {
  const [search, setSearch] = createSignal('');
  const [activeFilters, setActiveFilters] = createSignal<Record<string, Set<string>>>({});
  const [sortBy, setSortBy] = createSignal<SortKey>('impact');
  const [sortDesc, setSortDesc] = createSignal(true);
  const [hoveredId, setHoveredId] = createSignal<number | null>(null);
  const [selectedIds, setSelectedIds] = createSignal<Set<number>>(new Set());
  const [copied, setCopied] = createSignal(false);
  const [enhancing, setEnhancing] = createSignal<number | null>(null);
  const [enhanceNumber, setEnhanceNumber] = createSignal<number | null>(null);
  const [enhanceMessage, setEnhanceMessage] = createSignal<string | null>(null);
  const [creating, setCreating] = createSignal(false);
  const [createMessage, setCreateMessage] = createSignal<string | null>(null);

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
      else if (key === 'impact') cmp = (impactRank[a.impact] || 0) - (impactRank[b.impact] || 0);
      else if (key === 'mvpScore') cmp = a.mvpScore - b.mvpScore;
      return sortDesc() ? -cmp : cmp;
    });
    return list;
  });

  const hoveredFeature = createMemo(() => {
    const id = hoveredId();
    return id !== null ? features().find(f => f.number === id) || null : null;
  });

  const selectedFeatures = createMemo(() => {
    const ids = selectedIds();
    return features().filter(f => ids.has(f.number));
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

  const enhanceFeature = async (feature: Feature, prompt: string) => {
    setEnhancing(feature.number);
    setEnhanceNumber(feature.number);
    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: feature.number, prompt, feature: feature.feature })
      });
      const data = await res.json();
      setEnhanceMessage(data.message || 'enhance สำเร็จ');
    } catch (e) {
      setEnhanceMessage(`enhance ล้มเหลว: ${e}`);
    } finally {
      setEnhancing(null);
      setTimeout(() => { setEnhanceMessage(null); setEnhanceNumber(null); }, 4000);
    }
  };

  const createFeature = async (draft: Partial<Feature>) => {
    setCreating(true);
    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      const data = await res.json();
      setCreateMessage(data.message || 'สร้าง feature สำเร็จ');
    } catch (e) {
      setCreateMessage(`สร้าง feature ล้มเหลว: ${e}`);
    } finally {
      setCreating(false);
      setTimeout(() => setCreateMessage(null), 3000);
    }
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
    features,
    search,
    setSearch,
    activeFilters,
    toggleFilter,
    clearFilters,
    sortBy,
    setSortBy,
    sortDesc,
    setSortDesc,
    filterCategories,
    visibleFeatures,
    hoveredId,
    setHoveredId,
    hoveredFeature,
    selectedFeatures,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    selectedCount,
    copySelected,
    copied,
    enhancing,
    enhanceNumber,
    enhanceMessage,
    enhanceFeature,
    creating,
    createMessage,
    createFeature,
    counts,
  };
};
