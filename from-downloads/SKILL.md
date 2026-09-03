---
name: from-downloads
description: อ่านและ list ไฟล์จาก home downloads folder
argument-hint: "[pattern-or-filename]"
allowed-tools:
  - read
  - find_file_by_name
  - exec
  - ask_user_question
  - report
  - report-table
  - suggest-next-action
triggers:
  - user
  - model
related:
  - from-recent-windows-capture
  - capture-image-app-to-screenshot
  - watch-browser-and-improve-uxui
  - open-in-explorer
  - suggest-next-action
---

## Goal

อ่านและ list ไฟล์จาก home downloads folder สำหรับนำไปใช้ใน workflow อื่น

## Scope

ใช้กับไฟล์ทีอยู่ใน `~/Downloads` เช่น screenshots, images, documents, archives โดย list, filter และ read ไฟล์ทีเลือก

ดูเพิ่มเติม: /from-recent-windows-capture, /capture-image-app-to-screenshot, /watch-browser-and-improve-uxui, /open-in-explorer

## Execute

### 1. Resolve Downloads Path

> Goal: แก้ไข Downloads Path
1. Windows: `C:\Users\<username>\Downloads`
2. macOS: `~/Downloads`
3. Linux: `~/Downloads`
4. ถ้า user ระบุ path อื่น → ใช้ค่านั้น

### 2. List Files

> Goal: รายการ Files
1. ใช้ `/find_file_by_name` ด้วย pattern `*` บน downloads path
2. ถ้า user ระบุ pattern → ใช้ pattern นั้น
3. เรียงลำดับตามชื่อไฟล์ หรือ last modified
4. ถ้าไม่พบไฟล์ → stop และ report

### 3. Filter And Select

> Goal: กรอง And Select
1. ถ้ามีไฟล์มาก → ถาม user ว่าต้องการไฟล์ไหน
2. ถ้า user ระบุชื่อไฟล์ชัดเจน → เลือกไฟล์นั้น
3. รองรับ glob pattern เช่น `*.png`, `screenshot*`

### 4. Read File

> Goal: อ่าน File
1. ถ้าเป็น image (png, jpg, jpeg, gif, webp, bmp, svg) → ใช้ `/read`
2. ถ้าเป็น text (txt, md, json, csv, yml, yaml) → ใช้ `/read`
3. ถ้าเป็น binary ที read ไม่ได้ → รายงานขนาดและประเภท

### 5. Report

> Goal: รายงาน Report
1. ทำ `/report-table` แสดงไฟล์ทีพบ: No, Name, Size, Type, Modified
2. ทำ `/report` สำหรับไฟล์ทีเลือก
3. ทำ `/suggest-next-action`

## Rules

- ไม่อ่านไฟล์ทีอาจมี secrets หรือ credentials โดยอัตโนมัติ
- ถ้าไฟล์ดู sensitive → ถาม user ก่อน
- ไม่ move หรือ delete ไฟล์ใน Downloads โดยไม่ได้รับอนุญาต
- ใช้ `/find_file_by_name` สำหรับ list ไฟล์
- รองรับทั้ง Windows, macOS, Linux

## Expected Outcome

- รายการไฟล์ใน downloads folder
- ไฟล์ทีเลือกถูกอ่านหรือ report
- ข้อมูลพร้อมใช้งานต่อใน workflow อื่น
