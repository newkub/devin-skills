# Write Or Update SKILL.md

## Goal

`SKILL.md` ถูกต้องตาม spec

## Steps

1. อ่าน `SKILL.md` เดิมของ skill เป้าหมาย
2. อัปเดต frontmatter ตาม [references/frontmatter.md](frontmatter.md)
3. อัปเดต sections: `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
4. แบ่ง `## Execute` เป็น steps ไม่เกิน 10 โดยใช้ `### N. Step Name`, description, `> Goal:`, numbered list
5. ถ้า `SKILL.md` เรียก skill อื่น → ทำตาม [references/invoke-skills.md](invoke-skills.md)
6. อัปเดต commands, options, examples, environment variables, และ URLs
7. ลบ deprecated commands/options ออก
8. ถ้าไฟล์เกิน 250 บรรทัด → ย้ายเนื้อหาลง `references/` ตาม [references/refactor-guidelines.md](refactor-guidelines.md)
