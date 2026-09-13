---
name: follow-lib-dompurify
description: ใช้ dompurify/isomorphic-dompurify sanitize HTML กัน XSS ทุก environment
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
  - follow-lib-zod
  - follow-lib-arktype
---

## Goal

ใช้ dompurify/isomorphic-dompurify sanitize HTML กัน XSS ทุก environment

## Scope

ใช้เมื่อ task ต้อง render HTML จาก user input, CMS, markdown หรือ untrusted source — setup, config, SSR, debugging, หรือ best practices

ขอบเขต:
- ใช้ skill นี้สำหรับ sanitize HTML string ที่จะ inject เข้า DOM (innerHTML, `dangerouslySetInnerHTML`, Solid `innerHTML`, markdown output)
- ไม่ใช่ input validation ทั่วไป — ถ้า validate form/API data ใช้ `/follow-lib-zod` หรือ `/follow-lib-arktype`
- ไม่ใช่ output encoding สำหรับ URL/text node — text ธรรมดาไม่ต้อง sanitize (framework escape ให้แล้ว)

- Latest: `dompurify@3.4.15` (verified 2026-09-13)
- References: [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md) | [manifest](references/package-manifest.md)

## Execute

### 1. Install

> Goal: ติดตั้ง package ตาม environment

1. รัน `bun add dompurify` (runtime dependency)
2. v3 ship built-in TypeScript types (`dist/purify.cjs.d.ts`) — ไม่ต้องติดตั้ง `@types/dompurify` (ใช้เฉพาะ v2)
3. SSR/Node: ติดตั้ง `bun add isomorphic-dompurify` (wrapper บน jsdom) หรือ `bun add -D jsdom` แล้วสร้าง instance เอง
4. Worker runtimes (workerd/Cloudflare Workers): jsdom ไม่ทำงาน — ใช้ browser-side sanitize หรือ Trusted Types path

### 2. Sanitize At Render Boundary

> Goal: sanitize ก่อน inject HTML เข้า DOM เสมอ

1. Browser: `import DOMPurify from 'dompurify'` แล้ว `DOMPurify.sanitize(dirty)`
2. Inject ผ่าน `el.innerHTML = clean` / `dangerouslySetInnerHTML={{ __html: clean }}` — ผ่าน sanitize เสมอ
3. Node/Bun ด้วย jsdom:

```ts
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const purify = DOMPurify(new JSDOM('').window);
const clean = purify.sanitize(dirty);
```

4. หรือใช้ `import { sanitize } from 'isomorphic-dompurify'` สำหรับ isomorphic code
5. sanitize ที่ boundary เดียว (ก่อน render/store) — ไม่กระจายหลายจุด

### 3. Configure Allowlist

> Goal: จำกัด tags/attrs ตาม feature ที่ต้องการ

1. Default profile ปลอดภัยพอสำหรับ rich text ทั่วไป — ไม่ต้อง config ก็ block script/event handlers
2. กำหนด whitelist ชัดเจนถ้ารับเฉพาะ subset: `sanitize(dirty, { ALLOWED_TAGS: ['b','i','em','strong','a'], ALLOWED_ATTR: ['href'] })`
3. ใช้ `USE_PROFILES: { html: true }` / `{ svg: true }` / `{ mathMl: true }` สำหรับ predefined profiles
4. ใช้ `FORBID_TAGS`/`FORBID_ATTR` สำหรับ blacklist บนพื้นฐาน default profile
5. คืน DOM node ด้วย `RETURN_DOM` / `RETURN_DOM_FRAGMENT` เมื่อไม่ต้องการ string
6. ใช้ `RETURN_TRUSTED_TYPE: true` ถ้า app บังคับ Trusted Types CSP
7. `DOMPurify.setConfig(cfg)` สำหรับ persistent config; `DOMPurify.isSupported` เช็ค DOM support ก่อนใช้

### 4. Use Hooks For Post-Processing

> Goal: เพิ่ม attr/target ผ่าน hooks โดยไม่ลดความปลอดภัย

1. `DOMPurify.addHook('afterSanitizeAttributes', (node) => { ... })` — เช่น บังคับ `target="_blank"` + `rel="noopener"` บน links
2. `DOMPurify.removeHook(name)` / `removeAllHooks()` เพื่อ cleanup — ระวัง hook เป็น global state

### 5. Test And Verify

> Goal: พิสูจน์ว่า XSS payloads ถูกกรอง

1. เทสด้วย payloads พื้นฐาน: `<script>`, `<img onerror=...>`, `javascript:` URLs, `<svg onload=...>`, mutation XSS (mXSS) patterns
2. ทำ `/run-verify` สำหรับ lint, typecheck
3. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
4. ตรวจ official docs ล่าสุดก่อนใช้ config ที่ไม่แน่ใจ — https://github.com/cure53/DOMPurify#readme

## Rules

- ห้าม render raw HTML จาก user input โดยไม่ sanitize
- sanitize ที่ boundary เดียวก่อน render — ไม่กระจายหลายจุด
- ระวัง `dangerouslySetInnerHTML`/Solid `innerHTML` — ผ่าน sanitize เสมอ
- sanitize output ของ markdown renderers ด้วย (markdown ไม่ใช่ trust boundary)
- ห้ามพึ่ง regex/manual filtering แทน DOMPurify — parser-based เท่านั้น
- ใช้ /run-verify ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น

## Expected Outcome

- HTML ทุกจุดที่มาจาก untrusted source ผ่าน `DOMPurify.sanitize()` ก่อน render
- Config/allowlist ตรง feature ที่ใช้ — ไม่ over-permissive
- SSR/worker environment ใช้วิธีที่ถูกต้อง (jsdom หรือ isomorphic-dompurify)
- Lint, typecheck, tests ผ่าน
