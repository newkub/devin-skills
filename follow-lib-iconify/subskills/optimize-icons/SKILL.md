---
name: follow-lib-iconify-optimize-icons
description: Optimize Iconify — offline bundles, on-demand loading, subsetting
argument-hint: "[scope]"
related:
  - follow-lib-iconify
  - run-bench
  - check-size
  - report-bundle
  - report-before-after
---

## Goal

ลด bundle size และ network cost ของ Iconify usage — offline bundles, on-demand loading และ subsetting icon data

## Scope

ใช้เมื่อต้อง optimize icons ที่ใช้ Iconify — ครอบคลุม bundle analysis, แปลง API runtime → offline data, custom subsets และ lazy loading

## Execute

### 1. Baseline

> Goal: วัด icon cost ปัจจุบันก่อน optimize

1. ทำ `/check-size` หรือ `/report-bundle` เพื่อดูขนาด icon-related code ใน bundle
2. ตรวจ usage pattern: `import { Icon }`, `icon="..."` strings, `@iconify-json/*` imports — scan ว่าใช้ sets ไหน icons อะไรบ้าง
3. ระบุ anti-patterns: import ทั้ง `icons.json`, dynamic icon names ที่ยิง API runtime, icons ที่ไม่ได้ใช้

### 2. Prefer Offline Bundles

> Goal: แปลง runtime API fetching เป็น bundled icon data

1. ติดตั้ง `@iconify-json/<set>` สำหรับทุก set ที่ใช้ — แทนที่การ fetch จาก `api.iconify.design`
2. ส่ง icon data โดยตรงให้ component: `<Icon icon={mdiHome} />` โดย import จาก `@iconify-json/mdi` (tree-shakeable per-icon)
3. เก็บ API runtime เฉพาะ icon names ที่ user กำหนด runtime จริงๆ (เช่น icon picker)

### 3. Subset Icon Data

> Goal: bundle เฉพาะ icons ที่ใช้จริง

1. ใช้ `@iconify/utils` (`getIcons`, `minifyIconSet`) เพื่อ generate subset JSON ที่มีเฉพาะ icons ที่ใช้ — ดู official docs สำหรับ API ล่าสุด
2. สำหรับ UnoCSS `presetIcons`: import เฉพาะ collections ที่ใช้ใน `uno.config.ts`
3. สำหรับ Tailwind plugin: ระบุ icon sets ใน plugin config — ห้าม load ทุก set
4. ถ้า icons น้อยมาก พิจารณา inline SVG แทน Iconify เลย

### 4. Lazy-Load Dynamic Icons

> Goal: ลด initial bundle สำหรับ icons ที่ไม่จำเป็นตอน load

1. Dynamic import icon data สำหรับ sections ที่ไม่ critical
2. ใช้ `@iconify/utils` loader functions สำหรับ on-demand icon loading — ดู official docs
3. สำหรับ web component `iconify-icon` — icons load on-demand อยู่แล้ว แต่ต้องเสีย API runtime; ชั่งน้ำหนักกับ offline bundle

### 5. Verify And Compare

> Goal: วัดผลหลัง optimize เทียบ baseline

1. ทำ `/report-bundle` หรือ `/check-size` ซ้ำ แล้ว compare กับ baseline ด้วย `/report-before-after`
2. ตรวจว่า icons ทั้งหมดยัง render ถูกต้อง — ไม่มี missing icon
3. ถ้า bundle ไม่เล็กลงหรือ icon หาย → revert จุดนั้นแล้ว report

## Rules

- Offline data (`@iconify-json/*`) มาก่อน API runtime เสมอ — เว้นแต่ icon ต้อง dynamic จริง
- ห้าม import `icons.json` ทั้งไฟล์ของ set ใหญ่ (เช่น mdi มีหลายพัน icons)
- subset ต้อง cover ทุก icon ที่ใช้จริง — scan usage ก่อน generate
- preserve behavior — optimize ต้องไม่ทำให้ icon หายหรือกะพริบ
- ใช้ `/follow-lib-iconify` สำหรับ overview
- ใช้ `/run-bench` ถ้าต้องวัด load/render impact เชิงตัวเลข

## Expected Outcome

- Icon bundle เล็กลงเทียบ baseline ด้วยตัวเลขจริง
- ไม่มี runtime API calls สำหรับ static icons
- ทุก icon ยัง render ถูกต้อง
