---
name: follow-tool-github-project
description: ใช้ `gh project` จัดการ GitHub Projects ผ่าน CLI แบบ interactive และ scripted
---

## Goal

ใช้ `gh project` สร้าง ดู แก้ไข และจัดการ items/fields ใน GitHub Projects ผ่าน CLI โดยใช้โหมด interactive หรือ flags ตามสถานการณ์

## Scope

ใช้กับ GitHub Projects (Projects v2) ของผู้ใช้ องค์กร หรือ repository ที่เชื่อมโยง ไม่ครอบคลุม `gh issue` หรือ `gh pr` โดยตรง

## Execute

### 1. Verify Authentication And Scope

> Goal: ตรวจสอบสิทธิ์ก่อนใช้ `gh project`

1. รัน `gh auth status` เพื่อตรวจสอบ scopes ปัจจุบัน
2. ถ้าไม่มี `project` scope ให้รัน `gh auth refresh -s project`
3. ถ้ายังไม่ login ให้รัน `gh auth login` ก่อน

### 2. List And View Projects

> Goal: ค้นหาและดูรายละเอียด project

1. รัน `gh project list --owner "@me"` เพื่อดู projects ของตัวเอง
2. รัน `gh project list --owner <org>` เพื่อดู projects ขององค์กร
3. รัน `gh project view <number>` เพื่อดู project ใน terminal
4. รัน `gh project view <number> --web` เพื่อเปิดในเบราว์เซอร์

### 3. Create And Edit Projects

> Goal: สร้างหรือปรับแต่ง project

1. รัน `gh project create --title "<title>" --owner "@me"` เพื่อสร้าง project
2. ถ้าอยู่บน TTY และไม่ได้ระบุ flags ที่จำเป็น `gh` จะถามแบบ interactive
3. รัน `gh project edit <number> --title "<title>"` เพื่อแก้ไขชื่อ
4. รัน `gh project edit <number> --description "<desc>" --visibility PUBLIC` เพื่อแก้ไขรายละเอียด
5. รัน `gh project close <number>` หรือ `gh project close <number> --undo` เพื่อปิด/เปิด project ใหม่
6. อย่าลบ project โดยไม่ได้รับอนุญาตจากผู้ใช้

### 4. Manage Project Items

> Goal: เพิ่ม ลบ หรือแก้ไข items ใน project

1. รัน `gh project item-list <number> --owner "@me"` เพื่อดู items
2. รัน `gh project item-list <number> --query "assignee:@me is:open"` เพื่อกรอง items
3. รัน `gh project item-add <number> --url <issue-or-pr-url>` เพื่อเพิ่ม issue/PR เข้า project
4. รัน `gh project item-create <number> --title "<title>" --body "<body>"` เพื่อสร้าง draft item
5. ใช้ `gh project item-edit --id <item-id> --field-id <field-id> --project-id <project-id> --text "..."` เพื่อแก้ไข field ของ item
6. รัน `gh project item-archive <number> --id <item-id>` หรือ `gh project item-archive <number> --id <item-id> --undo`
7. รัน `gh project item-delete <number> --id <item-id>` ด้วยความระมัดระวัง

### 5. Inspect And Create Fields

> Goal: ดูหรือสร้าง custom fields

1. รัน `gh project field-list <number> --owner "@me"` เพื่อดู fields และ field IDs
2. รัน `gh project field-create <number> --name "<name>" --data-type "TEXT"` เพื่อสร้าง field
3. ใช้ field IDs จาก JSON output เพื่ออ้างอิงใน `item-edit`

### 6. Use Output And Automation

> Goal: ใช้ output ของ `gh project` กับ scripts

1. ใช้ `--json` หรือ `--jq <expression>` เพื่อรับ output เป็น JSON
2. ใช้ `--template "<go-template>"` เพื่อจัดรูปแบบ output
3. ใช้ `gh project item-list <number> --query "..."` เพื่อกรอง items ด้วย syntax ของ Projects
4. สำหรับ automation ให้ระบุ flags ครบ ไม่พึ่ง interactive prompt

## Rules

### 1. Authentication

- `gh project` ต้องการ token scope `project` ก่อนใช้งาน
- ตรวจสอบด้วย `gh auth status` แล้วรัน `gh auth refresh -s project` ถ้าขาด

### 2. Owner And Project Number

- ใช้ `--owner "@me"` สำหรับผู้ใช้ปัจจุบัน
- ใช้ `--owner <org>` สำหรับองค์กร
- หลายคำสั่งใช้ project `number` (ลำดับของ owner) ไม่ใช่ GraphQL ID

### 3. Interactive Mode

- ถ้ารันบน TTY และขาด flags ที่จำเป็น `gh` จะแสดง interactive prompt
- ใน scripts หรือ CI ให้ระบุ flags ทั้งหมดเพื่อหลีกเลี่ยง interactive prompt
- ใช้ `--web` เปิดหน้า project ในเบราว์เซอร์เมื่อจำเป็น

### 4. Item And Field IDs

- `item-edit` ต้องการ `--id`, `--field-id`, `--project-id`; `field-delete` ต้องการ `--id`
- ใช้ `--json` กับ `item-list` หรือ `field-list` เพื่อดึง IDs ที่ถูกต้อง
- ใช้ `--text`, `--number`, `--date`, `--single-select-option-id`, `--iteration-id`, `--clear` ตามประเภท field

### 5. Safety

- คำสั่งลบ/ปิด project (`delete`, `close`) เป็น destructive operation ต้องถามผู้ใช้ก่อน
- ตรวจสอบ owner และ project number ก่อนลบ/ปิด
- ใช้ `gh project close <number> --undo` แทนการลบ ถ้าเป้าหมายคือซ่อนชั่วคราว

## Expected Outcome

- สามารถสร้าง ดู แก้ไข และจัดการ GitHub Projects ผ่าน `gh project` ได้
- ใช้งานได้ทั้ง interactive (TTY) และ scripted (flags)
- Token มี scope `project` และ owner ระบุถูกต้อง
- ไม่มี project ถูกลบหรือปิดโดยไม่ได้รับอนุญาต
