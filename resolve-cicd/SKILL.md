---
name: resolve-cicd
description: Watch CI (GitHub Actions) และ CD (Cloudflare, deploy targets) แล้ว resolve จนผ่าน
argument-hint: "[--repo <owner/repo> | --run-id <id> | --url <url> | verify]"
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

### Workflows

| Argument | Workflow |
|----------|----------|
| `verify`, `verify-resolved` | `workflows/verify-resolved/SKILL.md` — re-run/watch workflow บน remote จนยืนยัน green |

1. ถ้า argument เป็น `verify` → อ่าน `workflows/verify-resolved/SKILL.md` แล้วทำตาม flow — ไม่ resolve ใหม่
2. ถ้าไม่ระบุ → ทำ Steps 1-4 ตามปกติ

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
   - GitHub Actions → `/resolve-github-actions-fails`
   - Cloudflare Worker/Pages เจาะจง → `/resolve-cloudflare-worker-fails`
   - Cloudflare ทั้ง account → `/resolve-all-cloudflare-worker-fails`
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

## Merged Details

### verify-resolved

##### Goal



ยืนยันหลัง `/resolve-cicd` ว่า pipeline กลับมา green จริงบน remote — ไม่ใช่แค่ local fix ผ่าน



##### Scope



- ใช้เมื่อ parent dispatch มาที่ `verify` หรือเรียกหลัง resolve CI/CD failure

- ครอบคลุม: re-run status, all jobs green, deploy target healthy

- Read-only: watch/ตรวจสอบ — ไม่แก้ไข



##### Execute



###### 1. Trigger Or Watch Re-Run



> Goal: ได้ผล run ใหม่จาก remote



1. ถ้า fix commit แล้ว → run ใหม่ auto-trigger — watch ด้วย `gh run watch` หรือ `gh run list`

2. ถ้าไม่ auto-trigger → `gh run rerun <run-id>` (หรือ `--failed` สำหรับ failed jobs เท่านั้น)

3. รอจน run complete — อย่า verdict ก่อน run จบ



###### 2. Verify All Jobs Green



> Goal: ไม่ใช่แค่ job ที่ fail — ทุก job ผ่าน



1. `gh run view <run-id>` — ทุก job เป็น `success`

2. flag jobs ที่ skip/cancel โดยไม่ตั้งใจ

3. ถ้า job ใหม่ fail → verdict `not-resolved` พร้อม logs pointer



###### 3. Verify Deploy Target



> Goal: CD side สำเร็จถ้ามี deploy



1. Cloudflare: `wrangler deployments list` — deployment ใหม่ active

2. อื่นๆ: ตรวจ deploy step ใน run + target URL ตอบกลับ

3. ถ้า deploy target unhealthy → verdict `degraded`



###### 4. Report



> Goal: สรุป pipeline status



1. ใช้ `/report` คอลัมน์: `No.`, `Job/Check`, `Result`, `Evidence`

2. Verdict: `green` / `not-resolved` / `degraded` พร้อม run URL



##### Rules



- verdict ต้องอิง remote run ล่าสุด — local pass ไม่พอ

- ถ้า re-run fail → report กลับให้ `/resolve-cicd` loop ต่อ — ไม่แก้เอง

- ระบุ run URL + commit sha ในรายงานเสมอ



##### Expected Outcome



- Verdict จาก remote run จริง พร้อม run URL

- รายการ jobs/deploys ที่ยังไม่ green ถ้ามี

### references/repo-resolve

##### Repo-Scoped CI/CD Resolve



ขั้นตอนสำหรับ `/resolve-cicd` เมื่อได้รับ repo หรือตรวจพบ repo ปัจจุบัน โดย resolve ทั้ง GitHub Actions และ Cloudflare Workers/Pages ทีตรงกับ repo นั้น



##### Goal



ตรวจสอบและแก้ไข CI/CD failures สำหรับ project/repo ทีระบุ ครอบคลุม GitHub Actions และ Cloudflare



##### Scope



ใช้กับ repo ปัจจุบันหรือ repo ที user ระบุ โดยหา worker/project ทีตรงกับ repo name แล้ว resolve



##### Execute



###### 1. Identify Repo



> Goal: ระบุ repo ปัจจุบัน

1. ถ้ามี argument `--repo` → ใช้ค่านั้น

2. ถ้าไม่มี → รัน `gh repo view --json nameWithOwner` หรือ `git remote -v` จาก current directory

3. ถ้าหาไม่พบ → ทำ `/ask-me`



###### 2. Resolve GitHub Actions



> Goal: แก้ไข GitHub Actions สำหรับ repo

1. ทำ `/resolve-github-actions-fails --repo <owner/repo>`

2. ถ้าไม่มี local repo ต้องการ code fix → ใช้ `/search-project-in-drive-d <repo-name>`

