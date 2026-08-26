---
name: watch-cloudflare
description: Watch deploy status ของ Cloudflare Workers แล้ว fix จนกว่าจะ deploy ผ่าน
argument-hint: "[worker-name-or-url]"
---

## Goal

Watch deploy status ของ Cloudflare Workers ผ่าน `wrangler tail` และ URL poll แล้ว fix จนกว่าจะ deploy ผ่าน โดยไม่รวมขั้นตอน build/deploy (เป็นหน้าที่ของ `/follow-service-deploy-to-cloudflare`)

## Scope

ใช้เมื่อ Cloudflare Workers deploy ไปแล้วแต่ยังไม่ผ่าน ต้องการ watch สถานะ หา root cause จาก logs และ fix จนกว่าจะ live สำเร็จ ครอบคลุมทุก framework ที่ deploy ไป Cloudflare Workers (Nitro, Hono, Nuxt, raw Workers)

ไม่ครอบคลุม: build, deploy, ตั้งค่า Nitro preset, สร้าง bindings — ใช้ `/follow-service-deploy-to-cloudflare` หรือ `/follow-service-cloudflare` แทน

## Execute

### 1. Identify Worker And URL

> Goal: รู้ชื่อ Worker และ URL ที่จะ watch

1. รับ `worker-name` หรือ URL จาก user, deploy output, หรือ `wrangler.jsonc` field `name`
2. ถ้ามีเฉพาะ URL → แปลงเป็น worker name จาก subdomain pattern `<name>.<account>.workers.dev`
3. ถ้าไม่ชัด → ทำ `/ask-me` ก่อนดำเนินการ
4. ตรวจสอบ authentication ด้วย `wrangler whoami`

### 2. Watch Deploy Status

> Goal: ตรวจสอบสถานะ deployment และ runtime errors

1. รัน `wrangler tail <worker-name> --status error --format json` เพื่อ stream errors และ exceptions
2. พร้อมกัน poll URL ด้วย `/watch-deploy` (ค่าเริ่มต้น `interval=10`, `timeout=300`, `expectedStatus=[200]`)
3. บันทึกทุก event: timestamp, `outcome`, URL, status, exception message
4. ดูรายละเอียดใน [references/watch-methods.md](references/watch-methods.md)
5. ถ้า `wrangler tail` หยุด output เกิน `30` วินาที → ถือว่า disconnect → retry tail สูงสุด `3` ครั้ง
6. ถ้า retry tail ครบ `3` ครั้งแล้วยัง disconnect → ใช้ `wrangler deployments list` แทน

### 3. Triage Failure

> Goal: จัดประเภท failure เพื่อเลือกทางแก้

1. URL poll ผ่าน (200) และ `wrangler tail` ไม่มี error → deployment live สำเร็จ → ไปขั้นตอน 6
2. URL ตอบ 5xx หรือ exception ใน tail → runtime error → ไปขั้นตอน 4
3. URL ตอบ 404 หรือ DNS error → deployment ยังไม่ propagate → รอและ poll ต่อ
4. `wrangler tail` ไม่เชื่อมต่อ → auth หรือ worker name ผิด → ทำ `/ask-me`
5. ใช้ `wrangler deployments list` ตรวจสถานะ deployment ล่าสุดถ้า tail ไม่ชัด

### 4. Locate Project Source

> Goal: หา project directory เพื่อ fix

1. ถ้า project path ทราบอยู่ → ใช้ path นั้น
2. ถ้าไม่ทราบ → ทำ `/search-project-in-drive-d` (Windows) หรือถาม user ด้วย `/ask-me`
3. ถ้าเจอหลาย project → เลือกจาก `wrangler.jsonc` field `name` ที่ตรงกับ worker
4. ถ้าไม่เจอ → ทำ `/ask-me` เพื่อขอ path จาก user
5. ยืนยัน path ที่เลือกก่อนแก้ไข

### 5. Fix Until Deploy Passes

> Goal: แก้ root cause จน deployment ผ่าน

1. ทำ `/resolve-errors` กับ errors ที่ triage ได้
2. วิเคราะห์ root cause จาก exception stack และ log messages
3. แก้ไข code น้อยที่สุดตาม root cause
4. ทำ `/run-check` เพื่อตรวจ lint, typecheck ก่อน deploy ใหม่
5. ทำ `/follow-service-deploy-to-cloudflare` เพื่อ build และ deploy ใหม่
6. วนกลับไปขั้นตอน 2 เพื่อ watch อีกครั้ง
7. ใช้ `/loop-until-complete` จนกว่า URL poll ผ่านและ tail ไม่มี error

