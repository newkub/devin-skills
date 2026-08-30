# Risk Review Checklist

## Identify Technical Risks

1. ตรวจ tech stack maturity, unproven libraries, breaking changes
2. ตรวจ integration points, dependencies, circular dependencies
3. ตรวจ scalability, performance bottlenecks, data migration risks
4. ตรวจ tech debt, legacy code, maintenance burden

## Identify Schedule And Resource Risks

1. ตรวจ timeline realism, effort estimates, buffer
2. ตรวจ critical path, dependencies, bottlenecks
3. ตรวจ resource availability: team, environment, tools
4. ตรวจ scope creep และ undefined acceptance criteria

## Identify Security And Compliance Risks

1. ตรวจ vulnerabilities, secrets exposure, auth/authz gaps
2. ตรวจ supply chain risks, dependencies vulnerabilities
3. ตรวจ compliance: GDPR, CCPA, PDPA, HIPAA, SOC2, PCI-DSS
4. ตรวจ data privacy, encryption, audit trails
5. ถ้าจำเป็น → ทำ `/review-security` หรือ `/review-compliance`

## Identify Business And Operational Risks

1. ตรวจ business value, user adoption, revenue impact
2. ตรวจ operational readiness: monitoring, alerting, on-call
3. ตรวจ deployment, rollback, incident response readiness
4. ตรวจ vendor lock-in, cost overrun, financial impact

## Check Mitigation And Rollback

1. ตรวจ critical/high risks มี mitigation plan
2. ตรวจ mitigation ลด probability หรือ impact ได้จริง
3. ตรวจ high-risk tasks มี rollback strategy หรือ fallback
4. ตรวจ assumptions ระบุชัดเจนและมีพื้นฐานจริง
5. ถ้า mitigation ไม่พอ → ระบุเป็น finding และแนะนำ action
