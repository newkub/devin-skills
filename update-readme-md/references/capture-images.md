# Step: Draw Usage ANSI

> Goal: วาด ANSI ประกอบสำหรับ Usage section แทนการ capture image

## Execute

### 1. Draw Web Usage ANSI

> Goal: วาด ANSI แสดง layout หน้าเว็บสำหรับ Usage via Web

1. ห่มเนื้อหาด้วย `<details>` + `<summary>` accordion
2. ภายในวาด layout หลักของหน้าเว็บด้วย box-drawing characters
3. แสดง key UI elements: header, main content, buttons, inputs
4. ใช้ ` ```text ` codeblock
5. ทุกบรรทัดต้องมีความยาวเท่ากัน — ใช้ space padding ให้ขอบขวาตรงกัน

### 2. Draw CLI `--help` ANSI

> Goal: วาด ANSI แสดง terminal output ของ `command --help` สำหรับ Usage via CLI

1. แสดง command `bunx <package> --help` หรือ `<cli-binary> --help` ใน bash codeblock
2. วาด terminal output ของ `--help` ด้วย box-drawing characters
3. รวม Usage, Options, Commands/Subcommands ทีปรากฏใน help
4. ใช้ ` ```text ` codeblock
5. ทุกบรรทัดต้องมีความยาวเท่ากัน

### 3. Draw TUI Usage ANSI

> Goal: วาด ANSI แสดง TUI layout สำหรับ Usage via TUI

1. ห่มเนื้อหาด้วย `<details>` + `<summary>` accordion
2. ภายในบอก key shortcuts (เช่น `↑`/`↓`, `Enter`, `q`)
3. วาด TUI screen ด้วย box-drawing characters
4. ใช้ ` ```text ` codeblock
5. ทุกบรรทัดต้องมีความยาวเท่ากัน

### 4. Draw Other Usage ANSI

> Goal: วาด ANSI สำหรับ access methods อื่นๆ (Desktop, Extension)

1. วาด layout หรือ output ที่เหมาะสมด้วย box-drawing characters
2. ใช้ ` ```text ` codeblock
3. ทุกบรรทัดต้องมีความยาวเท่ากัน

## Rules

- ไม่ต้องใช้ `/capture-web` หรือ `/capture-terminal` สำหรับ README
- ใช้ ANSI box-drawing characters วาดแทนการ capture image จริง
- `Usage via Web` และ `Usage via TUI` ต้องอยู่ใน `<details>` + `<summary>` accordion
- CLI: แสดง ANSI ของ `command --help` โดยเฉพาะ
- ทุกบรรทัดใน ANSI codeblock ต้องมีความยาวเท่ากัน — ใช้ space padding ให้ขอบขวาตรงกัน
- ใช้ ` ```text ` codeblock (ไม่ใช้ ` ```ansi ` เพื่อหลีกเลี่ยง color rendering ใน GitHub)
- ตรวจทุกบรรทัดว่ามี box-drawing border ครบทั้งซ้ายและขวา
- ความกว้างควรเท่ากันทุกบรรทัด — ใช้ fixed width เช่น 60 ตัวอักษร
- ไม่มี ANSI ใต้ logo/badges ใน Hero section
