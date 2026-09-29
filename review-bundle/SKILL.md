---
name: review-bundle
description: Review bundle size, chunks, static assets (images/fonts/media) และ build output
argument-hint: "[app-or-package]"
related:
  - run-build
  - report
  - scan-codebase
  - review-performance
  - deep-review-then-fix
  - run-review
  - report-bundle
  - review-security
  - use-pwsh-shell
  - search
  - run-profiler
---

## Goal

Review production output ทั้งหมด — bundle size, build output, chunks และ static assets (images, fonts, media) พร้อม loading strategy — review เท่านั้น ไม่แก้ไข config; fix ทำใน section `## Fix` หลัง user confirm

## Scope

ใช้กับ project ที่มี Vite / Rolldown / esbuild / Webpack หรือ bundler ที่คล้ายกัน รองรับ monorepo — ครอบคลุม `dist/` output และ assets ใน `public/`, `src/assets`

ไม่รวม: runtime performance deep-dive → ใช้ `/review-performance`

## Execute

### 1. Inspect Build Configuration

> Goal: เข้าใจ build config

1. อ่าน `package.json` scripts ที่เกี่ยวข้องกับ build, dev, deploy
2. อ่าน `vite.config.*`, `tsup.config.*`, `wrangler.jsonc`, `turbo.json`
3. ระบุ framework และ output target

### 2. Analyze Bundle Output

> Goal: เข้าใจ output ที่ผลิตออกมา

1. ทำ `/run-build` พร้อม bundle analyzer
2. วัด `dist/` size
3. ระบุ chunks ที่ใหญ่เกิน 500 kB หรือ duplicate vendor modules

### 3. Review Chunk And Dependency Strategy

> Goal: ตรวจสอบ chunking และ deps

1. ตรวจ manual chunks และ dynamic imports
2. ตรวจ tree shaking และ dead code
3. ตรวจ third-party dependencies ที่ inflate bundle

### 4. Delivery And Loading Strategy

> Goal: output ส่งถึง browser อย่างมีประสิทธิภาพ — ทำตาม `references/loading-strategy.md`

1. compression — brotli/gzip precompressed (`.br`/`.gz` artifacts) หรือ server-level
2. cache headers — hashed assets `immutable` + long TTL, HTML `no-cache`
3. preload/prefetch — critical chunks `modulepreload`, next-route `prefetch`
4. sourcemaps — production policy (`hidden-source-map`/none), uploaded to error tracker
5. entry/waterfall — initial JS graph minimal, ไม่มี serial chain ของ chunk requests

### 5. Audit Static Assets

> Goal: assets optimize ถูก format และ loading strategy เหมาะสม

ทำตาม references/assets-checklist.md

1. images — `png`/`jpg` ที่ควรเป็น `webp`/`avif`, ขาด `srcset`/`sizes`, `loading="lazy"`, `decoding="async"`, ขาด `width`/`height` (CLS risk)
2. fonts — `font-display: swap`, preloading, subset fonts และ weights ที่ใช้จริง
3. media — video/audio auto-load, ขาด poster, icons ที่ควรเป็น SVG sprite

### 6. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report` ตาราง columns: No., Area, Severity, Finding, Evidence, Fix
2. แนะนำ section `## Fix` เมื่อ user confirm การแก้ไข

### Subskills

> Goal: dispatch งานเฉพาะรูปแบบ — report subskill format findings, optimize subskill fix เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `size`, `report-size` — per-chunk delta table + asset inventory | `subskills/report-size/SKILL.md` |
| Apply bundle findings - dedupe deps, splitting, lazy loading | `subskills/optimize-bundle/SKILL.md` |

## Check: Bundle Regression

### Goal

ตรวจหา bundle size regression โดยเทียบ build output ปัจจุบันกับ baseline ก่อนหน้า — รายงาน chunks, assets และ dependencies ที่โตเกิน threshold

### Scope

- ใช้เมื่อต้องการเทียบ bundle size ระหว่าง builds (เช่น ก่อน/หลัง refactor, เพิ่ม dependency, หรือ upgrade)
- ครอบคลุม JS/CSS bundles จาก `dist/`, `build/`, `.output/` หรือ output directory ของ bundler ที่ตรวจพบ
- Read-only ต่อ source: ตรวจและรายงานเท่านั้น ไม่แก้ไข code

