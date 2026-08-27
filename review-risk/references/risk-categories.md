# Risk Categories

## Goal

ระบุ risk categories สำหรับ `review-risk` เพื่อไม่มองข้ามด้านใดด้านหนัง

## Categories

### Technical

- unproven technology, new libraries, breaking changes
- integration complexity, API stability, compatibility
- scalability, performance, concurrency
- data migration, schema changes, state consistency
- tech debt, legacy code, maintenance burden

### Schedule And Resources

- underestimated effort, unrealistic timeline
- critical path bottlenecks, dependency delays
- resource availability: team, environment, tools
- scope creep, unclear acceptance criteria
- external blockers, third-party lead time

### Security

- vulnerabilities, attack surfaces, injection, XSS
- secrets exposure, hardcoded credentials
- auth/authz gaps, privilege escalation
- supply chain, untrusted dependencies
- data breaches, encryption gaps

### Compliance And Legal

- GDPR, CCPA, PDPA, HIPAA, PCI-DSS, SOC2
- data retention, deletion, right to access
- licensing, IP, open-source compliance
- audit trails, logging, evidence

### Business

- wrong problem, low user adoption
- revenue impact, cost overrun
- competitive pressure, market timing
- stakeholder alignment, priority conflicts

### Operational

- deployment complexity, rollback difficulty
- monitoring, alerting, observability gaps
- incident response, on-call readiness
- vendor lock-in, service availability
- backup, disaster recovery

### Financial

- infrastructure cost, unexpected bills
- licensing cost, contract lock-in
- team cost, opportunity cost
