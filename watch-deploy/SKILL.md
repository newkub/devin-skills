---
name: watch-deploy
description: Poll a deployed URL and report when it becomes healthy after deployment
argument-hint: "[url|report]"
related:
  - run-watch
  - ask-me
  - run-deploy
---

## Goal

Monitor a deployment URL after a deploy command and report when the service returns a healthy status, typically HTTP 200.

## Scope

Use with static sites and web apps deployed to Cloudflare Pages, Vercel, Netlify, Railway, Render, Fly.io, or any custom domain. Works for production and preview deployments.

## Execute

### 1. Identify Deployment URL

> Goal: know the exact URL to poll

1. รับ URL จาก user, deploy output, หรือ CI log
2. ถ้า deploy ยังไม่เสร็จ ให้รอจนได้ URL ก่อน
3. ดู `references/targets.md` สำหรับ URL patterns ของแต่ละ platform
4. ถ้า URL ไม่ชัด → ทำ `/ask-me`

### 2. Configure Polling

> Goal: กำหนดเงื่อนไขการ poll

1. กำหนด `interval` (วินาทีระหว่าง poll) ค่าเริ่มต้น `10`
2. กำหนด `timeout` (วินาทีรวม) ค่าเริ่มต้น `300`
3. กำหนด `expectedStatus` ค่าเริ่มต้น `[200]`
4. ดู `references/health-check.md` สำหรับ redirect, 4xx, 5xx handling

### 3. Poll URL

> Goal: ตรวจสอบสถานะซ้ำจนกว่าจะผ่านหรือหมดเวลา

1. ใช้ `curl -s -I -L` หรือ `fetch` เพื่อตรวจสอบ URL
2. บันทึก timestamp, status, response time, elapsed time
3. ถ้าสถานะตรงกับ `expectedStatus` → หยุด และ report success
4. ถ้าเกิด network error → นับ retry และ report
5. ถ้ายังไม่ผ่าน → รอ `interval` วินาที แล้ว poll ใหม่

### 4. Report Result

> Goal: สรุปผลลัพธ์ให้ user ทราบ

1. ทำตาม `workflows/report-status/SKILL.md` — poll timeline, health transitions, time-to-live
2. ถ้าผ่าน ให้ report URL, status, response time, elapsed time
3. ถ้า timeout ให้ report last status, total polls, error summary
4. ถ้า redirect ให้ report final URL และ status

### Workflows

| Argument | Workflow |
|----------|----------|
| `report`, `status` | `workflows/report-status/SKILL.md` — deploy watch report (poll timeline, verdict) |

1. ถ้า argument เป็น `report`/`status` → อ่าน `workflows/report-status/SKILL.md` แล้วทำตาม flow — ใช้ poll data ที่มีอยู่ ไม่ poll ใหม่
2. ถ้าไม่ระบุ → ทำ Steps 1-4 ตามปกติ โดย Step 4 อ่าน workflow `report-status` มา execute

## Rules

### 1. Default Polling

- `interval` = `10` วินาที
- `timeout` = `300` วินาที
- `expectedStatus` = `[200]`
- `followRedirects` = `true`
- `maxInterval` = `60` วินาที (cap for 429 backoff)
- `maxRedirects` = `5`

### 2. Status Handling

- 200: healthy, stop immediately
- 301/302: follow redirect unless `followRedirects` = `false`
- 401/403: stop immediately, report "authentication required" — URL may be protected
- 404: continue polling (DNS/path may still propagate)
- 429: increase interval by `5` วินาที (ไม่เกิน `maxInterval`)
- 500–599: continue polling, report if repeated `3` times
- SSL error: stop immediately, report "SSL certificate error" — do not retry
- redirect loop (≥ 5 redirects): stop, report "redirect loop detected"
- network error: retry up to `maxRetries` = `5`

### 3. URL Sources

- รับ URL จาก output ของ `wrangler pages deploy`
- รับ URL จาก `vercel --yes` หรือ `netlify deploy`
- รับ URL จาก CI environment variable เช่น `DEPLOY_URL`
- ไม่ hardcode production domain ใน skill

### 4. Output

- แสดงทุก poll ด้วย timestamp, status, elapsed
- ใช้ table สำหรับสรุปผลลัพธ์
- ไม่ print HTML body

### 5. Rollback Recommendation

- ถ้า timeout ถึงและ deployment ยังไม่ healthy → report แนะนำ rollback
- ระบุ platform-specific rollback command (ดู `references/targets.md`)
- ไม่ rollback อัตโนมัติ — ให้ user ตัดสินใจ

### 6. Safety

- ไม่ poll URL ที่ user ไม่ยินยอม
- ไม่ส่ง headers ลับ เช่น API keys, โดยไม่ได้รับอนุญาต
- หยุดทันทีเมื่อ user กด `Ctrl+C`

