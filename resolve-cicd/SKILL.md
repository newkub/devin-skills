---
name: resolve-cicd
description: Watch CI (GitHub Actions) และ CD (Cloudflare, deploy targets) แล้ว resolve จนผ่าน
argument-hint: "[--repo <owner/repo> | --run-id <id> | --url <url>]"
related:
  - resolve-errors
  - git-commit
  - use-gh-cli
  - use-wrangler
  - run-check
  - loop-until-complete
  - report-progress
  - list-github
---

## Goal

Watch CI/CD ของ repo ปัจจุบันอย่างต่อเนื่อง — ตรวจ GitHub Actions runs และ Cloudflare (Workers/Pages) deployments เมื่อพบ failure ให้ dispatch `/resolve-errors` แก้ root cause แล้ว verify ด้วย run ใหม่จนเขียว หรือจนกว่าจะชน blocker ที่ต้องถาม user

## Scope

ใช้เมื่อต้องการเฝ้า pipeline หลัง push/merge หรือเมื่อรู้ว่า CI/CD fail อยู่ — ครอบคลุม CI (GitHub Actions) และ CD (Cloudflare Workers, Pages, deploy workflows, หรือ target อื่นที่ตรวจพบใน repo) แก้ไข errors ทำผ่าน `resolve-*` skills เสมอ — skill นี้ทำหน้าที่ watch + dispatch + verify เท่านั้น ไม่แก้ code เองโดยตรง

- โหมด repo-scoped (default ถ้าอยู่ใน git repo หรือมี `--repo`): resolve ทุก pipeline ที่ตรงกับ repo — ดู `references/repo-resolve.md`
- โหมด single-run (`--run-id` หรือ `--url`): ติดตาม run เดียวจนผ่าน — ดู `references/single-run.md` หรือ helper `scripts/resolve-cicd.ts`
- ไม่ trigger run ครั้งแรกเอง

## Execute

Step dependencies: Step 1 → 2 → 3 วนซ้ำจน clean หรือ blocked

### 1. Detect Targets

> Goal: ระบุ CI และ CD ทั้งหมดที่ repo นี้ใช้จริง

1. ตรวจ `.github/workflows/*.yml` — list workflow names และ jobs (CI vs deploy)
2. ตรวจ `wrangler.toml` / `wrangler.jsonc` ทุก workspace — ระบุ Workers/Pages projects
3. ตรวจ deploy scripts ใน `package.json` (`deploy`, `cf-typegen`, `wrangler deploy`) และ CI steps ที่เรียก deploy
4. ถ้าไม่พบ CI/CD เลย → stop และ report ว่าไม่มี target

### 2. Watch Status

> Goal: รวบรวมสถานะล่าสุดของทุก pipeline

CI (GitHub Actions):
1. `gh run list --limit 10` — ดู conclusion ของ runs ล่าสุดแยกตาม workflow
2. `gh run view <id> --log-failed` สำหรับ run ที่ `failure` — capture failed jobs และ error output
3. ถ้ามี run กำลังรันอยู่และต้องเฝ้า → `gh run watch <id> --interval 10` หรือ poll `gh run view <id>` ทุก ~15 วิ

CD (Cloudflare และอื่นๆ):
1. ตรวจ deploy workflow runs (ชื่อมี deploy/cloudflare/wrangler) — failure ของ workflow เหล่านี้ถือเป็น CD failure
2. ถ้ามี `wrangler` CLI + auth → `bunx wrangler deployments list --name <worker>` เทียบ latest deployment กับ expected version
3. ตรวจ health endpoint ของ workers ที่ deploy แล้ว (จาก `wrangler.toml` route/URL หรือ docs) — status ≠ 200 ถือเป็น deploy-unhealthy
4. Deploy target อื่นที่ตรวจพบ (Vercel, Docker registry, ฯลฯ) → ใช้ CLI/URL health check ตาม ecosystem

### 3. Resolve Failures

> Goal: แก้ทุก failure ผ่าน resolve-errors — ห้ามแก้ code เองใน skill นี้

