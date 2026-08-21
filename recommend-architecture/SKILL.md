---
name: recommend-architecture
description: แนะนำ architecture และ file structure ที่เหมาะสมสำหรับโปรเจกต์ พร้อม comment และตาราง file pattern
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - analyze-project
  - ship
---

## Goal

แนะนำ architecture และ file structure ที่เหมาะสมสำหรับโปรเจกต์ พร้อม comment ด้านหลังและตาราง file pattern

## Plan

วิเคราะห์โปรเจกต์ แนะนำ architecture และ file structure พร้อม comment และตาราง file pattern

## Scope

ครอบคลุมการวิเคราะห์โปรเจกต์ การแนะนำ architecture การแนะนำ file structure และการสร้างตาราง file pattern

## Execute

### 1. Deep Analyze
> Goal: Deep Analyze

วิเคราะห์โปรเจกต์อย่างละเอียด

- ทำ `/analyze-project` เพื่อวิเคราะห์โปรเจกต์อย่างละเอียด
- ระบุ architecture, code quality, dependencies
- บันทึก findings และ recommendations

### 2. Check Architecture
> Goal: Check Architecture

ตรวจสอบโครงสร้างไฟล์และ folders

- ทำ `/review-codebase` เพื่อตรวจสอบโครงสร้าง
- ระบุ architecture patterns ที่ใช้
- ตรวจสอบ consistency ของโครงสร้าง

### 3. Recommend Architecture
> Goal: Recommend Architecture

แนะนำ architecture ที่เหมาะสม

- แนะนำ architecture pattern ที่เหมาะสม
- แนะนำ file structure ที่เหมาะสม
- ตอบในแชทโดยตรง
- มี comment ด้านหลังแต่ละ file/folder

### 4. Create File Pattern Table
> Goal: Create File Pattern Table

สร้างตาราง file pattern

- สร้างตาราง file pattern ด้านล่าง
- Column: File Pattern, Description, Naming, Import
- ตอบในแชทโดยตรง

## Rules

### 1. Direct Response

ตอบในแชทโดยตรง

- ตอบในแชทโดยตรง
- ไม่ต้องสร้างไฟล์
- แสดง architecture และ file structure ในแชท

### 2. File Structure Format

รูปแบบ file structure

- ใช้ tree structure หรือ nested list
- มี comment ด้านหลังแต่ละ file/folder
- comment อธิบาย purpose หรือ responsibility

### 3. File Pattern Table

ตาราง file pattern

- สร้างตารางด้านล่าง file structure
- Column: File Pattern, Description, Naming, Import
- File Pattern ใช้ glob pattern เช่น `/*.vue`, `/*.ts`
- Description อธิบายหน้าที่ของ pattern
- Naming ใช้ตัวอย่างไฟล์จริงเพียงตัวเดียว เช่น `BookingPage.tsx`
- Import ระบุสามารถ import จาก folder ไหนได้บ้าง

### 4. Direct Execution

ทำงานอัตโนมัติโดยไม่หยุดถาม

- ถ้าผู้ใช้บอกว่า "ทำ ... ให้" ให้ทำตาม `/ship` เลย
- ไม่ต้องทำตาม workflow ปกติถ้าผู้ใช้สั่งโดยตรง
- ทำงานอัตโนมัติโดยไม่หยุดถาม

## Expected Outcome

- Architecture recommendation ที่เหมาะสม
- File structure พร้อม comment ด้านหลัง
- ตาราง file pattern พร้อม column ครบถ้วน
- ตอบในแชทโดยตรง
