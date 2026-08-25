# Writing Quality Checks

รายการตรวจสอบคุณภาพการเขียนสำหรับ documentation, code comments, commit messages, changelogs

## Documentation Checks

### README

- มี overview ที่อธิบาย project ใน 1-2 ย่อหน้า
- มี installation steps ที่รันได้จริงบน clean environment
- มี usage examples ที่ใช้งานได้จริง
- มี contributing guide หรือ link ไป contributing docs
- มี badge/status และ links ไป docs เต็ม

### Docs Site

- structure ชัดเจน: heading hierarchy ถูกต้อง (h1 → h2 → h3)
- navigation ใช้งานได้: sidebar, TOC, breadcrumbs
- ไม่มี orphan pages — ทุก page เข้าถึงได้จาก navigation
- ลดความซ้ำซ้อน: ทำ `/simplify` เพื่อตัด noise และ redundant content

### API Docs

- ครอบคลุม parameters, returns, throws, examples, edge cases
- ใช้ active voice
- ระบุ breaking changes และ migration path ชัดเจน

### Technical Guides

- แบ่งเป็นขั้นตอนชัดเจน
- มี examples ที่ใช้งานได้จริง
- อธิบาย why ไม่ใช่แค่ what

## Code Comment Checks

- ตรวจ comments ที่ขาดหายไปใน complex logic
- ลด obvious comments, commented-out code, noise comments
- ปรับปรุง comments: เปลี่ยนจาก what → why, อธิบาย intent ไม่ใช่ implementation
- ตรวจ TODO/FIXME ว่ามี context, owner, deadline หรือ clear action
- ปรับปรุง `JSDoc`/`TSDoc`: ครอบคลุม params, returns, throws, examples — ใช้ active voice

## Commit Message Checks

- ใช้ conventional commits format
- ใช้ active voice
- กระชับ และบอก why ไม่ใช่แค่ what
- ระบุ breaking changes ชัดเมื่อมี

## Changelog Checks

- ตรวจ `CHANGELOG.md` ที่ gen โดย `/follow-tool-changelogen` สำหรับ format และ grouping
- จัดกลุ่มตาม category: Features, Bug Fixes, Breaking Changes
- ใช้ user-facing language
- ระบุ migration path สำหรับ breaking changes

## Writing Consistency Checks

- สร้าง glossary: ระบุคำศัพท์ที่ใช้ทั่ว project และคำที่ควรหลีกเลี่ยง
- ตรวจ terminology consistency: ใช้คำเดียวกันสำหรับ concept เดียวกัน
- ตรวจ voice: active voice สำหรับ instructions, passive voice เฉพาะเมื่อจำเป็น
- ตรวจ tone: professional แต่เข้าถึงได้, ไม่ใช้ jargon โดยไม่จำเป็น
- ตรวจ formatting consistency: heading levels, bullet styles, code block languages, link formats

## Writing Issue Categories

- `unclear` — อ่านแล้วไม่เข้าใจว่าต้องทำอะไร
- `verbose` — เขียนยาวเกินจำเป็น มี noise
- `inconsistent terminology` — ใช้คำต่างกันสำหรับ concept เดียวกัน
- `missing context` — ขาดบริบทที่จำเป็นต่อการเข้าใจ
- `passive voice` — ใช้ passive voice ในที่ที่ควรใช้ active voice
- `jargon overuse` — ใช้ศัพท์เทคนิคโดยไม่อธิบาย
- `broken structure` — heading hierarchy หรือ navigation เสีย