- ใช้ /run-watch ถ้าจำเป็น
- ใช้ /run-watch ถ้าจำเป็น
- ใช้ /run-watch ถ้าจำเป็น
- ใช้ /run-deploy ถ้าจำเป็น

## Merged Details

### report-status

##### Goal

แปลง poll session ของ `/watch-deploy` เป็น status report — timeline ของ health transitions และ time-to-live

##### Scope

- ใช้เมื่อ `/watch-deploy` dispatch มาที่ `report`/`status` หรือเรียกหลัง poll จบ
- Chat-only report — ไม่สร้างไฟล์ถาวร

##### Execute

###### 1. Collect Poll Results

> Goal: รวมผลแต่ละ poll

1. รวม status code + latency ต่อ poll พร้อม timestamps
2. ระบุ transitions: `deploying` → `healthy` / `failed`
3. คำนวณ time-to-live (first poll → first 200)

###### 2. Build Status Report

> Goal: ตอบว่า deploy สำเร็จไหมและนานแค่ไหน

1. Summary: URL, total polls, duration, final status
2. ตาราง: `No.`, `Time`, `Status`, `Latency`, `Notes` — show transitions + ตัวอย่าง polls (ไม่ใช่ทุก poll)
3. flag anomalies: status flapping, slow-but-200

###### 3. Verdict

> Goal: สรุปผล deploy

1. Verdict: `live` / `timeout` / `unhealthy` / `flapping`
2. ถ้าไม่ live → แนะนำ `follow-deploy/workflows/verify-deploy/SKILL.md` หรือ rollback path
3. เทียบ time-to-live กับ deploys ก่อนหน้าถ้ามีข้อมูล

##### Rules

- ไม่ list ทุก poll — แสดง transitions + samples เป็นพอ
- ระบุ poll interval และ timeout ที่ใช้
- timeout ≠ failed เสมอ — ระบุว่า app อาจกำลัง warm up

##### Expected Outcome

- Status report พร้อม time-to-live + verdict

### references/health-check

#### Health Check And Polling

Polling logic and status interpretation for `watch-deploy`.

##### HTTP Status Rules

| Status | Meaning | Action |
|---|---|---|
| 200 | Healthy | Stop watching, report success |
| 301/302 | Redirect | Follow if `followRedirects` is `true`, otherwise report redirect |
| 404 | Not found | Continue polling if expected (new DNS/path not ready) |
| 429 | Rate limit | Back off and increase interval |
| 500–599 | Server error | Continue polling, report if repeated |
| timeout | No response | Retry, count toward `maxRetries` |

##### Polling Parameters

- `url`: target URL to poll
- `interval`: seconds between polls, default `10`
- `timeout`: total seconds to watch, default `300`
- `expectedStatus`: status codes considered healthy, default `200`
- `followRedirects`: whether to follow 301/302, default `true`
- `headers`: extra headers such as `Authorization` or custom host

##### Stop Conditions

- URL returns status in `expectedStatus` within `timeout`
- `timeout` reached without success
- `maxRetries` consecutive network errors reached
- User interrupts (`Ctrl+C`)

##### Output Format

Report each poll with:
- timestamp
- status code or error
- response time
- elapsed total time
- retry count

### references/targets

#### Deployment Targets

Common deploy targets and how to obtain a preview/production URL.

##### Cloudflare Pages

- Production: `https://<project-name>.pages.dev`
- Preview: printed by `wrangler pages deploy` e.g. `https://<hash>.<project-name>.pages.dev`
- Branch preview: `https://<branch-name>.<project-name>.pages.dev`

##### Vercel

- Production: `https://<project-name>.vercel.app`
- Preview: `https://<git-commit-hash>-<project-name>.vercel.app`
- `vercel --yes` prints the deployment URL

##### Netlify

- Production: `https://<site-name>.netlify.app`
- Deploy preview: printed by `netlify deploy` or in GitHub PR checks

##### Railway / Render / Fly.io

- Service URL is shown in the dashboard or by the CLI after deploy
- Some platforms require a health endpoint such as `/health` or `/api/health`

##### Custom domain

- Use the custom domain only after DNS propagation
- Prefer checking the platform-provided URL first to avoid false negatives

### references/website

#### Watch Deploy Official Resources

- This skill is a workflow; see [SKILL.md](../SKILL.md) for tooling.

## Expected Outcome

- URL ที่ deploy ไปถูก poll ซ้ำจนกว่าจะ healthy หรือหมดเวลา
- ผลลัพธ์ report ครบ: final status, response time, elapsed, retries
- ไม่มี TODO/MOCK/placeholder
- `SKILL.md` และ references ไม่เกิน 250 บรรทัด
