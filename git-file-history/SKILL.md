---
name: git-file-history
description: ดู git file history ของไฟล์ที่ระบุผ่าน @wrikka/git-cli package ที่ release แล้ว โดยใช้คำสั่ง
argument-hint: "[file]"
---

## Goal

ดู git file history ของไฟล์ที่ระบุผ่าน `@wrikka/git-cli` package ที่ release แล้ว โดยใช้คำสั่ง `git-ai file-history <file>` ซึ่งจะ generate HTML viewer พร้อม split-screen timeline, commit type badges, diff view, และ keyboard navigation อัตโนมัติ

## Scope

ใช้สำหรับดู git file history ของไฟล์ใดๆ ใน workspace ที่มี git repository และติดตั้ง `@wrikka/git-cli` แล้ว

## Execute

### 1. Install @wrikka/git-cli
> Goal: Install @wrikka/git-cli

1. ตรวจสอบว่าติดตั้ง `@wrikka/git-cli` แล้ว:
   - รัน `git-ai --help` เพื่อตรวจสอบ
   - ถ้ายังไม่ติดตั้ง ให้ติดตั้งจาก `@wrikka/bun-packages` monorepo:
     `bun --filter @wrikka/git-cli build` แล้ว `bun link`
2. ตรวจสอบว่ามี `OPENAI_API_KEY` environment variable ถ้าต้องการ AI features

### 2. Run file-history Command
> Goal: Run file-history Command

1. ระบุไฟล์ที่ต้องการดู history (จาก active document หรือที่ผู้ใช้ระบุ)
2. รัน `git-ai file-history <file_path>` ใน git root directory
3. CLI จะ:
   - ดึง commit history ด้วย `git log --follow`
   - ดึง file content แต่ละ commit ด้วย `git show <hash>:<file>`
   - Generate HTML พร้อม Vue 3 + Tailwind CSS
   - เขียน HTML ไปยัง OS temp directory
   - เปิดใน browser อัตโนมัติ
4. ถ้าไม่ต้องการเปิด browser อัตโนมัติ ใช้ `--no-open` flag

### 3. UI Components
> Goal: UI Components

1. Header - glassmorphism bar แสดง file path, commit count, view toggle, keyboard hints
2. Timeline Sidebar - split-screen vertical timeline ด้านซ้าย:
   - แต่ละ commit แสดงเป็น dot บน timeline line
   - Commit type badge (feat, fix, refactor, chore, docs, other)
   - Active commit มี glow effect
   - Hover ที่ dot จะ scale up
3. Commit Info Bar - แสดง type badge, hash, message, author, date, email
4. Code Viewer - แสดง file content แบบ line-numbered พร้อม sticky line numbers
5. Diff View - สลับได้ระหว่าง content และ diff vs previous commit:
   - Added lines: green background
   - Removed lines: red background
   - Dual line numbers (old + new)
   - Diff stats: +added / -removed
6. Navigation Footer - prev/next buttons + progress dots
7. Copy Button - copy file content to clipboard

### 4. Keyboard Navigation
> Goal: Keyboard Navigation

1. `ArrowLeft` - ไป commit ก่อนหน้า (older)
2. `ArrowRight` - ไป commit ถัดไป (newer)
3. `D` - สลับระหว่าง content และ diff view
4. แสดง keyboard hint ที่ header

### 5. Transition Animations
> Goal: Transition Animations

1. ใช้ Vue `<transition>` component กับ `mode="out-in"`
2. Slide right (ไป commit ใหม่กว่า): `translateX(30px) scale(0.98)` → `translateX(0)`
3. Slide left (ไป commit เก่ากว่า): `translateX(-30px) scale(0.98)` → `translateX(0)`
4. ใช้ `cubic-bezier(0.22, 1, 0.36, 1)` easing
5. Duration: `0.4s`
6. Timeline scroll into view แบบ smooth
7. `fade-in-up` animation สำหรับ content area

## Rules

### 1. Package Usage

- ใช้ `git-ai file-history <file>` จาก `@wrikka/git-cli` package เท่านั้น
- ไม่ต้องเขียน Bun shell script เอง — package จัดการให้ทั้งหมด
- ถ้า package ยังไม่ release ให้ build จาก monorepo ก่อน
- ใช้ `--no-open` flag ถ้าไม่ต้องการเปิด browser อัตโนมัติ

### 2. Git Data Extraction

- Package ใช้ `git log --follow` สำหรับติดตาม file renames
- ใช้ `--pretty=format` สำหรับ structured output
- ใช้ `git show <hash>:<file_path>` สำหรับดึง content แต่ละ commit
- ถ้าไฟล์ไม่มี git history จะแสดง error message

### 3. HTML Generation

- ใช้ Vue 3 ผ่าน unpkg CDN
- ใช้ Tailwind CSS ผ่าน cdn.tailwindcss.com
- ใช้ dark mode theme (`<html class="dark">`)
- Split-screen layout: timeline sidebar (left) + content area (right)
- ทุก commit ต้องมี entry ใน timeline
- ไฟล์ต้องทำงานได้ทันทีเมื่อเปิดใน browser

## Expected Outcome

- HTML ไฟล์เดียวใน OS temp directory พร้อม real git data
- Split-screen UI: timeline sidebar + content area
- Commit type badges สำหรับ conventional commits
- Keyboard navigation (left/right) พร้อม transition animations
- Content และ Diff view สลับได้
- เปิดใน browser อัตโนมัติหลัง generate
