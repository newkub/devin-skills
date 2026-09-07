---
name: create-github-issue
description: สร้าง ค้นหา แก้ไข ปิด เปิดใหม ลบ และจัดการ GitHub issues ผ่าน `gh` CLI
argument-hint: "[action] [repo]"
related:
  - follow-github-issue-templates
  - implement-github-issue-by-me
  - create-github-pr
  - update-github-issue
  - ask-me
  - open-github
  - list-github-issue
  - open-web
---

## Goal

ใช้ `gh issue` เพื่อสร้าง ค้นหา ดู แก้ไข ปิด เปิดใหม ลบ และจัดการ repository issues ผ่าน CLI ทั้งแบบ interactive และ scripted

## Scope

- ใช้ร่วมกับ skills: `/open-github`, `/open-github`, `/list-github-issue`, `/follow-github-issue-templates`, `/create-github-pr`, `/review-issue`, `/update-github-issue`
- รองรับ repo ปัจจุบัน หรือ `--repo owner/repo`
- ไม่ใช่ project management tool ครบวงจร

ดูเพิ่มเติม: `/implement-github-issue-by-me`, `/ask-me`, `/open-github`, `/open-github`, `/open-github`, `/open-web`

## Execute

### 1. Verify Repository And Auth

> Goal: ยืนยัน target repo

1. รัน `gh auth status`
2. รัน `gh repo view` เพื่อดู repo ปัจจุบัน
3. ถ้าอยู่นอก repo ให้ใช้ `--repo owner/repo` ทุก command
4. ตรวจสอบสิทธิ์ create/edit issues

### 2. List And View Issues

> Goal: ค้นหาและตรวจสอบ issues

1. `gh issue list --state all --limit 50` สำหรับ open/closed
2. `gh issue list --label <label> --assignee <user>` เพื่อกรอง
3. `gh issue view <number>` สำหรับรายละเอียด
4. `gh issue view <number> --comments` สำหรับ comments
5. `gh issue view <number> --web` เพื่อเปิดใน browser

### 3. Check Duplicates

> Goal: หลีกเลี่ยง duplicate issues

1. `gh issue list --search "<title>" --limit 10`
2. ถ้า duplicate → update issue เดิมและระบุ `duplicateOf`
3. ถ้าไม่ duplicate → สร้างใหม

### 4. Use Issue Template

> Goal: Format body ตาม issue type

1. ถ้า repo มี `.github/ISSUE_TEMPLATE/*.yml` → ใช้ repo templates
2. ถ้า repo ไม่มี templates → อ่าน `create-github-issue/templates/index.md` เลือก type ที่ตรง:
   - `bug` → `templates/bug.md`
   - `feature` → `templates/feature.md`
   - `idea` → `templates/idea.md`
   - `plan` → `templates/plan.md`
   - `question` → `templates/question.md`
3. ถ้า type เป็น `idea` → วาด ANSI UI sketch เองโดยอ่านไฟล์ project จริง ไม่ใช้ placeholder ใส่ sketch จริงข้างใน code fence
4. อ่าน template ที่เลือกแล้วแทนที่ placeholders ด้วยข้อมูลจริง
5. Title ต้องเป็น English Title Case ไม่เกิน 80 ตัวอักษร
6. Description ใช้ภาษาอังกฤษ ยกเว้น technical terms, project/skill names, paths, commands

### 5. Create Issue

> Goal: สร้าง issue บน GitHub

1. `gh issue create` แบบ interactive
2. หรือ `gh issue create --title "<title>" --body "<body>"`
3. หรือ `gh issue create -F body.md` อ่าน body จาก file
4. เพิ่ม `--label`, `--assignee`, `--milestone`, `--project`, `--type`, `--parent` ตามจำเป็น
5. ถ้าเป็น project item → `gh project item-add <project-id>`
6. ใช้ `--web` เพื่อเปิดหน้า create ใน browser

### 5.5 Create Idea-Feature Comments

> Goal: เพิ่ม comment หนึ่ง comment ต่อหน่วง idea โดยใช้ template `idea`

