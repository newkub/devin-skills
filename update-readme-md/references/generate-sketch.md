# Step: Generate Flow Diagram

> Goal: วาด ANSI flow diagram ของการทำงานสำหรับ README

## Execute

1. จาก `/learn-from-codebase` (deep-analyze) ระบุ main flow ของ project — input → process → output หรือ lifecycle (เช่น `describe → compose → run → result`)
2. วาดเป็น ANSI box-drawing flow diagram — ใช้ `─`, `│`, `▶`, `▼` แสดงทิศทาง — ทุกบรรทัดความยาวเท่ากัน (fixed width เช่น 60 chars)
3. วาง diagram ด้านบน Get Started โดยไม่ต้องมี heading — ใช้ ` ```text ` codeblock
4. ถ้า flow fail → retry (max 3 → stop/report)

## Rules

- Flow diagram เท่านั้น — แสดงการทำงาน/ลำดับขั้นตอน/data flow หรือ command pipeline
- ห้ามวาด file structure/tree หรือ UI mockup ในตำแหน่งนี้ (file structure อยู่ใน `Development > Architecture` เท่านั้น)
- ไม่มี ANSI ใต้ logo/badges ใน Hero section

## Example

```text
┌──────────────────────────────────────────────────────────┐
│  describe ──▶ compose ──▶ run                            │
│                                                          │
│  task(() => fetchUser(id))                               │
│      │  .map(u => u.name)                                │
│      │  .retry(Cadence.exponential(100))                 │
│      ▼  .timeout(5000)                                   │
│                                                          │
│  .run() ──▶ Result<A, E> ──▶ .match() ──▶ done           │
└──────────────────────────────────────────────────────────┘
```
