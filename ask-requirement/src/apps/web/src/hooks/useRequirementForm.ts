import { createMemo, createSignal } from "solid-js"
import { generateSummary } from "@ask-requirement/shared"
import type { RequirementForm, PlatformValue, IntegrationValue } from "@ask-requirement/shared"

const INITIAL_FORM: RequirementForm = {
  platforms: [],
  integrations: [],
  features: [""],
  targetUser: "",
  expectedUsers: "",
  competitors: [""],
  projectLevel: "",
  customData: [],
}

export function useRequirementForm() {
  const [form, setForm] = createSignal<RequirementForm>({ ...INITIAL_FORM })
  const [copied, setCopied] = createSignal(false)

  const summary = createMemo(() => {
    const f = form()
    if (f.projectLevel === "") return null
    return generateSummary(f)
  })

  const togglePlatform = (val: PlatformValue) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(val)
        ? prev.platforms.filter((p) => p !== val)
        : [...prev.platforms, val],
    }))
  }

  const toggleIntegration = (val: IntegrationValue) => {
    setForm((prev) => ({
      ...prev,
      integrations: prev.integrations.includes(val)
        ? prev.integrations.filter((i) => i !== val)
        : [...prev.integrations, val],
    }))
  }

  const addFeature = () => setForm((p) => ({ ...p, features: [...p.features, ""] }))
  const removeFeature = (i: number) => setForm((p) => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }))
  const updateFeature = (i: number, val: string) => setForm((p) => ({ ...p, features: p.features.map((f, idx) => idx === i ? val : f) }))

  const addCompetitor = () => setForm((p) => ({ ...p, competitors: [...p.competitors, ""] }))
  const removeCompetitor = (i: number) => setForm((p) => ({ ...p, competitors: p.competitors.filter((_, idx) => idx !== i) }))
  const updateCompetitor = (i: number, val: string) => setForm((p) => ({ ...p, competitors: p.competitors.map((c, idx) => idx === i ? val : c) }))

  const addCustomData = () => setForm((p) => ({ ...p, customData: [...p.customData, { key: "", value: "", icon: "mdi-tag" }] }))
  const removeCustomData = (i: number) => setForm((p) => ({ ...p, customData: p.customData.filter((_, idx) => idx !== i) }))
  const updateCustomData = (i: number, field: "key" | "value" | "icon", val: string) =>
    setForm((p) => ({ ...p, customData: p.customData.map((d, idx) => idx === i ? { ...d, [field]: val } : d) }))

  const copyToClipboard = async () => {
    const s = summary()
    if (!s) return
    await navigator.clipboard.writeText(s.markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetForm = () => setForm({ ...INITIAL_FORM })

  return {
    form,
    setForm,
    copied,
    summary,
    togglePlatform,
    toggleIntegration,
    addFeature,
    removeFeature,
    updateFeature,
    addCompetitor,
    removeCompetitor,
    updateCompetitor,
    addCustomData,
    removeCustomData,
    updateCustomData,
    copyToClipboard,
    resetForm,
  }
}
