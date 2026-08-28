import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import type { Feature } from '../types'

export const useFeatures = () => {
  const [features, setFeatures] = createSignal<Feature[]>([])
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<string | null>(null)
  const [dark, setDark] = createSignal(false)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch('/api/data')
      if (!r.ok) throw new Error(`ไม่สามารถโหลดข้อมูล: ${r.status} ${r.statusText}`)
      const data = await r.json()
      setFeatures(Array.isArray(data) ? data : data.features || [])
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  onMount(() => {
    loadData()
    const saved = localStorage.getItem('idea-features-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(saved === 'dark' || (!saved && prefersDark))
    const handler = () => navigator.sendBeacon('/close')
    window.addEventListener('beforeunload', handler)
    onCleanup(() => window.removeEventListener('beforeunload', handler))
  })

  createEffect(() => {
    document.documentElement.classList.toggle('dark', dark())
    localStorage.setItem('idea-features-theme', dark() ? 'dark' : 'light')
  })

  return { features, loading, error, dark, setDark, loadData }
}
