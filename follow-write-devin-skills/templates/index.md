# Templates Index

เลือก template ตาม prefix ของ skill:

| Prefix | Template File | Responsibility |
|---|---|---|
| `run-*` | [run.md](run.md) | execute commands พร้อม prerequisites check, error handling, result reporting |
| `follow-*` | [follow.md](follow.md) | implement best practices ของ tools/libraries/frameworks |
| `follow-*-architecture` | [follow-architecture.md](follow-architecture.md) | architecture patterns (override follow) |
| `check-*` | [check.md](check.md) | scan codebase หา issues และ report findings |
| `analyze-*` | [analyze.md](analyze.md) | วิเคราะห์ codebase ด้วย scripts, tools และหลายมิติ |
| `deep-*` | [deep.md](deep.md) | วิเคราะห์หลายมิติอย่างลึกซึ้ง พร้อม cross-reference |
| `review-*` | [review.md](review.md) | วิเคราะห์ quality พร้อม severity ratings และ review score |
| `report-*` | [report.md](report.md) | รวบรวมข้อมูล วิเคราะห์ และนำเสนอในรูปแบบที่อ่านง่าย |
| `idea-*` | [idea.md](idea.md) | สร้างไอเดีย วิเคราะห์ gaps และ opportunities พร้อม continuous numbering |
| `lib-*` | [lib.md](lib.md) | library ติดตั้งผ่าน registry ต้องมี `references/api/`, `references/cli.md`, `references/components/`, และ `subskills/` |

## Selection Rules

- ใช้ skill type template ตาม prefix เป็น canonical structure
- `follow-*-architecture` ใช้ architecture template ไม่ใช่ follow
- ถ้าไม่ตรง template → ใช้โครงสร้างมาตรฐาน `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`
- ถ้า skill เบี่ยงเบนจาก template → ระบุเหตุผลใน `## Scope`
