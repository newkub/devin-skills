# JSPM Programmatic API

> JSPM CLI ถูก build บน `@jspm/generator` — package ที่ใช้ generate และจัดการ `import maps` แบบ programmatic

## Install

```bash
npm install @jspm/generator
```

## Basic Usage

```ts
import { Generator } from "@jspm/generator";

const generator = new Generator({
  mapUrl: import.meta.url,
  defaultProvider: "jspm.io", // 'jspm.io' | 'esm.sh' | 'jsdelivr' | 'unpkg' | 'nodemodules'
  env: ["production", "browser"],
});

// เพิ่ม package เข้า map
await generator.install("lit@3");

// link โมดูลภายใน project
await generator.link("./src/app.js");

// ดึง import map เป็น JSON
const map = generator.getMap();

// inject เข้า HTML โดยตรง
const html = await generator.htmlInject(`<script type="module">import "lit"</script>`);
```

## Key APIs

| API | Description |
|-----|-------------|
| `new Generator(options)` | สร้าง generator พร้อม `defaultProvider`, `env`, `mapUrl`, `inputMap` |
| `generator.install(pkg)` | resolve package แล้วเพิ่มเข้า map |
| `generator.link(specifier)` | link local module เข้า map |
| `generator.update(pkgs?)` | อัปเดต resolutions ตาม semver ranges |
| `generator.getMap()` | คืน import map เป็น object |
| `generator.htmlInject(html, opts)` | inject `<script type="importmap">` และ `modulepreload` เข้า HTML |
| `generator.traceInstall()` | trace static imports จาก entry แล้ว pin ทั้งหมด |

## Options สำคัญ

- `integrity: true` — คำนวณ SRI hashes ให้ทุก module
- `preload: true` — เพิ่ม `<link rel="modulepreload">` ใน `htmlInject`
- `flattenScopes` / `combineSubpaths` — optimize map สำหรับ production (เทียบเท่า `--release`)
- `resolutions` — pin versions แบบ per-package

ดูรายละเอียดเพิ่มเติมที่: https://jspm.org/docs/api และ https://github.com/jspm/generator