1. อ่าน `create-github-issue/templates/idea.md`
2. แทนที่ placeholders:
   - `{{number}}`, `{{feature}}`, `{{type}}`, `{{why}}`, `{{benefit}}`, `{{impact}}`, `{{phase}}`, `{{effort}}`, `{{mvpScore}}`, `{{risk}}`
   - `{{uxui-sketch}}` ด้วย ANSI box-drawing sketch จริงจาก project analysis
   - `{{todo-table}}` ด้วยแถว `| action | files | dependencies | workspace |`
3. ตรวจ format:
   - ตารางต้องเป็น `| Feature | Type | Why | Benefit | Impact | Phase | Effort | MVP Score | Risk |`
   - header, separator, และแต่ละแถวต้องอยู่บนบรรทัดเดียว ห้ามขึ้นบรรทัดใหมภายใน cell
   - นับ `|` เพื่อยืนยัน summary row มี 10 pipes (9 คอลัมน์) และ Todo row มี 5 pipes (4 คอลัมน์)
   - `Todo` ต้องเป็นตารางมีคอลัมน์ `Action`, `Files`, `Dependencies`, `Workspace`
   - `UX/UI Sketch` ต้องเป็น ANSI art จริง ไม่ใช่ text description หัวข้อต้องไม่มี `(ANSI)`
4. Post ด้วย `gh issue comment <number> --body-file <comment.md>`

### 6. Update And Edit Issues

> Goal: อัปเดต metadata และเนื้อหา

1. `gh issue edit <number> --title "<title>" --body "<body>"`
2. `gh issue edit <number> --add-label bug --remove-label duplicate`
3. `gh issue edit <number> --add-assignee <user> --remove-assignee <user>`
4. `gh issue edit <number> --add-project "<title>" --remove-project <id>`
5. `gh issue edit <number> --milestone "v1.0"` หรือ `--remove-milestone`
6. `gh issue edit <number> --type Bug --parent <number>`

สำหรับ workflow update เต็มรูปแบบ ใช้ `/update-github-issue` ด้วย

### 7. Manage Issue Lifecycle

> Goal: ปิด เปิดใหม comment ปักหมุด ย้าย ลบ

1. `gh issue close <number>` หรือ `gh issue reopen <number>`
2. `gh issue comment <number> --body "<comment>"`
3. `gh issue pin <number>` / `gh issue unpin <number>`
4. `gh issue lock <number>` / `gh issue unlock <number>` ระวัง
5. `gh issue transfer <number> <owner/repo>` เพื่อย้าย
6. `gh issue delete <number> --yes` ต้องถาม user ก่อน ถ้าจริง ๆ ใช้ `close` ดีกว่า `delete`

### 8. Verify And Report

> Goal: ยืนยันความสำเร็จและส่งมอบ

1. ตรวจสอบว่า issue ถูกสร้าง/แก้ไขสำเร็จ
2. `gh issue view <number>` สำหรับตรวจสอบสุดท้าย
3. หลังสร้าง เปิดใน browser ด้วย `/open-web` หรือ `gh issue view <number> --web`
4. รายงาน issue URL กลับ

## Rules

### 1. Repository Target

- `gh issue` ใช้ repo จาก git remote ของ directory ปัจจุบัน
- ใช้ `--repo owner/repo` หรือ `-R` สำหรับ repo อื่น

### 2. Language

- Title และ description ใช้ภาษาอังกฤษ
- ยกเว้น technical terms, project/skill names, paths, commands และ repo conventions ที่กำหนดภาษาอื่น
- ถ้า repo conventions ไม่ระบุภาษา ใช้ English เป็น default

### 3. Issue Title

- ขึ้นต้นด้วย issue type (`Bug:`, `Feature:`, `Enhancement:`, `Docs:`)
- ใช้ Title Case
- ไม่เกิน 80 ตัวอักษร
- ตัวอย่าง: `Bug: Login fails after timeout`

### 4. Issue Description

- ใช้ `create-github-issue/templates/<type>.md` ตาม type ที่เลือก
- แทนที่ placeholders ด้วยข้อมูลจริง
- ถ้า type เป็น `idea` ใช้ `templates/idea.md` พร้อมตาราง `Feature | Type | Why | Benefit | Impact | Phase | Effort | MVP Score | Risk`, ANSI sketch จริง และ `Todo` ตาราง `Action | Files | Dependencies | Workspace`
- summary และ Todo แต่ละแถวต้องอยู่บนบรรทัดเดียว ห้ามขึ้นบรรทัดใหมภายใน cell
- ถ้า type ไม่ตรง template ใด ใช้ `bug.md` เป็น base แล้วปรับ

