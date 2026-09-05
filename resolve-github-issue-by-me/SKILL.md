---
name: resolve-github-issue-by-me
description: ปิดหรือ resolve GitHub issues ที่สร้างโดยฉันหลัง implement เสร็จผ่าน `gh issue`
argument-hint: "[issue-or-scope]"
related:
  - list-github-issue
  - implement-github-issue-by-me
  - productionize-implementation
  - resolve-github-pr
  - ask-me
---

## Goal

ตรวจสอบและ resolve GitHub issues ที่สร้างโดยฉัน (`@me`) หลัง implementation เสร็จ โดย comment สรุปผลและปิด issue อย่างถูกต้อง

## Scope

- จัดการเฉพาะ issues ที่สร้างโดย authenticated user (`--author @me`)
- comment สรุปผลการ implement ก่อนปิด issue
- ปิด issue ด้วย `gh issue close` เมื่อ acceptance criteria ครบ
- ถ้า issue ยังไม่เสร็จ → comment ความคืบหน้าแทนการปิด
- ไม่ลบ issue ไม่ย้าย issue และไม่ปิด issue ที่คนอื่นสร้าง
- ถ้า issue เชื่อมกับ PR → ใช้ `/resolve-github-pr` ให้ PR merge ปิด issue อัตโนมัติ

## Execute

### 1. Verify Repository And Auth

> Goal: ยืนยัน repo และ identity ของฉัน

1. รัน `gh auth status` เพื่อยืนยัน authentication
2. รัน `gh repo view` เพื่อดู repo ปัจจุบัน ถ้าอยู่นอก repo ใช้ `--repo owner/repo`
3. รับ `<issue-or-scope>` จาก argument — ถ้าไม่ระบุให้ resolve ทุก issue ที่ฉันสร้าง
4. ถ้า scope ไม่ชัด → ใช้ `/ask-me`

### 2. List My Issues

> Goal: รวบรวม issues ที่สร้างโดยฉัน

1. รัน `gh issue list --author @me --state open --limit 50` หรือใช้ `/list-github-issue`
2. ถ้าระบุ issue number → ใช้ `gh issue view <issue>` ตรวจสอบว่า author เป็นฉัน
3. อ่าน body และ comments ของแต่ละ issue เพื่อดู acceptance criteria
4. ถ้าไม่มี open issues ที่ฉันสร้าง → report และจบ

### 3. Verify Implementation

> Goal: ยืนยันว่าแต่ละ issue implement เสร็จแล้ว

1. ตรวจสอบว่า acceptance criteria ของ issue ครบตาม commits/PRs ที่เชื่อมโยง
2. ถ้ามี PR ที่ยังไม่ merge → ทำ `/resolve-github-pr` ก่อน
3. ถ้า issue ยัง implement ไม่เสร็จ → comment ความคืบหน้าและข้ามไป issue ถัดไป
4. ถ้าไม่แน่ใจว่าเสร็จหรือไม่ → ใช้ `/ask-me` ก่อนปิด

### 4. Comment Resolution

> Goal: comment สรุปผลก่อนปิด issue

1. รัน `gh issue comment <issue> --body "<summary>"` สรุปสิ่งที่ implement, commits/PRs ที่เกี่ยวข้อง และผล verification
2. เขียน comment เป็นภาษาอังกฤษ ยกเว้น technical terms และ repo conventions
3. ระบุ evidence เช่น commit hash, PR number, หรือ test results

### 5. Close Issue

> Goal: ปิด issue ที่เสร็จสมบูรณ์

1. รัน `gh issue close <issue> --reason completed` สำหรับ issue ที่ implement ครบ
2. รัน `gh issue close <issue> --reason "not planned"` ถ้า user ยืนยันว่าไม่ทำแล้ว
3. ถ้า PR มี `Closes #<issue>` อยู่แล้ว → ตรวจว่า GitHub ปิดอัตโนมัติหลัง merge
4. ไม่ปิด issue ที่ยังไม่เสร็จหรือไม่มี evidence

### 6. Verify And Report

> Goal: ยืนยันสถานะสุดท้ายและรายงาน

1. รัน `gh issue view <issue>` ตรวจสอบ state และ comments ล่าสุด
2. รายงานจำนวน issues ที่ปิด, comment ความคืบหน้า และข้าม พร้อม URL
3. ถ้าเหลือ issues ที่ยังไม่เสร็จ → แนะนำ `/implement-github-issue-by-me`

## Rules

### 1. My Issues Only

- จัดการเฉพาะ issues ที่ `--author @me` เท่านั้น
- ไม่ปิด แก้ไข หรือ comment ใน issues ของผู้อื่นโดยไม่ได้รับอนุญาต
- ตรวจสอบ author ก่อนทุก action

### 2. Evidence Before Close

- ปิด issue เฉพาะเมื่อมี evidence ว่า implement เสร็จ: merged PR, commits, หรือ verification ผ่าน
- ทุก issue ที่ปิดต้องมี comment สรุปผลก่อน
- ถ้าไม่มี evidence → comment ความคืบหน้าแทนการปิด

### 3. Safety

- `gh issue delete` เป็น destructive ต้องถาม user ก่อนเสมอ แนะนำใช้ `close` แทน
- ตรวจสอบ issue number และ repo ก่อน close
- ไม่ reopen issue ที่คนอื่นปิดโดยไม่ได้รับอนุญาต

### 4. Batch Discipline

- ประมวลผลทีละ issue ไม่ bulk close โดยไม่ตรวจ
- หลังแต่ละ issue ให้บันทึกผลลัพธ์ก่อนไป issue ถัดไป
- ถ้า implement ยังไม่เสร็จ → ส่งต่อ `/productionize-implementation` ผ่าน `/implement-github-issue-by-me`

## Expected Outcome

- Issues ที่ฉันสร้างและ implement เสร็จแล้วถูก comment สรุปและปิดด้วย reason ที่ถูกต้อง
- Issues ที่ยังไม่เสร็จได้รับ comment ความคืบหน้า
- ไม่มี issue ของผู้อื่นถูกแตะต้อง
- รายงานสรุปพร้อม URL ของแต่ละ issue
