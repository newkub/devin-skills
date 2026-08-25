# Data Integrity And Migration Checks

## Goal

ตรวจ data integrity และ migration scripts ก่อน migration

## Checks

### Migration Scripts

1. ตรวช migration scripts มีสำหรับ database schema changes
2. ตรวช migration scripts test บน staging environment
3. ตรวช migration scripts มี up และ down (rollback)
4. ตรวช migration scripts มี data transformation logic

### Data Transformation

1. ตรวช data transformation rules ระบุชัดเจน
2. ตรวช data mapping ระหว่าง old และ new format
3. ตรวช data validation หลัง transformation
4. ตรวช data loss prevention strategy

### Backup Strategy

1. ตรวช data backup strategy มีก่อน migration
2. ตรวช backup ทดสอบ restore ได้
3. ตรวช backup timing: ก่อน migration, ระหว่าง migration
4. ตรวช backup retention policy

### Data Integrity Validation

1. ตรวช data integrity validation หลัง migration
2. ตรวช row count comparison ก่อนและหลัง
3. ตรวช checksum หรือ hash validation
4. ตรวช referential integrity check

### Pre-Migration Assessment

1. ตรวช pre-migration profiling ทำแล้ว
2. ตรวช data quality assessment ทำแล้ว
3. ตรวช system compatibility ตรวจแล้ว
4. ตรวช migration scope ระบุชัดเจน

## Severity

- Critical: migration scripts ขาด, ไม่มี backup, data loss risk
- High: migration scripts ไม่ test, data transformation ไม่ชัด, validation ขาด
- Medium: backup ไม่ test, validation ไม่ครบ, profiling ขาด
- Low: data mapping ไม่ละเอียด, documentation ขาด
