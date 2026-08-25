# Zero-Downtime And Migration Checks

## Goal

ตรวจ zero-downtime strategy และ migration scripts ก่อน deploy

## Checks

### Deployment Strategy

1. ตรวจ deployment strategy: blue-green, canary, phased
2. ตรวจ zero-downtime deploy ตั้งค่าถูกต้อง
3. ตรวช deployment แบบ attached หรือ detached เหมาะสม
4. ตรวช rollback เป็น zero-downtime ด้วย

### Database Migration

1. ตรวจ migration scripts พร้อมและ test แล้ว
2. ตรวช migration รันบน staging environment ก่อน
3. ตรวช expand-contract pattern สำหรับ schema changes
4. ตรวช data integrity check หลัง migration
5. ตรวช migration rollback plan มี

### DNS And CDN

1. ตรวจ DNS config ถูกต้อง
2. ตรวช CDN config ถูกต้อง
3. ตรวช custom domain ตั้งค่า: `vercel domains`, `railway domain`
4. ตรวช DNS propagation ตรวจสอบก่อน deploy

### SSL And Security

1. ตรวช SSL certificates ตั้งค่าอัตโนมัติ
2. ตรวช HTTPS/TLS เท่านั้นสำหรับ external calls
3. ตรวช SSL certificate validation เปิดใช้งาน
4. ตรวช security headers ตั้งค่า: CORS, CSP, HSTS

## Severity

- Critical: ไม่มี migration plan, migration ไม่ test, ไม่มี SSL
- High: ไม่มี zero-downtime, DNS ผิด, migration rollback ขาด
- Medium: CDN ขาด, security headers ขาด, data integrity check ขาด
- Low: SSL config ไม่ละเอียด, DNS propagation ไม่ตรวจ