### Execute

#### 1. Establish Baseline

> Goal: มี baseline เพื่อเทียบ

1. รับ `baseline` จาก argument: path ของ build เดิม, git ref, หรือ `bundlesize` config
2. ถ้าเป็น git ref → build ที่ ref นั้นผ่าน `git worktree` หรือ stash (ทำ `/use-git-worktrees` ถ้าจำเป็น)
3. ถ้าไม่มี baseline → เก็บ build ปัจจุบันเป็น baseline ใน `.devin/bundle-baseline.json` แล้ว report
4. baseline file เก็บ: chunk name, size bytes, gzip size (ถ้าวัดได้)

#### 2. Build Current Output

> Goal: ได้ build output ปัจจุบัน

1. ทำ `/run-build` เพื่อสร้าง production build
2. ระบุ output directory จาก bundler config (`vite.config.*`, `next.config.*`, `package.json`)
3. เก็บรายการ files พร้อมขนาดด้วย `## Check: Bundle Size` หรือ `Get-ChildItem -Recurse -File`

#### 3. Compare Sizes

> Goal: หา deltas ต่อ file และรวม

1. เทียบชื่อไฟล์ที่ normalize แล้ว (ตัด content hash ออกจาก filename)
2. คำนวณ delta: `current - baseline` และเปอร์เซ็นต์
3. Threshold default: flag `regression` ถ้า file โต >5% หรือ >50 KB, flag `critical` ถ้า >20% หรือ >200 KB
4. แยก new chunks (ไม่มีใน baseline) และ removed chunks

#### 4. Attribute To Dependencies

> Goal: รู้ว่า regression มาจากอะไร

1. ถ้ามี bundle analyzer output (`stats.json`, `manifest.json`) → map chunk กลับไปหา modules/dependencies
2. เทียบ `package.json` dependencies กับ baseline หา packages ที่เพิ่มเข้า
3. ใช้ `/report-bundle` หรือ `## Check: Bundle Regression` เพื่อวิเคราะห์ chunks ที่โต

#### 5. Report

> Goal: สรุป regression ให้ตัดสินใจได้

1. ทำ `/report` คอลัมน์: `No.`, `Chunk`, `Before`, `After`, `Delta`, `Status`, `Suspected Cause`
2. Status: `ok`, `regression`, `critical`, `new`, `removed`
3. สรุป total bundle delta และ top regressions
4. ถ้า `critical` → เสนอ `## Check: Bundle Regression` เป็น next action

### Rules

#### 1. Deterministic Compare

- Normalize filenames ตัด content hash ก่อนเทียบ — hash เปลี่ยนทุก build
- เทียบ gzip size ถ้ามี — raw size อย่างเดียวอาจ misleading
- Baseline ต้องมาจาก production build เหมือนกัน ห้ามเทียบ dev build

#### 2. Read-Only

- ไม่แก้ไข code หรือ config เพื่อลด size ใน skill นี้ — ส่งต่อ `## Check: Bundle Regression`
- ไม่ลบ build artifacts ของ baseline

#### 3. Thresholds

- ใช้ทั้ง percent และ absolute threshold — เลี่ยง false positive จากไฟล์เล็ก
- ระบุ threshold ที่ใช้ใน report เสมอ

- ใช้ /report-bundle ถ้าจำเป็น
- ใช้ `## Check: Bundle Regression` ถ้าจำเป็น
- ใช้ `## Check: Bundle Regression` ถ้าจำเป็น

### Expected Outcome

- รู้ว่า build ใหม่โตหรือเล็กลงเท่าไร ต่อ chunk และรวม
- ระบุ suspected cause ของ regression ได้ (dependency ใหม่, code ใหม่)
- พร้อมตัดสินใจว่าจะ optimize หรือยอมรับ delta

## Check: Source Maps

### Goal

ตรวจว่า production build หรือ deployed app leak source maps (`.map` files, `sourceMappingURL` comment) ซึ่งเปิดเผย source code, internal paths และ logic ให้ภายนอก

### Scope

