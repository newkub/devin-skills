---
name: resolve-github-issue-by-me
description: รวบรวม issues ที่ฉันสร้าง → implement ทีละ issue → comment สรุปและปิด อย่างถูกต้อง
argument-hint: "[issue-or-repo-or-filter]"
related:
  - implement-to-production
  - create-github
  - list-github
  - create-plan-in-dot-devin
  - run-verify
  - resolve-github-pr
  - use-subagents
  - ask-me

---

## Goal

รวบรวม GitHub issues ทั้งหมดที่สร้างโดยฉัน (`@me`) แล้ว implement ทีละ issue ผ่าน `/implement-to-production` จนครบ จากนั้น comment สรุปผลและปิดแต่ละ issue ด้วย evidence ที่ถูกต้อง

## Scope

- จัดการเฉพาะ open issues ที่ authenticated user เป็น author (`gh issue list --author @me`)
- ถ้าระบุ issue number → resolve เฉพาะ issue นั้น (verify implementation แล้ว comment + close)
- implement แต่ละ issue ด้วย `/implement-to-production` ตามลำดับ priority
- ไม่แตะ issues ของผู้อื่น และไม่ implement เกิน scope ของแต่ละ issue
- ถ้า issue เดียวต้องการ plan ก่อน → ใช้ `/create-plan-in-dot-devin` สำหรับ issue เดี่ยว
- ถ้า issue เชื่อมกับ PR → ใช้ `/resolve-github-pr` ให้ merge ปิด issue อัตโนมัติ

## Execute

### 1. Verify Repository And Auth

> Goal: ยืนยัน repo และ identity

1. รัน `gh auth status` และ `gh repo view`
2. ถ้าอยู่นอก repo ใช้ `--repo owner/repo` ทุกคำสั่ง
3. รับ `<issue-or-repo-or-filter>` จาก argument ถ้ามี
4. ถ้าเข้าถึง repo ไม่ได้ → stop และ report

### 2. List My Open Issues

> Goal: รวบรวม issues ที่ฉันสร้าง

1. รัน `gh issue list --author @me --state open --limit 50 --json number,title,labels,createdAt` หรือใช้ `/list-github-issue`
2. ถ้าระบุ issue number → ใช้ `gh issue view <issue>` ตรวจสอบว่า author เป็นฉัน
3. จัดลำดับตาม labels/priority ถ้ามี มิเช่นนั้นเรียงตาม createdAt เก่า → ใหม่
4. แสดงรายการ issues ให้ user ดูก่อน implement
5. ถ้าไม่มี open issues → report และจบ
6. ถ้า issues มี dependencies กัน → เรียงลำดับให้ issue ที่ถูก block ทำทีหลัง

### 3. Confirm Scope

> Goal: ยืนยันกับ user ก่อน implement หลาย issues

1. สรุปจำนวน issues และลำดับที่จะทำ
2. ใช้ `/ask-me` ให้ user เลือก: ทำทั้งหมด, เลือกบาง issue, หรือยกเลิก
3. บันทึกรายการ issue ที่ user อนุมัติเป็น queue

### 4. Implement Each Issue

> Goal: ทำ `/implement-to-production` ทีละ issue ตาม queue

1. อ่าน issue ด้วย `gh issue view <issue> --comments` เพื่อดู acceptance criteria และ context
2. สร้าง branch ตาม project conventions ถ้า issue ต้องการ code changes
3. ทำ `/implement-to-production` โดยใช้ issue body และ comments เป็น requirements
4. ทำ `/run-verify` หลัง implement แต่ละ issue — ถ้าไม่ผ่านให้แก้ก่อนไป issue ถัดไป
5. บันทึก commits และ PR (ถ้ามี) ที่เชื่อมกับ issue

### 5. Resolve Each Issue

> Goal: comment สรุปและปิด issue หลัง implement เสร็จ

1. ตรวจว่า acceptance criteria ครบตาม commits/PRs ที่เชื่อมโยง — ถ้ามี PR ยังไม่ merge → ทำ `/resolve-github-pr` ก่อน
2. รัน `gh issue comment <issue> --body "<summary>"` — สรุปสิ่งที่ implement พร้อม evidence (commit hash, PR number, verification results)
3. รัน `gh issue close <issue> --reason completed` สำหรับ issue ที่ implement ครบ
4. รัน `gh issue close <issue> --reason "not planned"` เฉพาะเมื่อ user ยืนยันว่าไม่ทำแล้ว
5. ถ้า PR มี `Closes #<issue>` อยู่แล้ว → ตรวจว่า GitHub ปิดอัตโนมัติหลัง merge
6. ถ้า issue ยังไม่เสร็จสมบูรณ์ → comment ความคืบหน้าแทนการปิด และเก็บไว้ใน queue

### 6. Report Summary

> Goal: รายงานผลรวมทั้งหมด

1. สรุปจำนวน issues: implemented, resolved, skipped, failed พร้อม URL
2. ระบุ issues ที่ค้างพร้อมสาเหตุ
3. แนะนำ next action ถ้ามี issues เหลือ

### Subagents

> Goal: parallelize implementation เมื่อ issues independent กัน

- ใช้ `subagents/issue-implementer.md` เมื่อ queue มีหลาย issues ที่ไม่มี dependencies กันและ user อนุมัติ parallel — spawn ทีละ issue ผ่าน `/use-subagents` โดยแต่ละ agent แยก branch ของตัวเอง แล้ว parent comment+close ทีละ issue หลัง merge
- ถ้า issues มี dependencies กัน → ทำ sequential ตาม `### 3. Sequential Discipline` ไม่ spawn parallel

