---
name: follow-unocss-theme
description: UnoCSS theme — theme.css tokens → uno.config.ts map → UI uses theme utilities only → biome plugin + lint
related:
  - follow-lib-unocss
  - follow-design-system
  - improve-uxui
  - follow-create-biome-plugin
  - run-lint
---

## Goal

จัดการ UnoCSS theme แบบ end-to-end — `theme.css` เป็น single source of truth ของ design tokens → `uno.config.ts` map token ตาม `theme.css` (nested `DEFAULT`/`hover`/`active`/`foreground`) → ทุก UI ใช้ theme utility จาก `uno.config.ts` theme ตรง ๆ (ไม่มี `dark:` variant, ไม่มี palette hardcode, ไม่มี shortcut layer) → enforce ด้วย Biome plugin + theme lint script

## Scope

ใช้ทุก theme task ใน UnoCSS project (v66+/`presetWind4`) — first-time token layer, เพิ่ม/ปรับ tokens, dark mode, และ enforce ว่า UI ใช้ theme tokens เสมอ — workflow เดียว branch ตาม state (`theme.css` มีอยู่หรือไม่); setup UnoCSS ครั้งแรก → `/follow-lib-unocss` ก่อน

## Execute

### 1. Prerequisite And Detect State

> Goal: UnoCSS พร้อมและรู้ว่าต้อง create, modify หรือ lint

1. ต้องมี `uno.config.*` กับ `presetWind4()` — ไม่มี → ทำ `/follow-lib-unocss` ให้เสร็จก่อน
2. ระบุ CSS entry point และ linter ของ project (`biome.jsonc` → Biome path; `eslint.config.*` → ESLint path)
3. มี `theme.css`/CSS variables + `theme.colors` map อยู่แล้ว → `### 4. Modify Path`; ไม่มี → `### 2-3. Create Path`; argument `lint` → `### 6. Lint`

### 2. Create Path — Token Structure

> Goal: token model ชัดเจนก่อนเขียน CSS

1. ใช้ semantic tokens เท่านั้น — component ใช้ `bg-primary`/`text-muted-foreground` ไม่ใช่ `bg-blue-500`
2. ทุก surface token มี sub-keys ครบตามบทบาท: `DEFAULT`, `hover`, `active`, `foreground` — ขาด `foreground` = contrast พังใน dark mode
3. ตั้งชื่อเต็ม ห้ามตัวย่อ (`--color-background` ไม่ใช่ `--bg`; `--color-muted-foreground` ไม่ใช่ `--mut`) — อ่านรู้เรื่องและ grep ได้
4. ค่าเก็บเป็น **channel components** (`--color-primary: 221 83% 53%`) แล้ว config ห่อด้วย `hsl(var(--color-primary))` → ใช้ `bg-primary/50` (opacity modifier) ได้
5. Non-color tokens: `--radius-*`, `--shadow-*`, `--font-*` — map เข้า theme keys `fontFamily`/`radius`/`shadow`; อย่างอื่น (maxWidth, minHeight, fontSize, zIndex, gridTemplateColumns) ใส่ตรงใน `theme` ได้
6. Token set มาตรฐาน + ตัวอย่างเต็มใน `references/tokens.md` — surface set: `background`, `foreground`, `surface{DEFAULT,elevated,foreground}`, `muted{DEFAULT,foreground}`, `border{DEFAULT,hover}`, `accent{DEFAULT,hover,foreground}`, `primary`, `secondary`, `success`, `warning`, `destructive`, `focus`, `overlay`, `skeleton{DEFAULT,shine}`

### 3. Create Path — theme.css And Config Map

> Goal: `theme.css` เป็น source of truth + `uno.config.ts` map ครบ

1. สร้าง `theme.css` — light + dark + media fallback (template ใน `references/tokens.md`)
   - ไม่ต้องใส่ reset: `presetWind4({ preflights: { reset: true } })` (default) ให้ `*{box-sizing}`, `body{margin:0}` และ element normalize มาแล้ว — ใส่ซ้ำ = CSS ซ้ำซ้อน
   - เก็บเฉพาะ tokens, `@font-face`, keyframes, typography scale, link/form-control look
