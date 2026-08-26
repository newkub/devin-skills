---
name: update-convert-active-repo
description: สร้าง at-<repo> skills จาก top active remote repos ทีตรงกับ local git projects
---

## Goal

ดึง top active remote repositories แล้วสร้าง Devin skills ชื่อ `at-<repo-name>` สำหรับ project path ทีตรงกันใน local computer

## Scope

ใช้เมื่อต้องการ map remote repos กับ local projects และสร้าง skills ทีทำให้สามารถ invoke `/at-wrikka-com`, `/at-booking-platform` แล้วทำงานใน project path นั้นได้

## Execute

### 1. Get Active Remote Repos

> Goal: ดึง top 10 active repos จาก remote

1. รับ username หรือ org จาก user หรือ `git config user.name`
2. ใช้ GitHub CLI: `gh repo list <owner> --limit 10 --sort updated --json name,owner,url,pushedAt`
3. หรือใช้ API: `gh api users/<owner>/repos?sort=updated&per_page=10`
4. ถ้าไม่มี `gh` → ทำ `/follow-tool-my-global-cli` เพื่อติดตั้ง
5. บันทึก: `name`, `url`, `pushedAt`

### 2. List Local Projects

> Goal: หา local git projects

1. ทำ `/list-git-project-in-computer`
2. บันทึกรายการ `Project`, `Path`, `RemoteUrl`
3. ถ้า scan ช้า → ใช้ `/list-project-in-drive-d` หรือ known drive ทีละ drive

### 3. Match Remote To Local

> Goal: หา project path ทีตรงกับ remote repo

1. สร้าง table: RemoteRepo, LocalPath, MatchType
2. Match โดย:
   - repo name ตรงกับ directory name (case-insensitive)
   - repo name ตรงกับส่วนท้ายของ RemoteUrl ใน local
   - user ยืนยัน match ถ้าไม่ชัด
3. ถ้าไม่ตรง → ระบุ `no-match` และถาม user ว่าต้องการสร้าง `at-<repo>` โดย manual path หรือไม่
4. เลือก top 10 matches

### 4. Create at-<repo> Skills

> Goal: สร้าง skill สำหรับแต่ละ matched repo

1. สำหรับแต่ละ match:
   - สร้าง directory `%APPDATA%\devin\skills\at-<repo-name>\`
   - สร้าง `SKILL.md` ด้วย template จาก `at-this-repo`
   - ใส่ `project-root: <local-path>` ใน frontmatter
   - ใส่ `name: at-<repo-name>`
   - ใส่ `description: แก้ไข files ใน <local-path>`
2. ใน `SKILL.md`:
   - Step 1: `cd` หรือ `workdir = <project-root>`
   - Step 2: เรียก `/at-this-repo` หรือทำงานใน `<project-root>`
   - Rules: ไม่แก้ไขนอก `<project-root>`
3. ถ้า skill มีอยู่แล้ว → อัปเดต `project-root` อย่างเดียว

### 5. Update AGENTS.md

> Goal: บันทึก at-<repo> skills ใน catalog

1. สร้างหรือเพิ่ม category `#### At` ใน `AGENTS.md` (ก่อน `Workspaces`)
2. เพิ่ม `- `at-<repo-name>: /at-<repo-name>`` สำหรับแต่ละ repo
3. ใช้ `/update-agents-md` ถ้ามี

### 6. Validate And Commit

> Goal: ตรวจสอบและ commit

1. ทำ `/validate` สำหรับแต่ละ skill
2. ตรวจ line count ไม่เกิน 250
3. ตรวจ references ไม่ broken
4. ทำ `/ship` หรือ `/git-commit`

## Rules

### 1. Naming

- ใช้ `at-<repo-name>` โดย `repo-name` เป้น kebab-case
- ถ้า repo name มี `.` หรือ special char → แทนด้วย `-`
- ไม่ซ้ำกับ skill ทีมีอยู่

### 2. Path Accuracy

- `project-root` ต้องตรงกับ local path จริง
- ใช้ absolute path
- ถ้า path ไม่มี `.git` → หยุดและ report

### 3. No Overwrite Without Confirmation

- ถ้ามี `at-<repo>` อยู่แล้ว → ถามก่อน overwrite
- ถ้า path เปลี่ยน → update `project-root` และ references
- ใช้ `git mv` ถ้า directory name เปลี่ยน

### 4. Minimal Skills

- สร้างเฉพาะ repo ที match กับ local project
- ไม่สร้าง skill สำหรับ repo ทีไม่มี local path
- top 10 ตาม active ล่าสุด

## Expected Outcome

- `at-<repo-name>` skills ถูกสร้าง/อัปเดตสำหรับ remote repos ที match local projects
- `AGENTS.md` อัปเดตด้วย category `At`
- `list-git-project-in-computer` ใช้เป้นข้อมูล match
- สามารถ invoke `/at-<repo-name>` เพื่อทำงานใน project path นั้น
