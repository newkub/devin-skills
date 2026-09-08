# Standalone Slidev Project (merged from create-slide-via-slidev)

## Goal

สร้าง standalone Slidev project ด้วย `bun create slidev` ในตำแหน่งที่ผู้ใช้กำหนด พร้อม `package.json` และ `slides.md` ของตัวเอง

## Scope

ใช้สำหรับการสร้าง Slidev project แบบสแตนด์อโลนที่ไม่ได้อยู่ใน `D:/newkub/slides` monorepo — ถ้าต้องการสร้างใน `D:/newkub/slides` ให้ใช้ `/create-slide-in-newkub-slides` แทน

## Execute

### 1. Define Project

1. รับชื่อ project และตำแหน่งที่ต้องการสร้างจากผู้ใช้
2. ตรวจสอบว่าตำแหน่งนั้นว่างหรือไม่ — ถ้ามีอยู่แล้ว → ถามผู้ใช้ก่อนดำเนินการ
3. ถ้าผู้ใช้ไม่ระบุตำแหน่ง → ใช้ current directory

### 2. Scaffold Project

1. รัน `bun create slidev@latest {project-name}` ที่ตำแหน่งที่กำหนด
2. เลือก template เมื่อ CLI ถาม (default, seriph, apple-basic, bricks, academic)
3. รัน `bun install` ใน project directory
4. ตรวจสอบโครงสร้างไฟล์: `package.json`, `slides.md`, `components/`, `layouts/`, `public/`, `styles/`

### 3. Configure Headmatter

1. ตั้ง `theme` ตาม template ที่เลือก
2. ตั้ง `title` และ `info` ให้สื่อเนื้อหา
3. ตั้ง `transition: slide-left` เป็น default
4. เปิด `mdc: true` สำหรับ MDC syntax
5. ถ้าเป็นภาษาไทย → เพิ่ม `fonts` config ด้วย `Noto Sans Thai`

### 4. Write Slide Content

1. สร้าง title slide ด้วย `layout: cover`
2. เขียน content slides แต่ละ slide หนึ่ง concept
3. ใช้ `---` สำหรับแบ่ง slides
4. ใช้ layout ที่เหมาะสม: `default`, `two-cols`, `center`, `fact`, `section`, `quote`
5. สร้าง summary slide ด้วย `layout: end`

### 5. Run Dev Server

1. ทำ `/run-dev` เพื่อรัน `bunx slidev` ใน project directory
2. เปิด browser ที่ `http://localhost:3030`
3. ตรวจสอบว่า slides แสดงผลถูกต้อง

## Rules

- สร้างในตำแหน่งที่ผู้ใช้กำหนด — ไม่จำกัดที่ `D:/newkub/slides`
- project มี `package.json` ของตัวเอง — ไม่ใช่ shared root
- ใช้ Bun เป็น package manager
- หน้าแรกใช้ `layout: cover`, หน้าสุดท้ายใช้ `layout: end`
- แต่ละ slide มีหนึ่ง concept และไม่เกิน 5 bullet points
- ใช้ `v-click` สำหรับ step-by-step reveals

## Expected Outcome

- Standalone Slidev project สร้างสำเร็จพร้อม `package.json` ของตัวเอง
- `slides.md` มี headmatter และ content ครบถ้วน
- Dev server ทำงานได้ที่ port 3030
- สามารถ build หรือ export ได้