- ตรวจ output directory หลัง build (`dist/`, `build/`, `.output/`, `out/`) และ deployed URL
- ครอบคลุม: `.map` files, `//# sourceMappingURL=` comments, hidden sourcemaps (sourcemap ไม่ link แต่อัปโหลด), CSS sourcemaps
- Read-only: รายงานอย่างเดียว — แก้ไขผ่าน `/review-security`

### Execute

#### 1. Identify Target

> Goal: ระบุจุดที่จะตรวจ

1. รับ `build-dir-or-url` จาก argument หรือใช้ `/run-build` เพื่อสร้าง production build ก่อน
2. ถ้าไม่มี argument → หา build output directory จาก config (`vite.config`, `next.config`, `tsconfig`, bundler config)

#### 2. Scan Local Build Output

> Goal: หา source maps ใน build artifacts

1. ค้นหา `**/*.map` ใน output directory
2. ค้นหา `sourceMappingURL` ในไฟล์ JS/CSS ที่ build แล้ว
3. ตรวจว่า sourcemap mode ใน bundler config เป็น `hidden`, `true`, หรือ `nosources` — บันทึกค่าที่พบ

#### 3. Probe Deployed URL

> Goal: ตรวจว่า source maps เข้าถึงได้จากภายนอก

1. ดึง JS bundle จาก URL แล้วหา `sourceMappingURL` reference
2. ลอง fetch `<asset>.map` — ถ้าได้ 200 = leak
3. ข้าม step นี้ถ้าไม่มี deployed URL

#### 4. Report

> Goal: สรุป exposure

1. ใช้ `/report` คอลัมน์: `No.`, `File/Asset`, `Map Location`, `Exposed`, `Severity`, `Fix`
2. Severity: `critical` (map พร้อม sourcesContent เข้าถึงได้ภายนอก), `warning` (map ใน build แต่ไม่ deploy), `info` (hidden map สำหรับ error tracking)
3. แนะนำ fix: `sourcemap: 'hidden'` หรือ `false`, upload map ไป error tracking แทน, strip `sourceMappingURL`

### Rules

#### 1. Evidence-Based

- ทุก finding ต้องมี path หรือ URL ที่พบจริง
- แยกชัดว่า map อยู่ใน local build เท่านั้น หรือเข้าถึงได้จาก deployed URL

#### 2. Read-Only

- ไม่แก้ bundler config หรือลบไฟล์ — แนะนำผ่าน `/review-security`

#### 3. Context Aware

- การ upload sourcemap ไป Sentry/error tracking ไม่นับเป็น leak ถ้าไม่ expose สาธารณะ

- ใช้ /review-security สำหรับ security audit ภาพรวม
- ใช้ `## Check: Source Maps` สำหรับ bundle analysis
- ใช้ /review-security เมื่อต้องแก้ไข

### Expected Outcome

- รายการ source maps ที่พบพร้อม exposure level
- Severity และ fix ที่แนะนำต่อ finding

## Check: Bundle Size

### Goal

ตรวจสอบขนาดของไฟล์, directory หรือ disk บนเครื่อง และแสดงผลแบบ human-readable

### Scope

- ใช้บน Windows เป็นหลัก (รองรับ macOS/Linux ด้วย command equivalent)
- ตรวจไฟล์, directory, หรือ disk drive
- แสดงผลเป็น bytes, KB, MB, GB, TB
- ไม่แก้ไข ลบ หรือย้ายไฟล์

### Execute

#### 1. Identify Target

> Goal: ระบุสิ่งทีต้องตรวจขนาด

1. รับ `path` หรือ `disk` จาก argument
2. ถ้าไม่ระบุ → ใช้ current working directory
3. ถ้าเป็น `disk` หรือ drive letter → ใช้ disk check
4. ถ้าเป็น path ปกติ → ใช้ file/folder check

#### 2. Check File Size

> Goal: ตรวจขนาดไฟล์

1. ตรวจสอบว่า path ชี้ไปยังไฟล์ (`Test-Path -PathType Leaf`)
2. ใช้ `(Get-Item <path>).Length`
3. แปลงเป้น human-readable (B, KB, MB, GB, TB)
4. แสดงชื่อไฟล์, ขนาด, path

#### 3. Check Directory Size

> Goal: ตรวจขนาด directory

