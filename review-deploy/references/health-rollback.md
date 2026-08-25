# Health Check And Rollback Plan Checks

## Goal

ตรวจ health checks และ rollback plan ก่อน deploy

## Checks

### Health Endpoints

1. ตรวจ health endpoint มี: `/health`, `/healthz`, `/api/health`
2. ตรวจ health endpoint ทำงานได้และ return 200
3. ตรวช readiness probes ตั้งค่าถูกต้อง
4. ตรวช liveness probes ตั้งค่าถูกต้อง (ถ้าใช้ Kubernetes)

### Post-Deploy Validation

1. ตรวจมี post-deploy smoke tests สำหรับ critical paths
2. ตรวจมี error log monitoring หลัง deploy 5-10 นาที
3. ตรวชมี `run-test-e2e` สำหรับ critical paths หลัง deploy
4. ตรวชมี `watch-browser` สำหรับ monitoring deployment

### Rollback Procedure

1. ตรวจ rollback procedure ชัดเจนก่อน deploy
2. ตรวช rollback command ระบุ: `vercel rollback`, `railway redeploy`
3. ตรวจ rollback ทดสอบบน staging environment
4. ตรวช rollback trigger criteria ระบุชัดเจน

### Backup Strategy

1. ตรวจ backup strategy ตรวจสอบก่อน deploy
2. ตรวช database backup ทำก่อน migration
3. ตรวช config backup ทำก่อนเปลี่ยน
4. ตรวช backup restore ทดสอบได้

## Severity

- Critical: ไม่มี health endpoint, ไม่มี rollback plan, ไม่มี backup
- High: health endpoint ไม่ทำงาน, rollback ไม่ทดสอบ, post-deploy validation ขาด
- Medium: readiness probes ขาด, monitoring ไม่ต่อเนื่อง, backup ไม่ทดสอบ
- Low: health endpoint ไม่ละเอียด, rollback criteria ไม่ชัด
