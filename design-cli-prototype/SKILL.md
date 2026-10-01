---
name: design-cli-prototype
description: สร้าง CLI explorer prototype (SolidJS+Vite+UnoCSS) ใน temp — เปิดด้วย /open-web
argument-hint: "[cli-name-or-spec]"
related:
  - design-prototype-in-html
  - design-web-prototype
  - follow-solid-framework
  - follow-lib-solidjs
  - follow-lib-unocss
  - follow-tool-vite
  - learn-from-cli
  - create-files-in-os-temp
  - check-open-ports
  - open-web
  - ask-me
  - report
---

## Goal

สร้าง CLI documentation/explorer prototype จริงด้วย SolidJS + TypeScript + Vite + UnoCSS — typed `Command` schema เป็น single source of truth แยกเป็น Human Mode (explore visually) + Agent Mode (Markdown/Raw/Copy) — build ใน OS temp แล้วเปิดด้วย `/open-web`

## Scope

ใช้เมื่อต้องการ prototype CLI docs site ที่อิง schema จริง — command syntax explorer, option builder, inspector, terminal preview, agent-consumable markdown

- Prototype UI ทั่วไป single-file HTML → `/design-prototype-in-html`
- Production CLI docs site ใน project จริง → `/follow-solid-framework` ไม่ใช่ skill นี้

Full spec: [references/spec.md](references/spec.md)

## Execute

### 1. Gather CLI Spec

> Goal: รู้ว่า CLI มีอะไรบ้าง

1. รับ CLI name + commands จาก argument หรือ context; ไม่ระบุ → ใช้ default dataset ใน `references/spec.md` (`run`, `build`, `dev`, `deploy` + `plugins`, `presets`, `config`)
2. มี CLI จริง → ดึง command surface ตาม `/learn-from-cli` แล้ว map เข้า `Command` type
3. scope ไม่ชัด (จำนวน commands, sections, theme) → ทำ `/ask-me`

### 2. Scaffold Project

> Goal: SolidJS app พร้อมใน temp

1. ทำ `/create-files-in-os-temp` — สร้าง `<temp>/cli-prototype-<name>/`
2. Scaffold ตาม `/follow-solid-framework`: `bun create vite` (template `solid-ts`) → `bun add -d unocss` + config ตาม `/follow-lib-unocss`
3. สร้าง `src/` tree ตาม component architecture ใน `references/spec.md` — `data/` (typed schema), `lib/` (builder/parser/markdown-generator/search), `components/`, `routes/`

### 3. Implement Dual Modes

> Goal: human + agent experiences จาก schema เดียว

1. `data/commands.ts` = typed `Command[]` (name, description, usage, arguments, options, examples, exitCodes, relatedCommands) — single source ทุก UI derive จากที่นี่
2. Human Mode: `CommandSyntax` (tokenized, hover/click token → inspector), `CommandBuilder` (toggle options/args → live command string), `CommandInspector`, `ExampleTerminal`, `StickyCommandBar` — ใช้ `createSignal`/`createMemo`/`createStore` ตาม `/follow-lib-solidjs`
3. Agent Mode: `AgentMarkdown` + `MarkdownToolbar` — generate markdown จาก schema ผ่าน `lib/markdown-generator.ts` programmatically (ห้าม hand-write) + Raw (JSON) + Copy
4. `ModeSwitcher` สลับ `?mode=human|agent`; builder state serialize เข้า query params (`?preset=production&port=8080`) — shareable
5. Routing: `/commands/<name>`, `/plugins`, `/plugins/<name>`, `/presets`, `/presets/<name>`, `/config` — parse `location.pathname` + query ด้วย `lib/` router เบาๆ หรือ `@solidjs/router`

### 4. Apply UX Quality Bar

> Goal: ครบตาม spec — responsive, a11y, microinteractions, error states

1. Responsive: desktop `Sidebar | Docs | Inspector`, tablet `Sidebar | Docs`, mobile `Header + Command + Docs + BottomNav` — ทุก hover interaction ต้องมี click/tap equivalent
2. Accessibility: semantic HTML, keyboard nav, focus states, ARIA, accessible dialogs/tooltips, reduced motion, contrast — focus ring ผ่าน UnoCSS shortcuts
3. UnoCSS: reusable shortcuts (`surface`, `code-surface`, `command-token`, `option-token`, `muted-text`, `interactive`, `focus-ring` ฯลฯ) + variants (`hover:`, `focus:`, `disabled:`, `group-hover:`, `dark:`, `sm:`–`xl:`) — ห้ามกระจาย arbitrary styles
4. Microinteractions + error states ตาม `references/spec.md` — fast, subtle, purposeful

### 5. Run And Open

> Goal: user เห็น prototype ทำงานจริง

1. `bun install` → `bun run dev` background ตาม `/follow-tool-vite` (หรือ `bun run build` + `bun run preview` เพื่อ SPA fallback ของ deep routes)
2. ทำ `/check-open-ports` ถ้า port ชน → เปลี่ยน port
3. ทำ `/open-web` เปิด URL — verify console ไม่มี error, ทุก route เข้าได้, `?mode=agent` render markdown ถูกต้อง
4. ทำ `/report` สรุป temp path, URL, commands/routes ที่ครอบคลุม; user ขอแก้ → แก้ใน temp เดิมแล้ว refresh

## Rules

- Prototype เขียนลง OS temp เท่านั้น — ห้ามเขียนลง project (ยกเว้น user สั่ง)
- Typed `Command` schema = single source of truth — Human/Agent mode derive จาก schema เดียวกัน ห้าม hardcode docs แยก
- Markdown สำหรับ Agent Mode ต้อง generate programmatically เสมอ
- ทุก hover interaction ต้องมี click/tap equivalent — ห้าม rely on hover เพียงอย่างเดียว
- UnoCSS เป็น primary styling — reusable shortcuts กลาง ไม่ scatter arbitrary values
- Animations ต้อง fast + subtle — ห้ามเสีย performance เพื่อ visual effects
- ใช้ `/follow-solid-framework`, `/follow-lib-unocss`, `/follow-lib-solidjs` conventions เสมอ
- ใช้ `/create-files-in-os-temp`, `/open-web`, `/check-open-ports` เสมอ; ใช้ `/ask-me` ถ้าจำเป็น

## Expected Outcome

- CLI explorer prototype รันบน localhost เปิดใน browser — ทุก route/mode ใช้งานจริง
- Human Mode: explore syntax, build command, inspect options, ดู examples ใน terminal ได้ครบ
- Agent Mode: markdown/raw output deterministic จาก schema + copy ได้
- ไม่มี prototype files ปนใน project source
