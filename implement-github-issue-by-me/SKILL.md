---
name: implement-github-issue-by-me
description: นำ GitHub issues ทั้งหมดที่สร้างโดยฉันมา productionize-implementation ทีละ issue
argument-hint: "[repo-or-filter]"
related:
  - implement-github-issue
  - productionize-implementation
  - resolve-github-issue-by-me
  - create-github-issue
  - list-github-issue
  - create-plan-as-github-issue
  - run-verify
  - ask-me
---

## Goal

รวบรวม GitHub issues ทั้งหมดที่สร้างโดยฉัน (`@me`) แล้ว implement ทีละ issue ผ่าน `/productionize-implementation` จนครบ จากนั้น resolve แต่ละ issue ด้วย `/resolve-github-issue-by-me`

## Scope

- จัดการเฉพาะ open issues ที่ authenticated user เป็น author (`gh issue list --author @me`)
- implement แต่ละ issue ด้วย `/productionize-implementation` ตามลำดับ priority
- หลัง implement แต่ละ issue เสร็จ → ทำ `/resolve-github-issue-by-me` เพื่อ comment ผลและปิด issue
- ไม่แตะ issues ของผู้อื่น และไม่ implement เกิน scope ของแต่ละ issue
- ถ้า issue เดียวต้องการ plan ก่อน → ใช้ `/create-plan-as-github-issue` หรือ `/implement-github-issue` สำหรับ issue เดี่ยว

## Execute

### 1. Verify Repository And Auth

> Goal: ยืนยัน repo และ identity

1. รัน `gh auth status` และ `gh repo view`
2. ถ้าอยู่นอก repo ใช้ `--repo owner/repo` ทุกคำสั่ง
3. รับ `<repo-or-filter>` จาก argument ถ้ามี
4. ถ้าเข้าถึง repo ไม่ได้ → stop และ report

### 2. List My Open Issues

> Goal: รวบรวม issues ที่ฉันสร้าง

1. รัน `gh issue list --author @me --state open --limit 50 --json number,title,labels,createdAt` หรือใช้ `/list-github-issue`
2. จัดลำดับตาม labels/priority ถ้ามี มิเช่นนั้นเรียงตาม createdAt เก่า → ใหม่
3. แสดงรายการ issues ให้ user ดูก่อน implement
4. ถ้าไม่มี open issues → report และจบ
5. ถ้า issues มี dependencies กัน → เรียงลำดับให้ issue ที่ถูก block ทำทีหลัง

### 3. Confirm Scope

> Goal: ยืนยันกับ user ก่อน implement หลาย issues

1. สรุปจำนวน issues และลำดับที่จะทำ
2. ใช้ `/ask-me` ให้ user เลือก: ทำทั้งหมด, เลือกบาง issue, หรือยกเลิก
3. บันทึกรายการ issue ที่ user อนุมัติเป็น queue

### 4. Implement Each Issue

> Goal: ทำ `/productionize-implementation` ทีละ issue ตาม queue

1. อ่าน issue ด้วย `gh issue view <issue> --comments` เพื่อดู acceptance criteria และ context
2. สร้าง branch ตาม project conventions ถ้า issue ต้องการ code changes
3. ทำ `/productionize-implementation` โดยใช้ issue body และ comments เป็น requirements
4. ทำ `/run-verify` หลัง implement แต่ละ issue — ถ้าไม่ผ่านให้แก้ก่อนไป issue ถัดไป
5. บันทึก commits และ PR (ถ้ามี) ที่เชื่อมกับ issue

### 5. Resolve Each Issue

> Goal: ปิด issue หลัง implement เสร็จ

1. ทำ `/resolve-github-issue-by-me <issue>` เพื่อ comment สรุปผลและปิด issue
2. ระบุ evidence: commit hash, PR number, verification results
3. ถ้า issue ยังไม่เสร็จสมบูรณ์ → comment ความคืบหน้าและเก็บไว้ใน queue
4. ทำซ้ำจนครบทุก issue ใน queue

### 6. Report Summary

> Goal: รายงานผลรวมทั้งหมด

1. สรุปจำนวน issues: implemented, resolved, skipped, failed พร้อม URL
2. ระบุ issues ที่ค้างพร้อมสาเหตุ
3. แนะนำ next action ถ้ามี issues เหลือ

## Rules

### 1. My Issues Only

- ประมวลผลเฉพาะ issues ที่ `--author @me` เท่านั้น
- ไม่ implement หรือปิด issues ของผู้อื่น
- ตรวจสอบ author ก่อนทุก issue

### 2. Confirm Before Batch

- ต้องให้ user confirm รายการ issues ก่อน implement หลายรายการ
- ไม่ implement โดยไม่แสดง queue ให้ user เห็นก่อน
- user สามารถเลือก subset หรือยกเลิกได้

### 3. Sequential Discipline

- ทำทีละ issue ให้เสร็จและ verify ผ่านก่อนไป issue ถัดไป
- ถ้า issue ไหน fail → หยุด report และถาม user ว่าจะข้ามหรือแก้ต่อ
- แต่ละ issue แยก branch/commits ตาม project conventions

### 4. Resolve After Implement

- ทุก issue ที่ implement เสร็จต้องผ่าน `/resolve-github-issue-by-me`
- ไม่ปิด issue โดยไม่มี evidence การ implement
- ถ้า `/productionize-implementation` fail กลางคัน → ไม่ resolve issue นั้น

### 5. Scope Per Issue

- implement เฉพาะสิ่งที่ issue ระบุ ไม่ขยาย scope
- ถ้าพบงานเพิ่มเติม → สร้าง issue ใหม่ผ่าน `/create-github-issue` แทนการทำเกิน scope

## Expected Outcome

- Open issues ที่ฉันสร้างทั้งหมดถูก implement ผ่าน `/productionize-implementation`
- แต่ละ issue ที่เสร็จถูก comment สรุปและปิดผ่าน `/resolve-github-issue-by-me`
- Verification ผ่านสำหรับทุก issue ที่ implement
- รายงานสรุปครบ: implemented, resolved, skipped, failed พร้อม URL
