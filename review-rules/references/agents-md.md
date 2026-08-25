# AGENTS.md Structure And Coverage Checks

## Goal

ตรวจสอบไฟล์ `AGENTS.md` ให้เป็นไปตามรูปแบบมาตรฐาน อ้างอิง skills ที่ถูกต้อง และครอบคลุมทุก workspace

## Scope

ตรวจสอบไฟล์ `AGENTS.md` ระดับ root และ workspace ใน `.devin/` หรือ root ของโปรเจกต์

## Checks

### 1. Locate Files

- ใช้ `glob` เพื่อค้นหา `**/AGENTS.md`
- ระบุไฟล์ระดับ root และระดับ workspace
- หากไม่มี `AGENTS.md` ให้หยุดและรายงาน

### 2. Frontmatter

- ตรวจว่า `name` ตรงกับ workspace หรือโปรเจกต์
- ตรวจว่า `description` มีอยู่และกระชับ
- ตรวจว่า `related` มีเฉพาะ skills ที่มีอยู่จริง
- ตรวจ `auto_execution_mode` หากมี

### 3. Sections

- ยืนยันลำดับ: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- ยืนยันว่า `## Rules` มี `### Architecture` พร้อม `tech: /follow-<tech>`
- ยืนยันว่า `### Skills` map `skill-name: /skill-name`
- ยืนยันว่าไม่มี section `## Workflows` หรือ `### Workflows`

### 4. References

- ดึง references `skill-name` ทั้งหมด
- ยืนยันว่า directory ของแต่ละ skill เป้าหมายมีอยู่
- ตรวจ mappings `tech: /follow-<tech>` และ `skill-name: /skill-name`
- รายงาน references ที่หายไปหรือไม่ถูกต้อง

### 5. Workspace Coverage

- ใช้ `/check-monorepo` เพื่อยืนยันรายการ workspace
- เปรียบเทียบ directories ของ workspace กับตำแหน่ง `AGENTS.md`
- ตรวจว่า `AGENTS.md` ระดับ root มี `### Workspaces` ที่ระบุแต่ละ workspace
- ตรวจว่า `AGENTS.md` ระดับ workspace ไม่ซ้ำ conventions ของ root

## Expected Outcome

- ไฟล์ `AGENTS.md` เป็นไปตามรูปแบบมาตรฐาน
- skill references ทั้งหมดถูกต้อง
- ทุก workspace มี `AGENTS.md` ระดับ workspace ใน monorepo
