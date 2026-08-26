---
name: update-convert-active-repo-to-devin-skills
description: สร้าง at-<repo> skills จาก remote repos ทั้งหมดทีตรงกับ local git projects
related:
  - list-project-git-in-computer
  - list-chezmoi-files
  - at-this-repo
  - update-all-devin-global-skills
  - review-redundancy
  - validate
  - follow-write-devin-skills
---

## Goal

ดึง remote repositories ทั้งหมดจาก personal และ orgs แล้วสร้าง Devin skills ชื่อ `at-<repo-name>` สำหรับ project path ทีตรงกันใน local computer

## Scope

ใช้เมื่อต้องการ map remote repos กับ local projects ทั้งหมด และสร้าง skills ทีทำให้สามารถ invoke `/at-<repo-name>` แล้วทำงานใน project path นั้นได้

## Execute

### 1. List Remote Repos

> Goal: ดึง repos ทั้งหมดจาก personal และ orgs

1. รับ username จาก `git config user.name` หรือ user
2. รัน `gh api "users/<user>/repos?per_page=100"` เพื่อดึง personal repos ทั้งหมด
3. รัน `gh api "user/orgs?per_page=100"` เพื่อหา orgs
4. สำหรับแต่ละ org รัน `gh api "orgs/<org>/repos?per_page=100"`
5. ถ้ามี pagination ให้ loop จนกว่าจะหมด
6. บันทึก: `owner`, `name`, `full_name`, `url`, `pushedAt`

### 2. List Local Git Projects

> Goal: หา local git projects ทั้งหมด

1. ทำ `/list-project-git-in-computer`
2. บันทึกรายการ `Project`, `Path`, `Drive`, `RemoteUrl`
3. ถ้า scan ช้า → รันเฉพาะ drive ทีรู้

### 3. List Chezmoi Source Repo

> Goal: หา dotfiles/chezmoi source repo

1. ทำ `/list-chezmoi-files`
2. รัน `chezmoi source-path` เพื่อหา source directory
3. ถ้า source directory เป็น git repo → บันทึก path และ remote
4. ถ้า dotfiles เป็น git repo ใน local → match กับ remote repo `dotfiles`

### 4. Match Remote To Local

> Goal: หา project path ทีตรงกับ remote repo

1. สร้าง table: Owner, RemoteRepo, LocalPath, MatchType
2. Match โดย:
   - repo `owner/name` ตรงกับ `RemoteUrl` ใน local
   - repo `name` ตรงกับ directory name (case-insensitive)
   - repo `name` ตรงกับส่วนท้ายของ `RemoteUrl`
   - user ยืนยัน match ถ้าไม่ชัด
3. ถ้าไม่ตรง → ระบุ `no-match`
4. รวม matches ทั้งหมด ไม่จำกัด top 10

### 5. Create at-<repo> Skills

> Goal: สร้าง skill สำหรับแต่ละ matched repo

1. สำหรับแต่ละ match:
   - สร้าง directory `%APPDATA%\devin\skills\at-<repo-name>\`
   - สร้าง `SKILL.md` ด้วย template จาก `at-this-repo`
   - ใส่ `project-root: <local-path>` ใน frontmatter โดย path ใช้ `/` แทน `\` หรือ `\\` เพื่อหลีกเลี่ยง YAML escape error
   - ใส่ `name: at-<repo-name>`
   - ใส่ `description: แก้ไข files ใน <local-path>`
2. ใน `SKILL.md`:
   - Step 1: `cd` หรือ `workdir = <project-root>`
   - Step 2: เรียก `/at-this-repo` หรือทำงานใน `<project-root>`
   - Rules: ไม่แก้ไขนอก `<project-root>`
3. ถ้า skill มีอยู่แล้ว → อัปเดต `project-root` และเพิ่ม `related`

### 6. Update AGENTS.md

> Goal: บันทึก at-<repo> skills ใน catalog

1. สร้างหรืออัปเดต category `#### At` ใน `AGENTS.md`
2. เพิ่ม `- `at-<repo-name>: /at-<repo-name>`` สำหรับแต่ละ repo
3. เรียงตามชื่อ skill

### 7. Update All Devin Global Skills

> Goal: อัปเดต devin skills repo หลังสร้าง at-<repo>

1. ทำ `/update-all-devin-global-skills`
2. ตรวจสอบ cross-skill consistency สำหรับ `at-<repo>` ใหม่
3. ถ้ามี redundant skills → ทำ `/review-redundancy`

### 8. Validate And Commit

> Goal: ตรวจสอบและ commit

1. ทำ `/validate` สำหรับแต่ละ skill
2. ตรวจ line count ไม่เกิน 250
3. ตรวจ references ไม่ broken
4. ทำ `/ship` หรือ `/git-commit`

## Rules

### 1. All Repos

- ดึง repos ทั้งหมดจาก personal และ orgs
- ไม่จำกัด top 10
- รองรับ pagination
- ถ้า API rate limit → รอและ retry

### 2. Multiple Match Sources

- ใช้ `/list-project-git-in-computer` เป็นหลัก
- ใช้ `/list-chezmoi-files` เพื่อหา dotfiles source repo
- รวม local project จากทุก drive

### 3. Naming

- ใช้ `at-<repo-name>` โดย `repo-name` เป็น kebab-case
- ถ้า repo name มี `.` หรือ special char → แทนด้วย `-`
- ถ้าชื่อซ้ำกับ skill ทีมีอยู่ → ถามก่อน overwrite

### 4. Path Accuracy

- `project-root` ต้องตรงกับ local path จริง
- ใช้ absolute path
- ถ้า path ไม่มี `.git` → หยุดและ report

### 5. No Overwrite Without Confirmation

- ถ้ามี `at-<repo>` อยู่แล้ว → ถามก่อน overwrite
- ถ้า path เปลี่ยน → update `project-root` และ references
- ใช้ `git mv` ถ้า directory name เปลี่ยน

### 6. Create Only For Matches

- สร้างเฉพาะ repo ที match กับ local project
- ไม่สร้าง skill สำหรับ repo ทีไม่มี local path

### 7. Common Mistakes

- ลืมตรวจสอบว่า dependency มี skill ในระบบหรือไม่
- สร้าง skills ที่มีอยู่แล้วใน global
- ไม่ใช้ `/follow-write-devin-skills` ในการสร้าง
- ไม่ตรวจสอบ folder structure หลังสร้าง

### 8. Anti-Patterns

- สร้าง skills โดยไม่ตรวจสอบ dependencies ที่มีอยู่
- สร้าง skills แบบ manual ไม่ตามมาตรฐาน
- ข้าม `/learn-from-web` ก่อนเขียนเนื้อหา
- ไม่ตรวจสอบคุณภาพ content

## Expected Outcome

- `at-<repo-name>` skills ถูกสร้าง/อัปเดตสำหรับ remote repos ที match local projects
- `AGENTS.md` อัปเดตด้วย category `At`
- `list-project-git-in-computer` และ `list-chezmoi-files` ใช้เป็นข้อมูล match
- สามารถ invoke `/at-<repo-name>` เพื่อทำงานใน project path นั้น
