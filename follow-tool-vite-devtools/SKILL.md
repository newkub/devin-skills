---
name: follow-tool-vite-devtools
description: ตั้งค่าและสร้าง integration บน Vite DevTools (`@vitejs/devtools` + DevTools Kit) ตาม official docs
argument-hint: "[setup-or-kit-scope]"
related:
  - wrikka-vite-devtools
  - follow-tool-vite
  - follow-tool-vite-plugins
  - follow-tool-devfra
  - follow-tool-vitest
  - follow-tool-rolldown
  - follow-my-techstack
---

## Goal

เปิดใช้ Vite DevTools ในโปรเจกต์ Vite และสร้าง/พอร์ต integration เข้า dock ผ่าน DevTools Kit (`Plugin.devtools.setup`) ตาม official docs <https://devtools.vite.dev/>

## Scope

ใช้สำหรับงานที่เกี่ยวกับ devtools framework ของระบบนิเวศ Vite

- ติดตั้ง/คอนฟิก `@vitejs/devtools` ใน `vite.config.ts` (`apply`, `embeddedVisibility`, `dockPreferences`)
- กรณีไม่มี HTML entry → ใช้ client injector จาก browser entry
- Build DevTools พร้อมแอป (`build.withApp`, `build.injection`, `/__devtools/`)
- ใช้ built-in integrations — Rolldown, Vite, Vitest, Oxc
- เขียน Vite plugin ที่ mount UI เข้า dock ด้วย `devtools.setup`
- พอร์ต Devframe app เข้า hub ด้วย `createPluginFromDevframe`
- รายละเอียด option/API matrix → `references/apis.md`

## Execute

### 1. Install

> Goal: ได้เวอร์ชันที่ Vite DevTools รองรับจริง

1. อัป Vite เป็น 8.3+ — `"vite": "^8.3.0"` ใน `package.json` (ทำ `/follow-tool-vite`)
2. ติดตั้งแพ็กหลัก `bun add -D @vitejs/devtools` (docs ใช้ `pnpm add -D`; สลับ pm ตามโปรเจกต์)
3. ถ้าจะเขียน integration เอง → `bun add -D @vitejs/devtools-kit`
4. ตรวจ version จริงหลังก่อนใช้ API ใหม่ — ทั้งหมด release พร้อมกัน (ดู `### 7. Version Notes`)

### 2. Enable In Config

> Goal: เปิด dock ทั้ง dev และ build

1. ใส่ `devtools: true` ใน `defineConfig` — โหมด shorthand นี้เปิดทั้ง `vite dev` และ `vite build`
2. ถ้าเอาเฉพาะบางคำสั่ง → ใช้ form object แล้วตั้ง `apply` (`'all'` ค่า default, `'serve'`, `'build'`)
3. รัน dev server แล้วตรวจว่า dock โผล่; ถ้าไม่โผล่ → ดู `### 6. Troubleshooting`

### 3. Tune The Dock UI

> Goal: ให้ dock รบกวนหน้าน้อยที่สุดตาม teams ต้องการ

1. ตั้ง `embeddedVisibility` — `'normal'` โชว์ทันที (default), `'passive'` ซ่อนจนกด `Shift + Alt + D` แล้วจำไว้, `'hidden'` ใช้ shortcut เดียวแต่ไม่จำ
2. ตั้ง `dockPreferences.defaultMode` / `defaultPosition` สำหรับ layout เริ่มต้น (เช่น `'edge'` + `'bottom'`)
3. ค่าที่ user แก้ใน DevTools เองจะ override `dockPreferences` — อย่าตั้งค่าที่ขัดกับพฤติกรรม default

### 4. Projects Without An HTML Entry

> Goal: ได้ dock แม้ Vite ไม่ได้เสิร์ฟ HTML

