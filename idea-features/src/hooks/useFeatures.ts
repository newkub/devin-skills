import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import type { Feature } from '../types';

const POLL_MS = 3000;

export const useFeatures = () => {
  const [features, setFeatures] = createSignal<Feature[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [dark] = createSignal(true);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/data');
      if (!r.ok) throw new Error(`ไม่สามารถโหลดข้อมูล: ${r.status} ${r.statusText}`);
      const data = await r.json();
      setFeatures(Array.isArray(data) ? data : data.features || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    loadData();

    const timer = setInterval(() => {
      fetch('/api/data')
        .then(r => r.json())
        .then(data => setFeatures(Array.isArray(data) ? data : data.features || []))
        .catch(() => { });
    }, POLL_MS);

    onCleanup(() => clearInterval(timer));
  });

  createEffect(() => {
    document.documentElement.classList.add('dark');
  });

  return { features, loading, error, loadData };
};
