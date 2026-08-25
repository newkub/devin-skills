# Rollback And Recovery

เตรียม rollback procedure และตรวจสอบ backup strategy ก่อน deploy เพื่อให้กู้คืนได้เร็วเมื่อ deploy ล้มเหลว

## When To Use

- ก่อน deploy ทุกครั้ง (เตรียม rollback procedure)
- ถ้า deploy ล้มเหลวหรือพบ critical errors หลัง deploy
- ถ้า application ไม่ตอบสนองหลัง deploy

## Pre-Deploy Preparation

### 1. Backup Strategy Review

ทำ `/deep-review` เพื่อตรวจสอบ backup strategy ก่อน deploy:

- ตรวจ database backup ล่าสุด
- ตรวจ config backup (env vars, secrets)
- ตรวจ previous deployment version ที่ stable
- บันทึก commit SHA ปัจจุบันก่อน deploy

### 2. Rollback Procedure

เตรียม rollback procedure ชัดเจนก่อน deploy ตาม platform:

| Platform | Rollback Method |
|----------|----------------|
| Cloudflare Workers | `wrangler deployments rollback` หรือ redeploy commit เก่า |
| Vercel | `vercel rollback <deployment-url>` หรือ promote ผ่าน dashboard |
| Railway | `railway redeploy` จาก commit เก่า หรือ rollback ผ่าน dashboard |
| Docker/K8s | `kubectl rollout undo` หรือ redeploy image tag เก่า |

### 3. Zero-Downtime Check

ตรวจสอบว่า deploy เป็น zero-downtime (ถ้าต้องการ):

- ใช้ rolling deployment (K8s, Docker Swarm)
- ใช้ platform atomic deploy (Cloudflare, Vercel)
- ตรวจ health check ก่อน route traffic ไปยัง version ใหม่
- ถ้าไม่รองรับ zero-downtime → แจ้งผู้ใช้ก่อน deploy

## Rollback Execution

ถ้า deploy ล้มเหลวหรือพบ critical errors:

1. ทำ rollback ทันทีตาม procedure ที่เตรียมไว้
2. ทำ `/resolve-errors` เพื่อหา root cause
3. แก้ไข root cause ไม่ใช่แค่ symptoms
4. ทดสอบ fix ใน staging หรือ local ก่อน redeploy
5. Redeploy และทำ post-deploy validation ซ้ำ (กลับไป Step 7 ของ `SKILL.md`)

## Recovery Checklist

| Step | Action | Verify |
|------|--------|--------|
| 1 | Rollback ไปยัง version เก่า | Application ตอบสนองปกติ |
| 2 | แจ้งผู้ใช้หรือทีม (ถ้ามี impact) | Communication ส่งแล้ว |
| 3 | หา root cause ด้วย `/resolve-errors` | Root cause ระบุได้ |
| 4 | แก้ไข root cause | Fix ผ่าน verify |
| 5 | Redeploy | Deploy สำเร็จ |
| 6 | Post-deploy validation | Validation ผ่าน |
