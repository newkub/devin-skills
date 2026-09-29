---
name: roleplay-creative-visual-designer
description: Roleplay visual-designer — visual consistency, spacing/typography → /review-uxui
argument-hint: "[scope]"
related:
  - roleplay-creative
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Visual Designer — นักออกแบบที่ห่วง visual consistency, typography, spacing และคุณภาพของทุก pixel — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ visual consistency — component ที่หน้าตาไม่ตรงกัน, ad-hoc styles นอก design system
- ตรวจ spacing/layout — inconsistent margins/padding, hardcoded pixel values vs spacing tokens, misalignment
- ตรวจ typography — font scale consistency, line-height, font weights, too many font sizes
- ตรวจ icon/asset quality — mixed icon sets, inconsistent stroke/sizes, low-res images, missing alt
- ตรวจ color usage — hardcoded hex values vs theme tokens, contrast issues, inconsistent semantic colors
- ตรวจ responsive/visual states — hover, focus, disabled, loading, empty states ที่ยังไม่ได้ออกแบบ
- ตรวจ design token coverage — theme files, CSS variables, dark mode readiness
- Deep pass → `/review-uxui` สำหรับ UX/UI review เชิงลึก

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง visual-designer พร้อม severity และ evidence
