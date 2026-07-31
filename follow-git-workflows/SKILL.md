---
name: follow-git-workflows
description: แนวทาง Git workflows ครอบคลุม branching, committing, merging, worktree, rebase, stash, submodules, tags, bisect, cherry-pick, hooks, conflict, reflog, revert, config, LFS, blame, filter, clone และ cleanup
---

## Goal

ใช้ Git workflows ที่เป็นมาตรฐานสำหรับ branching, committing, merging, worktree, rebase, stash, submodules, tags, debugging, cherry-pick, hooks, conflict resolution, reflog, revert, config, LFS, blame, history rewrite, clone strategies และ cleanup

## Scope

ครอบคลุม Git workflow patterns: branch naming, commit conventions, merge strategies, worktree usage, rebase, stash, submodules, tags, bisect, cherry-pick, hooks, conflict resolution, reflog, revert, config, LFS, blame, history rewrite, clone strategies และ cleanup

## Execute

### 1. Branch Strategy

เลือก branching strategy ที่เหมาะสม

1. ใช้ `main`/`master` เป็น branch หลักสำหรับ production code
2. สร้าง branch ใหม่สำหรับแต่ละ feature หรือ bugfix โดยใช้ prefix: `feat/`, `fix/`, `hotfix/`, `chore/`, `docs/`, `refactor/`
3. ใช้ `/create-git-worktree` เพื่อสร้าง worktree ใน `worktree/` แทนการ checkout branch ใหม่
4. ตั้งชื่อ branch สื่อความหมาย เช่น `feat/user-auth`, `fix/booking-overflow`, `hotfix/payment-timeout`

### 2. Commit Conventions

ใช้ conventional commits

