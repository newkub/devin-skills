# ast-grep Rules Checks

## Goal

ตรวจสอบ ast-grep rules ใน `rules/` และ `sgconfig.yml` ให้ถูกต้องและสอดคล้องกับ `.devin/rules`

## Scope

ใช้สำหรับไฟล์ ast-grep rules ใน `rules/` และ config `sgconfig.yml`

## Checks

### 1. Alignment With `.devin/rules`

- เปรียบเทียบ rules ใน `rules/` กับ `.devin/rules`
- ตรวจว่า rule ใน ast-grep มี counterpart ใน `.devin/rules` หรือไม่
- ระบุ rules ที่มีเฉพาะในฝั่งเดียว

### 2. `sgconfig.yml`

- ตรวจว่า `ruleDirs` ระบุ directory ที่มีอยู่จริง
- ตรวจว่า `ruleDirs` match กับ directory structure ปัจจุบัน
- อัปเดต `sgconfig.yml` หาก directory structure เปลี่ยน

### 3. Rule Structure

- ตรวจว่า rule มี `id` ที่ unique
- ตรวจว่า rule มี `language` ที่ถูกต้อง
- ตรวจว่า `rule` block มี pattern หรือ `any`/`all` ที่ถูกต้อง
- ตรวจว่า `constraints` หากมีระบุค่าที่ valid

### 4. Validation

- รัน `ast-grep scan` หรือ `bun run scan`
- ตรวจว่าไม่มี error หรือ warning
- ถ้ามี error → แก้ไขและ recheck สูงสุด 3 รอบ

## Expected Outcome

- `rules/` และ `.devin/rules` sync กัน
- `sgconfig.yml` ชี้ไปยัง directory ที่มีอยู่จริง
- `ast-grep scan` ผ่านโดยไม่มี error
