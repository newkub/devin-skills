---
name: follow-tool-github-issue
description: ใช้ `gh issue` สร้าง ดู แก้ไข และจัดการ issues ของ repository ผ่าน CLI
related:
  - open-github-issue
  - open-github-pr
  - list-github-issue
  - create-github-issue
---

## Goal

ใช้ `gh issue` สร้าง ค้นหา ดู แก้ไข ปิด เปิด และจัดการ issues ของ repository ผ่าน CLI โดยใช้โหมด interactive หรือ flags

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `open-github-issue`, `open-github-pr`, `list-github-issue`, `create-github-issue`

ใช้กับ issues ของ repository ที่ `gh` รู้จัก (จาก current directory หรือ `--repo`) ไม่ครอบคลุม project management โดยตรง

## Execute

### 1. Verify Repository

> Goal: ตรวจสอบ repository เป้าหมายก่อนใช้ `gh issue`

1. รัน `gh repo view` เพื่อดู repository ปัจจุบัน
2. ถ้าไม่อยู่ใน repo หรือต้องการ repo อื่น ให้ใช้ `--repo [HOST/]OWNER/REPO`
3. ตรวจสอบสิทธิ์เขียน issue ด้วย `gh auth status`

### 2. List And View Issues

> Goal: ค้นหาและดูรายละเอียด issue

1. รัน `gh issue list` เพื่อดู open issues เริ่มต้น
2. รัน `gh issue list --state all --limit 50` เพื่อดูทั้ง open/closed
3. รัน `gh issue list --label bug --assignee "@me"` เพื่อกรองตาม label/assignee
4. รัน `gh issue status` เพื่อดู issues ที่เกี่ยวข้องกับตัวเอง
5. รัน `gh issue view <number>` เพื่อดูรายละเอียด
6. รัน `gh issue view <number> --comments` เพื่อดู comments ด้วย
7. รัน `gh issue view <number> --web` เพื่อเปิดในเบราว์เซอร์

### 3. Create Issues

> Goal: สร้าง issue ใหม่

1. รัน `gh issue create` เพื่อสร้างแบบ interactive (ถาม title/body ถ้าขาด)
2. รัน `gh issue create --title "<title>" --body "<body>"` เพื่อสร้างแบบ non-interactive
3. รัน `gh issue create -F body.md` เพื่ออ่าน body จากไฟล์
4. ใช้ `--label "<label>"`, `--assignee "@me"`, `--milestone "<name>"`, `--project "<title>"` เพื่อเติม metadata
5. ใช้ `--type <name>` และ `--parent <number>` สำหรับ issue types และ sub-issues
6. ใช้ `--web` เพื่อเปิดหน้า create ใน browser

### 4. Edit Issues

> Goal: แก้ไข metadata และเนื้อหาของ issue

1. รัน `gh issue edit <number> --title "<title>" --body "<body>"`
2. รัน `gh issue edit <number> --add-label bug --remove-label duplicate`
3. รัน `gh issue edit <number> --add-assignee "@me" --remove-assignee monalisa`
4. รัน `gh issue edit <number> --add-project "Roadmap" --remove-project v1`
5. รัน `gh issue edit <number> --type Bug --parent 100`
6. รัน `gh issue edit <number> --remove-milestone` หรือ `--milestone "v1.0"`

### 5. Manage Issue Lifecycle

> Goal: ปิด เปิด คอมเมนต์ ย้าย ลบ issue

1. รัน `gh issue close <number>` หรือ `gh issue reopen <number>`
2. รัน `gh issue comment <number> --body "<comment>"` เพื่อแสดงความคิดเห็น
3. รัน `gh issue pin <number>` หรือ `gh issue unpin <number>` เพื่อ pin/unpin
4. รัน `gh issue lock <number>` หรือ `gh issue unlock <number>` ด้วยความระมัดระวัง
5. รัน `gh issue transfer <number> <owner/repo>` เพื่อย้าย issue
6. รัน `gh issue delete <number> --yes` ด้วยความระมัดระวังหลังขออนุญาตผู้ใช้

### 6. Use Output And Automation

> Goal: ใช้ output ของ `gh issue` กับ scripts

1. ใช้ `--json` หรือ `--jq <expression>` เพื่อรับ output เป็น JSON
2. ใช้ `--template "<go-template>"` เพื่อจัดรูปแบบ output
3. ใช้ `--search "<query>"` สำหรับ advanced search syntax
4. ระบุ `--repo` หรือ `-R` เสมอเมื่อรันนอก repo

## Rules

### 1. Repository Target

- `gh issue` ใช้ repo จาก git remote ของ current directory
- ใช้ `--repo [HOST/]OWNER/REPO` เพื่อระบุ repo อื่น
- ใช้ `-R` เป็น short form ของ `--repo`

### 2. Interactive Mode

- `gh issue create` จะถาม title/body ถ้าขาด flags และรันบน TTY
- `gh issue create --editor` เปิด `$EDITOR` แทน prompt
- `gh issue comment` จะถาม body ถ้าขาด `--body`
- ใน scripts หรือ CI ให้ระบุ flags ครบถ้วนเพื่อหลีกเลี่ยง interactive

### 3. Issue Types And Relationships

- ใช้ `--type <name>` เพื่อกำหนด issue type (ถ้า repo เปิดใช้งาน)
- ใช้ `--parent <number>` หรือ `--add-sub-issue <number>` เพื่อสร้าง parent/sub-issue relationships
- ใช้ `--blocked-by <numbers>` และ `--blocking <numbers>` เพื่อระบุ dependencies

### 4. Project Integration

- ใช้ `--project "<title>"` กับ `gh issue create` เพื่อเพิ่ม issue เข้า project
- ใช้ `--add-project "<title>"` กับ `gh issue edit` เพื่อเพิ่มเข้า project เพิ่มเติม
- ต้องการ token scope `project` จึงจะเชื่อมโยงกับ project ได้

### 5. Safety

- คำสั่ง `delete`, `close`, `lock`, `transfer` เป็น destructive/irreversible ต้องถามผู้ใช้ก่อน
- ตรวจสอบ issue number/repo ก่อนเปลี่ยนสถานะ
- ใช้ `gh issue close` แทน `delete` ถ้าต้องการปิดเท่านั้น

## Expected Outcome

- สามารถสร้าง ค้นหา แก้ไข และจัดการ lifecycle ของ issues ผ่าน `gh issue` ได้
- ใช้งานได้ทั้ง interactive และ scripted
- Issues เชื่อมโยงกับ project/labels/assignees/milestones ถูกต้อง
- ไม่มี issue ถูกลบ/ย้าย/ปิดโดยไม่ได้รับอนุญาต