1. ใช้ format: `<type>(<scope>): <description>` เช่น `feat(booking): add cancellation policy`
2. Types: `feat`, `fix`, `hotfix`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`, `build`
3. เขียน description เป็น imperative mood ภาษาอังกฤษ ไม่เกิน 72 ตัวอักษร
4. ถ้ามี breaking change ให้เพิ่ม `!` หลัง type/scope เช่น `feat(api)!: change response format`
5. ใช้ `/git-commit` เพื่อ commit ตาม conventional commits standard

### 3. Merge Strategy

เลือก merge strategy ที่เหมาะสม

1. สำหรับ feature branches ใช้ squash merge เพื่อรวม commits เป็น commit เดียว
2. สำหรับ hotfix branches ใช้ fast-forward merge เพื่อรักษา commit history ตรงไปตรงมา
3. สำหรับ release branches ใช้ merge commit เพื่อรักษา merge history
4. หลัง merge ให้ลบ branch ที่ไม่ใช้แล้วด้วย `git branch -d <branch-name>`
5. ถ้าใช้ worktree ให้ลบ worktree ด้วย `git worktree remove worktree/<branch-name>`

### 4. Worktree Workflow

ใช้ worktree สำหรับการทำงานหลาย branches พร้อมกัน

1. ทำ `/create-git-worktree` เพื่อสร้าง worktree ใน `worktree/` ของ project
2. ทำงานใน worktree directory แทนการ checkout branch ใน main repository
3. หลังเสร็จงานให้ commit ใน worktree แล้ว merge เข้า `main`
4. ลบ worktree ด้วย `git worktree remove worktree/<branch-name>`
5. รัน `git worktree prune` เพื่อทำความสะอาด worktrees ที่ไม่ได้ใช้

### 5. Push And Pull

จัดการ remote synchronization

1. ใช้ `/git-push` เพื่อ push commits ไปยัง remote
2. ก่อน push ให้ตรวจสอบว่า local branch อยู่หน้า remote ไม่เกินจำเป็น
3. ถ้า remote มี commits ใหม่ให้ `git pull --rebase` เพื่อหลีกเลี่ยง merge commits ที่ไม่จำเป็น
4. หลีกเลี่ยง force push ไปยัง shared branches โดยไม่จำเป็น
5. ใช้ `/git-commit-and-push` เพื่อ commit และ push ในครั้งเดียว

### 6. Rebase And Stash

ใช้ rebase และ stash อย่างเหมาะสม

1. ทำ `/follow-git-rebase` เพื่อ squash commits หรือ rebase ไปยัง base ใหม่
2. ทำ `/follow-git-stash` เพื่อเก็บ changes ชั่วคราวเมื่อต้องสลับ context
3. ใช้ stash เฉพาะเมื่อต้องการเก็บ changes ชั่วคราว ถ้าพร้อมให้ `/git-commit` แทน
4. ถ้าต้องการทำงานหลาย branches ให้ใช้ `/create-git-worktree` แทน stash

### 7. Submodules

จัดการ git submodules

1. ทำ `/follow-git-submodules` เพื่อจัดการ submodules ทั้งหมด
2. ใช้ submodules เฉพาะเมื่อจำเป็น พิจารณาใช้ package manager แทน
3. ตรวจสอบ submodule status อย่างสม่ำเสมอ

### 8. Gitignore

จัดการไฟล์ที่ไม่ควร commit

1. ทำ `/follow-gitignore` เพื่อสร้างและจัดการ `.gitignore`
2. ตรวจสอบว่า `worktree/` อยู่ใน `.gitignore`
3. เพิ่ม patterns ตาม tools ที่ใช้จริงเท่านั้น

### 9. Tags And Releases

จัดการ git tags สำหรับ versioning

1. ทำ `/follow-git-tags` เพื่อสร้างและจัดการ tags
2. ใช้ semantic versioning: `vMAJOR.MINOR.PATCH`
3. ใช้ annotated tags สำหรับ releases เสมอ
4. Push tags ไปยัง remote ทุกครั้งหลังสร้าง

### 10. Debugging And Recovery

หาและกู้คืน commits ที่มีปัญหา

1. ทำ `/git-debug` เพื่อ debug ปัญหา git อย่างเป็นระบบ
2. ทำ `/follow-git-bisect` เพื่อหา commit ที่ทำให้เกิด bug
3. ทำ `/follow-git-reflog` เพื่อกู้คืน commits ที่หายไป
4. ทำ `/follow-git-blame` เพื่อดูประวัติการเปลี่ยนแปลงของ code
5. ทำ `/git-file-history` เพื่อดู file history แบบ interactive

### 11. Cherry-Pick And Revert

นำหรือย้อนการเปลี่ยนแปลงเฉพาะ

1. ทำ `/follow-git-cherry-pick` เพื่อนำ commits เฉพาะไปยัง branch อื่น
2. ทำ `/follow-git-revert` เพื่อย้อนการเปลี่ยนแปลงโดยไม่ rewrite history
3. ใช้ revert แทน reset เมื่อ commit ถูก push ไปแล้ว
4. ใช้ cherry-pick สำหรับ hotfix ไปหลาย release branches

### 12. Hooks And Configuration

จัดการ git hooks และ configuration

1. ทำ `/follow-git-hooks` เพื่อจัดการ git hooks ผ่าน Lefthook
2. ทำ `/follow-git-config` เพื่อจัดการ git configuration
3. ห้าม bypass hooks ด้วย `--no-verify` โดยไม่จำเป็น
4. ใช้ `.gitattributes` สำหรับ line endings แทน `core.autocrlf`

### 13. Conflict Resolution

Resolve merge conflicts อย่างเป็นระบบ

1. ทำ `/follow-git-conflict` เพื่อ resolve merge conflicts
2. แก้ที่ root cause ไม่ใช่แค่ลบ conflict markers
3. ตรวจสอบว่า code ทำงานได้หลัง resolve
4. ห้ามปล่อย conflict markers ค้างใน code

### 14. Large Files And History

จัดการ large files และ history rewriting

1. ทำ `/follow-git-lfs` เพื่อจัดการ large files ด้วย Git LFS
2. ใช้ `git filter-repo` หรือ BFG เพื่อ rewrite history ลบ secrets หรือ large files
3. สำรอง repository ก่อน rewrite history เสมอ
4. แจ้ง team members ให้ re-clone หลัง history rewrite

### 15. Clone Strategies

เลือก cloning strategy ที่เหมาะสม

1. ทำ `/follow-git-clone` เพื่อเลือก cloning strategy
2. ใช้ shallow clone สำหรับ CI/CD
3. ใช้ sparse checkout สำหรับ monorepos ขนาดใหญ่
4. ใช้ mirror clone สำหรับ backup หรือ migration

### 16. Cleanup

ทำความสะอาด repository อย่างสม่ำเสมอ

1. ลบ branches ที่ merge แล้วและไม่ใช้งาน
2. รัน `git worktree prune` เพื่อลบ worktrees ที่ไม่มี directory
3. ทำ `/follow-git-cleanup` เพื่อ optimize repository size
4. ตรวจสอบ stale branches ที่ไม่ได้ใช้เกิน 30 วัน

## Rules

### 1. Branch Naming

- ใช้ prefix ตาม type: `feat/`, `fix/`, `hotfix/`, `chore/`, `docs/`, `refactor/`
- ใช้ kebab-case สำหรับ branch name
- ชื่อ branch สื่อความหมายและไม่เกิน 50 ตัวอักษร
- หลีกเลี่ยงการใช้ issue number เป็นชื่อ branch เดี่ยวๆ

### 2. Commit Quality

- หนึ่ง commit ต่อหนึ่ง logical change
- ห้าม commit ไฟล์ที่ไม่เกี่ยวข้องใน commit เดียวกัน
- ใช้ conventional commits format เสมอ
- ห้ามใช้ `git commit -m "updates"` หรือ messages ที่ไม่สื่อความหมาย

### 3. Worktree Over Checkout

- ใช้ `/create-git-worktree` แทน `git checkout -b` เมื่อต้องการทำงานหลาย branches พร้อมกัน
- เก็บ worktrees ใน `worktree/` directory ของ project root
- ลบ worktree หลัง merge เสมอเพื่อรักษาความสะอาด
- ห้ามสร้าง worktree นอก `worktree/` directory

### 4. Merge Safety

- ตรวจสอบ working tree clean ก่อน merge
- ทำ `/run-verify` ก่อน merge เพื่อตรวจสอบว่า code ผ่าน quality gates
- หลัง merge ให้ลบ branch และ worktree ที่ไม่ใช้
- ห้าม force push ไปยัง `main`/`master`

### 5. Non-Redundancy

- รายละเอียดแต่ละ topic อยู่ใน sub-workflow แล้ว: `/follow-git-worktree`, `/follow-git-rebase`, `/follow-git-stash`, `/follow-git-submodules`, `/follow-gitignore`, `/follow-git-tags`, `/follow-git-bisect`, `/follow-git-cherry-pick`, `/follow-git-hooks`, `/follow-git-conflict`, `/follow-git-reflog`, `/follow-git-revert`, `/follow-git-config`, `/follow-git-lfs`, `/follow-git-blame`, `/follow-git-clone`, `/follow-git-cleanup`
- รายละเอียด commit format อยู่ใน `/git-commit` แล้ว
- Orchestrator workflow อ้างถึง sub-workflow โดยไม่ duplicate รายละเอียด

## Expected Outcome

- Git history สะอาด อ่านง่าย และสื่อความหมาย
- Branches จัดการเป็นระบบ ไม่มี stale branches
- Worktrees ใช้แทน checkout เพื่อทำงานหลาย branches พร้อมกัน
- Repository ไม่มี dead branches และ worktrees ที่ไม่ได้ใช้
- Tags ใช้ semantic versioning อย่างเป็นระบบ
- Conflicts ได้รับการแก้ไขอย่างถูกต้อง
- History สะอาด ไม่มี secrets หรือ large files ที่ไม่จำเป็น
