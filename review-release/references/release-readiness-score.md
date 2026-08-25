# Release Readiness Score Formula

## Goal

คำนวณ release readiness score จาก categories ที่ตรวจ

## Categories

ตรวจ categories ต่อไปนี้:

1. `version_semver` — version consistency, bump rules, semver compliance, pre-release
2. `changelog` — changelog file, release notes, conventional commits coverage
3. `breaking_changes` — breaking change detection, migration notes, API changes
4. `platform_targets` — platform config, auth tokens, rollback plan, CI/CD
5. `license_compliance` — license file, license consistency, dependency licenses
6. `release_notes` — release notes content, migration notes, GitHub Release

## Scoring

แต่ละ category ได้คะแนน:

- ✅ = 1.0 — ผ่านเกณฑ์ ไม่มี critical หรือ high findings
- ⚠️ = 0.5 — มี medium หรือ low findings ต้องระวัง
- ❌ = 0.0 — มี critical หรือ high findings ต้องแก้ก่อน

## Formula

```
release_readiness_score = (sum(category_scores) / total_categories) × 100
```

## Grade

- A: 90-100 — พร้อม publish ได้เลย
- B: 80-89 — พร้อม publish แต่ระวัง medium findings
- C: 70-79 — พร้อม publish แต่ต้องจัดการ findings ระหว่างทำ
- D: 60-69 — ควรแก้ high findings ก่อน publish
- F: <60 — ต้องแก้ critical blockers ก่อน

## Go Or No-Go

- Score >= 70 และไม่มี critical blockers → Go
- Score < 70 หรือมี critical blockers → No-Go แนะนำให้แก้ก่อน
