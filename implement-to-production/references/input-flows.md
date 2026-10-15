# Implement To Production — Input Flows

Detail for `/implement-to-production` `## Scope` — how to turn an input artifact (plan file or `TODO.md`) into the task queue the main flow (`### 1`–`### 9`) then executes. Read the matching section before starting `### 1` when the input is one of these.

> Pre-Run: the flow always returns to the main `## Execute` steps after the input is converted to a task list — the input file is the source of truth for scope, not for implementation strategy

## Plan File (`.devin/temp/plan/<workspace>/<title-date>.md`)

1. ระบุไฟล์แผน: argument เป็น plan path หรือ title; ไม่มี → list ไฟล์ใน `.devin/temp/plan/<workspace>/` แล้วถาม user เลือก
2. สร้าง task list จากไฟล์แผน — ระบุ task ที่ยัง `status: pending` จัดลำดับตาม `## Execution Order` แล้วทำทีละข้อจาก critical path; งานซับซ้อน → `/create-plan-in-dot-devin` ซ้ำก่อนลงมือ
3. อัปเดต status ในไฟล์แผนเป็น `in-progress`/`completed` ระหว่างทำ; พบปัญหา → `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง
4. ตรวจสอบทุก task `status: completed` → รัน `/deep-validate` + `/run-verify` → ลบไฟล์แผนเมื่องานครบ (ห้ามลบก่อนยืนยัน) → รายงานสรุป; ถ้าต้องเปลี่ยนแผนให้ถาม user ก่อน, task เสี่ยงสูงใช้ `/ask-me` ก่อน; แผนจาก `AGENTS.md` หรือเอกสารทั่วไปที่ไม่ต้องลบไฟล์ → ใช้ `/follow-plan` แทน

## TODO.md

1. หา `TODO.md` ใน project root — ไม่มี → stop และ report; แยก table rows: Title, Description, Status, Priority, Created
2. กรองเฉพาะ `pending`/`in-progress` → เรียงตาม priority high→medium→low, task ที่ไม่มี blocker ก่อน, created เก่า→ใหม่ → เลือก task แรก
3. implement ทีละ task ด้วย flow หลักของ skill (task ง่ายและมี state อยู่แล้ว → `/continue`; ซับซ้อน → `/create-plan-in-dot-devin` ก่อน); fail → `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง
4. อัปเดต `Status` ทันทีหลังทำ — `completed`/`blocked` พร้อมเหตุผล; เพิ่ม sub-task เมื่อจำเป็น ไม่เพิ่ม task ใหม่โดยไม่มีเหตุผล; task ไม่ชัดเจน → ถาม user ก่อน
5. วนข้อ 2-4 จนไม่มี `pending`; ถ้ามี `blocked` → report และถาม user; ปิดท้าย `/deep-validate` → `/run-verify` → `/ship` → `/report` สรุป tasks ทั้งหมด

## Rules

### 1. One Queue

- อ่าน input ครั้งเดียวแล้วได้ task list เดียว — ห้ามทำ task ที่ยังไม่ถูกถอดเป็นรายการใน queue และห้าม task ซ้ำสองแหล่ง

### 2. State Stays Written Down

- อัปเดต status ในไฟล์แผน/`TODO.md` ทันทีที่เสร็จแต่ละ task — งานค้าง/blocked → เก็บลง `TODO.md` ผ่าน `/save-to-todo-md` ก่อนจบ session

## Expected Outcome

- ทุก task ใน input artifact ถูก implement ผ่าน flow หลักและ status ตรงกับของจริง
- ไม่มี plan file ค้างเมื่องานครบ (ลบหลัง `/deep-validate` ผ่านแล้วเท่านั้น)
