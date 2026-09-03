---
name: view-pr
description: แสดงรายละเอียด PR ใน terminal พร้อม metadata และ diff
argument-hint: "[pr-number-or-url]"
allowed-tools:
  - exec
  - read
  - grep
  - find_file_by_name
triggers:
  - user
  - model
related:
  - view
  - view-diff
  - list-github-pr
---

## Goal

แสดงรายละเอียด PR ใน terminal: title, body, metadata, status และ diff ที่เลือกแสดงได้

## Scope

ใช้เมื่อผู้ใช้ขอดู PR ตรวจสอบ PR หรืออ่านรายละเอียด PR โดยไม่ต้องเปิด browser ใช้ได้ทั้ง repo ในเครื่องและ PR ข้าม repo ผ่าน `gh`

ดูเพิ่มเติม: /list-github-pr

## Execute

### 1. Identify PR

> Goal: Identify PR

ระบุ PR ที่จะแสดง

1. รับ PR number หรือ URL จาก argument หรือ context
2. หากไม่ได้รับ PR ให้ใช้ `gh pr view` สำหรับ PR ของ branch ปัจจุบัน
3. หากได้รับ URL ให้แยก `owner/repo` และ PR number
4. หากต้องการ `--repo` ให้ได้มาจาก git remote หรือ URL

### 2. Check gh CLI

> Goal: Check gh CLI

ตรวจสอบให้แน่ใจว่า `gh` พร้อมใช้และผ่านการตรวจสอบสิทธิ

1. รันคำสั่ง `gh --version`
2. หากขาดไป ให้ติดตั้งด้วย `mise use -g gh` หรือ `scoop install gh`
3. รันคำสั่ง `gh auth status` เพื่อยืนยันการตรวจสอบสิทธิ
4. หากยังไม่ผ่านการตรวจสอบสิทธิ ให้รันคำสั่ง `gh auth login` หรือรายงานปัญหา

### 3. View PR Details

> Goal: View PR Details

แสดง metadata ของ PR

1. รันคำสั่ง `gh pr view <number>`
2. ใช้ `gh pr view <number> --json ...` สำหรับ output ที่อ่านได้ด้วยเครื่อง
3. รวม fields: number, title, author, state, head, base, mergeable, checks, labels, reviewers, body
4. จัดรูปแบบ output เป็นตารางที่อ่านง่ายหรือรายงานแบ่งเป็นส่วน

### 4. View PR Checks And Reviews

> Goal: View PR Checks And Reviews

แสดงสถานะ CI และ review

1. รันคำสั่ง `gh pr checks <number>`
2. รันคำสั่ง `gh pr view <number> --json reviewDecision,statusCheckRollup`
3. สรุป checks ที่ผ่าน ล้มเหลว และรอดำเนินการ

### 5. View PR Diff

> Goal: View PR Diff

เลือกแสดง diff ของ PR

1. รันคำสั่ง `gh pr diff <number>` เมื่อผู้ใช้ขอดู diff
2. ใช้ `view-diff` หรือ `bat` เพื่อแสดง diff อย่างมีประสิทธิภาพ
3. จำกัด output ของ diff ไว้ที่ 500 บรรทัด หากใหญ่กว่านั้นให้สรุปก่อน

### 6. Cross-Repo PRs

> Goal: Cross-Repo PRs

จัดการ PR จาก repo อื่น

1. แยก PR URL เพื่อรับ owner, repo และ number
2. รันคำสั่ง `gh pr view <number> --repo <owner/repo>`
3. รันคำสั่ง `gh pr diff <number> --repo <owner/repo>`

## Rules

### 1. Tooling

- ใช้ `gh pr view` เป็นคำสั่งหลัก
- ใช้ `--json` สำหรับ metadata ที่อ่านได้ด้วยเครื่อง
- ใช้ `gh pr diff` สำหรับ diff

### 2. Output

- แสดง title, number, state, author, base และ head branches ก่อน
- แสดง body, labels และ reviewers เป็นส่วน
- แสดง checks และสถานะ review ให้ชัดเจน

### 3. Scope

- แสดงเท่านั้น ห้าม merge, close หรือแก้ไข PR เว้นแต่มีการขอ
- ถามก่อนแสดง PR หรือ diff ที่มีขนาดใหญ่มาก

### 4. Safety

- ตรวจสอบให้แน่ใจว่า `gh` ผ่านการตรวจสอบสิทธิ
- จัดการกรณีที่ไม่พบ PR อย่างเหมาะสมด้วยข้อความที่ชัดเจน
- ห้ามเปิดเผย token หรือ secret

## Expected Outcome

- แสดง PR title, body และ metadata อย่างชัดเจน
- สรุปสถานะ checks และ review
- แสดง diff ที่เลือกแสดงได้พร้อม syntax highlighting
- รองรับ PR ข้าม repo
