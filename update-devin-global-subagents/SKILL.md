---
name: update-devin-global-subagents
description: สร้างหรืออัปเดต global subagent ใน devin agents repo ให้ถูกต้องตาม AGENT.md
argument-hint: "[agent-name]"
related:
  - list-devin-global-subagents
  - review-devin-global-subagents
  - follow-create-devin-plugins
  - ship
  - ask-me
---

## Goal

สร้างหรืออัปเดต `AGENT.md` สำหรับ Devin subagent ให้ถูกต้อง ครบถ้วน และใช้งานได้จริง

## Scope

ใช้เมื่อต้องสร้าง agent ใหม่หรือแก้ไข agent ใน `~/.config/devin/agents/`, `.devin/agents/`, `.agents/agents/`, หรือ `%APPDATA%\devin\agents\`

## Execute

### 1. Identify Target Subagent

> Goal: ระบุ subagent ที่ต้องสร้างหรืออัปเดต

1. รับชื่อ agent และบทบาทจาก user
2. ทำ `/list-devin-global-subagents` เพื่อยืนยันว่า agent มีอยู่หรือไม่
3. ระบุ target directory: `<agents-root>/<agent-name>/`
4. ถ้าชื่อซ้ำหรือไม่ชัด → ทำ `/ask-me`

### 2. Select Archetype

> Goal: เลือกโครงสร้างสิทธิ์ตามบทบาท

1. Read-only auditor: `reviewer`, `verifyer`, `security-auditor` — deny `write`, `edit`
2. Builder/Implementer: `fixer`, `improver`, `refactorer`, `code-simplifier` — allow `edit`, `write`, `exec` สำหรับ test/lint/build
3. Planner/Designer: `architect`, `api-designer`, `uxui-designer` — อาจอนุญาตให้เขียน spec/design doc แต่ไม่แก้ source หลัก
4. Executor/Operator: `test-runner`, `release`, `deployment-specialist` — allow รันคำสั่งทีเกี่ยวข้อง

### 3. Write Frontmatter

> Goal: frontmatter ถูกต้องตาม Devin spec

1. `name`: lowercase, คั่นด้วย `-`, ตรงกับ directory name
2. `description`: กระชับ ≤100 ตัวอักษร
3. `model`: `sonnet` โดย default
4. `allowed-tools`: เลือกเฉพาะ tools ทีจำเป็น เช่น `read`, `grep`, `find_file_by_name`, `code_search`, `exec`, `edit`, `write`
5. `permissions`:
   - `allow`: คำสั่งปลอดภัย เช่น `Exec(bun run test)`, `Exec(bun run lint)`, `Exec(bun run typecheck)`, `Exec(bun run build)`
   - `deny`: `write`, `edit` สำหรับ read-only; หรือ `exec` ถ้าไม่ต้องการให้รัน terminal

### 4. Write Prompt Body

> Goal: prompt สอดคล้องกับบทบาทและ spec

1. `## Goal`: ประโยคเดียวชัดเจน
2. `## Scope`: ขอบเขตงานและ focus areas
3. `## Execute`: แบ่งเป็น steps ไม่เกิน 10 ขั้นตอน ใช้ `### N. Step Name`, `> Goal:`, และ numbered list
4. `## Rules`: 3-5 กฎเฉพาะบทบาท
5. `## Expected Outcome`: สิ่งทีต้องได้รับ
6. ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `agent-name`
7. ห้ามใช้ `**` bold markers

### 5. Validate

> Goal: AGENT.md พร้อมใช้งาน

1. ตรวจว่ามี frontmatter `---` ครบท้งสองฝั่ง
2. ตรวจ required fields: `name`, `description`, `model`, `allowed-tools`
3. ตรวจ required sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
4. นับบรรทัด ต้องไม่เกิน 250 บรรทัด
5. ตรวจหา markers ทีบ่งบอกว่าเนื้อหายังไม่สมบูรณ์
6. ตรวจว่า `name` ตรงกับ directory name และไม่ซ้ำกับ agent ตัวอื่น
7. ถ้ามีปัญหา → แก้ไขและ revalidate จนผ่าน

### 6. Update References

> Goal: รักษาความสอดคล้องกับ catalog

1. ถ้ามี agent อื่นเกี่ยวข้อง → อัปเดต `related` หรือ cross-reference
2. ถ้ามี skill ที agent ควรใช้ → เพิ่มลงใน `## Execute` หรือ `## Rules`
3. ทำ `/update-references` ถ้ามีชื่อเปลี่ยน
4. ทำ `/suggest-next-action` เมื่อเสร็จ

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Agent Identity

- `name` ต้องสะท้อนบทบาทเฉพาะ ไม่ generic เช่น `helper`, `expert`
- ห้ามซ้ำกับ existing agent ทีมีอยู่

### 2. Permissions

- Read-only agents ต้อง `deny: [write, edit]`
- Builder agents อนุญาต `edit`, `write` และ `exec` สำหรับ check/test
- Release/deploy agents ต้อง ask ก่อน remote side effects

### 3. Tool Selection

- `allowed-tools` ต้องเพียงพอต่อบทบาท ไม่มากเกิน
- อย่าเพิ่ม `glob` ถ้า runtime ไม่รองรับ ให้ใช้ `find_file_by_name` แทน

### 4. Format

- ใช้ heading ภาษาอังกฤษ Title Case หรือตาม convention ของ project
- รายการภาษาไทยสำหรับรายละเอียด
- ไฟล์ไม่เกิน 250 บรรทัด

### 5. Safety

- ถ้า overwrite `AGENT.md` เดิม → ทำ dry run ขอ user confirmation ก่อน
- ไม่แก้ไข agent อื่นโดยไม่จำเป็น
- ถ้าเปลี่ยน directory name → อัปเดต `name` ใน frontmatter ให้ตรง

## Expected Outcome

- `AGENT.md` ใหม่หรืออัปเดทที `<agents-root>/<agent-name>/AGENT.md`
- frontmatter ครบถ้วนและถูกต้อง
- prompt body มี `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
- ไฟล์ไม่เกิน 250 บรรทัด ไม่มี markers ทีบ่งบอกว่าเนื้อหายังไม่สมบูรณ์
- ชื่อ agent ตรงกับ directory name และไม่ซ้ำ
- `permissions` เหมาะสมกับบทบาท
- references อัปเดตครบถ้วน
