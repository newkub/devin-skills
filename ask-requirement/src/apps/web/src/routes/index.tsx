import { createFileRoute } from "@tanstack/solid-router"
import { PLATFORM_OPTIONS, INTEGRATION_OPTIONS } from "@ask-requirement/shared"
import type { ProjectLevelValue } from "@ask-requirement/shared"
import { OptionGrid } from "~/components/OptionGrid"
import { StringListEditor } from "~/components/StringListEditor"
import { ProjectLevelSection } from "~/components/ProjectLevelSection"
import { CustomDataSection } from "~/components/CustomDataSection"
import { SummaryPanel } from "~/components/SummaryPanel"
import { useRequirementForm } from "~/hooks/useRequirementForm"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ask Requirement" },
      { name: "description", content: "Structured project requirement collection" },
    ],
  }),
  component: Home,
})

function Home() {
  const form = useRequirementForm()

  return (
    <div class="min-h-screen bg-hsl-220 20% 8% text-gray-200">
      <div class="max-w-7xl mx-auto p-4 md:p-8">
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <span class="i-mdi-clipboard-list text-primary text-4xl" />
            Ask Requirement
          </h1>
          <p class="text-gray-400 mt-2">กรอกความต้องการโปรเจกต์แล้วสรุปอัตโนมัติ</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <div class="lg:w-3/4 space-y-6">
            <section class="card">
              <h2 class="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                <span class="i-mdi-devices text-primary text-2xl" />
                1. Platform
              </h2>
              <p class="text-gray-400 text-sm mb-4">เลือก platform ที่ต้องการ (เลือกได้หลายอัน)</p>
              <OptionGrid options={PLATFORM_OPTIONS} selected={form.form().platforms} onToggle={form.togglePlatform} />
            </section>

            <section class="card">
              <h2 class="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                <span class="i-mdi-link-variant text-primary text-2xl" />
                2. Integrations
              </h2>
              <p class="text-gray-400 text-sm mb-4">เลือก integrations ที่ต้องการ (เลือกได้หลายอัน)</p>
              <OptionGrid options={INTEGRATION_OPTIONS} selected={form.form().integrations} onToggle={form.toggleIntegration} />
            </section>

            <section class="card">
              <h2 class="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                <span class="i-mdi-format-list-bulleted text-primary text-2xl" />
                3. Features
              </h2>
              <p class="text-gray-400 text-sm mb-4">กรอก features ที่ต้องการ</p>
              <StringListEditor
                items={form.form().features}
                placeholder="เช่น User dashboard, Booking system, Search"
                onAdd={form.addFeature}
                onRemove={form.removeFeature}
                onUpdate={form.updateFeature}
                addLabel="Add Feature"
              />
            </section>

            <section class="card">
              <h2 class="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                <span class="i-mdi-account-group text-primary text-2xl" />
                4. Target Users
              </h2>
              <p class="text-gray-400 text-sm mb-4">target user คือใคร และคาดว่าจะมีเท่าไหร่</p>
              <div class="space-y-3">
                <div>
                  <label class="block text-gray-300 mb-1 text-sm">Target User</label>
                  <input
                    type="text"
                    placeholder="เช่น ร้านค้า SME, บริษัทท่องเที่ยว, ผู้ใช้ทั่วไป"
                    value={form.form().targetUser}
                    onInput={(e) => form.setForm((p) => ({ ...p, targetUser: e.currentTarget.value }))}
                    class="input-base"
                  />
                </div>
                <div>
                  <label class="block text-gray-300 mb-1 text-sm">Expected Users</label>
                  <input
                    type="text"
                    placeholder="เช่น 1,000, 10,000, 100,000+"
                    value={form.form().expectedUsers}
                    onInput={(e) => form.setForm((p) => ({ ...p, expectedUsers: e.currentTarget.value }))}
                    class="input-base"
                  />
                </div>
              </div>
            </section>

            <section class="card">
              <h2 class="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                <span class="i-mdi-sword-cross text-primary text-2xl" />
                5. Competitors
              </h2>
              <p class="text-gray-400 text-sm mb-4">คู่แข่งหรือโปรเจกต์ที่คล้ายกัน</p>
              <StringListEditor
                items={form.form().competitors}
                placeholder="เช่น Calendly, Acuity Scheduling, Setmore"
                onAdd={form.addCompetitor}
                onRemove={form.removeCompetitor}
                onUpdate={form.updateCompetitor}
                addLabel="Add Competitor"
              />
            </section>

            <section class="card">
              <h2 class="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                <span class="i-mdi-stairs-up text-primary text-2xl" />
                6. Project Level
              </h2>
              <p class="text-gray-400 text-sm mb-4">ระดับความซับซ้อนของโปรเจกต์</p>
              <ProjectLevelSection
                selected={form.form().projectLevel}
                onSelect={(val: ProjectLevelValue) => form.setForm((p) => ({ ...p, projectLevel: val }))}
              />
            </section>

            <section class="card">
              <h2 class="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                <span class="i-mdi-database-plus text-primary text-2xl" />
                7. Custom Data
              </h2>
              <p class="text-gray-400 text-sm mb-4">ข้อมูลเพิ่มเติมสำหรับ AI (key-value pairs พร้อม icon)</p>
              <CustomDataSection
                items={form.form().customData}
                onAdd={form.addCustomData}
                onRemove={form.removeCustomData}
                onUpdate={form.updateCustomData}
              />
            </section>

            <div class="flex gap-3">
              <button type="button" onClick={form.copyToClipboard} disabled={!form.summary()} class="btn-primary flex items-center gap-2 disabled:opacity-50">
                <span class={form.copied() ? "i-mdi-check" : "i-mdi-content-copy"} />
                {form.copied() ? "Copied!" : "Copy Summary"}
              </button>
              <button type="button" onClick={form.resetForm} class="btn-ghost flex items-center gap-2 text-yellow-400">
                <span class="i-mdi-refresh" />
                Reset
              </button>
            </div>
          </div>

          <div class="lg:w-1/4">
            <div class="sticky top-4">
              <SummaryPanel summary={form.summary()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
