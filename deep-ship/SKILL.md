---
name: deep-ship
argument-hint: "[target]"
description: Ship ไป production/release ด้วย deep validation, release, deploy, rollback plan, และ monitoring
related:
  - ask-me
  - ship
  - ship-continuous-dont-ask
  - deep-update
  - deep-update-project
  - run-release
  - follow-release
  - release-package-to-registry
  - deploy-to-vercel
  - deploy-to-cloudflare
  - deploy-to-railway
  - run-deploy
  - watch-deploy
  - watch-release
  - deep-validate
  - run-verify-on-local
  - test-all
  - review-security
  - review-compliance
  - review-observability
  - review-deploy
  - update-agents-md
  - update-readme-md
  - update-features-md
  - update-github-metadata
  - report-release-changelog
  - gen-changelog-md
  - git-commit
  - git-push
  - git-commit-and-push
  - report-progress
  - run-test-api
  - run-test-e2e
  - resolve-errors
  - report-table
  - suggest-next-action
---

## Goal

Ship workspace หรือ project ไปสู่ production/release ด้วย deep validation, release generation, deployment, rollback plan, และ post-ship monitoring ครบวงจร

## Scope

ใช้เมื่องานต้องส่งมอบไปยัง production หรือ release จริง ไม่ใช่แค่ commit ใน repo — ครอบคลุมตั้งแต่ pre-ship validation จนถึง live verification สำหรับ commit-only ใช้ `/ship`; สำหรับ loop improve แล้ว ship ใช้ `/ship-continuous-dont-ask`

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ

### 1. Define Ship Target And Scope

> Goal: ระบุสิ่งที่จะ ship และขอบเขต

1. รับ `[target]` จาก argument หรือ context; ถ้าไม่ชัด → ทำ `/ask-me`
2. ระบุ target: `workspace`, `project`, `package`, `library`, `service`, หรือ `all`
3. ตรวจสอบ `AGENTS.md`, `package.json`, `Cargo.toml`, `wrangler.toml`, `vercel.json` หรือ deploy/release config
4. ระบุ ship stages: commit, release, deploy, monitor
5. บันทึก scope, target, และ stages ที่จะทำ

### 2. Pre-Ship Deep Validation

> Goal: ยืนยันว่าพร้อม ship ก่อนลงมือ

1. ทำ `/deep-validate` เพื่อ validate correctness, type, security, compliance, cross-reference
2. ทำ `/run-verify-on-local` เพื่อ lint, typecheck, test, build
3. ทำ `/test-all` เพื่อรัน test suites ทั้งหมด
4. ทำ `/review-security` ถ้ามี API, auth, secrets
5. ทำ `/review-compliance` ถ้ามี GDPR, PDPA, PCI, SOC2
6. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

### 3. Update Pre-Ship Artifacts

> Goal: เอกสารและ metadata ของ project เป็นปัจจุบันก่อน ship

1. ทำ `/update-agents-md` ถ้า `AGENTS.md` ไม่อัปเดต
2. ทำ `/update-readme-md` เพื่อ sync `README.md`
3. ทำ `/update-features-md` เพื่อ sync `FEATURES.md`
4. ทำ `/update-github-metadata` เพื่อ sync description, homepage, topics
5. ทำ `/report-release-changelog` หรือ `/gen-changelog-md` ถ้าจะ release

### 4. Commit Code

> Goal: commit การเปลี่ยนแปลงที verified แล้ว

1. ทำ `/ship` ตาม `AGENTS.md` workflow (commit, submodule, skills update)
2. ถ้าต้องการ continuous improvement ก่อน ship → ทำ `/ship-continuous-dont-ask`
3. ถ้าไม่มี changes → stop และ report
4. ถ้าต้องการ push → ทำ `/git-push` หรือ `/git-commit-and-push`

### 5. Release

> Goal: สร้าง release ถ้า project มี versioned artifact

1. ตรวจสอบ `package.json`, `Cargo.toml`, `pyproject.toml` ว่ามี version และ publish config
2. ถ้าเป็น package/library → ทำ `/run-release` หรือ `/release-package-to-registry`
3. ถ้าใช้ changesets → ทำ `/follow-tool-changesets`
4. ถ้าใช้ release-it → ทำ `/follow-tool-release-it`
5. ถ้าไม่มี release config → ข้าม step นี้

