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
  const [selectedId, setSelectedId] = createSignal<number | null>(null);
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
      else if (key === 'impact') cmp = (impactRank[a.impact] || 0) - (impactRank[b.impact] || 0);
      else if (key === 'mvpScore') cmp = a.mvpScore - b.mvpScore;
      return sortDesc() ? -cmp : cmp;
    });
    return list;
  });

  const selectedFeature = createMemo(() => {
    const id = selectedId();
    return id !== null ? features().find(f => f.number === id) || null : null;
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

  const selectFeature = (id: number) => setSelectedId(id);
  const clearSelection = () => setSelectedId(null);

  const promptText = () => {
    const f = selectedFeature();
    if (!f) return '';
    return [
      'ช่วงพิจารณาและวางแผน implement feature ต่อไปนี้:',
      '',
      `Feature: ${f.feature}`,
      `Type: ${f.type} | Impact: ${f.impact} | Phase: ${f.phase} | Effort: ${f.effort} | MVP: ${f.mvpScore} | Risk: ${f.risk}`,
      '',
      `Description:`,
      `${f.description}`,
      '',
      f.reason ? `Why: ${f.reason}` : '',
      f.how ? `How: ${f.how}` : '',
      f.riskDetail ? `Risk: ${f.riskDetail}` : '',
      (f.tags || []).length ? `Tags: ${(f.tags || []).join(', ')}` : ''
    ].filter(Boolean).join('\n');
  };

  const copyPrompt = async () => {
    const text = promptText();
    if (!text) return;
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
      selected: selectedId() !== null ? 1 : 0,
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
    selectedId,
    selectFeature,
    clearSelection,
    selectedFeature,
    promptText,
    copyPrompt,
    copied,
    counts,
  };
};
