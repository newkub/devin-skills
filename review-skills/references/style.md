# Style Conventions

ตรวจสอบ style conventions ของ `SKILL.md` และไฟล์ใน `references/`

## Backticks Usage

- ใช้ backticks สำหรับ `tools` (เช่น `/scan-codebase`, `/validate`)
- ใช้ backticks สำหรับ `commands` (เช่น `npm run lint`, `bun install`)
- ใช้ backticks สำหรับ `paths` (เช่น `SKILL.md`, `references/index.md`)
- ใช้ backticks สำหรับ `skill-name` (เช่น `update-skills`, `review-all-skills`)
- ถ้าพบ tools/commands/paths/skill-name ที่ไม่มี backticks → flag เป็น Medium

## Bold Markers

- ห้ามใช้ `**` (bold markers) ในเนื้อหาทั้งหมด
- ใช้ backticks สำหรับ emphasis แทน bold
- ถ้าพบ `**` → flag เป็น Medium

## Heading Conventions

- Heading ภาษาอังกฤษใช้ Title Case
  - ถูก: `## Expected Outcome`, `### Check Frontmatter`
  - ผิด: `## expected outcome`, `### check frontmatter`
- Heading ภาษาไทยใช้ตามปกติ
- ถ้า heading ภาษาอังกฤษไม่ Title Case → flag เป็น Low

## Content Language

- Heading ภาษาอังกฤษ Title Case
- เนื้อหาบรรยายภาษาไทย
- รายการ (list items) ภาษาไทย
- ถ้าเนื้อหาผสมภาษาโดยไม่จำเป็น → flag เป็น Low

## Scoring

- Medium: ไม่ใช้ backticks, ใช้ `**` bold markers
- Low: heading ภาษาอังกฤษไม่ Title Case, เนื้อหาผสมภาษา
