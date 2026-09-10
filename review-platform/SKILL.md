---
name: review-platform
description: Review platform ครอบคลุมทุก dimension พร้อม review score
argument-hint: "[scope]"
related:
  - review-seo
  - report
  - suggest-next-action
---

## Goal

Review platform ครอบคลุมทุก dimension ของ platform พร้อม aggregate findings และ review score

## Scope

platform review สำหรับ: mobile app, desktop app, CLI/TUI, SSR, state management, routing, PWA, i18n, SEO, performance, accessibility, battery/energy, browser/platform compatibility

## Execute

### 1. Prepare And Mobile And Desktop

> Goal: เตรียม context และตรวจ mobile/desktop
ทำตาม `references/prepare.md` และ `references/mobile-desktop.md`

### 2. CLI And TUI

> Goal: ตรวจ CLI และ TUI
ทำตาม `references/cli-tui.md`

### 3. SSR, State, Routing, PWA

> Goal: ตรวจ SSR, state, routing และ PWA
ทำตาม `references/ssr-state-routing-pwa.md`

### 4. I18n

> Goal: ตรวจ i18n coverage
ทำตาม `references/i18n.md`

### 5. SEO

> Goal: ตรวจ SEO
ทำ `/review-seo`

### 6. Battery And Energy

> Goal: ตรวจ battery และ energy usage
ทำตาม `references/battery.md`

### 7. Performance

> Goal: ตรวจ performance
ทำตาม `references/performance.md`

### 8. Accessibility

> Goal: ตรวจ accessibility
ทำตาม `references/accessibility.md`

### 9. Compatibility

> Goal: ตรวจ compatibility
ทำตาม `references/compatibility.md`

### 10. Validate And Report

> Goal: validate findings และรายงาน
ทำตาม `references/validate.md` และ `references/report.md` และคำนวณ score จาก `references/scoring.md`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี dimension ใด → ข้าม step นั้นตามเกณฑ์ใน reference นั้น
- ถ้า project ไม่ใช่ web app → ข้าม SEO และ performance
- ถ้า project ไม่มี UI → ข้าม accessibility

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number (platform)
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ locale, URL, meta tag, หรือ function ที่เกี่ยวข้อง

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (platform)
- ไม่ลบไฟล์หรือส่วนประกอบใดๆ ในระหว่าง review

### 4. Health Score

- คำนวณ review score เป็น percentage (0-100) ตาม `references/scoring.md`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding (platform)
- แสดง score ต่อ dimension และ overall score (platform)
- ใช้ score เปรียบเทียบ before/after

### 5. Formatting

- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis (platform)
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report`

- ส่ง findings ไป domain `/review-*` ที่เกี่ยวข้องเพื่อแก้ใน section `## Fix`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก platform section
- รายงาน recommended actions พร้อม priority (platform)
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
