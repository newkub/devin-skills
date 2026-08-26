# Directory Structure

skill directory รองรับไฟล์ย่อยโดยไม่ทำให้ `SKILL.md` ยาวเกินไป

## Subdirectories

1. ถ้าต้องการ external references → สร้าง `references/` และเขียน references ให้ครบถ้วน. ถ้า skill มี dependencies (จำเป็นหรือ optional) → ต้องมี `references/` เสมอ และทุก dependency ต้องมี reference file ของตัวเอง (บังคับ ห้ามข้าม)
2. ถ้าต้องการ helper scripts → สร้าง `scripts/` ตาม `/use-scripts`
3. ถ้าต้องการ expanded documentation → สร้าง `guide/` หรือ `examples/`
4. ถ้าต้องการ Devin subskills → สร้าง `subskills/<domain>/<subskill>/SKILL.md` โดยตั้ง `name` เป็น `<domain>-<subskill>` แล้วให้ parent skill `<domain>-subskills/SKILL.md` อ้างถึง
5. ถ้าต้องการ project rules → ทำ `/update-dot-devin` เพื่อสร้าง `.devin/rules/`

## Rules

- ตรวจสอบว่าไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด
- ทุกไฟล์ใน file structure ต่างๆ (`references/`, `scripts/`, `subskills/`, `guide/`, `examples/`, `src/`, `.devin/rules/`) ต้องทำตาม `/follow-single-responsibility` — แต่ละไฟล์มีหน้าที่เดียวชัดเจน ไม่ผสมหลาย responsibilities ในไฟล์เดียว
- `SKILL.md` เป็น entry point หลัก ไม่เกิน 250 บรรทัด
- ถ้ามี CLI หรือ web ต้องมี `src/` เป็น root ของ code. CLI entry point ที่ `src/presentation/cli.ts`. directory name ต้องตรงกับ `name` ใน frontmatter
- ถ้า `references/` มี nested directories → ใช้ `/follow-flat-files`. ถ้า flat ทั้ง skill package → ใช้ `/follow-flat-folders`
- skill ที่มี `src/` ต้องถูกแปลงเป็น submodule ผ่าน `/convert-to-submodule`
