# Single-Run CD Watch And Resolve

> Part 2 of [single-run.md](single-run.md) — detection, CI watch, and prerequisites are covered there.

## Execute (Continued)

### 5. CD: Detect CD Target



> Goal: ระบุ deployment target และ URL

1. ใช้ `url-or-target` จาก argument ถ้ามี

2. ถ้าไม่มี → ค้นหาจาก env, deploy output, CI/CD log, section `references/targets` ใน `watch-deploy/SKILL.md`

3. ถ้ายังไม่ชัด → ทำ `/ask-me`



### 6. CD: Determine Platform



> Goal: เลือก skill ทีเหมาะกับ CD target

1. Cloudflare Pages: URL มี `.pages.dev` หรือ `wrangler` ใน output → ดำเนินการใน skill นี้ (`/resolve-cicd`) ถ้า fail → ทำ `/resolve-cloudflare-worker-fails` ก่อน re-deploy

2. Release/tag: version tag, release name, GitHub release → poll registry/tag endpoint จน live — `npm view <pkg>@<ver>`, `gh release view <tag>` (interval 30s, timeout 600s)

3. Generic URL: Railway, Render, Fly.io, Netlify, custom domain → `/watch-deploy`



### 7. CD: Watch Until Healthy



> Goal: ติดตาม deployment จน live หรือ release สำเร็จ

1. เรียก skill ตาม platform

2. ถ้า success → ไป Report

3. ถ้า fail, timeout, unhealthy → ไป Resolve



### 8. Resolve And Retry



> Goal: แก้ไขปัญหาแล้ว trigger ใหม่

1. บันทึก `LAST_GREEN_SHA` ด้วย `git rev-parse HEAD` ถ้ายังไม่มี

2. ทำ `/resolve-errors` วิเคราะห์ logs, errors, config

3. ถ้าเป้น GitHub Actions fail → ทำ `/resolve-github-actions-fails` ก่อนแก้ไข

4. ถ้าเป้น Cloudflare Worker fail → ทำ `/resolve-cloudflare-worker-fails` ก่อน re-deploy

5. ถ้า failure มาจาก code/config → แก้ไขน้อยทีสุด

6. ถ้า failure มาจาก workflow/CI setup → ทำ `/follow-tool-github-actions`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase` ตามลักษณะ

7. ถ้า failure มาจาก infra/secret/platform → ทำ `/deep-review-codebase`, `/follow-secret-manager`, `/setup-cicd` ตามลักษณะ

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



### 9. Report Result



> Goal: สรุปผล CI/CD

1. ถ้า success/healthy/release สำเร็จ → report platform, target, duration, status

2. ถ้าไม่ผ่าน → report failures ทีเหลือ, root cause, last green SHA, next step

3. ใช้ `/report table` ด้วยคอลัมน์: No., Mode, Platform, Target, Status, Duration, Root Cause, Action

4. ทำ `/check-deployment-fails` เพื่อดู failures ทีค้างใน repo

5. ถ้า user ต้องการ cleanup → ทำ `/delete-cicd-fails` ก่อน next step

6. ทำ `/suggest-next-action`



## Rules



### 1. Mode Detection

- ถ้า argument เป้น run ID หรือมี CI config → เป้น CI

- ถ้า argument เป้น URL, version, หรือ deploy output → เป้น CD

- ถ้าไม่ชัด → ใช้ `/ask-me`



### 2. Platform Detection

- ตรวจหา CI/CD config หรือ URL pattern ก่อนเดา

- ถ้าไม่ชัด → ใช้ generic polling

- ถ้าเป้น release อย่างเดียว → poll registry/tag endpoint จน live แทนการ watch deploy URL



### 3. No Initial Deploy

- `/resolve-cicd` ไม่ trigger ครั้งแรกเอง

- ต้องถูกเรียกหลัง trigger แล้ว

- ถ้ายังไม่มี trigger ให้ทำ `/run-deploy` หรือ push ก่อน



### 4. Resolve And Retry

- วน loop จนผ่านหรือถึงขีดจำกัด

- สูงสุด 5 รอบ ถ้าเกิน → stop และ report

- ถ้า failure เดิมซ้ำ 3 ครั้งขึ้นไป → circuit breaker, แนะนำ rollback



### 5. Safety

- บันทึก `LAST_GREEN_SHA` ก่อนแก้ไขทุกรอบ

- ถ้า fix สร้าง failure ใหม่หลัง 3 รอบ → แนะนำ revert กลับไป last green SHA

- ห้าม force-push หรือ rewrite history

- ห้าม re-run/re-deploy ซ้ำแบบไร้เงื่อนไข



### 6. Rollback Recommendation

- ถ้า timeout หรือไม่ผ่านหลัง 5 รอบ → แนะนำ rollback command ตาม platform

- ไม่ rollback อัตโนมัติ รอ user ตัดสินใจ

- ระบุ platform-specific rollback จาก section `references/targets` ใน `watch-deploy/SKILL.md`



### 7. Timeout

- `perRoundTimeout` = 300 วินาที สำหรับ resolve + re-run/re-deploy

- `ciWatchTimeout` = 900 วินาที สำหรับ pipeline ทีนาน

- `cdWatchTimeout` = 600 วินาที สำหรับ deployment ทีช้า

- ถ้าเกิน timeout → stop และ report



### 8. Partial Commit

- ก่อน push fix ให้ stage เฉพาะไฟล์ทีเกี่ยวข้องกับ root cause

- ไม่ commit/push ไฟล์อื่นทีไม่เกี่ยวข้อง



## Expected Outcome



- CI pipeline ผ่าน หรือ CD live/healthy หรือ release สำเร็จ

- รายงาน `/report table` สมบูรณ์

- ระบุ next step ผ่าน `/suggest-next-action`

- ไม่มี auto-rollback โดยไม่แจ้ง user

- ถ้าไม่ผ่าน มี last green SHA และ rollback recommendation ชัดเจน

