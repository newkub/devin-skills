---
name: follow-edgejs
description: ใช้งาน Edge.js template engine สำหรับ Node.js ตาม official best practices
related:
  - follow-lang-nodejs
  - follow-lang-typescript
  - follow-tool-vite
  - follow-create-devin-plugins
  - ask-me
  - deep-validate
  - ship
---

## Goal

ตั้งค่าและใช้งาน Edge.js template engine สำหรับ Node.js ด้วย syntax ทีใกล้ JavaScript, components, slots, partials, และ state management ตาม official documentation

## Scope

ใช้สำหรับโปรเจกต์ Node.js/Bun ทีต้องการ backend template engine แบบ ESM-only โดยไม่ต้อง build step รองรับทัง standalone และใน AdonisJS

- ติดตั้ง `edge.js` ผ่าน `bun` หรือ `npm`
- สร้าง `Edge` instance, mount disks, และ enable cache
- เขียน template ด้วย `.edge` syntax
- ใช้ conditionals, loops, partials, components, slots, และ layouts
- จัดการ template state: globals, locals, rendering data, inline variables
- ขยายความสามารถด้วย plugins และ custom tags เมื่อจำเป็น

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อนเริ่ม

1. ยืนยันว่ามี `package.json` และ project ใช้ ESM (`"type": "module"` หรือไฟล์ `.mjs`)
2. ยืนยันว่ามี Bun หรือ Node.js เวอร์ชันล่าสุดรองรับ ESM
3. ตรวจสอบ version ของ `edge.js` ใน `package.json` หรือ `npm view edge.js version`
4. ถ้าไม่มี project → stop และ `/ask-me` เพื่อสร้างก่อน

### 2. Install Edge.js

> Goal: ติดตั้ง `edge.js` ใน project

1. รัน `bun add edge.js` (ถ้า project ใช้ npm เป็นหลัก ให้ใช้ `npm i edge.js`)
2. ตรวจสอบว่า `edge.js` อยู่ใน `dependencies` ของ `package.json`
3. ถ้าใช้ TypeScript ให้ตรวจสอบว่า `tsconfig.json` รองรับ ESM (`module: "NodeNext"` หรือ `"ESNext"`)
4. อย่า hardcode credentials หรือ secrets ใน template หรือ config

### 3. Configure Edge Instance

> Goal: สร้างและกำหนดค่า Edge instance

1. สร้าง `edge.ts` หรือ `edge.js` สำหรับ singleton instance
2. ใช้ `Edge.create()` และ `edge.mount(new URL('./views', import.meta.url))`
3. เปิด cache ใน production เพื่อหลีกเลี่ยง re-compile ซ้ำ

```ts
import { Edge } from 'edge.js'

export const edge = Edge.create({
  cache: process.env.NODE_ENV === 'production'
})

edge.mount(new URL('./views', import.meta.url))
```

4. ถ้ามีหลาย disk/theme ให้ใช้ `edge.mount('diskName', new URL('path', import.meta.url))` และ render ด้วย `diskName::template`
5. ระวัง keywords สงวน `template`, `$context`, `state`, `$filename` ไม่ใช้เป็นชื่อ state

### 4. Write Templates

> Goal: เขียนไฟล์ `.edge` ตาม syntax

1. สร้างไฟล์ `.edge` ใน `views/` หรือ `templates/`
2. ใช้ `{{ expression }}` สำหรับ interpolation โดย expression เป็น JavaScript ใดก็ได้
3. ใช้ `@if(condition)`, `@elseif`, `@else`, `@end` สำหรับ conditionals
4. ใช้ `@each(item in items)` หรือ `@each((item, index) in items)` สำหรับ loops
5. ใช้ `@include('partial')` สำหรับ partials และ `@includeIf(condition, 'partial')` สำหรับ conditional include
6. ใช้ `{{-- comment --}}` สำหรับ comments
7. ดูรายละเอียด syntax ใน `references/syntax.md`

### 5. Use Components and Layouts

> Goal: สร้าง UI แบบ reusable ด้วย components และ slots

1. สร้าง components ใน `views/components/<name>.edge`
2. ใช้ `@component('components/button', { props })` หรือ `@!component('components/button', { props })` สำหรับ auto-close
3. ใช้ `@<componentTag>()` เมื่อ component อยู่ใน `components/` directory
4. ใช้ `$props` สำหรับจัดการ props และ `$slots.main()` สำหรับ slots
5. สร้าง layouts ด้วย `@layout.app({ title: '...' })` และ `@slot('main')` / `@endslot`
6. ดูตัวอย่าง components และ slots ใน `references/components.md`