2. `uno.config.ts` — presets/transformers/theme ตามตัวอย่างใน `references/tokens.md`: `presetWind4({ dark: 'class' })`, `presetIcons({ scale, extraProperties })`, `presetTypography()`, `transformerDirectives()`, `transformerVariantGroup()`
3. ตั้ง `content.filesystem` เมื่อ class/icon ถูกประกอบแบบ dynamic — ใช้ `globSync` จาก `node:fs`:

   ```ts
   import { globSync } from "node:fs"
   const sources = globSync("./src/**/*.{tsx,ts}", { cwd: import.meta.dirname })
   export default defineConfig({ content: { filesystem: sources } })
   ```

4. import `theme.css` ตาม framework: Vite `main.ts`/root route, Next.js `app/layout.tsx`, Nuxt `nuxt.config` css array, Astro layout

### 4. Modify Path — Update Existing Theme

> Goal: ปรับ theme ที่มีอยู่โดยไม่ clobber

1. อ่าน `uno.config.*` เดิม — merge `theme`/`rules`/`variants` กับของเดิม ห้าม overwrite ทั้งไฟล์
2. ใช้ wind4 theme keys: `font`, `radius`, `shadow`, `breakpoint`, `ease`, `spacing`, `colors` (+ `fontFamily`/`maxWidth`/`zIndex`/`animation` ได้); หลีกเลี่ยงชื่อ wind3 ที่ถูก rename
3. Token ใหม่ต้องเพิ่มทั้ง light และ dark block พร้อมกัน + map ใน `theme.colors`
4. UI ใช้ **theme utility ตรง ๆ** — `bg-surface`, `text-muted-foreground`, `border-border`, `rounded-md`, `shadow-lg`, `ring-focus/40`, `bg-primary-hover` … ไม่มี shortcut layer ใน config
   - ค่าที่เป็น layout/ขนาดให้ใช้ utility ปกติของ wind4 (`p-6`, `gap-3`, `max-w-content`)
   - สี/spacing ที่ซ้ำบ่อยให้ **เพิ่ม token** ใน `theme` ไม่ใช่สร้าง shortcut
5. `rules`/`variants` เป็น last resort เท่านั้น — ใช้ theme ก่อน

### 5. Dark Mode

> Goal: dark mode ทำงานผ่าน CSS variables — UI ไม่ต้องมี `dark:` variant

1. Dark mode switch ที่ CSS variable layer (`theme.css`) ไม่ใช่ utility layer — เลือก selector: `.dark` class (คู่กับ `presetWind4({ dark: 'class' })`), `[data-theme="dark"]`, หรือ `prefers-color-scheme`
2. ถ้าใช้ `dark: 'class'` → toggle `.dark` บน `<html>`; ถ้าใช้ `[data-theme]` → set attribute บน `:root` — **อย่าตั้ง `dark: 'media'` พร้อม `.dark` selector** (selector จะไม่ถูก apply)
3. เพราะ tokens เปลี่ยนค่าเอง → **UI ห้ามเขียน `dark:` variant กับ theme colors**; `dark:` ใช้ได้เฉพาะ non-theme edge case (เช่น media asset)
4. Toggle/persist/FOUC guard — inline script ก่อน CSS, `localStorage`, แล้ว set class/attribute; snippets ใน `references/tokens.md`

### 6. Lint — Enforce Theme Usage

> Goal: ทุก UI ใช้ theme tokens ตรงกับ `uno.config.ts` — deterministic + linter

1. รัน theme lint preset (รันเสมอเมื่อมี theme layer):

   ```bash
   bun "<skills>/follow-unocss-theme/scripts/theme-lint.ts" <project-root>
   ```

   `--json` สำหรับ report/CI — exit `1` เมื่อมี Critical/High; checks: token parity (light↔dark), config-map orphans/missing, foreground pairs, palette hardcode, `dark:` redundant, undefined tokens, dark wiring
2. ตั้ง linter enforcement:
   - **Biome** → `.grit` plugin ตาม `references/biome-plugin.md` (ห้าม `dark:` + palette classes) และ restrict scope ด้วย `overrides` ใน `biome.jsonc`
   - **ESLint** → `@unocss/eslint-plugin` flat config (`unocss.configs.flat`) ได้ `unocss/order` autofix + `unocss/blocklist`
3. Class checks เสริม: dynamic class template literals ต้องเป็น full class name ที่ scanner มองเห็น; conflicting utilities (`p-2 p-4`); `content.filesystem` ครอบ extensions จริง; class ที่ไม่มี CSS เลย → `scripts/check-dead-classes.ts`

### 7. Verify And Fix

> Goal: theme ครบ ทุก UI ผ่าน lint ไม่มี regression

