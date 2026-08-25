# Incident Response Readiness Validation Rules

## Runbook

- Coverage: ทุก critical alert มี runbook
- Accuracy: runbook ตรงกับ current system
- Step-by-step: มีขั้นตอนชัดเจน, มี command ที่ใช้ได้
- Link from alerts: alert มี link ไปยัง runbook
- Regular update: runbook อัปเดตตาม system change
- ตรวจ runbook: มี runbook, อัปเดต, ใช้ได้จริง

## On-Call Setup

- On-call schedule: rotation schedule, primary/secondary
- Handoff process: handoff document, handoff meeting
- On-call tooling: PagerDuty, Opsgenie, Slack
- ตรวจ on-call: มี schedule, มี handoff, มี tooling

## Incident Declaration

- Severity level: Sev1, Sev2, Sev3, Sev4 definition
- Declaration criteria: เมื่อไรประกาศ incident, ใครประกาศ
- Communication channel: incident channel, bridge
- ตรวจ declaration: มี criteria, มี channel

## Incident Communication

- Status page: public status page, update cadence
- Stakeholder update: internal update, cadence
- Customer communication: email, in-app notification
- ตรวจ communication: มี status page, มี update process

## Postmortem

- Blameless postmortem: focus ที่ system, ไม่โทษคน
- Root cause analysis: 5 whys, fishbone, causal analysis
- Action item tracking: action item, owner, due date, status
- Postmortem template: มี template, มี section ครบ
- ตรวจ postmortem: มี process, มี template, มี action item tracking

## Chaos Engineering

- Chaos experiment: สร้าง failure เพื่อ test resilience
- Game day: regular game day, cross-team
- Fault injection: inject latency, error, resource exhaustion
- Resilience testing: test fallback, retry, circuit breaker
- ตรวจ chaos: มี experiment, มี game day

## Severity Criteria

- Critical: no runbook for critical alert, no on-call, no incident declaration process, no postmortem process, no status page
- High: outdated runbook, missing chaos engineering, no action item tracking, no stakeholder update, missing handoff
- Medium: suboptimal severity level, missing game day, incomplete postmortem template
- Low: documentation gap, minor naming
