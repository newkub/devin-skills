---
name: improve-uxui
description: ปรับปรุง UX/UI, UX writing, web accessibility, และ SEO ของ project
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - improve-writing
  - check-accessibility
  - senior-frontend
  - review-frontend
  - validate
  - resolve-errors
  - suggest-next-action
---

## Goal

ปรับปรุง UX/UI ของ project ให้ดีขึ้น รวมถึง copy, accessibility, SEO, visual design, และ component interaction

## Scope

ใช้กับ project หรือ workspace ที่ต้องการปรับปรุง UX/UI, copy, accessibility, SEO, visual design, และ component interaction — ไม่รวม developer documentation (ใช้ `/improve-docs`)

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะ UX/UI ปัจจุบัน
1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ pain points: copy, navigation, accessibility, visual consistency, responsive, SEO, performance
4. ถ้าไม่พบ issues → stop และ report

### 2. Improve UX Writing
> Goal: ข้อความชัดเจนและสนับสนุน user journey
1. ระบุ touchpoints ทั้งหมด: navigation, actions, feedback, guidance, error
2. ตรวจสอบปัญหา: คำกำกวม, ยาวเกินไป, ศัพท์เทคนิค, ไม่สอดคล้องกัน
3. ปรับปรุง microcopy, button labels, link text, tooltips, placeholders ให้ใช้ action verbs
4. สร้างหรืออัปเดต voice/tone guidelines ใน `docs/ux-writing-guidelines.md`
5. ใช้ `/improve-writing` ถ้า user-facing copy หรือ docs ต้องการปรับปรุง

### 3. Improve Error Messages And Empty States
> Goal: ช่วยให้ผู้ใช้กู้คืนและเข้าใจสถานะ
1. เขียน error messages ที่บอกสาเหตุและวิธีแก้ (what + how to fix)
2. หลีกเลี่ยงคำว่า "Error", "Failed", "Invalid" โดยไม่มีบริบท
3. ปรับปรุง empty states ให้มีคำอธิบายและ call-to-action ชัดเจน
4. ใช้ tone ที่เหมาะสมกับ severity

### 4. Improve Forms And Notifications
> Goal: ฟอร์มและการแจ้งเตือนใช้งานง่าย
1. ปรับปรุง field labels, helper text, validation messages ให้บอกเกณฑ์ที่ต้องการ
2. ใช้ inline validation พร้อม feedback ทันที
3. ปรับปรุง toast/banner/confirmation dialogs ให้กระชับ บอกผลและ action
4. ใช้ tone ที่เหมาะกับ info, success, warning, error

### 5. Improve Web Accessibility
> Goal: ใช้งานได้กับทุกคน ตาม WCAG
1. ทำ `/check-accessibility` เพื่อหา WCAG issues
2. ตรวจสอบ keyboard navigation, tab order, focus indicators
3. ตรวจสอบ ARIA labels, roles, alt text, semantic HTML
4. ตรวจสอบ color contrast ตาม WCAG AA/AAA
5. ตรวจสอบ form labels, error messages, media captions/controls
6. ทดสอบด้วย screen reader และ keyboard

### 6. Improve SEO
> Goal: ปรับปรุงการค้นหาและ discoverability
1. ตรวจสอบ meta tags, title, description, canonical, Open Graph, structured data
2. ตรวจสอบ heading hierarchy, semantic HTML, internal links
3. ตรวจสอบ page speed, mobile friendliness, Core Web Vitals
4. แก้ไข issues ตาม priority

### 7. Improve UI And Frontend
> Goal: visual design, layout, components, interaction ดีขึ้น
1. ทำ `/senior-frontend` ถ้ามี issues ด้าน UI, performance, component design
2. ทำ `/review-frontend` ถ้า frontend performance เป็นปัญหา
3. ตรวจสอบ responsive, visual consistency, spacing, typography

### 8. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ `/validate` หรือ `/run-check`
2. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
3. ทำ `/suggest-next-action`

## Rules

### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ → stop และ `/ask-me`

### 2. User-Centric Writing
- เขียนให้เข้าใจง่ายก่อน แล้วค่อยคิดเรื่องความฉลาด
- ใช้ active voice, action verbs, และภาษาที่เป็นมิตร
- ทุก error message ต้องบอกวิธีแก้

### 3. Accessibility And SEO
- ตรวจสอบตาม WCAG 2.1 AA ขั้นต่ำ
- ทดสอบด้วย keyboard และ screen reader
- ใช้ semantic HTML และ meta tags ที่ถูกต้อง

## Expected Outcome
- UX/UI ดีขึ้นตาม criteria
- copy ชัดเจน เข้าใจง่าย สม่ำเสมอ
- accessibility ผ่าน WCAG AA
- SEO ดีขึ้น
- ไม่มี regression
- รายงานสรุปผล
