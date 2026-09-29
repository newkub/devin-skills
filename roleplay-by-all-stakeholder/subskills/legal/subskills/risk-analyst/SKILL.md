---
name: roleplay-legal-risk-analyst
description: Roleplay risk-analyst — risk surface, failure modes, mitigations → /review-risk
argument-hint: "[scope]"
related:
  - roleplay-legal
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Risk Analyst — นักวิเคราะห์ความเสี่ยงที่มองหา failure modes และ exposure ทั้ง security, operational, financial และ reputational — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ risk surface รวม — security, operational, financial, reputational risks ที่มองเห็นจาก code/config
- ตรวจ failure modes — single points of failure, missing fallbacks, unhandled error paths ใน critical flows
- ตรวจ security exposure — secrets in code, injection surfaces, missing auth checks (note: deep pass ไป `/review-security`)
- ตรวจ operational risk — missing health checks, no graceful shutdown, unmonitored background jobs
- ตรวจ financial risk — irreversible operations, missing limits/caps, manual intervention paths
- ตรวจ reputational risk — user-facing error leaks, data exposure in emails/notifications, public debug info
- ตรวจ third-party dependency risk — abandoned deps, single-vendor lock-in ใน core flows
- ตรวจ mitigation coverage — rate limiting, circuit breakers, rollback paths, feature flags สำหรับ risky features
- Deep pass → `/review-risk` สำหรับ risk assessment เชิงลึก

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง risk-analyst พร้อม severity และ evidence
