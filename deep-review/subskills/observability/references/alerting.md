# Alerting Validation Rules

## Alert Rules

- Coverage: ทุก critical path มี alert
- Critical path alerts: auth, payment, database, API gateway
- SLO-based alerts: error budget burn rate, latency budget
- Anomaly detection: statistical, ML-based
- ตรวจ coverage: ไม่มี critical path ที่ไม่มี alert

## Alert Thresholds

- Static threshold: fixed value (error rate > 5%)
- Dynamic threshold: adaptive (anomaly detection)
- Burn rate: error budget burn rate (1x, 2x, 6x, 10x)
- Multi-window: short window (5m) + long window (1h)
- Multi-burn-rate: fast burn (2% in 1h) + slow burn (10% in 6h)
- ตรวจ threshold: ไม่ sensitive เกินไป (alert storm), ไม่ insensitive เกินไป (miss)

## Alert Routing

- Severity-based routing: critical → page, high → Slack, medium → email
- Team ownership: alert ไปยัง team ที่รับผิดชอบ
- On-call schedule: follow on-call rotation
- ตรวจ routing: alert ไปถึงคนที่รับผิดชอบเวลาที่เหมาะสม

## Alert Escalation

- Escalation policy: ถ้าไม่ respond ใน X นาที → escalate
- Fallback responder: backup responder ถ้า primary ไม่ว่าง
- Escalation timeout: ระบุ timeout สำหรับแต่ละ level
- ตรวจ escalation: ไม่มี alert ที่ stuck โดยไม่มี escalation

## Alert Noise Reduction

- Deduplication: รวม alert ที่เป็น issue เดียวกัน
- Grouping: รวม alert ที่เกี่ยวข้องเป็น incident
- Silencing: silence ระหว่าง maintenance
- Maintenance window: schedule maintenance, suppress alert
- ตรวจ noise: alert count ต่อวัน, alert storm detection

## Alert Content

- Runbook link: link ไปยัง runbook สำหรับ alert
- Context: service, metric, threshold, current value
- Severity: critical, high, medium, low
- Impact: user impact, business impact
- Actionable: บอกว่าต้องทำอะไร
- ตรวจ content: alert มีข้อมูลพอสำหรับ triage

## Alert Testing

- Synthetic alert: สร้าง alert เพื่อ test pipeline
- Alert simulation: simulate condition เพื่อ trigger alert
- Alert drill: regular drill สำหรับ on-call
- ตรวจ testing: alert pipeline ถูก test  regularly

## Severity Criteria

- Critical: no alerting on critical path, alert storm, missing escalation, no runbook link, no on-call
- High: missing SLO alert, alert fatigue, missing alert routing, no alert testing, missing alert content
- Medium: suboptimal threshold, missing noise reduction, inconsistent routing
- Low: documentation gap, minor naming