1. ถ้าแอปเป็น JS-only entry / backend integration / middleware mode → import injector จาก browser entry แทน config
2. เลือก entry ตาม visibility mode เพียงตัวเดียว: `@vitejs/devtools/client/inject` (normal), `client/inject-passive` (passive), `client/inject-hidden` (hidden)
3. type declarations ของ subpath เหล่านี้ยังไม่เสร็จ — ใส่ `// @ts-expect-error` ที่ import ชั่วคราว แล้วเอาออกเมื่อ upstream มี types

### 5. Ship DevTools With The Build

> Goal: ได้ static DevTools พร้อม output ของแอป

1. ตั้ง `devtools: { apply: 'build', build: { withApp: true } }` เพื่อเขียนไฟล์ DevTools ข้าง build ของแอป (`build.outDir` override ได้ default ตาม Vite)
2. full-page UI อยู่ที่ `/__devtools/`; embed dock ในแอปที่ build แล้วด้วยการโหลด `/__devtools/embedded.js`
3. ถ้าอยากให้เห็น dock ในแอปที่ build → `build.injection: true` (default `false` และบังคับว่าต้องคู่กับ `build.withApp: true`)
4. deploy แล้วต้องเสิร์ฟ assets ใต้ Vite `base` ด้วย ไม่งั้น dock 404
5. ยืนยันด้วย `/test-website` หรือ `/use-agent-browser` ว่า route `/__devtools/` เปิดได้จริงใน build ที่ deploy

### 6. Use Built-in Integrations

> Goal: ใช้ tool ที่ ship มาแล้วแทนเขียนใหม่

1. Rolldown (`@vitejs/devtools-rolldown`) — module graph/chunk/asset/treemap/flamegraph, plugin hook cost, package duplication, session compare (ทำ `/follow-tool-rolldown`)
2. Vite (`@vitejs/devtools-vite`) — plugin inspector + module transforms ตาม pipeline order (ทำ `/follow-tool-vite`)
3. Vitest (`@vitejs/devtools-vitest`) — test UI ใน dock; เปิด dock เฉพาะเมื่อโปรเจกต์มี `vitest`, launch แล้วติดตั้ง `@vitest/ui` + รัน `vitest --ui` เป็น iframe (ทำ `/follow-tool-vitest`)
4. Oxc (`@vitejs/devtools-oxc`) — oxlint/oxfmt inspector + ESLint/Prettier/Biome migration; รัน standalone ได้ด้วย `npx @vitejs/devtools-oxc`; ถ้าตรวจเจอ Vite Plus จะรันผ่าน `vp`
5. แยก integration ที่ยังไม่มีในโปรเจกต์เป็น launcher ใน dock — กดแล้วติดตั้ง on demand แล้ว restart dev server; ตัวที่มีอยู่แล้วจะ mount อัตโนมัติ

### 7. Version Notes

> Goal: อ้างอิงข้อมูลที่ตรวจแล้ว ไม่ใช่ความจำ

- `@vitejs/devtools`, `-kit`, `-vite`, `-rolldown`, `-vitest`, `-oxc` = `0.7.6` (MIT, VoidZero Inc. & Vite Contributors; verified 2026-10-14)
- `devtools-vite` upstream ยังขึ้นว่า "work in progress" — อย่าสร้างของสำคัญพิงมัน
- reference error code เมื่อ kit/rolldown พัง: DTK00xx (Kit) และ RDDT00xx (Rolldown) ในหน้า Error Reference ของ docs
- Docs: `https://devtools.vite.dev/guide/` (Getting Started, Chrome Extension), `/kit/` (Kit), `/rolldown/`, `/vite/`, `/vitest/`, `/oxc/`, `/errors/`

## Rules

### 1. Choose The Right Layer

- เขียน Vite plugin ปกติ → ใช้ `Plugin.devtools.setup` ตรง ๆ (docks, terminals, palette, custom renderers อยู่ที่นี่)
- มี Devframe definition อยู่แล้ว → ใช้ `createPluginFromDevframe(def, { setup })` จาก `@vitejs/devtools-kit/node` แล้วได้ dock iframe จาก `id`/`name`/`icon`/`basePath` อัตโนมัติ — ไม่ต้องเขียน plugin เอง
- ต้องการ tool ที่ไม่พึ่ง Vite เลย (CLI/MCP/static dashboard) → ไป `follow-tool-devfra` ซึ่งเป็นฐานของ Kit อีกชั้น
- เรียงชั้น: Vite DevTools → `@vitejs/devtools-kit` (hub: dock, palette, terminals, `devtools.setup`) → Devframe (framework-neutral)

