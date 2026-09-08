# Report UX/UI Guidelines

## Goal

ทำให้รายงานทุกรูปแบบอ่านง่าย เข้าใจเร็ว และ action ชัดเจน

## Principles

### 1. Summary First

- ทุก report ต้องเริ่มด้วย key findings หรือสรุปผล 2-3 ข้อ
- ใช้ bullet สั้น ก่อนรายละเอียด

### 2. Sort By Status

- ถ้ามี status: เรียง `completed` หรือ `done` ขึ้นก่อน
- ลำดับถัดไป: `in_progress` → `pending` → `blocker` → `failed`

### 3. Emoji Legend

| Status | Emoji |
|---|---|
| ผ่าน/เสร็จ | `✅` |
| ค้าง/กำลังทำ | `⏳` |
| ติดปัญหา | `❌` |
| warning | `⚠️` |
| info | `ℹ️` |
| รอ user | `❓` |

### 4. Table Format

- คอลัมน์แรกต้องเป็น `No.`
- ไม่ใช้ bold markers `**`
- ใช้ backticks สำหรับ code, paths, skill names
- หัวตารางชัดเจน ไม่อักษรพิเศษเกิน

### 5. Numbered List

- หนึ่งเลข = หนึ่งข้อ single responsibility
- เรียงตาม priority
- ใช้ sub-bullet ถ้าจำเป็น

### 6. Code Blocks

- ระบุ language
- ไม่ใส่ line numbers
- แยกหลาย block ด้วย heading สั้น ๆ

### 7. Progress

- ใช้ progress bar เช่น `████████████░░ 80%`
- ระบุเปอร์เซ็นต์และ trend (↑ ↓ →)

### 8. Next Action

- จบด้วย next action ที่ actionable
- ไม่ทิ้ง report โดยไม่มีทิศทาง
