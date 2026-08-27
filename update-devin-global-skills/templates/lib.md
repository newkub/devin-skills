# lib-* Template

library ติดตั้งผ่าน registry ต้องมี `references/api/`, `references/cli.md`, `references/components/`, และ `subskills/`

## Execute Pattern

- ตรวจ manifest (`package.json`, `Cargo.toml`). ระบุ registry และ version. ตรวจ ecosystem (bun, node, pnpm, yarn, cargo, pip). ทำ `/learn-from-web` จาก official docs ของ library เสมอ เพื่อยืนยัน install command ล่าสุด, version ที่ stable, และ peer dependencies. ใช้คำสั่ง install ที่เหมาะกับ package manager (`bun add`, `bun add -g`, `bun install`, `cargo add`, `pip install`). บันทึก version. ติดตั้ง peer dependencies
- เขียน/แก้ไข config. ระบุ entry point และ initial setup. ใช้ examples จาก `references/components/` หรือ `examples/`. ทำ `/deep-validate` หรือ `/run-verify-fast`. รัน tests/examples. ทำ `/git-commit` ถ้ามีการเปลี่ยนแปลง
- Required: `references/api/`, `references/cli.md`, `references/components/` ถ้า library มีส่วนนั้น. ถ้าไม่มี CLI → ละ `references/cli.md` ได้ แต่ระบุเหตุผลใน `## Scope`. ถ้า library มีหลาย use cases → สร้าง `subskills/<lib>/<subskill>/SKILL.md`. parent ต้อง `related` ทุก subskill. ระบุคำสั่ง install จริง. ระบุ config files และ snippets จริง. ใช้ backticks สำหรับ code และ command เสมอ