1. ตรวจสอบว่า path ชี้ไปยัง directory (`Test-Path -PathType Container`)
2. ใช้ `Get-ChildItem -Recurse -File <path> -ErrorAction SilentlyContinue`
3. รวมขนาดด้วย `Measure-Object -Property Length -Sum`
4. นับจำนวนไฟล์, directory, และขนาดรวม
5. แปลงเป้น human-readable
6. ถ้า directory ใหญ่มาก → จำกัดเวลา หรือใช้ `/run-profiler` ถ้าจำเป็น

#### 4. Check Disk Size

> Goal: ตรวจขนาด disk

1. บน Windows: ใช้ `Get-Volume <drive-letter>` หรือ `Get-PSDrive <drive-letter>`
2. ดึง `Size`, `SizeRemaining`, `SizeUsed`
3. แปลงเป้น human-readable
4. แสดง total, used, free, usage percent
5. บน macOS/Linux: ใช้ `df -h <mount>`

#### 5. Format Output

> Goal: แสดงผลอ่านง่าย

1. ใช้ `/report` สร้างตาราง
2. คอลัมน์: `Item`, `Type`, `Size`, `Files`, `Note`
3. แสดง human-readable (เช่น `1.23 GB`)
4. ถ้าหลาย target → แสดงทีละแถว

### Rules

#### 1. Human-Readable

- แสดงขนาดเป้น B, KB, MB, GB, TB เสมอ
- ใช้ 2 ตำแหน่งทศนิยมสำหรับ KB ขึ้นไป
- ระบุ unit ชัดเจน

#### 2. Respect Scope

- ไม่ลบ ไม่ย้าย ไม่แก้ไขไฟล์
- ไม่ติดตั้ง program
- แค่ตรวจสอบและรายงาน

#### 3. Performance

- ถ้า directory ใหญ่ ใช้ `-File` เพื่อไม่ต้องนับ sub-directories ทีละ node
- ถ้าใช้เวลานานเกิน 30 วินาที → หยุดและรายงาน partial result
- ระบุเวลาทีใช้ถ้าจำเป็น

#### 4. Error Handling

- ถ้า path ไม่มีอยู่ → รายงาน `not found`
- ถ้าไม่มีสิทธิ์เข้าถึง → รายงาน `access denied`
- ถ้า disk ไม่มี → รายงาน `drive not found`

#### 5. Output

- ใช้ `/report`
- แสดง size ก่อนและหลัง (ถ้าเปรียบเทียบ)
- ถ้าเปรียบเทียบหลาย path → เรียงตาม size

- ใช้ /use-pwsh-shell ถ้าจำเป็น
- ใช้ /search-files-patterns ถ้าจำเป็น

### Expected Outcome

- ทราบขนาดของไฟล์, directory หรือ disk ทีต้องการ
- ผลลัพธ์ human-readable
- ไม่มีการเปลี่ยนแปลงใดๆ ในระบบไฟล์

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `bundle-regression` | `## Check: Bundle Regression` |
| `source-maps` | `## Check: Source Maps` |
| `size` | `## Check: Bundle Size` |

## Rules

### 1. Read Only

- ไม่แก้ไข build config หรือ assets ระหว่าง review
- ทุก audit ใช้ measurement จริงเท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี bundle size, chunk name, asset path/size หรือ config line
- ไม่สรุป chunking หรือ format โดยไม่มี evidence

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. baseline: `/run-build` + bundle analyzer — sizes ต่อ chunk, biggest deps, assets inventory ตาม type/size
2. code splitting: route-based `import()`, vendor split, lazy heavy features
3. tree shaking: named imports, `sideEffects`, dev-only code ออก
4. images: AVIF/WebP+fallback, srcset, compress, lazy ใต้ viewport
5. fonts: woff2+subset, font-display swap, preload critical
6. videos/icons: compressed formats, poster, SVG sprites; cache headers immutable+hash
7. compression: brotli/gzip, minify, hashed names + long-term cache
8. verify: build เทียบ bytes before/after, smoke test lazy chunks, ไม่มี visual/CLS regression

## References

- [Full-dimension checklist](references/checklist.md)
- [Assets checklist](references/assets-checklist.md)
- [Loading strategy](references/loading-strategy.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ `/scan-codebase` ถ้าจำเป็น

## Expected Outcome

- ตาราง findings แยกตาม bundle size, chunks, deps, images, fonts, media
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
