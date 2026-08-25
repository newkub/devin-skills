# SLO/SLI/SLA Validation Rules

## SLI Definition

- Indicator selection: เลือก indicator ที่สำคัญต่อ user experience
- Measurement method: วิธีวัด (request count, error count, latency)
- Valid events: นิยาม event ที่นับว่า valid
- Total events: นิยาม event ทั้งหมด
- SLI = valid events / total events
- ตรวจ SLI: ทุก critical service มี SLI

## SLO Definition

- Target percentage: 99.9%, 99.95%, 99.99%
- Window: rolling (30 day) หรือ calendar (monthly)
- User journey mapping: SLO ต่อ user journey (signup, checkout, search)
- ตรวจ SLO: target realistic, window เหมาะสม

## Error Budget

- Budget calculation: (1 - SLO) * total events = error budget
- Budget burn rate: เร็ว, ช้า, critical burn
- Budget policy: ถ้า burn เร็ว → freeze feature, ถ้า burn ช้า → allow feature
- Budget enforcement: automated enforcement, manual enforcement
- ตรวจ error budget: มี policy, มี enforcement

## SLA Definition

- External commitment: SLA ใน contract
- Penalty clause: ค่าปรับถ้าไม่ผ่าน SLA
- Internal SLO vs external SLA gap: SLO สูงกว่า SLA (buffer)
- ตรวจ SLA: มี contract clause, มี buffer

## SLO Reporting

- Report cadence: weekly, monthly, quarterly
- Report audience: engineering, product, leadership
- Report content: SLO achievement, error budget, trend
- Trend tracking: historical trend, forecast
- ตรวจ reporting: มี regular report

## SLO Review

- Regular review cycle: quarterly, semi-annually
- SLO adjustment: ปรับ target ตาม user feedback, business need
- User feedback integration: รับ feedback จาก user สำหรับ SLO
- ตรวจ review: มี review cycle, มี adjustment process

## Severity Criteria

- Critical: no SLO defined for critical service, SLO not measured, error budget exceeded without action, no SLA for paid service
- High: missing error budget policy, inconsistent SLI, no SLO reporting, no SLO review cycle, no buffer between SLO and SLA
- Medium: suboptimal target, suboptimal window, missing trend tracking
- Low: documentation gap, minor naming