### 5. Labels Convention

| Category | Labels |
|----------|--------|
| Type | bug, feature, enhancement, documentation, refactor |
| Priority | critical, high, medium, low |
| Status | triage, in-progress, review, done |
| Component | frontend, backend, database, api, ui |

### 6. Issue Relations

- `blockedBy`: issue ที่ต้อง resolve ก่อน
- `blocks`: issue ที่ถูก block โดย issue นี้
- `relatedTo`: เกี่ยวข้องแต่ไม่ block
- `duplicateOf`: issue ซ้ำ

### 7. Assignees

- ระบุ primary assignee หนึ่งคน
- หลีกเลี่ยงหลาย assignees เว้นแต่จำเป็น
- ใช้ GitHub username ที่ถูกต้อง

### 8. Update Existing Issues

- ถ้า issue มี comments จากคนอื่น อย่า overwrite body โดยไม่ขอ user confirmation
- ใช้ `--add-label` และ `--remove-label`
- ใช้ `--add-assignee` และ `--remove-assignee`
- ตรวจสอบ issue หลัง update

### 9. Safety

- `delete`, `close`, `lock`, `transfer` เป้น destructive ต้องถาม user ก่อน
- ตรวจสอบ issue number/repo ก่อนเปลี่ยน state
- ถ้าต้องการปิด ใช้ `gh issue close` ดีกว่า `delete`

### 10. Interactive And Script Mode

- ใน TTY `gh issue create` จะ prompt title/body ถ้าขาด flags
- ใน scripts/CI ต้องใส่ flags ครบเพื่อหลีกเลี่ยง interactivity
- ใช้ `--json` หรือ `--jq` สำหรับ JSON output
- ใช้ `--template` เพื่อ format output

### 11. CLI Reference

| Command | Description | Common Options |
|---------|-------------|----------------|
| `gh issue list` | รายการ issues | `-R`, `--state`, `--label`, `--assignee`, `--limit` |
| `gh issue view <id>` | ดู issue | `-R`, `--comments`, `--json`, `--web` |
| `gh issue create` | สร้าง issue | `-R`, `--title`, `--body`, `--label`, `--assignee`, `--milestone`, `--project`, `--type`, `--parent`, `--web` |
| `gh issue edit <id>` | แก้ไข issue | `-R`, `--title`, `--body`, `--add-label`, `--remove-label`, `--add-assignee`, `--remove-assignee`, `--add-project`, `--remove-project`, `--milestone`, `--type`, `--parent` |
| `gh issue close <id>` | ปิด issue | `-R`, `--comment`, `--reason` |
| `gh issue reopen <id>` | เปิด issue ใหม | `-R`, `--comment` |
| `gh issue comment <id>` | Comment | `-R`, `--body`, `--edit-last` |
| `gh issue delete <id>` | ลบ issue | `-R`, `--yes` |

## Expected Outcome

- สร้าง ค้นหา ดู แก้ไข และจัดการ lifecycle ของ issues ผ่าน `gh issue` ได้
- ใช้งานได้ทั้ง interactive และ scripted modes
- Issues เชื่อมโยง project, labels, assignees, milestones ถูกต้อง
- ไม่มี issue ถูกลบ ย้าย หรือปิด โดยไม่ได้รับอนุญาต
- ทีมสามารถเข้าใจและลงมือกับ issue ได้ทันที

## Common Mistakes

- ไม่ใช้ template ทำให้ขาดข้อมูล
- Title ไม่ชัดหรือยาวเกินไป
- ขาด environment details
- ไม่เชื่อมโยง related issues
- ใช้ labels ที่ไม่ตรง conventions

## Anti-Patterns

- สร้าง issue กว้างเกินไป (ควรแยก)
- สร้าง issue โดยไม่มี action items
- สร้าง issue โดยไม่มี steps to reproduce
- ใช้ description สั้นเกินไปและขาด context
