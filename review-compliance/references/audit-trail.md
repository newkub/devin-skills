# Audit Trail Validation Rules

## Audit Log Content

- Who: user ID, role, IP address
- What: action, resource, before/after value
- When: timestamp, timezone
- Where: endpoint, service, location
- Reason: reason สำหรับ action (ถ้ามี)
- ตรวจ content: มีครบทุก field

## Audit Log Coverage

- Authentication: login, logout, failed login, MFA
- Authorization: permission grant, permission revoke, role change
- Data access: read, export, share
- Data modification: create, update, delete
- Configuration change: config, permission, policy
- ตรวจ coverage: มี log สำหรับทุก critical action

## Tamper Protection

- Append-only: ไม่สามารถ update/delete log
- Cryptographic hash: hash chain สำหรับ integrity
- Digital signature: sign log สำหรับ authenticity
- Access restriction: ไม่ให้ user ทั่วไป access audit log
- ตรวจ tamper: มี append-only, มี hash, มี signature, มี restriction

## Audit Log Retention

- Retention period: ตาม compliance (HIPAA 6 ปี, SOX 7 ปี, GDPR ตามจำเป็น)
- Archive: archive log ที่เก่า
- Legal hold: hold log สำหรับ legal case
- Disposal: secure disposal หลัง retention
- ตรวจ retention: มี period, มี archive, มี legal hold, มี disposal

## Audit Log Review

- Regular review: review log regularly
- Anomaly detection: detect anomaly ใน log
- Escalation: escalate suspicious activity
- Review record: มี record ของ review
- ตรวจ review: มี regular review, มี anomaly detection, มี escalation

## Audit Log Access

- Access control: มี RBAC สำหรับ audit log
- Access log: log การ access audit log
- Segregation of duties: คนที่ review ไม่ใช่คนที่ generate
- ตรวจ access: มี RBAC, มี access log, มี segregation

## Severity Criteria

- Critical: no audit log on data access, no tamper protection, audit log can be modified, no retention, no access control
- High: incomplete coverage, missing review, no anomaly detection, missing access control, no segregation
- Medium: suboptimal retention, missing archive, incomplete review record
- Low: documentation gap, minor naming
