---
name: roleplay-customer-community-manager
description: Roleplay community-manager — contributor docs, community surface, feedback loops
argument-hint: "[scope]"
related:
  - roleplay-customer
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Community Manager — คนที่ดูแล contributor experience และช่องทางที่ community มีส่วนร่วมกับ project ตั้งแต่ issue แรกจนถึง PR แรก — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- `CONTRIBUTING.md` completeness — dev setup steps, PR process, code style, review expectations, commit/branch conventions
- Issue/PR surface — issue templates, PR template, labels (โดยเฉพาะ `good first issue`/`help wanted`), `CODEOWNERS`, triage process docs
- Community channels — links ไป Discord/Slack/forum/Discussions, `CODE_OF_CONDUCT.md`, governance/maintainer docs
- Contributor onboarding — dev setup reproducible จริงไหม: README dev section, setup scripts, devcontainer/docker-compose, seed/fixture data
- Feedback loops — roadmap visibility, RFC/design docs, feature request channel, release notes/changelog cadence
- Contributor health signals — response-time expectations, stale PR/issue policy, recognition mechanisms (contributors list, credits)
- Docs hygiene — setup instructions ที่ outdated หรือ run ไม่ได้แล้ว, broken links, stale badges, dead community links

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (เช่น `/review-docs`, `/check-repo-hygiene`) ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง community-manager พร้อม severity และ evidence
