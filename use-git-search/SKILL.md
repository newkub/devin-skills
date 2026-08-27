---
name: use-git-search
description: ค้นหา git history, commits, diffs ด้วย log/grep/blame/pickaxe รองรับ local/remote
related:
  - git-debug
  - check-git-files-history
  - use-git-bisect
---

## Goal

ค้นหา pattern, string, หรือ change ใน git repository ด้วย git search tools เพื่อหา commit, file, หรือบรรทัดทีเกี่ยวข้อง รองรับทั้ง local repo และ remote repo บน GitHub

## Scope

- ค้นหาใน commit messages, code changes, file content
- ใช้ `git log`, `git grep`, `git blame`, `git diff`, `git show`
- รองรับ remote repo ผ่าน `gh api`
- รายงานผลเป็นตารางพร้อม commit SHA, author, date, message
- ใช้เป็นเครื่องมือตัวช่วยใน `/deep-debug` และ `/git-debug`

## Execute

### 1. Define Search

> Goal: รู้ว่าจะค้นหาอะไร

1. รับ search pattern จาก user หรือ context
2. ระบุ scope:
   - `commit-message` → ค้นหาใน commit messages
   - `code` → ค้นหาใน code changes (diff)
   - `content` → ค้นหาใน file content ปัจจุบัน
   - `blame` → ค้นหาว่าใครแก้ไขบรรทัดนั้น
   - `file` → ค้นหาชื่อไฟล์
3. ระบุ repo: local path หรือ `owner/repo` บน GitHub
4. ระบุ branch/range/commit ถ้ามี

### 2. Local Repo Search

> Goal: ค้นหาใน local git repo

1. ถ้า `commit-message` → รัน `git log --all --grep=<pattern> --oneline`
2. ถ้า `code` → รัน `git log --all -S <pattern>` หรือ `git log --all -G <regex>`
3. ถ้า `content` → รัน `git grep -n <pattern>` หรือ `git grep -n <pattern> <commit>`
4. ถ้า `blame` → รัน `git blame -L <start>,<end> <file>` แล้วดึง commit
5. ถ้า `file` → รัน `git log --all --name-only --pretty=format: -- <pattern>` หรือ `git diff --name-only`
6. ถ้าค้นหาทั้ง repo ใหญ่ → จำกัด range ด้วย `--since` หรือ `<commit>..<commit>`

### 3. Remote Repo Search

> Goal: ค้นหาใน remote GitHub repo

1. ยืนยัน repo ด้วย `gh repo view <owner/repo>`
2. ถ้า `commit-message` → `gh api repos/<owner>/<repo>/commits?per_page=100` แล้ว filter messages
3. ถ้า `code` → ใช้ `gh api repos/<owner>/<repo>/commits?q=<pattern>` ไม่ได้ตรง → ดึง commits แล้ว fetch diff แต่ละ commit
4. ถ้า `content` → `gh api search/code?q=<pattern>+repo:<owner>/<repo>`
5. ถ้า `file` → `gh api repos/<owner>/<repo>/git/trees/HEAD?recursive=1` แล้ว filter paths
6. ถ้ามี pagination → ทำจนกระทั่งเจอหรือครบ limit

### 4. Analyze And Report

> Goal: สรุปผลค้นหา

1. ทำ `/report-table` แสดง: No, Commit SHA, Date, Author, Scope, Match
2. ถ้าเจอบรรทัด → แสดง file path, line, snippet
3. ถ้าไม่เจอ → แนะนำให้เปลี่ยน pattern หรือ scope
4. ทำ `/suggest-next-action` เช่น bisect, restore, หรือดู diff

## Rules

### 1. Search Strategy

- เริ่มจาก scope แคบทีสุดก่อน (เช่น file หรือ blame) แล้วขยาย
- ใช้ regex เมื่อต้องการ pattern matching
- ใช้ `-S` สำหรับ exact string ใน diff, `-G` สำหรับ regex
- ไม่ค้นหา secrets, tokens, หรือ private data โดยไม่จำเป็น

### 2. Remote Limitations

- GitHub API มี rate limit → ใช้ pagination อย่างระมัดระวัง
- Search API ต้องการ repo มี indexing แล้ว
- ถ้า repo ใหญ่ → clone local แล้วค้นหาด้วย git command จะเร็วกว่า

### 3. Safety

- ไม่แก้ไข repo ใน step ค้นหา
- ถ้า result มี sensitive data → redact ก่อน report
- สำรอง working tree ก่อน restore หรือ checkout

### 4. Output

- ใช้ `/report-table` เสมอ
- แสดง exact match และ context สั้นๆ
- เรียงผลลัพธ์ตาม date ล่าสุดก่อน

## Expected Outcome

- หา commit/file/line ทีตรงเงื่อนไขได้
- รายงานชัดเจนพร้อม evidence
- รองรับทั้ง local และ remote
- ใช้งานได้กับ `/deep-debug` และ `/git-debug`
