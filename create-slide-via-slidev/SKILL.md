---
name: create-slide-via-slidev
description: สร้าง standalone Slidev project ด้วย CLI ในตำแหน่งใดก็ได้ พร้อม package.json ของตัวเอง
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
---

## Goal

สร้าง standalone Slidev project ด้วย `bun create slidev` ในตำแหน่งที่ผู้ใช้กำหนด พร้อม `package.json` และ `slides.md` ของตัวเอง

## Scope

ใช้สำหรับการสร้าง Slidev project แบบสแตนด์อโลนที่ไม่ได้อยู่ใน `D:/newkub/slides` monorepo — ถ้าต้องการสร้างใน `D:/newkub/slides` ให้ใช้ `/create-slide-in-newkub-slides` แทน

## Execute

### 1. Define Project

> Goal: กำหนดชื่อและตำแหน่ง project
> Goal: รู้ชื่อและตำแหน่งที่จะสร้าง

1. รับชื่อ project และตำแหน่งที่ต้องการสร้างจากผู้ใช้
2. ตรวจสอบว่าตำแหน่งนั้นว่างหรือไม่ — ถ้ามีอยู่แล้ว → ถามผู้ใช้ก่อนดำเนินการ
3. ถ้าผู้ใช้ไม่ระบุตำแหน่ง → ใช้ current directory

### 2. Scaffold Project

> Goal: สร้าง Slidev project ด้วย CLI
> Goal: project structure สร้างสำเร็จพร้อม dependencies

1. รัน `bun create slidev@latest {project-name}` ที่ตำแหน่งที่กำหนด
2. เลือก template เมื่อ CLI ถาม (default, seriph, apple-basic, bricks, academic)
3. รัน `bun install` ใน project directory
4. ตรวจสอบโครงสร้างไฟล์: `package.json`, `slides.md`, `components/`, `layouts/`, `public/`, `styles/`

### 3. Configure Headmatter

> Goal: ตั้งค่า headmatter ใน `slides.md`
> Goal: headmatter มีค่าที่เหมาะสมสำหรับ presentation

1. ตั้ง `theme` ตาม template ที่เลือก
2. ตั้ง `title` และ `info` ให้สื่อเนื้อหา
3. ตั้ง `transition: slide-left` เป็น default
4. เปิด `mdc: true` สำหรับ MDC syntax
5. ถ้าเป็นภาษาไทย → เพิ่ม `fonts` config:
   ```yaml
   fonts:
     sans: 'Noto Sans Thai'
     serif: 'Noto Sans Thai'
     mono: 'Noto Sans Thai'
   ```

### 4. Write Slide Content

> Goal: เขียนเนื้อหา slides ตามต้องการ
> Goal: slides มีโครงสร้างชัดเจน เริ่มต้นด้วย cover จบด้วย end

1. สร้าง title slide ด้วย `layout: cover`
2. เขียน content slides แต่ละ slide หนึ่ง concept
3. ใช้ `---` สำหรับแบ่ง slides
4. ใช้ layout ที่เหมาะสม: `default`, `two-cols`, `center`, `fact`, `section`, `quote`
5. สร้าง summary slide ด้วย `layout: end`

### 5. Run Dev Server

> Goal: dev server ทำงานและแสดง slides ได้

1. ทำ `/run-dev` เพื่อรัน `bunx slidev` ใน project directory
2. เปิด browser ที่ `http://localhost:3030`
3. ตรวจสอบว่า slides แสดงผลถูกต้อง

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Project Location

- สร้างในตำแหน่งที่ผู้ใช้กำหนด — ไม่จำกัดที่ `D:/newkub/slides`
- ถ้าต้องการสร้างใน `D:/newkub/slides` → ใช้ `/create-slide-in-newkub-slides` แทน
- project มี `package.json` ของตัวเอง — ไม่ใช่ shared root
- ใช้ Bun เป็น package manager

### 2. CLI Usage

- ใช้ `bun create slidev@latest {project-name}` สำหรับ scaffold
- ใช้ `bunx slidev` สำหรับ dev server
- ใช้ `bunx slidev build` สำหรับ build static site
- ใช้ `bunx slidev export` สำหรับ export PDF

### 3. Slide Structure

- หน้าแรกใช้ `layout: cover`
- หน้าสุดท้ายใช้ `layout: end`
- แต่ละ slide มีหนึ่ง concept
- ไม่เกิน 5 bullet points ต่อ slide
- ใช้ `v-click` สำหรับ step-by-step reveals

### 4. Non-Redundancy

- รายละเอียด Slidev syntax และ features อยู่ใน `/follow-slidev` แล้ว
- รายละเอียดการสร้างใน `D:/newkub/slides` อยู่ใน `/create-slide-in-newkub-slides` แล้ว
- ใช้ `/follow-slidev` สำหรับ best practices ของ Slidev

## Expected Outcome

- Standalone Slidev project สร้างสำเร็จพร้อม `package.json` ของตัวเอง
- `slides.md` มี headmatter และ content ครบถ้วน
- Dev server ทำงานได้ที่ port 3030
- สามารถ build หรือ export ได้
