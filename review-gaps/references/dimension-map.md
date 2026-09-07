# Dimension Map

(merged from: review-improvement)

ใช้เมื่อต้องสแกน scope แบบกว้างหา "improve อะไรได้บ้าง" — ตรวจแต่ละ dimension แบบเบา (ไม่ใช่ deep review เต็มรูปแบบ) แล้ว map ไปยัง section `## Fix` ของ `review-*` ที่ตรง domain

| No. | Dimension | ดูอะไร | Fix Skill |
|-----|-----------|--------|-----------|
| 1 | Architecture | boundaries, coupling, SRP, layer violations | `/review-architecture` |
| 2 | Security | secrets, auth, injection, headers, deps vulns | `/review-security` |
| 3 | Performance | bundle, rendering, queries, memory, network | `/review-performance` |
| 4 | Quality | naming, duplication, complexity, dead code | `/review-then-fix` |
| 5 | Dependencies | outdated, vulnerable, unused, licenses | `/review-dependencies` |
| 6 | Accessibility | WCAG violations, keyboard, contrast | `/review-accessibility` |
| 7 | Docs | stale docs, missing guides, broken links | `/review-docs` |
| 8 | Tests | coverage gaps, missing edge cases | `/review-test` |
| 9 | Observability | missing logs, metrics, alerts | `/review-observability` |

## Rules

- สแกนกว้างไม่ลงลึก — ถ้าต้องการ depth ให้ใช้ `review-*` เฉพาะด้านหรือ `/deep-review`
- ทุก finding ต้องมี evidence ไม่เดา
- แสดงเฉพาะ findings ที่มี fix path ชัดเจน — ถ้าไม่มี skill ตรงให้ระบุ "no skill" พร้อมแนวทาง
- ไม่แก้ไข code ระหว่าง scan — ส่งต่อ section `## Fix` ของ `review-*` เท่านั้น
- ไม่สร้าง findings จาก style preference ที่ไม่มีผลจริง
