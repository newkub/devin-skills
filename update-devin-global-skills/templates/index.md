# Templates Index

ไฟล์ใน `templates/` คือ execute pattern guides สำหรับแต่ละ prefix ไม่ใช่ `SKILL.md` สมบูรณ์ ดูตัวอย่าง skill ครบรูปแบบใน [../examples/review-skill.md](../examples/review-skill.md)

เลือก template ตาม prefix โดยใช้ longest match ก่อน:

| Prefix | Template File | Responsibility |
|---|---|---|
| `run-*` | [run.md](run.md) | execute commands พร้อม prerequisites check, error handling, result reporting |
| `follow-lib-*` | [lib.md](lib.md) | library ติดตั้งผ่าน registry ต้องมี `references/api/`, `references/cli.md`, `references/components/`, และ `subskills/` |
| `follow-create-*` | [follow-create.md](follow-create.md) | สร้าง plugins, extensions, CLI, library หรือ project scaffold |
| `follow-*` | [follow.md](follow.md) | implement best practices ของ tools/libraries/frameworks |
| `setup-*` | [setup.md](setup.md) | ติดตั้งและตั้งค่า tools/services ให้พร้อมใช้ พร้อม verify |
| `config-*` | [config.md](config.md) | แก้ configuration ของที่มีอยู่ — merge keys ไม่ clobber |
| `deploy-*` | [deploy.md](deploy.md) | deploy ไปยัง platform จน live พร้อม post-deploy verify |
| `migrate-*` | [migrate.md](migrate.md) | ย้าย tool/library/version อย่างปลอดภัย มี rollback path |
| `optimize-*` | [optimize.md](optimize.md) | ปรับ performance/cost โดยวัด baseline ก่อนและหลัง |
| `improve-*` | [improve.md](improve.md) | ปรับคุณภาพของสิ่งที่มีอยู่ โดย preserve behavior |
| `fix-*` | [fix.md](fix.md) | แก้ findings/bugs ที่รู้ root cause แล้ว — minimal + verify ไม่ regression |
| `update-*` | [update.md](update.md) | อัปเดตของที่มีอยู่ให้ทันสมัย — minimal diff, idempotent |
| `check-*` | [check.md](check.md) | scan codebase หา issues และ report findings |
| `analyze-*` | [analyze.md](analyze.md) | วิเคราะห์ codebase ด้วย scripts, tools และหลายมิติ |
| `deep-*` | [deep.md](deep.md) | วิเคราะห์หลายมิติอย่างลึกซึ้ง พร้อม cross-reference |
| `review-*` | [review.md](review.md) | วิเคราะห์ quality พร้อม severity ratings และ review score |
| `report-*` | [report.md](report.md) | รวบรวมข้อมูล วิเคราะห์ และนำเสนอในรูปแบบที่อ่านง่าย |
| `idea-*` | [idea.md](idea.md) | สร้างไอเดีย วิเคราะห์ gaps และ opportunities พร้อม continuous numbering |

## Selection Rules

- ใช้ skill type template ตาม prefix โดยเอา longest match ก่อน (เช่น `follow-lib-*` มากว่า `follow-*`)
- ถ้าไม่ตรง template → ใช้โครงสร้างมาตรฐาน `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`
- ถ้า skill เบี่ยงเบนจาก template → ระบุเหตุผลใน `## Scope`
