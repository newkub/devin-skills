---
name: follow-lib-js-delivr
description: ใช้ jsDelivr CDN สำหรับโหลด npm packages และ GitHub repositories บน web
related:
  - follow-lib-esm-sh
  - follow-lib-jspm
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ `jsDelivr` CDN โหลด `npm packages`, `GitHub repositories`, `ESM modules` และ static assets บน `web pages` ด้วย `multi-CDN infrastructure`

## Scope

ใช้สำหรับการโหลด `JavaScript libraries`, `CSS frameworks` และ static assets ผ่าน `https://cdn.jsdelivr.net` รองรับ `npm`, `GitHub`, version ranges, `combine`, `ESM mode`, `SRI` และ public API

## Execute

### 1. Load Packages

> Goal: โหลด packages ผ่าน `jsDelivr`

1. ใช้ URL format `https://cdn.jsdelivr.net/npm/{package}@{version}/{file}`
2. ใช้ `https://cdn.jsdelivr.net/gh/{user}/{repo}@{version}/{file}` สำหรับ `GitHub`
3. `version` รองรับ exact (`5.3.3`), range (`5`, `5.3`), tag (`latest`, `beta`) หรือ `commit`/`branch` สำหรับ `GitHub`
4. ตัวอย่าง:
   - `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`
   - `https://cdn.jsdelivr.net/gh/jquery/jquery@3.7.1/dist/jquery.min.js`

### 2. Use ESM Mode

> Goal: ใช้งาน `ES modules` ผ่าน jsDelivr

1. ใช้ `https://cdn.jsdelivr.net/npm/{package}@{version}/+esm` เพื่อ bundle และแปลงเป็น `ESM` ที่พร้อมใช้งานใน `browser`
2. ใช้ short domain `https://esm.run/{package}` สำหรับ testing (beta, ไม่แนะนำสำหรับ production)
3. `+esm` จะ resolve dependencies, minify, สร้าง source map และแปลง `CommonJS` เป็น `ESM` โดยอัตโนมัติ
4. ใช้กับ `<script type="module">` หรือ `import`

### 3. Combine Files

> Goal: ลด `HTTP requests`

1. ใช้ endpoint `/combine/` สำหรับรวมหลายไฟล์จาก `npm` และ `GitHub` ใน URL เดียว
2. ใช้ format: `https://cdn.jsdelivr.net/combine/npm/pkgA@x/file,gh/user/repo@y/file`
3. ห้ามใช้ shorthand `/g/` เนื่องจาก deprecated
4. ระวัง: การรวมไฟล์ขนาดใหญ่หรือจำนวนมากอาจช้าในครั้งแรก

### 4. Ensure Stability And Security

> Goal: รักษา `stability` และ `security` ของ production

1. Pin version เสมอสำหรับ production เช่น `@5.3.3` แทน `latest`
2. ใช้ `SRI` hashes สำหรับ `<script>` และ `<link>` โดยเพิ่ม `integrity` และ `crossorigin="anonymous"`
3. ใช้ `https://data.jsdelivr.com/v1` สำหรับตรวจสอบ metadata, versions, entry points และ download stats
4. ไม่พึ่งพา `esm.run` ใน production จนกว่าจะ stable

### 5. Monitor And Optimize

> Goal: ติดตาม `performance` และ optimize

1. Monitor CDN performance ผ่าน `https://status.jsdelivr.com/`
2. เลือกไฟล์ `.min` หรือใช้ automatic minification สำหรับ `JS`/`CSS`/`SVG` ที่รองรับ
3. ล้าง cache ได้ผ่าน purge cache tool บน jsDelivr website เมื่อจำเป็น
4. ใช้ version range ได้ใน development แต่ pin version สำหรับ production

## Rules

- ใช้ URL format `https://cdn.jsdelivr.net/npm/{package}@{version}/{file}` หรือ `https://cdn.jsdelivr.net/gh/{user}/{repo}@{version}/{file}`
- Pin version เสมอสำหรับ production
- ใช้ `SRI` hashes สำหรับ `<script>` และ `<link>`
- ใช้ `/combine/` สำหรับรวมหลายไฟล์
- ห้ามใช้ deprecated `/g/` endpoint
- ใช้ `+esm` สำหรับ `ESM bundle`; `esm.run` สำหรับ testing เท่านั้น
- ใช้ `latest` หรือ version range ได้ แต่ไม่แนะนำสำหรับ production
- Test URL ก่อน deploy
- ใช้ `crossorigin="anonymous"` เมื่อใช้ `SRI`
- ใช้ `https://data.jsdelivr.com/v1` สำหรับดู metadata ก่อนเลือกไฟล์

- ใช้ `/follow-lib-esm-sh` ถ้าต้องการ `ESM CDN` ทางเลือก
- ใช้ `/follow-lib-jspm` ถ้าต้องการ `import maps package manager`
- ใช้ `/follow-lib-animejs` ถ้าจำเป็น
- ใช้ `/follow-lib-arktype` ถ้าจำเป็น
- ใช้ `/follow-lib-better-auth` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- `Loading performance` ที่ดีขึ้นด้วย `multi-CDN` และ `combine`
- `Global reach` รวมถึง `China`
- `High availability` ด้วย `failover`
- `Security` ที่ดีขึ้นด้วย `SRI` และ version pinning
