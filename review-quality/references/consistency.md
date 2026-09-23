# Consistency Review

## Goal

ตรวจความสอดคล้องของ structure, ภาษา, format, terminology, และ references

## Checklist

- ทุก skill มี structure: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- Frontmatter ครบ: `name`, `description`, optional `argument-hint`, `related`
- ภาษาไทย/อังกฤษใช้สม่ำเสมอในส่วนที่กำหนด
- Formatting: ไม่ใช้ `**` bold markers, ใช้ backticks สำหรับ code/tools/paths
- Terminology สอดคล้องกันข้าม skill
- `related` references ไม่มี broken หรือ outdated
- ไฟล์ `SKILL.md` ไม่เกิน 250 บรรทัด
- ชื่อ directory ใช้ kebab-case ตรงกับ `name`

## Severity

- `High`: broken references หรือ structure ผิดทำให้ skill ใช้ไม่ได้
- `Medium`: inconsistencies ที่ส่งผลต่อ discoverability
- `Low`: แนะนำให้ปรับ

## Fix Path

- `/update-references` สำหรับ broken/missing references
- `/update-devin-global-skills` สำหรับ skill repo standards
