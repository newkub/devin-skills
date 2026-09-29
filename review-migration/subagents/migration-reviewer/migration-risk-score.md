# Migration Risk Score Formula

## Goal

คำนวณ migration risk score จาก categories ที่ตรวจ

## Categories

ตรวจ categories ต่อไปนี้:

1. `backward_compat` — breaking changes, compatibility strategy, consumer impact, version compat
2. `data_integrity` — migration scripts, data transformation, backup, validation
3. `rollback_cutover` — rollback strategy, triggers, cutover plan, deployment strategy
4. `dependency_migration` — version compatibility, breaking changes, peer deps
5. `framework_migration` — API changes, config changes, codemods
6. `infrastructure_migration` — database, API server, external services
7. `feature_flag_migration` — flag strategy, rollout plan, fallback

## Scoring

แต่ละ category ได้คะแนน:

- ✅ = 1.0 — ผ่านเกณฑ์ ไม่มี critical หรือ high findings
- ⚠️ = 0.5 — มี medium หรือ low findings ต้องระวัง
- ❌ = 0.0 — มี critical หรือ high findings ต้องแก้ก่อน

## Formula

```
migration_risk_score = (sum(category_scores) / total_categories) × 100
```

## Risk Level

- Low: 90-100 — migration พร้อม execute ได้เลย
- Medium: 70-89 — migration พร้อม execute แต่ระวัง findings
- High: 50-69 — ควรแก้ high findings ก่อน migrate
- Critical: <50 — ต้องแก้ critical blockers ก่อน

## Go Or No-Go

- Score >= 70 และไม่มี critical blockers → Go
- Score < 70 หรือมี critical blockers → No-Go แนะนำให้ปรับ plan ก่อน
