# Usage Section

> Goal: เขียน `## Usage` ครอบคลุมทุก access method พร้อม ANSI drawing

## Section Structure

`## Usage` ต้องมี `### Usage via ...` สำหรับแต่ละ access method ที project รองรับ:

- Web
- API
- CLI
- SDK
- TUI
- Desktop
- Browser Extension

## Content Types

### Usage via Web

- ห่มเนื้อหาด้วย `<details>` + `<summary>` accordion
- summary ระบุ flow/screen สั้นๆ เช่น `Web app click flow & layout`
- ภายใน: text instructions บอกว่ากดอะไรตรงไหน + ANSI drawing แสดง layout

### Usage via API

- code block พร้อม import และ function call
- ตัวอย่างต้อง runnable ได้
- ตามด้วย references table `| api | description | options | default |`

### Usage via CLI

- bash code block พร้อม `command --help`
- ANSI drawing ต้องแสดง terminal output ของ `--help` โดยเฉพาะ
- รวม Usage, Options, Commands/Subcommands ทีปรากฏใน help

### Usage via SDK

- code block พร้อม install + import + usage
- ตัวอย่างครบทั้ง 3 ส่วน
- ตามด้วย references table ถ้ามี

### Usage via TUI

- ห่มเนื้อหาด้วย `<details>` + `<summary>` accordion
- summary ระบุ TUI flow เช่น `TUI keyboard shortcuts & layout`
- ภายใน: text instructions บอก key shortcuts + ANSI drawing แสดง TUI layout

### Usage via Desktop / Browser Extension

- text instructions บอกวิธีเปิด/ติดตั้งและใช้งาน
- ตามด้วย ANSI drawing แสดง layout เมื่อเหมาะสม

## Accordion Rules

- `Usage via Web` และ `Usage via TUI` ต้องห่มเนื้อหาด้วย `<details>` + `<summary>`
- `<details>` block ต้องมี blank line ก่อนเปิดและก่อนปิด
- ภายใน accordion ต้องประกอบด้วย text instructions + ANSI drawing

## ANSI Rules

- ใช้ ` ```text ` codeblock (ไม่ใช้ ` ```ansi `)
- ใช้ ANSI box-drawing characters วาด layout/output
- ทุกบรรทัดต้องมีความยาวเท่ากัน — ใช้ space padding ให้ขอบขวาตรงกัน
- ความกว้างควรเท่ากันทุกบรรทัด — ใช้ fixed width เช่น 60 ตัวอักษร
- ไม่ต้องใช้ `/capture-web` หรือ `/capture-terminal` สำหรับ README
