# Lane Types

## Standard Lanes

| Lane | งาน | Mode | หมายเหตุ |
|------|-----|------|---------|
| `verify` | build, lint, typecheck, format | parallel-calls | รันพร้อมกันได้หลัง code นิ่ง |
| `test` | unit, integration, e2e | subagent | แยกตาม test type ได้ |
| `review` | code review, security, perf | subagent | หลาย review ขนานกันได้ |
| `docs` | README, USAGE, changelog | subagent | แตะเฉพาะ docs ไฟล์ |
| `deps` | outdated, audit, licenses | script | mechanical scan |
| `fix` | แก้ findings ต่อ module | subagent | แยกตาม file ownership |
| `ship-ops` | commit, PR, release notes | sequential | ทำหลังทุก lane ผ่าน |

## Ownership Rules

- 1 ไฟล์ = 1 lane เท่านั้น
- shared files (เช่น `package.json`, `index.ts` barrel) → กำหนด owner lane เดียว
- lane ที่อ่านอย่างเดียว (review, audit) แตะไฟล์ซ้ำกันได้ — ห้าม write เท่านั้น

## Example Decomposition

```
lanes:
  - name: fix-frontend
    files: apps/web/src/**
    mode: subagent
  - name: fix-api
    files: apps/api/src/**
    mode: subagent
  - name: scan-deps
    files: package.json, lockfile
    mode: script
  - name: docs
    files: "*.md", docs/**
    mode: subagent
  - name: verify
    files: (read-only)
    mode: parallel-calls   # หลัง fix lanes จบ
```

## Anti-Patterns

- spawn subagent สำหรับ `bunx eslint .` — ใช้ script
- lane ที่ deliverable คือ "ดูแล้วคิดว่า" — ไม่วัดผลได้
- verify lane รันขนานกับ fix lane — verify ต้องรอ code นิ่ง
