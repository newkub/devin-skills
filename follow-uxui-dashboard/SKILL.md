---
name: follow-uxui-dashboard
description: ออกแบบ UX/UI สำหรับ dashboard ที่มี sidebar, search, collapse, tabs, และ performance
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - follow-uxui
  - review-uxui
  - follow-uxui-interaction
  - follow-uxui-accessibility
  - follow-uxui-chart
  - follow-tanstack-virtual
  - report-format-table
  - suggest-next-action
---

## Goal

สร้าง dashboard UX/UI ที่ใช้งานง่าย มี sidebar navigation ครบ search/collapse/tabs responsive และ performance

## Scope

ใช้สำหรับ dashboard ที่มี sidebar, top-level tabs, nested menu, permission-based access, quick actions, และ widgets โดย focus ที่ navigation, layout, rendering, routing และ performance

## Execute

### 1. Analyze Dashboard Context

วิเคราะห์ dashboard ที่มีอยู่

> Goal: เข้าใจ tech stack, navigation structure, และ user roles

1. ทำ `/scan-codebase` เพื่อหา dashboard layout, sidebar, tabs, และ routing
2. ระบุ UI framework, CSS framework, design tokens, breakpoint config, icon system
3. ระบุ user roles และ permissions ที่ควรกรอง sidebar menu
4. ทำ `/follow-uxui` เพื่อเลือก skill ย่อยที่เหมาะสม

### 2. Design Sidebar Navigation

ออกแบบ sidebar สำหรับ navigation

> Goal: sidebar ค้นหาได้ ยุบ/ขยายได้ responsive และ a11y ครบ

1. จัดกลุ่ม menu เป็น sections พร้อม title ทั้งภาษาไทยหรือภาษาอังกฤษ
2. ใส่ search bar ด้านบน sidebar สำหรับ filter menu items แบบ real-time
3. รองรับ collapse/expand ทั้ง section และ sidebar level
4. ทำ active state ด้วย visual ชัดเจน background + text color
5. แสดง icon + label + optional description สำหรับแต่ละ item
6. จัดการ mobile drawer พร้อม overlay และ close button
7. ใช้ semantic HTML `nav`, `ul`, `li`, `a`, `aria-current="page"`

### 3. Design Top-Level Tabs

ออกแบบ role tabs ที่ด้านบน sidebar

> Goal: user สลับบทบาท primary ได้ง่าย ไม่หลง

1. แสดง tabs เช่น User / Provider / Partner / Admin ตาม permission
2. ทำ active tab ชัดเจนด้วย background highlight
3. tab click ต้อง navigate ไป href หลักของแต่ละ role
4. ซ่อน tab ที่ user ไม่มีสิทธิ์
5. ใช้ `aria-label"role switcher"` และ keyboard navigation

### 4. Design Dashboard Main Content

ออกแบบ content area ของ dashboard

> Goal: แสดงข้อมูลสำคัญก่อน โหลดเร็ว และปรับแต่งได้

1. ทำ page header ชัดเจน title + subtitle + primary actions
2. ใช้ widget grid สำหรับ stats cards, charts, lists, quick actions
3. รองรับ widget customization เปิด/ปิด/เรียงลำดับ
4. ใช้ skeleton loading สำหรับ async widgets
5. แสดง empty state พร้อม next action
6. ใช้ quick actions panel สำหรับลัดไปยังฟีเจอร์หลัก

### 5. Optimize Rendering And Performance

ปรับ rendering เพื่อ performance

> Goal: dashboard โหลดและ scroll ลื่นไหล

1. แยก sidebar เป็น server/static ส่วน ลด re-render
2. ใช้ `Suspense` และ `ErrorBoundary` ในแต่ละ widget
3. ใช้ `createMemo` หรือ framework equivalent สำหรับ derived state
4. ใช้ `/follow-tanstack-virtual` สำหรับ list ยาว
5. code-split route ของ dashboard ตาม tab/section
6. lazy load icons/visuals ที่ไม่ critical
7. ระบุ loading priority สำหรับ above-the-fold widgets

### 6. Handle Routing And Deep Links

จัด routing สำหรับ dashboard

> Goal: URL สะท้อน tab/section ทำ deep link ได้

1. ใช้ route file convention เช่น `/provider/$id/dashboard/<section>`
2. active state ตรงกับ current pathname หรือ prefix
3. tab switching ต้อง sync กับ URL
4. redirect ไปหน้า default เมื่อเข้า parent route
5. รองรับ permission-based 404/redirect

### 7. Validate Accessibility And Responsiveness

ตรวจสอบ a11y และ responsive

> Goal: ใช้งานได้ทั้ง desktop, tablet, mobile และ keyboard/screen reader

1. ทำ `/check-accessibility` เพื่อตรวจ WCAG
2. touch target ขั้นต่ำ 44x44px
3. keyboard navigation สำหรับ sidebar, tabs, search
4. focus visible และ focus trap สำหรับ mobile drawer
5. prefers-reduced-motion สำหรับ sidebar transition
6. รองรับ safe area insets บน mobile

## Rules

### 1. Sidebar Search

- search ต้อง filter menu label, description, section ทันที
- แสดง no results state พร้อมคำแนะนำ
- ระบุ keyboard shortcut เช่น `Ctrl+K` หรือ `/`

### 2. Collapsible Menu

- มี state ระดับ section และ item group
- จดจำ state ใน localStorage หรือ persistence layer
- ไม่ซ่อน item ที user ไม่มีสิทธิ์ ให้กรองก่อน

### 3. Active And Selection

- active item ใช้ `aria-current="page"`
- active tab ใช้ `aria-selected="true"`
- hover, focus, active ต้องมี visual ต่างกัน

### 4. Performance Budget

- first contentful paint ของ dashboard ไม่เกิน 1.5s
- time to interactive ไม่เกิน 3.5s
- virtualize รายการทีเกิน 20 items

### 5. Consistency With Design System

- ใช้ design tokens สำหรับ colors, spacing, border, radius
- ใช้ icon class convention ที่ตรงกับ project เช่น `i-mdi-*`
- ใช้ typography scale จาก project

## Expected Outcome

- Dashboard มี sidebar ค้นหา/ยุบ/ขยาย/ responsive ได้
- Top-level role tabs สลับได้ตาม permission
- Content area โหลดเร็ว skeleton loading + empty state ครบ
- Routing + deep link ทำงานถูกต้อง
- ผ่าน a11y และ responsive tests
