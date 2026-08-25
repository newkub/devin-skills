# Post-Deploy Validation

ตรวจสอบ deployment อย่างละเอียดหลัง deploy สำเร็จ เพื่อยืนยันว่า application ทำงานได้จริงใน production

## When To Use

- หลัง deploy สำเร็จและ deployment live แล้ว
- ก่อนปิด task หรือส่งมอบงาน
- ถ้ามี critical path ที่ต้องทดสอบ เช่น auth, checkout, API endpoints

## Steps

### 1. E2E Test Critical Paths

ทำ `/run-test-e2e` เพื่อทดสอบ critical paths หลัง deploy:

- Login/auth flow
- Main user journey (search, create, update, delete)
- API endpoints ที่สำคัญ
- Payment/checkout (ถ้ามี)

### 2. Health Endpoint Check

ตรวจสอบ health endpoint และ readiness probes:

- `GET /health` หรือ `GET /api/health` ต้อง return 200
- ตรวจ readiness probe ถ้า platform รองรับ (Kubernetes, Cloudflare)
- ตรวจ response time < 1000ms

### 3. Error Log Monitoring

ตรวจสอบ error logs หลัง deploy 5-10 นาที:

- ตรวจ platform logs (Cloudflare dashboard, Vercel logs, Railway logs)
- ตรวจ browser console errors ผ่าน `/watch-browser`
- ตรวจ network errors ใน browser DevTools
- ถ้าพบ critical errors → ทำ rollback ทันที และทำ `/resolve-errors`

### 4. Smoke Test Checklist

| Check | Method | Expected |
|-------|--------|----------|
| Page load | เปิด URL ใน browser | HTTP 200, page render สมบูรณ์ |
| API response | `curl` หรือ browser | 200 OK, ไม่มี 500/502 |
| Assets | ตรวจ CSS/JS load | ไม่มี 404 |
| Database | ตรวจ query ทำงาน | ไม่มี connection error |
| Auth | login ทดสอบ | สำเร็จ, token ถูกต้อง |

## Rollback Trigger

ถ้าพบ critical errors ระหว่าง validation:

1. ทำ rollback ทันที (ดู `references/rollback-recovery.md`)
2. ทำ `/resolve-errors` เพื่อหา root cause
3. แก้ไขแล้ว redeploy
4. ทำ validation ซ้ำจนกว่าจะผ่าน