### 6. Manage Template State

> Goal: ส่งข้อมูลให้ templates อย่างถูกต้อง

1. ใช้ `edge.global(name, value)` สำหรับ state ที่แชร์ทุก template
2. ใช้ `edge.createRenderer().share({ ... })` สำหรับ locals ที่ isolated ต่อ request
3. ใช้ `await edge.render('view', data)` สำหรับ render data ที่ไม่แชร์กับ components
4. ใช้ `@let(name = value)` และ `@assign(name = newValue)` สำหรับ inline variables
5. ดูรายละเอียด state layers ใน `references/state.md`

### 7. Render and Integrate

> Goal: render templates ใน runtime

1. ใช้ `await edge.render('home', data)` สำหรับ render จาก disk
2. ใช้ `await edge.renderRaw(templateString, data)` สำหรับ in-memory template
3. ใช้ `renderSync` / `renderRawSync` ถ้าต้องการ synchronous แต่แนะนำให้ใช้ async
4. ผสานกับ HTTP server ด้วยการส่ง `html` string กลับ client

```ts
import { createServer } from 'node:http'
import { edge } from './edge.js'

const server = createServer(async (req, res) => {
  const html = await edge.render('home', { username: 'virk' })
  res.setHeader('content-type', 'text/html')
  res.end(html)
})

server.listen(3000)
```

### 8. Extend Edge

> Goal: ขยายความสามารถด้วย plugins และ custom tags

1. ใช้ `edge.use(plugin)` สำหรับ plugin เช่น `edge-iconify` สำหรับ SVG icons
2. ติดตั้ง `edge-iconify` และ `@iconify-json/<set>` ถ้าใช้ icons
3. ใช้ `edge.registerTag(tagContract)` สำหรับ custom tags เฉพาะทาง
4. ดูรายละเอียด custom tags ใน official documentation

### 9. Validate and Ship

> Goal: ตรวจสอบความถูกต้องก่อนส่งมอบ

1. รัน `bun run typecheck` หรือ `tsc --noEmit` ถ้าใช้ TypeScript
2. รัน `bun test` หรือ test suite ที่มี
3. ตรวจสอบว่าไม่มี reserved keywords ถูก override
4. ทำ `/deep-validate` แล้ว `/ship`

## Rules

### 1. ESM Only

- `edge.js` เป็น ESM-only package ต้องใช้ `import` ไม่ใช้ `require`
- ตั้งค่า `package.json` ให้มี `"type": "module"` หรือใช้นามสกุล `.mjs`

### 2. Template Files

- ใช้นามสกุล `.edge` สำหรับ template files
- เก็บ template ใน `views/` หรือ `templates/` ตาม convention ของ project
- ใช้ `edge.mount()` เพื่อ register disk ก่อน render

### 3. Security

- output ของ `{{ }}` ถูก HTML-escape โดย default ป้องกัน XSS
- ใช้ `{{{ }}` หรือ `html.safe()` เฉพาะกับ content ที่ trusted
- ไม่ใส่ secrets, credentials, หรือ hardcoded API keys ใน template

### 4. Syntax Discipline

- Edge tags (`@if`, `@each`, `@component`, ฯลฯ) ต้องอยู่บน line ของตัวเอง
- ใช้ `~` ต่อท้าย tag เมื่อต้องการ swallow newline
- ใช้ `!` นำหน้า tag name สำหรับ auto-close block tags เช่น `@!component(...)`
- comments ใช้ `{{-- ... --}}`

### 5. Performance

- enable cache ใน production ด้วย `cache: process.env.NODE_ENV === 'production'`
- หลีกเลี่ยงการ re-render template เดิมหลายครั้งใน loop
- ใช้ `render` async เป็นหลัก

### 6. State Management

- ไม่ใช้ชื่อ `template`, `$context`, `state`, `$filename` เป็น template state
- แยกระหว่าง globals, locals, rendering data, และ inline variables ตาม scope ที่ถูกต้อง

### 7. Package Manager

- default ใช้ `bun add` สำหรับ JS/TS projects
- ถ้า project ใช้ package manager อื่น ให้ใช้ตาม ecosystem (`npm i`, `pnpm add`, `yarn add`)

## Expected Outcome

- `edge.js` ติดตั้งและกำหนดค่าถูกต้องด้วย ESM
- `Edge` instance mount disk ได้และ enable cache ใน production
- Templates ใช้งานได้ทัง interpolation, conditionals, loops, partials, components, slots
- Template state ถูกจัดการตาม globals, locals, rendering data, inline variables
- Production มี cache เปิดใช้งาน
- Typecheck และ tests ผ่าน
