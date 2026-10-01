# template-starter (degit) — Best Practices

Scaffold projects จาก template repos ด้วย degit — clean copies ไม่มี git history

## Recommended Patterns

- `degit <user>/<repo>[/<subdir>] <target>` — คัดลอกไฟล์ไม่มี `.git`; subdir syntax สำหรับ monorepo templates
- `#branch`/`#tag` suffix pin template version — default main = moving target; pin สำหรับ reproducible scaffolds
- `--force` เฉพาะเมื่อตั้งใจ overwrite — degit refuse non-empty dirs by default (ดี)
- Post-scaffold checklist: rename package name, install deps, เปลี่ยน README/LICENSE, init git ใหม่
- Template repos ของตัวเอง: keep minimal + documented placeholders — scaffold ออกมาพร้อมใช้

## Common Pitfalls

- degit ไม่ resolve git submodules — templates ที่มี submodules ต้อง manual init
- Placeholder tokens ใน templates (ชื่อ project, author) — script rename หรือ sed หลัง scaffold
- Cache: degit cache GitHub tarballs — stale template ใช้ `--force` หรือ clear cache
- Private repos: degit รองรับผ่าน auth (`--mode git` fallback) — https download ต้อง public
- อย่า scaffold บน existing project root — target dir ใหม่เสมอ, merge เองถ้าจำเป็น

## Workflow

1. เลือก template (official/community/mine) + pin tag
2. `degit user/repo target`
3. `cd target` → install → rename placeholders → `git init` → first commit
4. Verify dev/build/test pass ก่อนเขียนโค้ดจริง

## Do / Don't

| Do | Don't |
|----|-------|
| pin template `#tag` | scaffold จาก moving main |
| target dir ใหม่เสมอ | degit ลง existing project |
| rename placeholders ทันที | commit template branding |
| verify scaffold รันได้ก่อน | assume template works |
