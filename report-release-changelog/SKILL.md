---
name: report-release-changelog
description: ดึงและจัดรูปแบบ release changelog จาก GitHub diff ระหว่าง tags
argument-hint: "[range]"
related:
  - vs
  - ask-me
  - report-table
  - suggest-next-action
  - report-ansi
  - fix
  - refactor
  - view-repo
---

## Goal

ดึงข้อมูล release diff ระหว่าง GitHub tags และจัดรูปแบบเป็น report changelog ที่อ่านง่าย

## Scope

ใช้กับ public หรือ private GitHub repo ที่ระบุ compare URL หรือ `owner/repo` พร้อม tags เป้าหมาย ครอบคลุมทั้ง fetch diff data และ format report

ดูเพิ่มเติม: /vs

## Execute

### 1. Identify Repo And Tags

> Goal: ระบุ repository และ tags ที่ต้องเปรียบเทียบ

1. ถ้า user ให้ compare URL เช่น `https://github.com/moonrepo/moon/compare/v2.4.5...v2.4.6` → แยก `owner/repo`, `from`, `to`
2. ถ้า user ให้ `owner/repo` อย่างเดียว → หา latest release และก่อนหน้าผ่าน GitHub API
3. ถ้าไม่ชัด → `/ask-me` ก่อน
4. ถ้า tag ไม่มีอยู่จริง → report ว่า `tag not found` และ stop
5. ถ้าต้องการดู repo metadata สรุปก่อน ให้ทำ `/view-repo`

### 2. Fetch Compare Data

> Goal: ดึงข้อมูล diff ระหว่าง tags

1. ทำ `mcp_call_tool` บน `github-mcp-server` เพื่อ compare ระหว่าง tags
2. ถ้าไม่มี GitHub MCP → ใช้ `curl`/`Invoke-RestMethod` กับ GitHub REST API: `GET /repos/{owner}/{repo}/compare/{from}...{to}`
3. ดึง release notes ของ `to` tag จาก `GET /repos/{owner}/{repo}/releases/tags/{to}`
4. เก็บ commits, files changed, additions, deletions, pull request numbers
5. ถ้า repo private ต้องมี token เหมาะสม ถ้าไม่มี → `/ask-me`

### 3. Categorize Changes

> Goal: จัดประเภท changes จาก commits

1. อ่าน commit messages ทั้งหมด และ pull request titles
2. จัดกลุ่มตาม conventional commits:
   - `BREAKING` — `!` หรือ `BREAKING CHANGE` footer
   - `feat` — features ใหม่
   - `fix` — bug fixes
   - `docs` — documentation
   - `chore` — build, ci, refactor
   - `perf` — performance
   - `security` — security fixes
3. ถ้า commit message ไม่ตรง conventional commits → จัดเป็น `chore`
4. ดึง PR title มาประกอบถ้า PR number มีอยู่
5. ระบุ files ที่ impact มากที่สุด (sort ตาม `changes` count)

### 4. Format Changelog

> Goal: จัดรูปแบบ report

1. Header: release version, compare URL, release date
2. Summary: จำนวน commits, files changed, additions, deletions, จำนวน PRs
3. Breaking Changes: รายการที่มี `!` หรือ `BREAKING CHANGE`
4. Features: รายการ `feat`
5. Fixes: รายการ `fix`
6. Performance/Security: รายการ `perf`, `security`
7. Docs: รายการ `docs`
8. Other Changes: รายการ `chore`, `refactor`, `ci`
9. Files Changed: สรุป top 10 files ตามจำนวน changes

### 5. Output

> Goal: นำเสนอ report

1. ใช้ `/report-table` สำหรับตารางสรุป
2. เก็บ report เป็น markdown ถ้า user ต้องการไฟล์
3. ทำ `/suggest-next-action`

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้คอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... โดย headers ชัดเจน จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Clarity

- เรียงลำดับ sections: Breaking → Features → Fixes → Performance/Security → Docs → Other
- ระบุ compare URL ไว้ด้านบน
- ถ้าไม่มีข้อมูลบาง section → ข้ามไป ไม่ใส่ `none`

### 2. Accuracy

- สรุป commit message ให้กระชับ ไม่ตัดทอนจนผิดเจตนา
- ถ้าเป็น PR ให้ใส่ `#<number>`

### 3. Conciseness

- ถ้า commits มากกว่า 50 → แสดงเฉพาะ top 20 ของแต่ละ category พร้อม count

### 4. Data Source

- ใช้ GitHub API เป็นหลัก
- ถ้า repo private ต้องมี token เหมาะสม ถ้าไม่มี → `/ask-me`

## Expected Outcome

- ได้ owner/repo, from/to tags, compare URL, release notes, รายการ commits แยกประเภท
- Report changelog ที่มี header, summary, categories, files changed
- อ่านง่าย มี highlights
- มี next action ชัดเจน
