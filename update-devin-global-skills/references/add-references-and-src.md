# Add References, Examples, And Src

## Goal

skill package ครบถ้วนและไม่ซ้ำซ้อน

## Steps

1. ถ้า skill มี dependencies → สร้าง `references/` ครบทุก dependency
2. ถ้ามี sub-workflows ที invoke แยกได้ หรือ subagent profiles → สร้าง `subskills/` หรือ `subagents/` ตาม [references/subskills-and-subagents.md](references/subskills-and-subagents.md)
3. ถ้ามี CLI หรือ web → สร้าง `src/` ตาม [references/src.md](references/src.md)
4. ถ้ามี templates หรือ examples → สร้าง `templates/` หรือ `examples/`
5. อ่านรายละเอียด create workflow ใน [references/create-devin-skills.md](references/create-devin-skills.md)
6. ตรวจ markdown links ชี้ไปไฟล์ที่มีอยู่จริง