### 6. Deploy

> Goal: นำงานไป deploy บน platform ทีกำหนด

1. ตรวจสอบ deploy config: `vercel.json`, `wrangler.toml`, `railway.toml`, `Dockerfile`, `fly.toml`
2. ถ้า deploy ไป Vercel → ทำ `/deploy-to-vercel`
3. ถ้า deploy ไป Cloudflare Workers → ทำ `/deploy-to-cloudflare`
4. ถ้า deploy ไป Railway → ทำ `/deploy-to-railway`
5. ถ้า platform อืน → ทำ `/run-deploy`
6. ถ้าไม่มี deploy config → ข้าม step นี้

### 7. Watch And Verify Live

> Goal: ยืนยันว่า deploy/release live ทำงานได้

1. ทำ `/watch-deploy` เพื่อ poll URL จน healthy
2. ทำ `/watch-release` ถ้ามี release
3. ทำ `/run-test-api` หรือ smoke tests กับ live endpoints
4. ทำ `/run-test-e2e` ถ้ามี E2E tests
5. ถ้า health check ไม่ผ่าน → ทำ rollback plan ใน step ถัดไป

### 8. Rollback Plan

> Goal: เตรียม rollback สำหรับกรณีล้มเหลว

1. บันทึก previous version, commit hash, และ deploy URL
2. ระบุ rollback command หรือ redeploy กลับ version ก่อนหน้า
3. ทดสอบ rollback command ด้วย dry run ถ้าไม่มี side effects
4. ถ้า health check ไม่ผ่าน → ดำเนืินการ rollback ทันทีตาม plan

### 9. Post-Ship Observability

> Goal: ติดตามสถานะหลัง ship

1. ทำ `/review-observability` ถ้ามี metrics, logging, alerting
2. ตรวจสอบ error rates, latency, traffic จาก dashboard ถ้ามี
3. ทำ `/report-progress` เพื่อ track status หลัง ship

### 10. Report And Suggest

> Goal: รายงานผลและ next action

1. ทำ `/report-table` สรุป status, version, URLs, deploy platform, validation results
2. ระบุ rollback plan และ observability status
3. ทำ `/suggest-next-action` เพื่อแนะนำ next action

## Rules

### 1. No Surprise Push/Release

- `/deep-ship` อาจ push, release, deploy ตาม config ของ project
- ถ้า user ไม่ต้องการ release/deploy → ใช้ `/ship` แทน
- ถ้า config ไม่ชัด → ทำ `/ask-me` ก่อนดำเนืินการ

### 2. Validation Before Ship

- ต้องผ่าน `/deep-validate`, `/run-verify-on-local`, `/test-all` ก่อนย้ายไป step ถัดไป
- ไม่อ้างว่างานพร้อม ship ถ้า validation fail
- ถ้าไม่ผ่านหลัง 3 รอบ → stop และ report

### 3. Rollback Readiness

- ต้องมี rollback plan ก่อน deploy
- บันทึก previous version และ commit hash
- ถ้า health check ไม่ผ่านให้ rollback ก่อน report

### 4. Conditionality

- ข้าม release/deploy/monitor ถ้า project ไม่มี config ทีรองรับ
- ข้าม `/review-compliance` ถ้าไม่มี regulatory requirements
- ข้าม `/review-observability` ถ้าไม่มี monitoring setup

### 5. AGENTS.md First

- ทำ `/update-agents-md` และ `/follow-agents-md` ก่อน ship ทุกครั้ง
- ถ้า `AGENTS.md` ไม่พร้อม → แก้ไขก่อน ship

## Expected Outcome

- การเปลี่ยนแปลงถูก commit (และ push ถ้าได้รับคำสั่ง/มี config)
- release ถูกสร้าง (ถ้ามี versioned artifact)
- deploy สำเร็จและ live (ถ้ามี deploy config)
- ผ่าน `/deep-validate`, `/run-verify-on-local`, `/test-all` ก่อน ship
- มี rollback plan และบันทึก previous state
- observability ตรวจสอบ (ถ้ามี)
- รายงาน status, version, URLs, validation, rollback, และ next actions ครบถ้วน
