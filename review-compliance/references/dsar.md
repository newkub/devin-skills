# Data Subject Rights (DSAR) Validation Rules

## DSAR Intake

- Request channel: มี channel สำหรับ submit request (form, email, API)
- Identity verification: verify identity ก่อน fulfill
- Request tracking: มี tracking system, มี status
- Response timeline: ภายใน 1 เดือน (GDPR), 45 วัน (CCPA)
- ตรวจ intake: มี channel, มี verification, มี tracking, มี timeline

## Access Request

- Data export: export ข้อมูลทั้งหมดของ user
- Data categories: ระบุ category ของข้อมูล
- Data sources: ระบุ source ของข้อมูล
- Third-party data: ระบุ third party ที่ share ข้อมูล
- ตรวจ access: มี export, มี category, มี source, มี third-party

## Deletion Request

- Data deletion: ลบข้อมูลจาก production database
- Backup deletion: ลบจาก backup หรือ schedule ลบ
- Third-party deletion: request ลบจาก third party
- Deletion verification: verify ว่าลบแล้ว
- ตรวจ deletion: มี production, มี backup, มี third-party, มี verification

## Portability Request

- Machine-readable format: JSON, CSV, XML
- Data export: export ข้อมูลที่ user ให้มา
- Direct transmission: ส่งตรงไปยัง controller อื่น (ถ้า technically feasible)
- ตรวจ portability: มี format, มี export, มี transmission

## Objection Request

- Processing stop: หยุด processing ที่ user object
- Marketing opt-out: หยุด marketing
- Profiling stop: หยุด profiling
- ตรวจ objection: มี stop, มี opt-out, มี profiling stop

## DSAR Exception

- Legal obligation: ไม่ลบถ้ามี legal obligation
- Freedom of expression: ไม่ลบถ้าจำเป็นสำหรับ freedom of expression
- Public interest: ไม่ลบถ้า public interest
- Legal claims: ไม่ลบถ้าจำเป็นสำหรับ legal claim
- ตรวจ exception: มี exception policy, มี documentation

## Review Checklist

1. ตรวจสอบ DSAR intake: request channel, identity verification, request tracking, response timeline
2. ตรวจสอบ access request: data export, data categories, data sources, third-party data
3. ตรวจสอบ deletion request: data deletion, backup deletion, third-party deletion, deletion verification
4. ตรวจสอบ portability request: machine-readable format, data export, direct transmission
5. ตรวจสอบ objection request: processing stop, marketing opt-out, profiling stop
6. ตรวจสอบ DSAR exception: legal obligation, freedom of expression, public interest, legal claims

## Severity Criteria

- Critical: no DSAR process, no identity verification, no deletion including backup, no response within timeline, no tracking
- High: missing portability, missing objection, incomplete data export, no third-party deletion, no exception policy
- Medium: suboptimal verification, incomplete data category, missing direct transmission
- Low: documentation gap, minor naming
