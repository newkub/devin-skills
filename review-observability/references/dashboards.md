# Dashboards Validation Rules

## Dashboard Coverage

- Service overview: ทุก service มี overview dashboard
- RED dashboard: Rate, Errors, Duration สำหรับ service
- USE dashboard: Utilization, Saturation, Errors สำหรับ resource
- Business dashboard: KPI, conversion, revenue
- Incident dashboard: active incident, impact, mitigation
- ตรวจ coverage: ไม่มี service ที่ไม่มี dashboard

## Dashboard Layout

- Logical grouping: จัดกลุ่ม panel ตาม theme
- Time range: default time range, zoom capability
- Refresh interval: auto refresh, manual refresh
- Panel sizing: ขนาด panel เหมาะสม, ไม่ too small, ไม่ too large
- ตรวจ layout: อ่านง่าย, ไม่ cluttered

## Dashboard Drill-Down

- Log drill-down: จาก metric spike → log สำหรับช่วงเวลานั้น
- Trace drill-down: จาก latency spike → trace สำหรับ slow request
- Metric drill-down: จาก aggregate → breakdown
- Correlated views: ดู metric, log, trace พร้อมกัน
- ตรวจ drill-down: สามารถ drill-down จาก dashboard ได้

## Dashboard Freshness

- Real-time vs cached: real-time สำหรับ operational, cached สำหรับ historical
- Data staleness: ข้อมูลไม่เก่าเกินไป
- Refresh strategy: auto refresh interval, ไม่ overload
- ตรวจ freshness: dashboard แสดงข้อมูลล่าสุด

## Dashboard Access

- Role-based access: dashboard ตาม role
- Team ownership: ทีมเป็นเจ้าของ dashboard
- Public vs private: public สำหรับ team, private สำหรับ stakeholder
- ตรวจ access: dashboard มี access control

## Dashboard Documentation

- Panel description: อธิบาย panel แต่ละอัน
- Query explanation: อธิบาย query ที่ใช้
- Link to runbook: link ไปยัง runbook สำหรับ alert
- ตรวจ documentation: dashboard มี documentation ครบ

## Severity Criteria

- Critical: missing critical service dashboard, broken dashboard, no incident dashboard
- High: missing drill-down, stale data, missing documentation, no team ownership, missing access control
- Medium: suboptimal layout, suboptimal refresh, missing panel description
- Low: documentation gap, minor naming