### 6. Report Result

> Goal: สรุปผลให้ user ทราบ

1. ถ้าผ่าน → report worker name, URL, final status, response time, จำนวนรอบที่ fix
2. ถ้ายังไม่ผ่านหลัง timeout → report last status, error summary, สิ่งที่ค้าง และ next step
3. ใช้ table สำหรับสรุปผลลัพธ์

## Rules

### 1. Scope Boundary

- ทำเฉพาะ watch และ fix จนกว่าจะ deploy ผ่าน
- ห้าม build หรือ deploy เอง — ใช้ `/follow-service-deploy-to-cloudflare` สำหรับขั้นตอนนั้น
- ห้ามตั้งค่า Nitro preset หรือ bindings — ใช้ `/follow-service-cloudflare`

### 2. Watch Method

- ใช้ `wrangler tail <worker-name> --status error --format json` คู่กับ `/watch-deploy` URL poll เสมอ
- `interval` = `10` วินาที, `timeout` = `300` วินาที, `expectedStatus` = `[200]`
- ใช้ `wrangler deployments list` เมื่อ tail ไม่ชัด
- ดู filtering options ใน [references/watch-methods.md](references/watch-methods.md)

### 3. Failure Handling

- 200 + ไม่มี error → สำเร็จ หยุดทันที
- 5xx หรือ exception → runtime error → fix source
- 404 หรือ DNS → รอ propagation ไม่ fix
- auth ผิด → ทำ `/ask-me` ไม่พยายามแก้เอง
- วนซ้ำสูงสุด `5` รอบ ถ้าเกิน → stop และ report

### 4. Project Location

- ถ้า project path ทราบอยู่ → ใช้ path นั้นก่อน
- ถ้าไม่ทราบ → ใช้ `/search-project-in-drive-d` (Windows) หรือถาม user ด้วย `/ask-me`
- เลือก project จาก `wrangler.jsonc` field `name` ที่ตรงกับ worker
- ถ้าไม่เจอ → ทำ `/ask-me` ไม่เดา path

### 5. Safety

- ห้าม deploy หรือ build โดยไม่ผ่าน `/run-check` ก่อน
- ห้าม commit secrets จาก logs
- หยุดทันทีเมื่อ user กด `Ctrl+C`
- ไม่ hardcode worker name หรือ URL ใน skill

### 6. Tail Reconnection

- ถ้า `wrangler tail` disconnect → retry สูงสุด `3` ครั้ง with `5` วินาทีระหว่าง retry
- ถ้า retry ครบ → fallback เป็น `wrangler deployments list` + URL poll only
- ถ้า `wrangler` CLI ไม่ได้ติดตั้ง → ทำ `/ask-me` ไม่พยายามติดตั้งเอง

### 7. Rollback Safety

- ก่อนแก้ไข code ให้สร้าง checkpoint ด้วย `git stash`
- ถ้า fix round ≥ `3` และ error count เพิ่มขึ้น → พิจารณา `wrangler rollback` ก่อนแก้ต่อ
- ถ้า fix สร้าง error ใหม่ → `git stash pop` เพื่อคืนค่า

### 8. Per-Round Timeout

- `perRoundTimeout` = `120` วินาที สำหรับแต่ละรอบ fix-and-redeploy
- ถ้าเกิน → stop รอบนั้นและ report

## Expected Outcome

- Cloudflare Workers deploy status ถูก watch จนกว่าจะผ่านหรือหมดเวลา
- Runtime errors ถูก triage และ fix ที่ root cause
- Project source ถูกหาผ่าน path ที่ทราบ หรือ `/search-project-in-drive-d` (Windows) หรือ `/ask-me`
- Deployment live สำเร็จ: URL poll 200 และ `wrangler tail` ไม่มี error
- ผลลัพธ์ report ครบ: worker name, URL, status, จำนวนรอบ fix, สิ่งที่ค้าง
- ไม่มี TODO/MOCK/placeholder
- `SKILL.md` และ references ไม่เกิน 250 บรรทัด
