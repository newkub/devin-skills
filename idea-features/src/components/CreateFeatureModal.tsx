import { Show, createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import type { useFeatureApp } from '../hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

interface CreateFeatureModalProps {
  app: App
  open: () => boolean
  onClose: () => void
}

const CreateFeatureModal: Component<CreateFeatureModalProps> = (props) => {
  const [feature, setFeature] = createSignal('')
  const [description, setDescription] = createSignal('')
  const [type, setType] = createSignal<'Extends' | 'New'>('New')
  const [impact, setImpact] = createSignal('กลาง')
  const [phase, setPhase] = createSignal('MVP')
  const [effort, setEffort] = createSignal('M')
  const [mvpScore, setMvpScore] = createSignal(5)
  const [risk, setRisk] = createSignal('กลาง')
  const [reason, setReason] = createSignal('')
  const [how, setHow] = createSignal('')
  const [riskDetail, setRiskDetail] = createSignal('')
  const [tags, setTags] = createSignal('')

  const submit = () => {
    props.app.createFeature({
      feature: feature(),
      description: description(),
      type: type(),
      impact: impact(),
      phase: phase(),
      effort: effort(),
      mvpScore: mvpScore(),
      risk: risk(),
      reason: reason() || undefined,
      how: how() || undefined,
      riskDetail: riskDetail() || undefined,
      tags: tags() ? tags().split(',').map(t => t.trim()).filter(Boolean) : undefined,
    })
    setFeature('')
    setDescription('')
    setReason('')
    setHow('')
    setRiskDetail('')
    setTags('')
    setMvpScore(5)
    props.onClose()
  }

  return (
    <Show when={props.open()}>
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={props.onClose}>
        <div
          class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          onClick={e => e.stopPropagation()}
        >
          <div class="mb-4 flex items-center justify-between">
            <h2 class="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white"><span>➕</span> สร้าง Idea Feature ใหม</h2>
            <button onClick={props.onClose} class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Feature name</label>
              <input value={feature()} onInput={e => setFeature(e.currentTarget.value)} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="ชื่อ feature" />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Description</label>
              <textarea value={description()} onInput={e => setDescription(e.currentTarget.value)} rows={2} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="อธิบายสั้นๆ" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Type</label>
              <select value={type()} onInput={e => setType(e.currentTarget.value as 'Extends' | 'New')} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                <option value="New">New</option>
                <option value="Extends">Extends</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Impact</label>
              <select value={impact()} onInput={e => setImpact(e.currentTarget.value)} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                <option value="สูง">สูง</option>
                <option value="กลาง">กลาง</option>
                <option value="ต่ำ">ต่ำ</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Phase</label>
              <select value={phase()} onInput={e => setPhase(e.currentTarget.value)} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                <option value="MVP">MVP</option>
                <option value="v2">v2</option>
                <option value="v3">v3</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Effort</label>
              <select value={effort()} onInput={e => setEffort(e.currentTarget.value)} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">MVP Score</label>
              <input type="number" min={1} max={10} value={mvpScore()} onInput={e => setMvpScore(parseInt(e.currentTarget.value || '0', 10))} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Risk</label>
              <select value={risk()} onInput={e => setRisk(e.currentTarget.value)} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                <option value="สูง">สูง</option>
                <option value="กลาง">กลาง</option>
                <option value="ต่ำ">ต่ำ</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Why</label>
              <textarea value={reason()} onInput={e => setReason(e.currentTarget.value)} rows={2} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">How</label>
              <textarea value={how()} onInput={e => setHow(e.currentTarget.value)} rows={2} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Risk Detail</label>
              <textarea value={riskDetail()} onInput={e => setRiskDetail(e.currentTarget.value)} rows={2} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Tags (comma)</label>
              <input value={tags()} onInput={e => setTags(e.currentTarget.value)} class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="tag1, tag2" />
            </div>
          </div>

          <Show when={props.app.createMessage()}>
            <div class="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300">{props.app.createMessage()}</div>
          </Show>

          <div class="mt-5 flex justify-end gap-2">
            <button onClick={props.onClose} class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">ยกเลิก</button>
            <button onClick={submit} disabled={props.app.creating() || !feature() || !description()} class="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50">{props.app.creating() ? 'กำลังสร้าง...' : 'สร้าง Feature'}</button>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default CreateFeatureModal
