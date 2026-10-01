---
name: design-web-prototype
description: สร้าง interactive web prototype คุณภาพ production ด้วย SolidJS+TS+UnoCSS+Vite — dark-first dev-tool aesthetic, reusable components, functional จริงไม่ใช่ mockup
argument-hint: "[app-spec-or-domain]"
related:
  - design-prototype-in-html
  - design-cli-prototype
  - follow-solid-framework
  - follow-lib-solidjs
  - follow-lib-unocss
  - follow-tool-vite
  - follow-design-system
  - create-files-in-os-temp
  - check-open-ports
  - open-web
  - ask-me
  - report
---

## Goal

Design + implement interactive web prototype ที่ functional จริง (ไม่ใช่ static mockup) — ใช้ SolidJS + TypeScript + UnoCSS + Vite + Modern Web APIs, reusable components, premium developer-tool aesthetic — build ใน OS temp แล้วเปิดด้วย `/open-web`

## Scope

ใช้เมื่อต้องการ web prototype แบบ interactive — dashboard, explorer, playground, config UI, data tools

- Prototype UI ธรรมดา single-file HTML → `/design-prototype-in-html`
- CLI documentation/explorer specifically → `/design-cli-prototype`
- Production app ใน project จริง → `/follow-solid-framework` ไม่ใช่ skill นี้

## Execute

### 1. Clarify Spec

> Goal: รู้ว่า prototype ต้องทำอะไร

1. รับ domain/spec จาก argument หรือ context — ไม่ชัด → `/ask-me` (จำนวน views, data model, interactions)
2. ถ้ามี data source จริง (CLI surface, API, config) → ดึง schema จริงมาเป็น source of truth ก่อน design

### 2. Scaffold

> Goal: SolidJS app พร้อมใน temp

1. ทำ `/create-files-in-os-temp` — สร้าง `<temp>/web-proto-<name>/`
2. Scaffold ตาม `/follow-solid-framework`: `bun create vite` (template `solid-ts`) → `bun add -d unocss`
3. UnoCSS config ตาม `/follow-lib-unocss` เท่านั้น — `presetWind4` (ไม่ใช่ `presetUno` — deprecated), theme keys ปัจจุบัน (`font`, `radius`, `shadow`, `breakpoint`, `ease`, `property`, `spacing` — ไม่ใช่ `fontFamily`/`borderRadius`/`boxShadow` เดิม), `presetIcons`, transformers ตามต้องการ
4. สร้าง `src/` tree: `data/` (typed schema = single source of truth), `lib/` (logic), `components/`, `routes/`

### 3. Implement

> Goal: functional app จาก typed data เดียว

1. `data/` = typed schema — ทุก view/panel derive จาก schema เดียว ห้าม hardcode content แยก
2. Reusable SolidJS components ตาม `/follow-lib-solidjs` — `createSignal`/`createMemo`/`createStore`, Context เฉพาะที่ justify
3. Interactive elements ทำงานจริง: hover/click inspect, builders, copy, search, navigation — ไม่ใช่ dead UI
4. ถ้า app มี 2 audiences (human/agent) → generate ทั้งสองจาก schema เดียว programmatically

### 4. Apply UX Quality Bar

> Goal: ครบตาม production-quality bar

1. Visual: dark-first, minimal, dense-but-readable, subtle borders, layered surfaces, strong typography, monospace สำหรับ code/CLI elements, subtle gradients, restrained shadows — ห้าม generic SaaS landing aesthetic (no huge hero, no excessive glassmorphism/rounded cards/illustrations)
2. UnoCSS เป็น ALL styling: reusable shortcuts (`surface`, `code-surface`, `interactive`, `focus-ring`, `muted-text`) + variants (`hover:`/`focus:`/`group-hover:`/`dark:`/`sm:`-`xl:`) — CSS แยกเฉพาะ browser-specific/advanced animations ที่ UnoCSS ทำไม่ได้จริง
3. Responsive: 3 breakpoints — desktop full layout, tablet collapse, mobile stacked + bottom nav
4. Accessibility: semantic HTML, keyboard nav, focus states, ARIA, reduced motion, WCAG AA contrast
5. Microinteractions: fast + subtle + purposeful — copy feedback, transitions, active indicators
6. Theme toggle (ถ้ามี): smooth transition — ไม่ hard swap ตาม `/follow-design-system`/`/improve-uxui` convention
7. ภาษาไทยในหน้าเว็บ → font stack ตาม `/follow-lib-unocss` (`@fontsource-variable/noto-sans-thai` + per-glyph fallback)

### 5. Run And Open

> Goal: user เห็น prototype ทำงานจริง

1. `bun install` → `bun run dev` ตาม `/follow-tool-vite`
2. `/check-open-ports` ถ้า port ชน → เปลี่ยน port
3. `/open-web` — verify console clean, ทุก route/interaction ใช้ได้
4. `/report` สรุป temp path + URL; user ขอแก้ → แก้ใน temp เดิมแล้ว refresh

## Rules

- Prototype เขียนลง OS temp เท่านั้น — ห้ามเขียนลง project (ยกเว้น user สั่ง)
- Typed data schema = single source of truth — ทุก view derive จากมัน
- UnoCSS `presetWind4` เท่านั้น — ห้าม Tailwind/Bootstrap/large CSS stylesheet; CSS เฉพาะที่ UnoCSS ทำไม่ได้
- ทุก hover interaction ต้องมี click/tap equivalent — ห้าม rely on hover เพียงอย่างเดียว
- Animations fast + subtle — ห้ามเสีย performance เพื่อ effects
- ทุก config ทำตาม canonical skills (`/follow-lib-unocss`, `/follow-solid-framework`, `/follow-lib-solidjs`) — ห้ามคัดลอก config ตัวอย่างจาก spec ภายนอกที่อาจ stale
- ใช้ `/create-files-in-os-temp`, `/open-web`, `/check-open-ports` เสมอ; ใช้ `/ask-me` ถ้าจำเป็น

## Expected Outcome

- Prototype รันบน localhost เปิดใน browser — functional จริงทุก interaction
- Styling 100% UnoCSS ตาม `presetWind4` conventions — reusable shortcuts ไม่ scatter
- ไม่มี prototype files ปนใน project source