3. บันทึกผล runs ที resolve ได้และค้าง



###### 3. Resolve Cloudflare



> Goal: แก้ไข Cloudflare Workers/Pages ทีตรงกับ repo

1. หา worker name ทีตรงกับ repo name หรือ project name จาก `wrangler.toml`

2. ทำ `/resolve-cloudflare-worker-fails --worker <worker-name>` หรือ `/resolve-all-cloudflare-worker-fails --project <project-name>`

3. ถ้าไม่พบ worker ทีตรงกับ repo → ข้ามและบันทึกว่าไม่มี Cloudflare resource

4. ถ้าพบ local project ทีตรงกัน → ใช้ `/search-project-in-drive-d <worker-name>` แล้ว `wrangler deploy`

5. ทำซ้ำสูงสุด 3 รอบ



###### 4. Cross-Check



> Goal: ยืนยันว่า CI/CD ของ repo ผ่าน

1. รัน `gh run list --repo <owner/repo> --status failure --limit 10` อีกครั้ง

2. ถ้ายังมี failure → กลับไปขั้นตอน 2 หรือ 3

3. ถ้าผ่าน → ไป Report



###### 5. Report



> Goal: สรุปผล

1. ใช้ `/report table` คอลัมน์: No., Repo, CI Status, CD Status, Action Taken, Notes

2. สรุป: resolve ได้, ค้าง, manual-fix-required

3. ทำ `/suggest-next-action`



##### Rules



###### 1. Scope

- resolve เฉพาะ project/repo ทีตรงกับ repo ทีระบุ

- ไม่ขยับไป repo อื่นโดยอัตโนมัติ



###### 2. Worker Matching

- worker name สามารถตรงกับ repo name หรือ slug ของ project

- ถ้าไม่ชัด → ใช้ Cloudflare API list workers/pages แล้ว filter ด้วย repo name



###### 3. Local Project

- ใช้ `/search-project-in-drive-d` หา local project

- ถ้าไม่พบ → ทำเครื่องหมาย `manual-fix-required`



###### 4. Safety

- ถาม user ก่อน deploy/redeploy worker ถ้ามีผลกระทบสูง

- ไม่ commit/push อัตโนมัติ



##### Expected Outcome



- GitHub Actions ของ repo ไม่มี failures ค้าง

- Cloudflare Workers/Pages ทีตรงกับ repo ถูก resolve หรือทำเครื่องหมาย manual-fix-required

- ตารางสรุป repo-scoped CI/CD status

### references/runs

#### CI/CD Runs



##### Goal



บันทึกรายการ CI/CD runs สำหรับ tracking และ resolve



##### Execute



1. ระบุ run ID, platform, branch, commit

2. บันทึกสถานะ pass/fail/cancel/timeout

3. อ้างอิงเมื่อต้อง re-run หรือ resolve failure

### references/single-run

##### Single-Run CI/CD Resolve



เรียก skill โดย `/resolve-cicd [run-id|url]` หรือรันด้วย helper script:



```bash

bun "%APPDATA%\devin\skills\resolve-cicd\\scripts\resolve-cicd.ts" \

  [--run-id <id> | --url <url>] \

  [--max-retries 5] \

  [--no-retry]

```



- helper รองรับ GitHub Actions (CI) แบบเต็มรูปแบบ

- CD mode จะส่งต่อให้ `/watch-deploy` ตาม target — release/tag → poll registry endpoint จน live (`npm view`, `gh release view <tag>`)



##### Goal



ติดตาม CI/CD pipeline หลังจากถูก trigger ตรวจสอบวาผ่าน, live/healthy, หรือ release สำเร็จ ถ้าไม่ผ่านให้ resolve และ re-run/re-deploy จนกว่าจะผ่าน



##### Scope



ใช้หลังจาก:

- push code

- `/run-deploy`, `/deploy-to-*`, `/ship-to-dev-branch`, `/run-release`

- หรือเมื่อได้รับ `run-id` หรือ `url-or-target` จาก argument



ครอบคลุม:

- CI: GitHub Actions, GitLab CI, Azure DevOps, CircleCI, Jenkins

- CD: Cloudflare Pages, Vercel, Railway, Render, Fly.io, Netlify, custom domain, release/tag



สำหรับ CI platform เฉพาะจะส่งต่อ `/resolve-github-actions-fails`

สำหรับ CD platform เฉพาะจะส่งต่อ `/watch-deploy` (release/tag → poll registry/tag endpoint จน live)



ไม่รวม trigger ครั้งแรก — ต้องถูก trigger โดย `/run-deploy`, `/deploy-to-*`, `/run-release` หรือ push ก่อน



##### Execute



###### 1. Detect CICD Mode



> Goal: ระบุวาเป้น CI หรือ CD

