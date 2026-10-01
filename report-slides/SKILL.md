---
name: report-slides
description: สร้าง Slidev presentation สรุปหัวข้อที่ระบุใน `.devin/temp/` — slide report ชั่วคราว
argument-hint: "[topic]"
related:
  - report
  - learn
  - follow-create-slide-slidev
  - convert-to-lang-th
  - delete-project-temp
  - open-web
---

## Goal

สร้าง Slidev presentation สรุป concept, tool, library หรือหัวข้อที่ user ระบุเป็น slides ภาษาไทยใน `.devin/temp/slides/{topic}/` — เป็น report artifact ชั่วคราว ไม่เก็บถาวรใน repo

## Scope

ใช้สำหรับสร้าง slide report เพื่อนำเสนอหรือแชร์ความรู้แบบชั่วคราว — output อยู่ใน `.devin/temp/` เท่านั้น (ล้างได้ด้วย `/delete-project-temp`)

## Execute

### 1. Define Topic

> Goal: รู้หัวข้อและชื่อ slide

1. ระบุหัวข้อ (concept, tool, library, framework)
2. กำหนดชื่อ slide folder (เช่น `rust`, `solidjs`, `drizzle`)
3. กำหนดระดับความลึก (overview, intermediate, deep)
4. ระบุคำถามหลักที่ต้องการคำตอบ

### 2. Research

> Goal: รวบรวมเนื้อหาก่อนเขียน slides

1. ทำ `/learn` สำหรับ concept, tool, หรือ library ที่ต้องการ
2. บันทึก core concepts, code examples, และ best practices
3. ระบุ key points ที่จะนำไปทำ slides

### 3. Create Slide File

> Goal: สร้าง `slides.md` ใน temp

1. สร้าง `.devin/temp/slides/{topic}/slides.md` พร้อม frontmatter มาตรฐาน (`theme`, `title`)
2. ไม่สร้าง `package.json` — `bunx slidev` resolve dependencies เอง
3. ทำ `/convert-to-lang-th` — เนื้อหา slides เป็นภาษาไทย

### 4. Write Slide Content

> Goal: เขียน content จากข้อมูลที่ research มา

1. สร้าง title slide พร้อมชื่อ topic และ overview
2. สร้าง concept slides อธิบาย core concepts ทีละหัวข้อ
3. สร้าง code example slides พร้อม syntax highlighting
4. สร้าง comparison slides ถ้าเปรียบเทียบกับสิ่งที่รู้จัก
5. สร้าง best practices slide
6. สร้าง summary slide สรุป key takeaways
7. เพิ่ม `v-click` และ `v-motion` สำหรับ animations ตามต้องการ

### 5. Run And Open

> Goal: render slides ให้ user ดูได้ทันที

1. `cd .devin/temp/slides/{topic}` แล้วรัน `bunx slidev slides.md`
2. ทำ `/open-web` เพื่อเปิด `http://localhost:3030`
3. ตรวจสอบว่า slides แสดงผลถูกต้อง

## Rules

### 1. Temp Only

- สร้างใน `.devin/temp/slides/{topic}/` เท่านั้น — ห้ามเขียนลง repo หรือ `D:/newkub/slides/`
- ไม่สร้าง `package.json` — `bunx slidev` พอ
- `.devin/temp/` เป็น artifact zone — ล้างได้ด้วย `/delete-project-temp` ไม่กระทบ project

### 2. Content Structure

- เริ่มจาก overview ก่อน deep dive
- แต่ละ slide มีหนึ่ง concept เท่านั้น
- ใช้ code examples สำหรับทุก concept
- ใช้ comparison tables สำหรับเปรียบเทียบ
- สรุป key takeaways ใน slide สุดท้าย

### 3. Slide Quality

- ทำ `/follow-create-slide-slidev` สำหรับ Slidev best practices
- ใช้ `v-click` สำหรับ step-by-step reveals
- ใช้ transition สำหรับ slide transitions
- ไม่เกิน 5 bullet points ต่อ slide

### 4. Learning Integration

- ใช้ข้อมูลจาก `/learn` โดยตรง
- ไม่เขียน content ใหม่นอกจากที่ research มา
- บันทึก lessons learned ใน slide สุดท้าย
- ทำ `/convert-to-lang-th` — เนื้อหาและคำอธิบายเป็นภาษาไทย
- ใช้ technical terms ภาษาอังกฤษเมื่อจำเป็น เช่น `ownership`, `borrowing`, `async`

## Expected Outcome

- Slidev `slides.md` สร้างใน `.devin/temp/slides/{topic}/`
- Slides สรุปความรู้เป็นภาษาไทย พร้อม code examples และ best practices
- Dev server ทำงานได้ที่ port 3030
- Browser เปิดอัตโนมัติและแสดง slides
- พร้อมแชร์กับทีม — ลบทิ้งได้ทุกเมื่อผ่าน `/delete-project-temp`
