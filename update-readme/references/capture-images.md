# Step: Draw Usage ANSI

> Goal: วาด ANSI ประกอบสำหรับ Usage section แทนการ capture image

## Execute

### 1. Draw Web Usage ANSI

> Goal: วาด ANSI แสดง layout หน้าเว็บสำหรับ Usage via Web

1. วาด layout หลักของหน้าเว็บด้วย box-drawing characters
2. แสดง key UI elements: header, main content, buttons, inputs
3. ใช้ ` ```text ` codeblock
4. ทุกบรรทัดต้องมีความยาวเท่ากัน — ใช้ space padding ให้ขอบขวาตรงกัน

### 2. Draw CLI Usage ANSI

> Goal: วาด ANSI แสดง terminal output สำหรับ Usage via CLI

1. วาด terminal window ด้วย box-drawing characters
2. แสดง command และ output ตัวอย่าง
3. ใช้ ` ```text ` codeblock
4. ทุกบรรทัดต้องมีความยาวเท่ากัน

### 3. Draw Other Usage ANSI

> Goal: วาด ANSI สำหรับ access methods อื่นๆ (TUI, Desktop, Extension)

1. วาด layout หรือ output ที่เหมาะสมด้วย box-drawing characters
2. ใช้ ` ```text ` codeblock
3. ทุกบรรทัดต้องมีความยาวเท่ากัน

## Rules

- ไม่ต้องใช้ `/capture-web` หรือ `/capture-terminal` สำหรับ README
- ใช้ ANSI box-drawing characters วาดแทนการ capture image จริง
- ทุกบรรทัดใน ANSI codeblock ต้องมีความยาวเท่ากัน — ใช้ space padding ให้ขอบขวาตรงกัน
- ใช้ ` ```text ` codeblock (ไม่ใช่ ` ```ansi ` เพื่อหลีกเลี่ยง color rendering ใน GitHub)
- ตรวจทุกบรรทัดว่ามี box-drawing border ครบทั้งซ้ายและขวา
- ความกว้างควรเท่ากันทุกบรรทัด — ใช้ fixed width เช่น 60 ตัวอักษร
- ไม่มี ANSI ใต้ logo/badges ใน Hero section