1. ถ้าได้รับ `run-id` จาก argument → เป้น CI

2. ถ้าได้รับ `url-or-target` จาก argument → เป้น CD

3. ถ้าไม่มี argument → ค้นหาจาก:

   - environment variable `DEPLOY_URL`, `PREVIEW_URL`, `VERCEL_URL`, `CF_PAGES_URL`

   - CI/CD log ล่าสุดทีมี run ID หรือ URL

   - `watch-deploy/references/targets.md` ใน `watch-deploy`

   - `references/runs.md` ใน `/resolve-cicd`

4. ถ้ายังไม่ชัด → ทำ `/ask-me`



###### 2. CI: Detect CI Platform



> Goal: ระบุ CI platform

1. หา CI config files (`.github/workflows/*`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `.circleci/config.yml`, `Jenkinsfile`)

2. เรียงตามลำดับ: GitHub Actions → GitLab CI → Azure DevOps → CircleCI → Jenkins

3. ถ้าไม่พบ config → ทำ `/deep-review`, `/deep-review`, `/deep-review` หรือ `/ask-me`



###### 3. CI: Verify CLI And Identify Run



> Goal: เตรียม CLI และ run ID

1. ตรวจ CLI: `gh`, `glab`, `az`, `circleci`, `jenkins-cli`

2. ถ้า `run-id` มาจาก argument → ใช้ค่านั้น

3. ถ้าไม่มี → หา run ล่าสุด:

   - GitHub Actions: `gh run list --limit 5`

   - GitLab CI: `glab pipeline list --limit 5`

   - Azure DevOps: `az pipelines runs list --top 5`

   - CircleCI: `circleci pipeline list`

   - Jenkins: latest build API

4. ถ้าไม่มี active run → report และ stop



###### 4. CI: Watch Pipeline



> Goal: ติดตาม CI จนสิ้นสุด

1. ถ้า GitHub Actions → ทำ `/resolve-github-actions-fails [run-id]` แล้ว return ผล

2. GitLab CI: `glab pipeline trace <pipeline-id>`

3. Azure DevOps: `az pipelines runs show --id <run-id>` poll ทุก 10 วิ

4. CircleCI: poll API

5. Jenkins: poll build status

6. ถ้า pass → ไป Report

7. ถ้า fail, cancel, timeout → ไป Resolve



###### 5. CD: Detect CD Target



> Goal: ระบุ deployment target และ URL

1. ใช้ `url-or-target` จาก argument ถ้ามี

2. ถ้าไม่มี → ค้นหาจาก env, deploy output, CI/CD log, `watch-deploy/watch-deploy/references/targets.md`

3. ถ้ายังไม่ชัด → ทำ `/ask-me`



###### 6. CD: Determine Platform



> Goal: เลือก skill ทีเหมาะกับ CD target

1. Cloudflare Pages: URL มี `.pages.dev` หรือ `wrangler` ใน output → ดำเนินการใน skill นี้ (`/resolve-cicd`) ถ้า fail → ทำ `/resolve-cloudflare-worker-fails` ก่อน re-deploy

2. Release/tag: version tag, release name, GitHub release → poll registry/tag endpoint จน live — `npm view <pkg>@<ver>`, `gh release view <tag>` (interval 30s, timeout 600s)

3. Generic URL: Railway, Render, Fly.io, Netlify, custom domain → `/watch-deploy`



###### 7. CD: Watch Until Healthy



> Goal: ติดตาม deployment จน live หรือ release สำเร็จ

1. เรียก skill ตาม platform

2. ถ้า success → ไป Report

3. ถ้า fail, timeout, unhealthy → ไป Resolve



###### 8. Resolve And Retry



> Goal: แก้ไขปัญหาแล้ว trigger ใหม่

1. บันทึก `LAST_GREEN_SHA` ด้วย `git rev-parse HEAD` ถ้ายังไม่มี

2. ทำ `/resolve-errors` วิเคราะห์ logs, errors, config

3. ถ้าเป้น GitHub Actions fail → ทำ `/resolve-github-actions-fails` ก่อนแก้ไข

4. ถ้าเป้น Cloudflare Worker fail → ทำ `/resolve-cloudflare-worker-fails` ก่อน re-deploy

5. ถ้า failure มาจาก code/config → แก้ไขน้อยทีสุด

6. ถ้า failure มาจาก workflow/CI setup → ทำ `/follow-tool-github-actions`, `/deep-review`, `/deep-review`, `/deep-review` ตามลักษณะ

7. ถ้า failure มาจาก infra/secret/platform → ทำ `/deep-review`, `/follow-secret-manager`, `/setup-cicd` ตามลักษณะ

8. ถ้าเป้น CI: commit/push หรือ re-trigger pipeline ตาม platform กลับไป Watch Pipeline

