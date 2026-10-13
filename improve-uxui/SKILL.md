---
name: improve-uxui
description: หา UX/UI improvements — design system, interaction, navigation, layouts — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-a11y
  - improve-rbac
  - improve-form
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
  - follow-lib-unocss
  - follow-unocss-theme
  - follow-lib-shiki
  - follow-lib-comark
  - follow-tool-unlighthouse
  - follow-design-system
  - run-lint
  - test-a11y
  - test-visual
---

## Goal

ตอบคำถาม "UX/UI improve/optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-uxui` + `review-accessibility` + `review-mobile` + `review-frontend` (RBAC UI) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "UX/UI ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-uxui` — UX flow, interaction, visual design, navigation, layouts, design system, theme (รวม smooth theme toggle — theme switch ต้องมี animated transition ไม่ hard swap), motion
- `review-accessibility` — a11y, ARIA, keyboard nav, contrast, screen reader
- `review-mobile` — responsive, mobile-friendly, touch targets, pages/components adaptiveness, realtime feedback
- `review-frontend` (RBAC UI) — role-based UI/UX:
  - **RBAC UI** — nav/menu/action items ที่ role-based ต้อง gate ทั้ง UI layer และ route layer (hidden ≠ secure — direct URL ต้องถูก guard ด้วย); role ที่ไม่มีสิทธิ์เห็น menu → redirect หรือ forbidden UI ที่ตั้งใจ ไม่ใช่ blank/crash; permissions ของ role ย่อย (เช่น owner vs staff ใน team) ต้องมี capability checks ที่ action level ไม่ใช่แค่ page level
  - **role route groups** — ถ้า app มี auth: routes ควร group ตาม roles ด้วย pathless groups เช่น `(guest)` `(user)` `(team)` `(providers)` `(internal)` — file organization สะท้อน RBAC model, เลือก guard ที่ group/layout level
  - **UX routing** — URL-driven state สำหรับสิ่งที่ user อยาก share/back (tabs, filters, modals); deep-linkable settings; redirect ตาม role (`roleHome`)
- dedicated a11y review (WCAG violations, keyboard, contrast) → `/improve-a11y`; dedicated RBAC review (server-side permission matrix + guards) → `/improve-rbac`; form-focused improvements (validation UX, form states) → `/improve-form`; error states/error UI/error boundaries (loading, empty, error, offline, failure display) → owned by `/improve-error-handling` — not this skill

### Tools And Libraries

ใช้ตอน review และ fix findings ที่เกี่ยวข้อง:

| Skill | ใช้เมื่อ |
|-------|----------|
| `/follow-tool-unlighthouse` | วัด accessibility/best-practices scores site-wide ทุก route เป็น evidence และ baseline ก่อน-หลัง fix |
| `/follow-lib-unocss` | styling utilities, UnoCSS setup/config |
| `/follow-unocss-theme` | theme tokens (`theme.css` → `uno.config.ts`), dark mode, token enforcement — ใช้เสมอเมื่อ findings เกี่ยวกับ theme/design tokens |
| `/follow-lib-shiki` | code blocks ใน UI — syntax highlighting, dual themes, notation transformers |
| `/follow-lib-comark` | markdown content rendering — docs, callouts/components, streaming chat output |
| `/follow-design-system` | design tokens, theming, design system consistency findings |
- motion/animation consistency → `/improve-motion`; UI copy → `/improve-ux-writing`; error UI → `/improve-error-handling` (คงเดิม)

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-uxui` + `review-accessibility` + `review-mobile` + `review-frontend` (RBAC UI, UX routing) — error UI/error boundary findings ส่งต่อ `/improve-error-handling`
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทำ `/run-lint` หลังแก้เพื่อ verify ไม่มี regression
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-uxui` + `review-accessibility` + `review-mobile` + `review-frontend`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง
- ใช้ /test-a11y verify a11y fixes และ /test-visual สำหรับ visual regression

## Expected Outcome

- Prioritized improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`
