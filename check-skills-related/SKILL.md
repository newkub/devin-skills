---
name: check-skills-related
description: ดูความสัมพันธ์ระหว่าง skills แบบเร็ว หรือลึกตาม mode ทีเลือก
argument-hint: "[skill-name | mode]"
allowed-tools:
  - exec
  - grep
  - read
related:
  - check-circular-dependencies
  - review-references
  - update-references
  - suggest-next-action
---

## Goal

ตรวจสอบความสัมพันธ์ระหว่าง skills: ใครเรียกใคร มี cycle ไหม โดยเลือก mode ตามทีจำเป็น

## Scope

- ใช้เมื่อต้องการ call graph, หา cycle, หรือดู direct refs ของ skill เดียว
- Default คือ summary เร็ว
- ถ้าต้องการละเอียดหรือ cycle ให้เลือก mode ทีเหมาะสม

## Modes

| No. | Mode | ใช้เมื่อ | ความเร็ว |
|----:|------|----------|----------|
| 1 | `Summary` (default) | ต้องการสถิติรวม | เร็ว |
| 2 | `Quick` | ต้องการ direct refs ของ skill เดียว ไม่สนใจ body refs | เร็วทีสุด |
| 3 | `Tree` | ดู call tree ของ skill | ปานกลาง |
| 4 | `Cycles` | หา circular references | ช้าหน่อย |
| 5 | `Verify` | CI check หา cycle | ช้าหน่อย |
| 6 | `Full` | รายละเอียดทุก skill | ช้า — ใช้เท่าทีจำเป็น |

## Execute

### 1. Build Binary

> Goal: มี binary สำหรับรัน

1. ถ้า `target/release/check-skills-related.exe` ยังไม่อยู่ → รัน `cargo build --release`
2. รัน binary ด้วย `exec`

### 2. Summary (default)

> Goal: ดูสถิติรวมเร็วๆ

```bash
target/release/check-skills-related.exe
```

Output: total skills, total relations, orphan skills, unknown refs

### 3. Check One Skill

> Goal: รู้ direct refs ของ skill เดียว

```bash
# เร็ว: ดูเฉพาะ related
target/release/check-skills-related.exe -Skill ship -Mode Quick

# ดู call tree (default depth 1)
target/release/check-skills-related.exe -Skill ship

# ลึกขึ้น
target/release/check-skills-related.exe -Skill ship -TreeDepth 2
```

### 4. Check Cycles

> Goal: หา cycle

```bash
target/release/check-skills-related.exe -Mode Cycles
```

ถ้าเจอ cycle → แนะนำ `/check-circular-dependencies` หรือ `/update-references`

### 5. CI Verify

> Goal: exit 1 ถ้ามี cycle

```bash
target/release/check-skills-related.exe -Mode Verify
```

## Rules

- Default `Summary` รวดเร็ว ไม่หา cycle
- ใช้ `Quick` เมื่อต้องการ direct refs เร็วๆ
- ใช้ `Full` หรือ `Tree` ลึกๆ เฉพาะเมื่อจำเป็นจริง
- ถ้าหา cycle ให้ใช้ `Cycles` หรือ `Verify`
- ไม่ auto-fix references
- ถ้าพบ unknown refs → ใช้ `/update-references`

## Expected Outcome

- รู้ว่า skill ไหนเรียก skill ไหน
- หา cycle ได้ถ้าเลือก mode ทีเหมาะสม
- ได้สถิติรวมเร็วๆ โดย default