9. ถ้าเป้น CD: re-deploy ตาม platform:

   - Cloudflare → `/deploy-to-cloudflare`

   - Vercel → `/deploy-to-vercel`

   - Railway → `/deploy-to-railway` หรือ `/run-deploy`

   - Generic → `/run-deploy`

   - Release → `/run-release`

10. ถ้า re-run/re-deploy ไม่ได้ → stop และ report

11. กลับไป Watch Pipeline หรือ Watch Until Healthy

12. วนซ้ำสูงสุด 5 รอบ ถ้าเกิน → stop และ report



###### 9. Report Result



> Goal: สรุปผล CI/CD

1. ถ้า success/healthy/release สำเร็จ → report platform, target, duration, status

2. ถ้าไม่ผ่าน → report failures ทีเหลือ, root cause, last green SHA, next step

3. ใช้ `/report table` ด้วยคอลัมน์: No., Mode, Platform, Target, Status, Duration, Root Cause, Action

4. ทำ `/list-deployment-fails` เพื่อดู failures ทีค้างใน repo

5. ถ้า user ต้องการ cleanup → ทำ `/delete-cicd-fails` ก่อน next step

6. ทำ `/suggest-next-action`



##### Rules



###### 1. Mode Detection

- ถ้า argument เป้น run ID หรือมี CI config → เป้น CI

- ถ้า argument เป้น URL, version, หรือ deploy output → เป้น CD

- ถ้าไม่ชัด → ใช้ `/ask-me`



###### 2. Platform Detection

- ตรวจหา CI/CD config หรือ URL pattern ก่อนเดา

- ถ้าไม่ชัด → ใช้ generic polling

- ถ้าเป้น release อย่างเดียว → poll registry/tag endpoint จน live แทนการ watch deploy URL



###### 3. No Initial Deploy

- `/resolve-cicd` ไม่ trigger ครั้งแรกเอง

- ต้องถูกเรียกหลัง trigger แล้ว

- ถ้ายังไม่มี trigger ให้ทำ `/run-deploy` หรือ push ก่อน



###### 4. Resolve And Retry

- วน loop จนผ่านหรือถึงขีดจำกัด

- สูงสุด 5 รอบ ถ้าเกิน → stop และ report

- ถ้า failure เดิมซ้ำ 3 ครั้งขึ้นไป → circuit breaker, แนะนำ rollback



###### 5. Safety

- บันทึก `LAST_GREEN_SHA` ก่อนแก้ไขทุกรอบ

- ถ้า fix สร้าง failure ใหม่หลัง 3 รอบ → แนะนำ revert กลับไป last green SHA

- ห้าม force-push หรือ rewrite history

- ห้าม re-run/re-deploy ซ้ำแบบไร้เงื่อนไข



###### 6. Rollback Recommendation

- ถ้า timeout หรือไม่ผ่านหลัง 5 รอบ → แนะนำ rollback command ตาม platform

- ไม่ rollback อัตโนมัติ รอ user ตัดสินใจ

- ระบุ platform-specific rollback จาก `watch-deploy/watch-deploy/references/targets.md`



###### 7. Timeout

- `perRoundTimeout` = 300 วินาที สำหรับ resolve + re-run/re-deploy

- `ciWatchTimeout` = 900 วินาที สำหรับ pipeline ทีนาน

- `cdWatchTimeout` = 600 วินาที สำหรับ deployment ทีช้า

- ถ้าเกิน timeout → stop และ report



###### 8. Partial Commit

- ก่อน push fix ให้ stage เฉพาะไฟล์ทีเกี่ยวข้องกับ root cause

- ไม่ commit/push ไฟล์อื่นทีไม่เกี่ยวข้อง



##### Expected Outcome



- CI pipeline ผ่าน หรือ CD live/healthy หรือ release สำเร็จ

- รายงาน `/report table` สมบูรณ์

- ระบุ next step ผ่าน `/suggest-next-action`

- ไม่มี auto-rollback โดยไม่แจ้ง user

- ถ้าไม่ผ่าน มี last green SHA และ rollback recommendation ชัดเจน

### references/website

#### Resolve CICD Official Resources



##### Website



- https://devin.ai



##### Documentation



- https://docs.devin.ai



##### Repository



- N/A



##### Package Registry



- N/A



##### Description



ติดตามและแก้ไข CI/CD pipeline failures สำหรับ repo หรือ single run/URL ที่ระบุ

## Expected Outcome

- รู้สถานะ CI/CD ทุก pipeline ของ repo ในตารางเดียว
- Failures ถูกแก้ที่ root cause ผ่าน `/resolve-errors` และ verify ด้วย run จริงจนเขียว
- Blockers ที่แก้เองไม่ได้ถูก report พร้อม action required — ไม่มี silent failure
