---
name: design-prototype-in-html
description: สร้าง interactive HTML prototype/mockup จาก design brief — single-file, เปิดด้วย /open-web
argument-hint: "[brief-or-feature]"
related:
  - report-html
  - report-prompt-uxui-web-design
  - visualize-in-web
  - open-web
  - create-files-in-os-temp
  - ask-me
---

## Goal

สร้าง interactive design prototype เป็น single-file HTML — render ผ่าน `/report-html` conventions (Tailwind CDN + Vue 3, theme toggle, interactive components) — เปิดด้วย `/open-web` ใน temp dir

## Scope

ใช้เมื่อต้องการ prototype UI/flow ก่อน implement จริง — screen mockup, user flow, component states, responsive layouts

- ต้องการ prompt สำหรับ AI image/design gen → `/report-prompt-uxui-web-design`
- ต้องการ visual report จากข้อมูลเดิม → `/visualize-in-web` หรือ `/report-html` โดยตรง
- Production UI → implement ใน project จริง ไม่ใช่ skill นี้

## Execute

### 1. Gather Brief

> Goal: รู้ว่าต้อง prototype อะไร

1. ถ้า argument เป็น feature/route → เก็บ requirements: screens, components, interactions, states
2. ไม่ชัดเจน → ทำ `/ask-me` (scope: screens เดียว/หลาย screens, device targets, fidelity)
3. ระบุ data mock ที่ต้องการ — realistic sample data ไม่ใช่ lorem ipsum

### 2. Build Prototype

> Goal: single-file HTML ที่ใช้งานจริงได้

1. ทำ `/create-files-in-os-temp` — สร้าง `<temp>/prototype/index.html`
2. ทำตาม `/report-html` conventions: `<!DOCTYPE html>` + Tailwind CDN + Vue 3 (`vue.global.js`) + dark mode toggle
3. ใช้ interactive elements ตามที่ prototype ต้องการ: tabs, modals, drawers, hover states, form inputs, transitions — Vue `v-if`/`v-for`/`v-model`/`@click`
4. หลาย screens → sticky nav/tab bar สลับ screens ในไฟล์เดียว (ไม่แยกไฟล์)
5. Mobile view → responsive + device frame (rounded border + width เช่น `max-w-[390px]`) ถ้า brief ระบุ
6. ใส่ annotations ได้ — badge/note ระบุว่าเป็น prototype (เช่น "mock data", "not wired")

### 3. Open And Iterate

> Goal: user เห็นและแก้ไขต่อได้

1. ทำ `/open-web` เปิดไฟล์ใน temp
2. ทำ `/report` สรุป path + screens/states ที่ครอบคลุม
3. ถ้า user ขอแก้ → แก้ไฟล์เดิมใน temp แล้ว refresh

## Rules

- Prototype เขียนลง temp เท่านั้น — ห้ามเขียนลง project (ยกเว้น user สั่ง)
- ต้อง interactive จริง — ไม่ใช่ static image/screenshot
- Single file — assets ทั้งหมด CDN, mock data inline
- fidelity ตาม brief — lo-fi wireframe (gray boxes, เร็ว) หรือ hi-fi (ตาม design system) — default hi-fi-lite: real components, สไตล์เรียบ

- ใช้ `/report-html` conventions เสมอสำหรับ HTML shell
- ใช้ `/open-web`, `/create-files-in-os-temp` เสมอ
- ใช้ `/ask-me` ถ้าจำเป็น

## Expected Outcome

- Interactive prototype เปิดใน browser — user click/สลับ state ได้จริง
- แชร์/iterate ได้ง่าย (ไฟล์เดียวใน temp)
- ไม่มี prototype files ปนใน project source
