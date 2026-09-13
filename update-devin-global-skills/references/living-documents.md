# Living Documents Registry

เอกสารที่เก็บ "ข้อมูล" (ไม่ใช่ workflow) — ต้องอัปเดตเสมอเมื่อสิ่งที่อ้างถึงเปลี่ยน ไม่งั้นจะกลายเป็น stale/โกหก

> **Rule: หลังเพิ่ม/ลบ/merge/rename skill หรือ tool ใดๆ → เช็คตารางนี้เสมอ แล้ว sync เอกสารที่เกี่ยวข้องทันที**

## Canonical Documents

| No. | Document | Path | Stale Signal | Update Action |
|-----|----------|------|--------------|---------------|
| 1 | CLI inventory | `check-my-global-cli/references/global-cli-commands.md` | tool ใหม่ติดตั้ง / date เก่า >30 วัน / tool ใน list ใช้ไม่ได้ | re-run `mise list` + `scoop list`, rewrite ตาราง |
| 2 | Tool map | `follow-skills-map/references/tool-map.md` | skill/tool เพิ่ม/ลบ/merge | เพิ่ม/แก้แถว action→tool→skill |
| 3 | Tech catalog | `review-dependencies/references/techstack-catalog.md` | เลือก dep ใหม่ / lib EOL / major release | update entry + verify กับ official source |
| 4 | Skills index | `skills/AGENTS.md` | เพิ่ม/ลบ/merge/rename skill | recount family, แก้รายละเอียด skill ที่เปลี่ยน |
| 5 | Subagent registry | `use-subagents/SKILL.md` (ตาราง subagents) | เพิ่ม/ลบ `subagents/*.md` ใน skill ใดก็ได้ | แก้แถวในตาราง |
| 6 | Subskills matrix | `update-devin-global-skills/references/subskills-and-subagents.md` | เปลี่ยน convention การแยก skill | อัปเดต decision matrix + ตัวอย่าง |
| 7 | `related:` frontmatter | ทุก `SKILL.md` | skill ที่อ้างถูก merge/rename/ลบ | แก้ `related` ให้ชี้ skill ที่มีจริง |

## Sync Triggers (เมื่อไหร่ต้องเช็ค)

| Event | ต้อง sync |
|-------|-----------|
| `mise use -g <tool>` / `scoop install` | No. 1 (+ No. 2 ถ้า tool map กับ skill) |
| สร้าง skill ใหม่ | No. 2, 4, 7 |
| ลบ/merge skill | No. 2, 4, 5, 7 (grep ชื่อเดิมทั้ง skills/) |
| Rename skill | No. 4, 7 + ทุกไฟล์ที่อ้างชื่อเดิม |
| เพิ่ม `references/`, `subagents/`, `scripts/` ใน skill | No. 5 (ถ้า subagent), No. 6 (ถ้าเปลี่ยน pattern) |
| เลือก dep/tech ใหม่ใน project | No. 3 |

## Verification

หลัง sync → รัน grep ยืนยันไม่มีชื่อเก่าค้าง:

```bash
rg "<old-name>" $env:APPDATA\devin\skills
```

ต้องเหลือแค่ mentions ที่จงใจ (เช่น note "merged จาก …") เท่านั้น
