# Fan-Out

## Goal

ส่ง lanes ทั้งหมดทำงานพร้อมกันด้วย parallel execution สูงสุด — subagents, scripts และ parallel tool calls

## Execution Modes

| Mode | เหมาะกับ | วิธี |
|------|---------|-----|
| `subagent` | lane ที่ต้อง judgment, multi-step, แก้ไฟล์ | `run_subagent` หรือ `/follow-devin-global-subagents` |
| `script` | mechanical, deterministic, scan จำนวนมาก | `/use-scripts`, `/use-astgrep`, `/search-by-astgrep` |
| `parallel-calls` | read-only checks, commands อิสระ | tool calls หลายอันในข้อความเดียวตาม `/follow-parallel` |

## Subagent Fan-Out

1. spawn ทุก lane ที่เป็น `subagent` mode พร้อมกัน — ไม่รอ lane แรกจบก่อน spawn lane ถัดไป
2. ให้แต่ละ lane: workspace path, file ownership, deliverable, acceptance criteria
3. background lanes → เก็บ lane id ไว้ poll ผลภายหลัง

## Script Fan-Out

- รวม mechanical checks เป็น script เดียวเมื่อทำได้ (เช่น lint+format+audit)
- ใช้ `/use-astgrep` สำหรับ codemod/scan ทีต้อง AST precision
- script ที่รันนาน → background แล้ว poll

## Parallel Tool Calls

- `read`, `grep`, `exec` read-only ที่อิสระกัน → batch ในข้อความเดียว
- ห้าม parallel สำหรับ commands ที่ dependent กัน หรือแตะ state เดียวกัน (git, files)

## Limits

- ไม่ spawn subagents เกินจำนวน lanes ที่ independent จริง
- ถ้า lanes > 10 → แบ่งเป็น phases: foundation lanes ก่อน แล้ว dependent lanes
- ทุก spawn ต้องบันทึก lane → agent id mapping ไว้สำหรับ collect
