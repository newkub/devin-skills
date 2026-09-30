---
name: report-prompt-uxui-web-design
description: สร้าง prompt ออกแบบ UX/UI web — grid card 4 col ครบทุก routes แสดง mobile view ต่อ card
argument-hint: "[scope-or-routes-file]"
related:
  - report-uxui
  - report-uxui-all-routes
  - scan-codebase
  - visualize-in-web
  - follow-design-system
  - report
---

## Goal

สร้าง prompt สำหรับออกแบบ UX/UI web ครบวงจร (desktop, tablet, mobile) ที่ระบุ layout เป็น grid card 4 columns — จำนวน card เท่ากับจำนวน routes ของ app, แต่ละ card แสดง UX/UI ในมุมมอง mobile พร้อม route, page name และ description ครบทุก routes และมีชื่อ app อยู่บรรทัดบนสุดของ prompt

## Scope

- ใช้เมื่อต้องการ prompt พร้อมใช้สำหรับ generate/design web UX/UI overview ของ app ทั้งระบบ — prompt ต้องครอบทั้ง desktop, tablet และ mobile
- Output คือ prompt text (ใน ```text block) ที่ embed รายการ routes จริงจาก codebase — ไม่ใช่การวาด UI เอง (วาด sketch ใช้ `/report-uxui`, route table ใช้ `/report-uxui-all-routes`)
- ถ้า user ต้องการ render จริง → ส่ง prompt ไป `/visualize-in-web` หรือ capture ผ่าน `/record-video-web-with-agents-browser`

## Execute

### 1. Collect App Info And Routes

> Goal: ได้ชื่อ app และ routes ครบทุกตัว

1. ทำ `/scan-codebase` เพื่อหา app name (`package.json` `name`, `index.html` `<title>`, หรือ brand ใน layout) และ framework/router ที่ใช้
2. ทำ `/report-uxui-all-routes` เพื่อรวบรวม routes ทั้งหมด — page routes, dynamic patterns, auth-required
3. ถ้า argument ชี้ไฟล์ routes/routes.md → ใช้ตัวนั้นแทน scan
4. ทุก route ต้องมี: `path`, `page/component name`, `description` (1 บรรทัด — สรุปจาก page content จริง ห้ามเดา)

### 2. Compose Prompt

> Goal: เขียน prompt ครบตาม spec — โครงบังคับ

1. บรรทัดบนสุดเขียนชื่อ app เป็นบรรทัดแรกของ prompt
2. Body ของ prompt ระบุ spec ดังนี้ (ห้ามขาด):
   - ออกแบบ UX/UI web ครบทั้ง desktop, tablet และ mobile
   - แสดงผลเป็น grid card 4 columns (`grid-template-columns: repeat(4, 1fr)`) — card ต่อแถวย่อตาม viewport (desktop 4, tablet 2, mobile 1)
   - จำนวน card เท่ากับจำนวน routes ทั้งหมด — 1 card = 1 route
   - แต่ละ card แสดง UX/UI เป็น mobile view (mobile viewport preview ของ route นั้น)
   - แต่ละ card มี: route path, page name, description — ครบทุก routes
3. Embed รายการ routes จริงทั้งหมดลงใน prompt เป็น table หรือ list — ห้าม placeholder เช่น "route1, route2, ..."

### 3. Emit Prompt

> Goal: ส่ง prompt พร้อมใช้ใน chat

1. ใส่ prompt ทั้งหมดใน ```text block เดียว — copy ไปใช้ได้ทันที
2. ทำ `/report` สรุป: `No.`, `Route`, `Page`, `Description` สำหรับทุก routes ที่ embed
3. บอกจำนวน routes/cards และชื่อ app ที่ใช้
4. ถ้า user ต้องการเห็นผล → เสนอ `/visualize-in-web` render grid ตาม prompt นี้

## Rules

### 1. Prompt Structure Contract

- บรรทัดแรกของ prompt = ชื่อ app เท่านั้น (ไม่มี heading อื่นก่อนหน้า)
- ต้องระบุทั้ง 3 viewports: desktop, tablet, mobile
- Card count = route count เสมอ — ห้ามรวมหลาย routes ใน card เดียวหรือข้าม route ใด
- แต่ละ card ต้องมี mobile UXUI preview + route + page + description ครบ

### 2. Routes Completeness

- Routes ต้องมาจาก codebase จริง (`/scan-codebase` + `/report-uxui-all-routes`) — ห้ามเดาหรือ sample
- Dynamic routes (`[id]`, `:id`, `$slug`) ใส่ pattern เดิมใน route path
- ถ้า routes > 24 → ยังแสดงครบทุก routes แต่เตือนว่า grid ยาว

### 3. Formatting

- Prompt อยู่ใน ```text block เดียว — ไม่แตกเป็นหลาย block
- ใช้ backticks สำหรับ `route-path`, `page-name`, `app-name` ในเนื้อหา prompt
- ไม่ใช้ bold markers; report summary ตาม `/report` conventions

## Expected Outcome

- Prompt พร้อมใช้ที่ขอ UX/UI web design ครบ desktop/tablet/mobile เป็น 4-col card grid
- ชื่อ app อยู่บนสุด; cards ครบเท่าจำนวน routes; แต่ละ card มี mobile UXUI + route + page + description
- รายการ routes ทั้งหมด embed ใน prompt — ไม่มี placeholder
