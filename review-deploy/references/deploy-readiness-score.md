# Deploy Readiness Score Formula

## Goal

คำนวณ deploy readiness score จาก categories ที่ตรวจ

## Categories

ตรวจ categories ต่อไปนี้:

1. `env_secrets` — env vars, secrets, tokens, config validation
2. `build_artifacts` — build process, output directory, platform config, ignore files
3. `health_rollback` — health endpoints, post-deploy validation, rollback, backup
4. `zero_downtime` — deployment strategy, migration, DNS/CDN, SSL
5. `ci_cd` — CI/CD pipeline, deployment workflow, staging test
6. `monitoring` — error monitoring, log monitoring, alerting

## Scoring

แต่ละ category ได้คะแนน:

- ✅ = 1.0 — ผ่านเกณฑ์ ไม่มี critical หรือ high findings
- ⚠️ = 0.5 — มี medium หรือ low findings ต้องระวัง
- ❌ = 0.0 — มี critical หรือ high findings ต้องแก้ก่อน

## Formula

```
deploy_readiness_score = (sum(category_scores) / total_categories) × 100
```

## Grade

- A: 90-100 — พร้อม deploy ได้เลย
- B: 80-89 — พร้อม deploy แต่ระวัง medium findings
- C: 70-79 — พร้อม deploy แต่ต้องจัดการ findings ระหว่างทำ
- D: 60-69 — ควรแก้ high findings ก่อน deploy
- F: <60 — ต้องแก้ critical blockers ก่อน

## Go Or No-Go

- Score >= 70 และไม่มี critical blockers → Go
- Score < 70 หรือมี critical blockers → No-Go แนะนำให้แก้ก่อน
