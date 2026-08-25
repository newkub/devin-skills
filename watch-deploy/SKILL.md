---
name: watch-deploy
description: Poll a deployed URL and report when it becomes healthy after deployment
argument-hint: "[url]"
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

1. ถ้าผ่าน ให้ report URL, status, response time, elapsed time
2. ถ้า timeout ให้ report last status, total polls, error summary
3. ถ้า redirect ให้ report final URL และ status

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

## Expected Outcome

- URL ที่ deploy ไปถูก poll ซ้ำจนกว่าจะ healthy หรือหมดเวลา
- ผลลัพธ์ report ครบ: final status, response time, elapsed, retries
- ไม่มี TODO/MOCK/placeholder
- `SKILL.md` และ references ไม่เกิน 250 บรรทัด
