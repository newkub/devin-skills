# Plan Quality Score Formula

## Goal

คำนวณ plan quality score จาก categories ที่ตรวจ

## Categories

ตรวจ categories ต่อไปนี้:

1. `risk_assessment` — risk identification, assessment, mitigation, stress test
2. `dependency_mapping` — task dependencies, critical path, module dependencies, parallelization
3. `alternatives_analysis` — architectural decisions, library choices, trade-offs
4. `timeline_feasibility` — timeline, effort estimates, buffer, milestones
5. `scope_clarity` — scope ชัดเจน ไม่กว้าง ไม่แคบ
6. `acceptance_criteria` — ทุก task มี acceptance criteria ที่ testable
7. `rollback_plan` — high-risk tasks มี rollback strategy
8. `resource_requirements` — resources, dependencies, infrastructure ระบุชัด

## Scoring

แต่ละ category ได้คะแนน:

- ✅ = 1.0 — ผ่านเกณฑ์ ไม่มี critical หรือ high findings
- ⚠️ = 0.5 — มี medium หรือ low findings ต้องระวัง
- ❌ = 0.0 — มี critical หรือ high findings ต้องแก้ก่อน

## Formula

```
plan_quality_score = (sum(category_scores) / total_categories) × 100
```

## Grade

- A: 90-100 — plan พร้อม execute เริ่มได้เลย
- B: 80-89 — plan พร้อม execute แต่ระวัง medium findings
- C: 70-79 — plan พร้อม execute แต่ต้องจัดการ findings ระหว่างทำ
- D: 60-69 — ควรแก้ high findings ก่อนเริ่ม
- F: <60 — ต้องปรับ plan ใหม่ก่อน

## Go Or No-Go

- Score >= 70 และไม่มี critical findings → Go
- Score < 70 หรือมี critical findings → No-Go แนะนำให้ปรับ plan ก่อน
