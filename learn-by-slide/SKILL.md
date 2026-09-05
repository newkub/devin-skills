---
name: learn-by-slide
description: เรียนรู้และสร้าง Slidev presentation สรุปความรู้ใน D:/newkub/slides/learn/
argument-hint: "[topic]"
related:
  - learn
  - create-slide-in-newkub-slides
  - translate-to-lang-th
  - open-web
  - follow-framework-slidev
---

## Goal

เรียนรู้ concept, tool, หรือ library และสร้าง Slidev presentation สรุปความรู้เป็น slides ภาษาไทยใน `D:/newkub/slides/learn/`

## Scope

ใช้สำหรับเรียนรู้สิ่งใหม่และสร้าง presentation slides สรุปความรู้เพื่อแชร์กับทีม

## Execute

### 1. Define Learning Target

> Goal: Define Learning Target

กำหนดเป้าหมายการเรียนรู้และชื่อ slide:

1. ระบุสิ่งที่ต้องการเรียนรู้ (concept, tool, library, framework)
2. กำหนดชื่อ slide project (เช่น `rust`, `solidjs`, `drizzle`)
3. กำหนดระดับความลึก (overview, intermediate, deep)
4. ระบุคำถามหลักที่ต้องการคำตอบ

### 2. Deep Research

> Goal: Deep Research

ทำ `/learn` เพื่อเรียนรู้และรวบรวมข้อมูล:

1. ทำ `/learn` สำหรับ concept, tool, หรือ library ที่ต้องการ
2. บันทึก core concepts, code examples, และ best practices
3. ระบุ key points ที่จะนำไปทำ slides

### 3. Create Slide Project

> Goal: Create Slide Project

ทำ `/create-slide-in-newkub-slides` สำหรับสร้าง Slidev project:

1. สร้าง project ใน `D:/newkub/slides/learn/{topic-name}`
2. ไม่ต้องสร้าง `package.json` — dependencies อยู่ที่ root `D:/newkub/slides/package.json` แล้ว
3. สร้าง `slides.md` พร้อม frontmatter มาตรฐาน
4. ทำ `/translate-to-lang-th` — เนื้อหา slides เป็นภาษาไทย

### 4. Write Slide Content

> Goal: Write Slide Content

เขียน content จากข้อมูลที่เรียนรู้:

1. สร้าง title slide พร้อมชื่อ topic และ overview
2. สร้าง concept slides อธิบาย core concepts ทีละหัวข้อ
3. สร้าง code example slides พร้อม syntax highlighting
4. สร้าง comparison slides ถ้าเปรียบเทียบกับสิ่งที่รู้จัก
5. สร้าง best practices slide
6. สร้าง summary slide สรุป key takeaways
7. เพิ่ม `v-click` และ `v-motion` สำหรับ animations ตามต้องการ

### 5. Run And Open

> Goal: Run And Open

รัน dev server และเปิด browser:

1. รัน `bunx slidev learn/{topic-name}/slides.md` ที่ root directory `D:/newkub/slides`
2. ทำ `/open-web` เพื่อเปิด `http://localhost:3030`
3. ตรวจสอบว่า slides แสดงผลถูกต้อง

## Rules

### 1. Project Location

- สร้าง project ใน `D:/newkub/slides/learn/{topic-name}` เท่านั้น
- ไม่สร้าง `package.json` ของ project — ใช้ root `package.json` อย่างเดียว
- ใช้ Bun เป็น package manager
- ไม่ใช้ `bun create slidev` แต่ติดตั้ง dependencies ที่ root ครั้งเดียว

### 2. Content Structure

- เริ่มจาก overview ก่อน deep dive
- แต่ละ slide มีหนึ่ง concept เท่านั้น
- ใช้ code examples สำหรับทุก concept
- ใช้ comparison tables สำหรับเปรียบเทียบ
- สรุป key takeaways ใน slide สุดท้าย

### 3. Slide Quality

- ทำ `/follow-framework-slidev` สำหรับ Slidev best practices
- ใช้ `v-click` สำหรับ step-by-step reveals
- ใช้ transition สำหรับ slide transitions
- ไม่เกิน 5 bullet points ต่อ slide

### 4. Learning Integration

- ใช้ข้อมูลจาก `/learn` โดยตรง
- ไม่เขียน content ใหม่นอกจากที่ research มา
- บันทึก lessons learned ใน slide สุดท้าย
- ทำ `/translate-to-lang-th` — เนื้อหาและคำอธิบายเป็นภาษาไทย
- ใช้ technical terms ภาษาอังกฤษเมื่อจำเป็น เช่น `ownership`, `borrowing`, `async`

## Expected Outcome

- เข้าใจ concept, tool, หรือ library อย่างลึกซึ้ง
- Slidev project สร้างใน `D:/newkub/slides/learn/{topic-name}`
- ไม่มี `package.json` ของ project — ใช้ root `package.json` อย่างเดียว
- Slides สรุปความรู้เป็นภาษาไทย พร้อม code examples และ best practices
- Dev server ทำงานได้ที่ port 3030
- Browser เปิดอัตโนมัติและแสดง slides
- พร้อมแชร์กับทีม