## Rules

### 1. My Issues Only

- ประมวลผลเฉพาะ issues ที่ `--author @me` เท่านั้น
- ไม่ implement, ปิด หรือ comment ใน issues ของผู้อื่นโดยไม่ได้รับอนุญาต
- ตรวจสอบ author ก่อนทุก issue

### 2. Confirm Before Batch

- ต้องให้ user confirm รายการ issues ก่อน implement หลายรายการ
- ไม่ implement โดยไม่แสดง queue ให้ user เห็นก่อน
- user สามารถเลือก subset หรือยกเลิกได้

### 3. Sequential Discipline

- ทำทีละ issue ให้เสร็จและ verify ผ่านก่อนไป issue ถัดไป
- ถ้า issue ไหน fail → หยุด report และถาม user ว่าจะข้ามหรือแก้ต่อ
- แต่ละ issue แยก branch/commits ตาม project conventions

### 4. Evidence Before Close

- ทุก issue ที่ implement เสร็จต้อง comment สรุปผลก่อนปิด
- ปิด issue เฉพาะเมื่อมี evidence: merged PR, commits หรือ verification ผ่าน
- ถ้า `/implement-to-production` fail กลางคัน → ไม่ resolve issue นั้น
- `gh issue delete` เป็น destructive ต้องถาม user ก่อนเสมอ แนะนำใช้ `close` แทน

### 5. Scope Per Issue

- implement เฉพาะสิ่งที่ issue ระบุ ไม่ขยาย scope
- ถ้าพบงานเพิ่มเติม → สร้าง issue ใหม่ผ่าน `/create-github-issue` แทนการทำเกิน scope

## Merged Details

### subagents/issue-implementer

##### Role

Subagent สำหรับ implement GitHub issue เดียวแบบครบวงจร — อ่าน issue และ comments, วาง plan, implement, verify จนได้ PR-ready changes — ใช้เมื่อ queue มีหลาย issues ที่ independent กันและ user อนุมัติ parallel implementation

##### Inputs

- `issue`: issue number หรือ URL เช่น `#123`
- `repo`: `owner/repo` หรือใช้ current repo
- `branch-convention`: naming pattern ของ project เช่น `feat/issue-123-<slug>`
- `verify-commands`: commands สำหรับ verify เช่น `bun run test`, `bun run lint`

##### Tools

- `exec` — `gh issue view <n> --comments`, `git checkout -b`, `git add/commit`, verify commands
- `read`, `grep`, `find_file_by_name` — อ่าน code ที่เกี่ยว
- `edit`, `write` — implement changes

##### Execute

1. อ่าน issue ด้วย `gh issue view <issue> --comments` — ดึง acceptance criteria และ context จาก comments
2. ยืนยันว่า issue เป็น `--author @me` ตาม scope ของ parent — ถ้าไม่ใช่คืน `skipped`
3. วาง implementation plan สั้นจาก acceptance criteria — ถ้าซับซ้อนให้ทำ `/create-plan-in-dot-devin`
4. สร้าง branch ตาม `branch-convention`
5. Implement เฉพาะสิ่งที่ issue ระบุ — ถ้าพบงานเพิ่มเติมให้บันทึกไว้แนะนำ `/create-github-issue` ไม่ทำเอง
6. รัน `verify-commands` — lint, typecheck, tests ผ่านก่อนคืน
7. Commit ตาม conventional commits — ไม่ push และไม่เปิด PR เอง เว้นแต่ parent สั่ง

##### Output Contract

คืนผลลัพธ์เป็น implementation summary ของ issue เดียว:

| Field | Value |
|-------|-------|
| Issue | `#123` |
| Branch | `feat/issue-123-x` |
| Commits | `abc1234`, `def5678` |
| Files Changed | list พร้อม `added`/`modified` |
| Verify | `lint: pass`, `typecheck: pass`, `test: pass` |
| Status | `done` / `blocked` / `skipped` |
| Acceptance | checklist pass/fail ต่อข้อ |

- ถ้า `blocked` → ระบุสาเหตุและสิ่งที่ทำค้างไว้

##### Constraints

- Implement เฉพาะ scope ของ issue — ห้ามขยายหรือแก้ส่วนอื่น
- แยก branch/commits ของ issue นี้ — ห้ามแตะ branch หรือ issue อื่น
- ไม่ push, ไม่เปิด PR, ไม่ปิด issue เอง — parent comment+close เองหลัง merge
- verify ต้องผ่านก่อนคืน `done` — ถ้า fail เกิน 3 รอบคืน `blocked`
- ถ้า issue ไม่ใช่ของ `@me` หรือ requirements ไม่ชัด → คืน `skipped`/`blocked` ให้ parent ถาม user

## Expected Outcome

- Open issues ที่ฉันสร้างทั้งหมดถูก implement ผ่าน `/implement-to-production`
- แต่ละ issue ที่เสร็จถูก comment สรุปและปิดด้วย reason ที่ถูกต้อง
- Issues ที่ยังไม่เสร็จได้รับ comment ความคืบหน้า
- Verification ผ่านสำหรับทุก issue ที่ implement
- รายงานสรุปครบ: implemented, resolved, skipped, failed พร้อม URL