1. จัดกลุ่ม failures ตาม pipeline — CI failure และ CD failure แยกกัน
2. เรียงลำดับ: CI ก่อน CD เสมอ (CD fail จาก CI artifact พังเป็นเรื่องปกติ) และ upstream job ก่อน downstream
3. สำหรับแต่ละ failure group → เรียก resolve skill ที่ตรง:
   - GitHub Actions → `/resolve-github-actions`
   - Cloudflare Worker/Pages เจาะจง → `/resolve-cloudflare-worker`
   - Cloudflare ทั้ง account → `/resolve-cloudflare`
   - Code/config errors ทั่วไป → `/resolve-errors`
4. หลัง fix → commit + push แล้วกลับไป Step 2 watch run ใหม่ — ทำ `/loop-until-complete` จนทุก pipeline เขียวหรือชน blocker
5. Blocker ที่แก้เองไม่ได้ (missing secrets, quota, permissions, billing) → stop และ report รายการ secrets/values ที่ต้องให้ user ไป set — ห้าม commit secrets หรือ workaround ที่ลด security posture

### 4. Report

> Goal: สรุปสถานะ pipeline ทั้งหมดหลัง watch/resolve

1. ทำ `/report` — ตาราง: pipeline, สถานะก่อน, สาเหตุ, fix, สถานะหลัง
2. ทำ `/report-progress` — งานเสร็จ/ค้าง และ next actions
3. ถ้าเหลือ blockers → ระบุ action required ชัดเจน (เช่น `wrangler secret put X --name auth`)

## Rules

### 1. Watch Discipline

- ต้อง detect targets จาก repo จริงก่อนเสมอ — ห้าม assume ว่าเป็น GitHub/Cloudflare เท่านั้น
- Poll interval ≥10 วิ — ห้าม busy-loop `gh run view`
- ถ้าไม่มี run ใหม่ (ยังไม่ push) → watch run ล่าสุดของ branch ปัจจุบันแทน

### 2. Resolution Discipline

- แก้ errors ผ่าน `resolve-*` skills เท่านั้น — skill นี้ไม่แก้ code โดยตรง
- แก้ CI ก่อน CD เสมอ — CD ที่พึ่ง CI artifact จะแก้เองเมื่อ CI เขียว
- Fix แล้วต้อง verify ด้วย run จริง (`gh run watch`) — ห้ามอ้างว่าผ่านจาก local check อย่างเดียว
- ถ้า fix + watch loop เกิน 3 รอบยัง fail จุดเดิม → ทำ `/deep-debug` (single-run สูงสุด 5 รอบ; repo-scoped สูงสุด 3 รอบต่อ worker — failure เดิมซ้ำ 3 ครั้งให้แนะนำ rollback)
- บันทึก `LAST_GREEN_SHA` ก่อนแก้ไข — ถาม user ก่อน rerun/deploy ที่กระทบ production
- Timeout: `perRoundTimeout` 300 วิ, `ciWatchTimeout` 900 วิ, `cdWatchTimeout` 600 วิ

### 3. Safety

- ห้าม commit secrets/tokens เพื่อแก้ CD failure — report ให้ user set เอง
- ห้าม disable workflow, skip jobs, หรือลด branch protection เพื่อให้เขียว — นั่นคือ symptom fix
- `gh` ต้อง auth อยู่แล้ว — ถ้า `gh auth status` fail → report ให้ user login เอง

### 4. Integration

- `/git-commit-and-push` — ใช้หลัง fix เพื่อ push แล้ว watch ต่อ
- `/use-gh-cli` — command reference สำหรับ gh runs/workflows
- `/use-wrangler` — command reference สำหรับ wrangler deployments
- `/run-check` — local gate ก่อน push fix

- ใช้ /list-github ถ้าจำเป็น

## Expected Outcome

- รู้สถานะ CI/CD ทุก pipeline ของ repo ในตารางเดียว
- Failures ถูกแก้ที่ root cause ผ่าน `/resolve-errors` และ verify ด้วย run จริงจนเขียว
- Blockers ที่แก้เองไม่ได้ถูก report พร้อม action required — ไม่มี silent failure
