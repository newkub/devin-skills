| key | value |
|---|---|
| package | `sonda` |
| install | `bun add -D sonda` |
| stable version | 0.14.0 (verified 2026-10-03) |
| license | MIT |
| docs | https://sonda.dev |
| repository | https://github.com/filipsobol/sonda |

| api | description | signature/example |
|---|---|---|
| `sonda/vite` | Vite plugin | `import Sonda from 'sonda/vite'` → `plugins: [Sonda()]` |
| `sonda/rollup` | Rollup plugin | `import Sonda from 'sonda/rollup'` |
| `sonda/rolldown` | Rolldown plugin | `import Sonda from 'sonda/rolldown'` |
| `sonda/esbuild` | esbuild plugin | `import Sonda from 'sonda/esbuild'` |
| `sonda/webpack` | webpack plugin | `import Sonda from 'sonda/webpack'` |
| `sonda/rspack` | Rspack plugin | `import Sonda from 'sonda/rspack'` |
| framework integrations | Next.js, Nuxt, Astro, SvelteKit, Angular CLI | ดู https://sonda.dev/getting-started.html |
| `enabled` | เปิด/ปิด plugin | `Sonda({ enabled: true })` (default) |
| `include` | RegExp patterns ของ assets ที่ include | `Sonda({ include: [/\.js$/] })` |
| `exclude` | RegExp patterns ของ assets ที่ exclude (ชนะ `include`; `.map`/`.d.ts` excluded เสมอ) | `Sonda({ exclude: [/\.css$/] })` |
| `format` | output format `'html'` \| `'json'` หรือ array | `Sonda({ format: ['html', 'json'] })` |
| `filename` | ชื่อไฟล์ report (absolute path override `outputDir`) | `Sonda({ filename: 'sonda_[index]' })` (default) |
| `outputDir` | directory ของ report | `Sonda({ outputDir: '.sonda' })` (default) |
| `open` | auto-open report หลัง build | `Sonda({ open: false })` สำหรับ CI |
| `deep` | อ่าน source maps ของ imported modules แตก deps เป็น source files | `Sonda({ deep: true })` |
| `sources` | embed source code ใน report (inspect code feature) | `Sonda({ sources: true })` |
| `gzip` | รายงาน GZIP compressed sizes | `Sonda({ gzip: true })` |
| `brotli` | รายงาน Brotli compressed sizes | `Sonda({ brotli: true })` |
| `server` | generate report สำหรับ server bundles (framework integrations เท่านั้น) | `Sonda({ server: true })` |