### 2. Config Discipline

- ตั้ง `devtools: true` แล้วทดสอบทั้ง `dev` และ `build` ก่อน merge — shorthand นี้เปิดสองทาง
- ใช้ `apply: 'serve'` สำหรับโปรเจกต์ที่ไม่ต้องการ devtools ติดไปพร้อมกับ build
- `build.injection` ใช้ได้เมื่อ `build.withApp: true` เท่านั้น; เขียน config ตามลำดับนี้ทุกครั้ง
- อย่า hardcode path `/__devtools/` ในโค้ดแอป — อ่าน `base` ของ Vite ก่อนประกอบ URL

### 3. Integration Authoring

- เพิ่ม `/// <reference types="@vitejs/devtools-kit" />` ที่ไฟล์ plugin เพื่อให้ `devtools` hook มี type
- register dock ด้วย `ctx.docks.register({ id, title, icon, type, url })` — `id` ต้อง stable เพราะ user bookmark ไว้
- เลือก dock `type` ตามงาน: `iframe` (UI ของตัวเอง), `action` (ปุ่ม trigger), `custom` (renderer), `launcher` (ติดตั้ง on demand), `json-render` (spec from data)
- ใช้ `ctx.commands.register({ id, title, handler })` สำหรับ command palette; gate ด้วย when-clause เมื่อไม่เสมอไป
- RPC ของ Kit ใช้ birpc + valibot; state ข้าม server↔client เป็น patch-synced shared state (ดู `references/apis.md`)
- ถ้า ship ขึ้น GitHub → ติด tag `vite-devtools` ตามที่ docs ขอ เพื่อให้เห็นของ ecosystem

### 4. Boundaries With Other Skills

- เรื่อง dev server/build config ทั่วไป → `/follow-tool-vite`; เรื่องเขียน plugin → `/follow-tool-vite-plugins` / `/follow-create-vite-plugin`; skill นี้ครอบเฉพาะชั้น devtools
- โปรเจกต์ที่ใช้ `wrikka-vite-devtools` (`/use-wrikka-vite-devtools`) มี devtools hub ของตัวเองบน Devframe — อย่าเปิด `@vitejs/devtools` ซ้อนจนได้ dock สองชั้นโดยไม่ตั้งใจ; ถ้าจะรวมให้ mount ผ่าน `createPluginFromDevframe` ตัวเดียว

### 5. Quality Gates

- ตรวจ schema จริงก่อนใช้ option ใด — `/check-types-definition` บน `devtools` type จาก Vite/Kit, หรือ `/follow-tool-vite` ถ้าไม่แน่
- หลังเปลี่ยน config → รัน `/run-dev` แล้ว verify dock ด้วย browser จริง ไม่ใช่ดูแค่ log
- ถ้า build/CI พังจาก devtools → `/resolve-errors`; ใช้ error code (DTK/RDDT) ค้นใน docs ก่อนเดา

- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

1. `vite.config.ts` เปิด Vite DevTools อย่างจงใจ (`apply`, visibility, dock layout) ไม่ใช่ leftover shorthand
2. โปรเจกต์ไม่มี HTML entry ยังได้ dock ผ่าน client injector ที่ถูกต้องตาม mode
3. ใช้ built-in integrations (Rolldown/Vite/Vitest/Oxc) เป็น และเลือก layer ที่ถูกเมื่อเขียน integration ใหม่
4. integration ที่เขียน/พอร์ต mount เข้า dock เดียวกับระบบ ไม่ชนกันเอง
5. ทุก claim อ้างอิง docs/npm version `0.7.6` ที่ตรวจแล้ว ไม่ใช่ memory
