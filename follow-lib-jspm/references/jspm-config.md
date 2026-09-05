# JSPM Configuration

> การ configure JSPM ผ่าน `package.json`, `importmap.js` และ CLI flags

## package.json

JSPM อ่าน entry points และ dependencies จาก `package.json` โดยตรง:

```json
{
  "name": "my-app",
  "type": "module",
  "exports": {
    ".": "./src/index.js",
    "./feature": "./src/feature.js"
  },
  "dependencies": {
    "lit": "^3.0.0"
  }
}
```

- `"type": "module"` — จำเป็นสำหรับ native ES modules
- `exports` — JSPM ใช้ resolve entry points และ subpaths
- `dependencies` — source of truth ของ import map

## importmap.js

`jspm install` สร้าง `importmap.js` ที่ render `<script type="importmap">` ให้ browser:

```json
{
  "imports": {
    "lit": "https://ga.jspm.io/npm:lit@3.3.0/index.js"
  },
  "scopes": {
    "https://ga.jspm.io/npm:lit@3.3.0/": {
      "@lit/reactive-element": "https://ga.jspm.io/npm:@lit/reactive-element@2.1.0/reactive-element.js"
    }
  }
}
```

- `imports` — top-level specifier mappings
- `scopes` — per-package mappings สำหรับ transitive dependencies
- `integrity` — SRI hashes เมื่อใช้ `--integrity`

## Conditional Environments

ใช้ `-C` เพื่อสลับ export conditions:

```bash
jspm install -C production    # resolve "production" condition
jspm install -C development   # resolve "development" condition
jspm install -C browser       # resolve "browser" condition
```

## CDN Providers

เลือก provider ด้วย `--provider` หรือ `defaultProvider` ใน API:

| Provider | Base | หมายเหตุ |
|----------|------|----------|
| `jspm.io` | `https://ga.jspm.io` | default, รองรับ import map optimization |
| `esm.sh` | `https://esm.sh` | build-on-demand, รองรับ TypeScript |
| `jsdelivr` | `https://cdn.jsdelivr.net` | multi-CDN fallback |
| `unpkg` | `https://unpkg.com` | direct npm files |
| `nodemodules` | `file://` local | ใช้ `node_modules` โดยตรง |

## Release Mode

`jspm install --release` เทียบเท่าการเปิด:

- `flattenScopes` — รวม scopes เข้า top-level imports เมื่อทำได้
- `combineSubpaths` — รวม subpath mappings ของ package เดียวกัน
- `-C production` — production export conditions

ดูรายละเอียดเพิ่มเติมที่: https://jspm.org/docs
