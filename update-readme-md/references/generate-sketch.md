# Step: Generate UI Sketch

> Goal: สร้าง UX/UI sketch สำหรับ README

## Execute

1. ทำ `/report-markdown-ansi` เพื่อวาด layout หลักของ workspace เฉพาะหน้าหลักหรือหน้าที่สำคัญที่สุด
2. แปลง sketch เป็น text codeblock (ไม่ใช่ ANSI) สำหรับใส่ใน README
3. วาง sketch ด้านบน Get Started โดยไม่ต้องมี heading
4. ถ้า sketch fail → retry (max 3 → stop/report)

## Rules

- UI Sketch: text codeblock ไม่ใช่ ANSI
- ไม่มี ANSI ใต้ logo/badges ใน Hero section
- ไม่มี report ANSI ใน Hero section — ANSI อยู่ที่ Usage section เท่านั้น
