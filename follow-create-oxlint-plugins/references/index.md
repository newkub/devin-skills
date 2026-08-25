# Reference Index — `follow-create-oxlint-plugins`

สิกล `follow-create-oxlint-plugins` ครอบคลุมการกำหนดค่า Oxlint plugins ทั้ง built-in (native) และ JavaScript plugins
เพื่อให้สามารถเปิดใช้งานชุดกฎ (rules) เพิ่มเติม ตั้งค่า severity และจัดการ alias สำหรับชื่อที่ reserved ได้อย่างถูกต้อง

ไฟล์ reference ทั้งหมดในไดเรกทอรีนี้:

| ไฟล์ | ความรับผิดชอบ |
| --- | --- |
| `index.md` | ไฟล์นี้ — ดัชนีรวมรายการ reference files และหน้าที่ของแต่ละไฟล์ |
| `oxlint-config.md` | อ้างอิงการกำหนดค่า Oxlint โดยรวม: รูปแบบ config file (`.oxlintrc.json` / `oxlint.config.ts`), ฟิลด์ `plugins` และ `jsPlugins`, `categories` (correctness/suspicious/pedantic/perf/style/restriction/nursery), reserved plugin names และ CLI flags ที่เกี่ยวข้อง |
| `js-plugins.md` | อ้างอิง JavaScript plugins: การใช้ฟิลด์ `jsPlugins`, รูปแบบ string vs object, การกำหนด alias สำหรับ reserved names, คำเตือนสถานะ alpha พร้อมตัวอย่าง |

## วิธีใช้งาน

1. เริ่มจาก `oxlint-config.md` เพื่อเข้าใจโครงสร้าง config และวิธีเปิด built-in plugins ผ่านฟิลด์ `plugins`
2. ใช้ `js-plugins.md` เมื่อต้องการเพิ่ม ESLint plugins ที่เป็น JavaScript ผ่านฟิลด์ `jsPlugins` หรือต้องการ alias สำหรับชื่อที่ reserved
3. เลือกรูปแบบ config ตาม runtime: ใช้ `.oxlintrc.json` กับ standalone binary, ใช้ `oxlint.config.ts` เมื่อใช้ Node-based `oxlint` package

## แหล่งข้อมูลหลัก

- Configuration: https://oxc.rs/docs/guide/usage/linter/config
- Built-in Plugins: https://oxc.rs/docs/guide/usage/linter/plugins
- JS Plugins: https://oxc.rs/docs/guide/usage/linter/js-plugins
- Config file reference: https://oxc.rs/docs/guide/usage/linter/config-file-reference
- CLI reference: https://oxc.rs/docs/guide/usage/linter/cli
