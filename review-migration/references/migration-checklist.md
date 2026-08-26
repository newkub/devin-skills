# Migration Execution Checklist

## Goal

ตรวจสอบ migration plan พร้อม execution readiness ก่อนลงมือ

## Checks

### Assessment And Planning

1. Scope ของ migration ชัดเจน: dependencies, framework, database, API, infrastructure
2. Impact analysis ครอบคลุก consumers และ critical paths
3. Risk assessment, timeline และ rollback strategy มี
4. Pre-migration profiling และ data quality assessment ทำแล้ว
5. System compatibility ระหว่าง versions ตรวจแล้ว

### Preparation

1. Feature branch สำหรับ migration สร้างแล้ว
2. Dependencies ใหม่หรือ environment ใหม่ติดตั้งแล้ว
3. Migration scripts หรือ codemods พร้อม
4. Backup ของ data และ configuration สร้างแล้ว
5. Staging environment และ monitoring/alerts ตั้งค่าแล้ว

### Code Transformation

1. Breaking changes ระบุและมี migration path
2. Official codemods หรือ ast-grep ใช้แล้ว
3. Imports, API calls และ config files อัปเดตแล้ว
4. Manual changes มี review เพิ่มเติม

### Testing

1. Unit, integration, e2e tests รันผ่าน
2. Data integrity validation ทำแล้ว
3. Manual testing สำหรับ critical journeys ทำแล้ว
4. Load testing สำหรับ performance-critical migrations ทำแล้ว
5. Rollback plan ทดสอบบน staging แล้ว

### Deployment

1. Deployment strategy: phased, canary, blue-green ระบุชัดเจน
2. Rollback trigger criteria ระบุชัดเจน
3. Monitoring logs, metrics หลัง deployment ตั้งค่าแล้ว
4. Data integrity หลัง migration ตรวจแล้ว

### Cleanup And Documentation

1. Dependencies เก่าทีไม่ใช้แล้วลบแล้ว
2. Documentation, README, API docs อัปเดตแล้ว
3. Runbooks และ rollback procedures บันทึกแล้ว
4. Feature branch ปิดแล้ว

## Severity

- Critical: ไม่มี rollback plan, ไม่ทดสอบ, ไม่มี backup, breaking changes ไม่ระบุ
- High: compatibility ไม่ตรวจ, migration path ขาด, data integrity validation ไม่ครบ
- Medium: documentation ไม่อัปเดต, timeline ไม่ชัด, monitoring ไม่ครบ
- Low: cleanup ไม่สมบูรณ์, feature branch ค้าง
