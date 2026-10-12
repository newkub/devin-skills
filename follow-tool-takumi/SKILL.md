---
name: follow-tool-takumi
description: ใช้ Takumi render OG images, social cards และ PDFs จาก JSX/CSS โดยไม่ต้อง browser
argument-hint: "[scope]"
related:
  - improve-seo
  - follow-create-web-nextjs
  - follow-create-web-nuxt
  - follow-tool-vite
  - use-agent-browser
---

## Goal

ใช้ Takumi (`takumi-js`) สร้าง Open Graph images, social cards, SVG, animations และ PDFs จาก JSX, HTML, CSS หรือ Tailwind โดยไม่ต้อง headless browser

## Scope

ใช้สำหรับ JS/TS projects ที่ต้อง generate images แบบ programmatic — OG images, social cards, banners, charts, PDFs — บน Node.js, Bun, Cloudflare Workers, Vercel Edge, Deno หรือ browser

- Boundary: render JSX/HTML → image bytes (PNG, JPEG, WebP, SVG) หรือ PDF; ไม่ใช่ browser screenshot tool — ถ้าต้อง capture หน้าเว็บจริง → `/use-agent-browser` หรือ `/capture`
- `takumi-js` bundle ทั้ง native (`@takumi-rs/core` บน Node.js) และ WASM (`@takumi-rs/wasm` บน Workers/Edge/browser) — runtime เลือกเอง
- ใช้ใน `/improve-seo` เมื่อ finding เกี่ยวกับ `og:image`, `twitter:image`, social cards
- Latest: `takumi-js@2.14.0` (verified 2026-10-03)

## Execute

### 1. Install

> Goal: ติดตั้ง takumi-js

1. ติดตั้ง `bun add takumi-js`
2. ไม่ต้องแยก native/wasm — `takumi-js` เลือก binding ที่ถูกตาม runtime เอง
3. Rust projects ใช้ `takumi` crate แทนได้

### 2. Render First Image

> Goal: render JSX → image bytes

1. ใช้ `render` จาก `takumi-js` — รับ JSX + `{ width, height }` คืน image bytes
2. ใช้ `tw="..."` สำหรับ Tailwind classes หรือ `style={{}}` สำหรับ inline CSS
3. Font built-in มีแค่ Geist (Latin, weights 300–800) — scripts อื่นต้องโหลดผ่าน `fonts` option
4. ดู signatures ทั้งหมดใน [API reference](references/apis.md)

### 3. Serve Over HTTP

> Goal: คืน image เป็น HTTP response

1. ใช้ `ImageResponse` จาก `takumi-js/response` — extends web `Response`, API เหมือน `next/og`
2. ใช้ใน route handlers ของ framework ได้ทุกตัวที่รองรับ `Request`/`Response`
3. Integrations มี docs เฉพาะ: Next.js, Nuxt (ผ่าน Nuxt OG Image), SvelteKit, TanStack Start, Nitro, Astro, Fumapress

### 4. Load Fonts And Assets

> Goal: text ถูกต้องทุกภาษาและมี assets ครบ

1. ใช้ `googleFonts` จาก `takumi-js/helpers` โหลด Google Fonts — รองรับ weight range และ variable axes
2. `fonts` รับ raw bytes, descriptor หรือ URL string
3. Render หลายภาพ → register fonts ครั้งเดียวบน `Renderer` แล้ว reuse
4. Images/emoji โหลดตาม [docs](https://takumi.kane.tw/docs/load-images)

### 5. Advanced Output

> Goal: ใช้ output formats อื่นเมื่อจำเป็น

1. `renderSvg()` คืน SVG แทน encoded bytes
2. Keyframe animations → WebP, APNG, GIF (CSS `@keyframes`, Tailwind `animate-*`)
3. PDF generation สำหรับ invoices/reports — ดู docs `/docs/pdf`
4. `measure()` API วัด layout ก่อน render

## Rules

### 1. No Browser

- Takumi render ไม่ผ่าน headless browser — เร็วกว่าและเบากว่า screenshot approach
- CSS ที่รองรับ: grid, flexbox, gradients, custom fonts, keyframes — ดู support matrix ใน docs

### 2. Fonts

- ไม่อ่าน system fonts เลย — ทุก font ต้องผ่าน `fonts` option หรือ built-in Geist
- ขาด font → missing glyphs; ภาษาไทย/จีน/ญี่ปุ่น/อาหรับ ต้องโหลด font เสมอ

### 3. SEO Usage

- OG image spec: `1200×630` — `twitter:card` `summary_large_image`
- ทำให้ OG generation เป็น route handler ที่ deterministic — cache output ตาม content hash
- Migrating จาก Satori → คง Flexbox styles ไว้; bare `<div>` ของ Takumi default เป็น block layout

- ใช้ /improve-seo ถ้าจำเป็น
- ใช้ /follow-create-web-nextjs ถ้าจำเป็น
- ใช้ /follow-create-web-nuxt ถ้าจำเป็น
- ใช้ /follow-tool-vite ถ้าจำเป็น

## References

- [API reference](references/apis.md)

- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- `takumi-js` ติดตั้งและ render ภาพแรกได้
- `ImageResponse` serve OG images ผ่าน route handler
- Fonts/assets โหลดถูกสำหรับทุกภาษาที่ใช้
- พร้อมใช้ใน `/improve-seo` fixes สำหรับ `og:image`/`twitter:image`
