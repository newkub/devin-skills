---
name: follow-github
description: ตั้งค่า GitHub repository รวม metadata, branch protection และ .github templates
argument-hint: "[scope]"
related:
  - update-github-metadata
  - follow-dot-github
  - report-table
  - suggest-next-action
  - follow-git-flow
  - view-repo
---

## Goal

ตั้งค่า GitHub repository ให้พร้อมใช้งานตาม flow: metadata ถูกต้อง, `main` และ integration branch ถูก protect, `.github` templates ครบ
`/follow-github` ไม่เปลี่ยน visibility, ไม่ rename repo, ไม่ลบ branch

## Scope

ใช้หลัง repo มี `main` และ integration branch บน remote แล้ว ครอบคลุม:
- sync GitHub metadata ด้วย `/update-github-metadata`
- ตั้ง branch protection บน `main` และ integration branch
- สร้าง/อัปเดต `.github` templates ด้วย `/follow-dot-github` (optional)

ถ้าต้องการแค่ metadata → ใช้ `/update-github-metadata`
ถ้าต้องการแค่ local git flow → ใช้ `/follow-git-flow`

## Execute

### 1. Pre-flight

> Goal: เตรียมข้อมูล GitHub repo

1. ตรวจ `gh` CLI ด้วย `gh auth status`
2. ถ้าไม่ authenticate → stop และ report
3. หา `owner/repo` ด้วย `gh repo view --json owner,name --jq '.owner.login + "/" + .name'`
4. กำหนด integration branch จาก `AGENTS.md` หรือ project conventions (default: `integration`)
5. ตรวจ `main` และ `<integration-branch>` บน remote ด้วย:
   ```bash
   gh api repos/<owner>/<repo>/branches/main
   gh api repos/<owner>/<repo>/branches/<integration-branch>
   ```
6. ถ้าไม่มี integration branch บน remote → สร้างด้วย:
   - `git fetch origin`
   - `git switch -c <integration-branch> origin/main`
   - `git push -u origin <integration-branch>`

### 2. Update GitHub Metadata

> Goal: metadata สะท้อน project จริง

1. ทำ `/update-github-metadata`
2. ตรวจ default branch ต้องเป้น `main`
3. ถ้าไม่ใช่ `main` → ตั้งด้วย `gh repo edit <owner/repo> --default-branch main`

### 3. Protect main Branch

> Goal: `main` เป้น production branch ที merge ผ่าน PR เท่านั้น

1. สร้าง JSON payload:
   ```json
   {
     "required_status_checks": {
       "strict": true,
       "contexts": []
     },
     "enforce_admins": true,
     "required_pull_request_reviews": {
       "required_approving_review_count": 0,
       "dismiss_stale_reviews": true,
       "require_code_owner_reviews": false
     },
     "restrictions": null,
     "allow_force_pushes": false,
     "allow_deletions": false
   }
   ```
2. บันทึก payload ลง `.devin/github/main-protection.json`:
   - สร้าง directory `.devin/github/` ถ้ายังไม่มี
   - เขียน JSON ลงไฟล์
3. ส่งไปยัง GitHub API:
   ```bash
   gh api repos/<owner>/<repo>/branches/main/protection --method PUT --input .devin/github/main-protection.json
   ```
4. หรือใช้ PowerShell:
   ```powershell
   $body = Get-Content .devin/github/main-protection.json -Raw
   $body | gh api repos/<owner>/<repo>/branches/main/protection --method PUT --input -
   ```
5. ถ้า API ตอบ 422 → ปรับ `enforce_admins` เป้น `null` หรือ `{"enabled": true}` ตาม response
6. บันทึก status code

### 4. Protect Integration Branch

> Goal: integration branch เป้น staging branch ทีมี status checks

1. ใช้ payload เหมือน `main` แต่เปลี่ยน path เป้น `branches/<integration-branch>/protection`
2. บันทึก `.devin/github/<integration-branch>-protection.json` (ถ้าไม่ต้องการ required PR บน integration branch ให้ตั้ง `required_pull_request_reviews` เป้น `null`)
3. ส่งด้วย `gh api`:
   ```bash
   gh api repos/<owner>/<repo>/branches/<integration-branch>/protection --method PUT --input .devin/github/<integration-branch>-protection.json
   ```

### 5. Setup .github Templates (Optional)

> Goal: issue/PR templates และ community files

1. ถ้า `AGENTS.md` ระบุต้องการ templates → ทำ `/follow-dot-github`
2. ถ้าไม่ระบุ → skip และ report

### 6. Verify

> Goal: ยืนยัน GitHub settings

1. ทำ `gh repo view <owner/repo> --json defaultBranchRef`
2. ทำ `gh api repos/<owner>/<repo>/branches/main/protection --jq .`
3. ทำ `gh api repos/<owner>/<repo>/branches/<integration-branch>/protection --jq .`
4. ตรวจสอบว่า `main` และ `<integration-branch>` มี protection
5. ทำ `/view-repo` เพื่อตรวจ metadata และ health หลังตั้งค่า

### 7. Report

> Goal: สรุปผล

1. ใช้ `/report-table` สรุป: metadata, branch protection, templates
2. ทำ `/suggest-next-action`

## Rules

### 1. No Visibility/Name Changes

- ไม่เปลี่ยน repo visibility (public/private)
- ไม่ rename repo
- ไม่ลบ branch
- ไม่เปลี่ยน default branch นอกจาก `main`

### 2. No Git Config Global

- ไม่ทำ `git config --global`
- ไม่ทำ `git init`
- ใช้ `gh` CLI สำหรับ GitHub operations

### 3. Branch Protection Defaults

- `main`: บังคับ PR + status checks + no force push + no delete
- integration branch: บังคับ status checks + no force push + no delete (PR optional)
- `required_approving_review_count` เริ่มต้น 0 สำหรับ solo project
- ถ้า team มากขึ้น → ปรับเป้น 1 ผ่าน `AGENTS.md`

### 4. Idempotent

- ตรวจ existing protection ก่อน update
- ถ้า settings ถูกต้องแล้ว → ข้าม
- ไม่ overwrite templates โดยไม่ dry run

### 5. Safety

- ถ้า `gh` ไม่พร้อม → stop
- ถ้า branch ไม่มีบน remote → สร้าง integration branch ด้วย `git switch -c <integration-branch> origin/main` แล้ว `git push -u origin <integration-branch>`
- ถ้า API ตอบ 422 → อ่าน error message และปรับ payload

## Expected Outcome

- GitHub repo metadata sync กับ project
- `main` ถูก protect: PR required, status checks, no force push, no delete
- integration branch ถูก protect: status checks, no force push, no delete
- Default branch เป้น `main`
- `.github` templates พร้อม (ถ้าเลือกทำ)
- ไม่มี visibility/name เปลี่ยน
- มีรายงานผลและ next action
