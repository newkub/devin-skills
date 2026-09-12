# Add References, Examples, And Src

## Goal

skill package ครบถ้วนและไม่ซ้ำซ้อน

## Steps

1. ถ้า skill มี dependencies → สร้าง `references/` ครบทุก dependency
2. ถ้า skill มี lib/package ให้ติดตั้ง → สร้าง `references/package-manifest.md` จาก [new-skills template](https://github.com/newkub/devin-global-skills) (`new-skills/templates/package-manifest.md`) — ใส่ metadata จริง: package, registry, latest version + release date, author, license, repo, website, docs, changelog
3. ถ้ามี sub-workflows ที invoke แยกได้ หรือ subagent profiles → สร้าง `subskills/` หรือ `subagents/` ตาม [references/subskills-and-subagents.md](subskills-and-subagents.md)
4. ถ้ามี CLI หรือ web → สร้าง `src/` ตาม [references/src.md](src.md)
5. ถ้ามี templates หรือ examples → สร้าง `templates/` หรือ `examples/`
6. อ่านรายละเอียด create workflow ใน [references/create-devin-skills.md](create-devin-skills.md)
7. ตรวจ markdown links ชี้ไปไฟล์ที่มีอยู่จริง