1. รัน `/run-dev` ทดสอบ `bg-background`/`bg-surface`/`text-foreground`/`border-border` — utilities generate ใน output
2. Toggle dark → ทุก color เปลี่ยนตาม dark block โดยไม่มี `dark:` class; reload ไม่มี FOUC
3. Contrast — `*-foreground` บน base ผ่าน WCAG AA ทั้งสอง mode
4. Radius consistency — ค่า `rounded-[Npx]` ควร snap เข้า theme scale (`scripts/normalize-radius.ts`)
5. Icon/asset ที่ประกอบชื่อแบบ dynamic ต้องทำให้ scanner เห็น (เขียน full class `i-mdi:x` ในที่ที่ประกาศชื่อ) แล้ว verify ว่า CSS ถูก generate
6. ทำ `/run-lint` — theme lint + biome/eslint plugin ผ่าน; ถ้าพัง → `/resolve-errors` max 3 รอบแล้ว stop report
7. Theme findings → `/apply` mode `validate`; palette hardcode → map เข้า semantic token ที่ตรง intent เท่านั้น ห้ามเปลี่ยนสีเอง
8. ทำ `/report` table: `No. | Area | Check | Findings | Status`

## Rules

- `theme.css` เป็น single source of truth — ห้าม hardcode ค่าสีใน `uno.config.ts` (map ผ่าน `hsl(var(--*))` / `var(--*)` เท่านั้น) และห้าม hardcode ใน UI
- ชื่อ token ต้องตรงกันระหว่าง `theme.css` และ `uno.config.ts` ทุกตัว; ใช้ชื่อเต็ม ห้ามตัวย่อ
- **ห้ามเขียนซ้ำกับ UnoCSS reset** — `presetWind4` preflights จัดการ `*{box-sizing}`, `body{margin:0}` และ normalize ของ `button`/`input`/`select`/`textarea` แล้ว
- UI ใช้ **theme utility** จาก `uno.config.ts` theme เท่านั้น — ห้าม palette classes (`bg-blue-500`, `text-gray-600`) ยกเว้น `black`/`white`/`transparent`; ไม่มี shortcut layer
- **ห้าม `dark:` variant ใน UI** — tokens สลับผ่าน CSS variables อยู่แล้ว
- tokens ทั้ง light และ dark block ต้องครบชุดเดียวกัน (ยกเว้น non-color tokens ที่ไม่เปลี่ยน)
- ทุก surface token ต้องมี `*-foreground` pair
- ชื่อ class/icon ที่ประกอบจากตัวแปรต้องเป็น full name ที่ UnoCSS scanner มองเห็น — ห้ามพึ่ง safelist ที่ hand-maintain
- Biome plugin ต้อง restrict scope ด้วย `overrides.includes` ตามไฟล์ UI จริง — ห้ามรันบน generated files/config
- รัน `scripts/theme-lint.ts` ก่อนเสมอ — deterministic ไม่ต้องเดา; ใช้ linter ที่ project มีอยู่ ห้ามติดตั้ง ESLint ถ้า project ใช้ Biome
- ใช้ /follow-lib-unocss ถ้าจำเป็น
- ใช้ /follow-lib-css ถ้าจำเป็น
- ใช้ /run-lint ถ้าจำเป็น

## Expected Outcome

- `theme.css` มี semantic tokens ชื่อเต็ม ครบทั้ง light และ dark พร้อม foreground pairs เป็น single source of truth (ไม่มี reset ซ้ำ)
- `uno.config.ts` map `theme.colors`/non-color keys ตรงกับ `theme.css` ทุก token ด้วย `hsl(var(--*))`/`var(--*)` + `content.filesystem` จาก `globSync`
- UI ใช้ theme utility จาก `uno.config.ts` theme โดยตรง — ไม่มี palette hardcode, ไม่มี `dark:` variant, ไม่มี shortcut layer
- ชื่อ class/icon ทุกตัวที่ประกอบแบบ dynamic ปรากฏเป็น full name ใน source → scanner generate CSS ให้ครบ
- Biome plugin (scoped ด้วย `overrides`) หรือ ESLint plugin enforce rules ใน linter ของ project
- `theme-lint.ts` + `/run-lint` ผ่าน — token parity, pairs, wiring, undefined tokens ครบ
- Dark mode toggle ทำงาน + persist + ไม่มี FOUC; radius ใช้ theme scale สม่ำเสมอ
