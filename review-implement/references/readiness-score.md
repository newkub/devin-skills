# Implementation Readiness Score Formula

## Goal

คำนวณ implementation readiness score จาก categories ที่ตรวจ

## Categories

ตรวจ categories ต่อไปนี้:

1. `plan_readiness` — plan completeness และ task quality
2. `mock_inventory` — mock/stub/placeholder inventory ครบถ้วน
3. `todo_inventory` — TODO/FIXME/HACK inventory ครบถ้วน
4. `queue_validation` — queue tasks มี title, description, priority, status
5. `github_task_clarity` — GitHub tasks มี acceptance criteria และ scope
6. `mvp_scope` — MVP scope ชัดเจน และไม่ over-engineer
7. `realization_blockers` — ไม่มี critical blockers ก่อน implementation

## Scoring

แต่ละ category ได้คะแนน:

- ✅ = 1.0 — ผ่านเกณฑ์ ไม่มี critical หรือ high findings
- ⚠️ = 0.5 — มี medium หรือ low findings ต้องระวัง
- ❌ = 0.0 — มี critical หรือ high findings ต้องแก้ก่อน

## Formula

```
readiness_score = (sum(category_scores) / total_categories) × 100
```

## Grade

- A: 90-100 — พร้อม implement เริ่มได้เลย
- B: 80-89 — พร้อม implement แต่ระวัง medium findings
- C: 70-79 — พร้อม implement แต่ต้องจัดการ findings ระหว่างทำ
- D: 60-69 — ควรแก้ high findings ก่อนเริ่ม
- F: <60 — ต้องแก้ critical blockers ก่อน

## Go Or No-Go

- Score >= 70 และไม่มี critical blockers → Go
- Score < 70 หรือมี critical blockers → No-Go แนะนำให้แก้ก่อน
