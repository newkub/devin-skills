---
name: run-drizzle-studio
description: รัน Drizzle Studio สำหรับจัดการ database ผ่าน GUI
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

รัน `drizzle-kit studio` ให้ทำงานได้จริง พร้อมตรวจ config, database connection, และเปิด browser

## Scope

ใช้สำหรับ project ที่ติดตั้ง `drizzle-kit` แล้ว — เน้นการ execute รัน studio ไม่ใช่ guide ทั่วไป

## Execute

### 1. Verify Prerequisites

> Goal: ตรวจสอบว่า project พร้อมรัน Drizzle Studio
> Goal: ไม่พลาดเพราะ config หรือ dependencies ขาด

1. ตรวจสอบว่ามีไฟล์ `drizzle.config.ts` หรือ `drizzle.config.js`
2. อ่าน `drizzle.config.ts` เพื่อดู `schema`, `dialect`, และ `dbCredentials`
3. ตรวจสอบว่ามี `drizzle-kit` ใน `package.json` dependencies
4. ตรวจสอบว่ามี environment variable ที่จำเป็น เช่น `DATABASE_URL`
5. ถ้า config ขาด → ทำ `/follow-drizzle` ก่อนแล้ว stop

### 2. Check Database Connection

> Goal: ตรวจสอบว่า database พร้อมใช้งาน
> Goal: รัน studio ได้โดยไม่ติด connection error

1. ดึง `DATABASE_URL` จาก `.env` หรือ environment
2. ใช้ database client หรือ `drizzle-kit push --dry-run` เช็คว่าเชื่อมต่อได้
3. ถ้า database ไม่พร้อม → แจ้ง user และ stop
4. ตรวจสอบว่า schema ที่ระบุใน config มีอยู่จริง

### 3. Start Drizzle Studio

> Goal: รัน Drizzle Studio ด้วยคำสั่งที่ถูกต้อง
> Goal: Studio process รันอยู่บน port ทีกำหนด

1. เลือกคำสั่งตาม package manager:
   - `bunx drizzle-kit studio`
   - `npx drizzle-kit studio`
   - `pnpm dlx drizzle-kit studio`
   - `yarn dlx drizzle-kit studio`
2. ถ้ามี `package.json` scripts `studio` → ใช้ `bun studio` หรือ `npm run studio`
3. รันคำสั่ง และรอ output แสดง `http://localhost:4983`
4. บันทึก port ที่ studio ใช้

### 4. Open Browser

> Goal: เปิด browser เพื่อเข้าใช้งาน Studio
> Goal: User เข้าถึง GUI ได้ทันที

1. ใช้ `open-web` หรือ platform equivalent เพื่อเปิด `http://localhost:<port>`
2. default port คือ `4983`
3. ถ้า port ถูกใช้แล้ว ให้รอ output บอก port ใหม่
4. ยืนยันว่าหน้า Studio โหลดได้

### 5. Handle Errors

> Goal: แก้ไขปัญหาทั่วไประหว่างรัน
> Goal: studio รันผ่านโดยไม่มี error

1. ถ้า `drizzle-kit: command not found` → รัน `bun add -D drizzle-kit`
2. ถ้า `database connection failed` → ตรวจ `DATABASE_URL` และสิทธิ์การเข้าถึง
3. ถ้า `schema not found` → ตรวจ path ใน `drizzle.config.ts`
4. ถ้า port 4983 ถูกใช้ → ใช้ `PORT=4984 bunx drizzle-kit studio` หรือตัวเลือก port อื่น
5. ถ้าไม่ผ่าน → ทำ `/resolve-errors`

### 6. Stop Studio

> Goal: หยุด process อย่างถูกต้อง
> Goal: ไม่ทิ้ง process ค้าง

1. บันทึกว่าจะหยุดเมื่อไหร่ตาม user request
2. ใช้ `Ctrl+C` บน process ที่รันอยู่
3. ถ้า process ค้าง → ใช้ `taskkill` หรือ `pkill` เพื่อหยุด process
4. ยืนยันว่า port ถูกปล่อยแล้ว

## Rules

### 1. Package Manager

- ใช้ `bunx` เป็น default ถ้า project ใช้ Bun
- ใช้ `npx` ถ้าไม่มี Bun
- ใช้ `pnpm dlx` หรือ `yarn dlx` ตาม lockfile

### 2. Port And URL

- Default port คือ `4983`
- เปิด URL ที่ studio แจ้งใน output
- ถ้ามี custom port ให้บันทึกและสื่อสารให้ user

### 3. Configuration

- ต้องมี `drizzle.config.ts` ก่อนรันเสมอ
- ต้องมี `DATABASE_URL` หรือ credentials ที config ระบุ
- ถ้า config ไม่ถูกต้อง แก้ไขก่อนหรือหยุดทำงาน

### 4. Safety

- ไม่รัน studio บน production database โดยไม่มีการยืนยัน
- ไม่แก้ไขข้อมูล production ผ่าน studio โดยตรง
- ตรวจสอบ environment ก่อนรัน

### 5. Non-Redundancy

- ไม่ซ้ำกับ `/follow-drizzle` ที่เน้น development guide
- ใช้ขั้นตอนนี้เฉพาะเมื่อต้องการรัน studio จริง

## Expected Outcome

- `drizzle-kit studio` รันอยู่บน `http://localhost:4983` หรือ port ทีกำหนด
- Browser เปิดหน้า Studio เรียบร้อย
- Database connection และ schema ถูกต้อง
- ไม่มี process ค้างหลังใช้งานเสร็จ
