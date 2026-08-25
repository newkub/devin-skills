# Governance Checks

## Goal

ตรวจสอบ governance structure, ownership, policies, review process, และ maintenance

## Checks

### Governance Structure

1. ตรวจสอบ governance framework: roles, responsibilities, decision making, escalation path
2. ตรวจสอบ project charter, `README`, `CONTRIBUTING`, `GOVERNANCE.md` ถ้ามี
3. ตรวจสอบ communication channels, meeting cadence, RFC process
4. ตรวจสอบ decision log

### Ownership

1. ตรวจสอบ `CODEOWNERS` / `OWNERS` file ครอบคลุมทุก module
2. ตรวจสอบ package / directory ownership assignment
3. ตรวจสอบ accountability สำหรับ security, release, incident
4. ตรวจสอบ critical path มี owner
5. ตรวจสอบ security area มี owner

### Policies

1. ตรวจสอบ coding standards: style guide, lint config, formatting, conventions
2. ตรวจสอบ security policy: secrets, auth, vulnerability disclosure, incident response
3. ตรวจสอบ compliance policy: GDPR, data retention, licensing, data residency
4. ตรวจสอบ data policy: PII handling, retention, deletion, classification
5. ตรวจสอบ release / branching policy: versioning, CHANGELOG, deprecation, breaking changes
6. ตรวจสอบ contribution policy: PR template, issue template, CLA, code of conduct

### Review Process

1. ตรวจสอบ code review workflow: required reviewers, approval count, `CODEOWNERS` integration
2. ตรวจสอบ CI / checks ก่อน merge: lint, typecheck, test, security scan
3. ตรวจสอบ merge criteria: passing checks, review approval, status checks
4. ตรวจสอบ review cadence, stale PR handling, review feedback tracking
5. ตรวจสอบ automation for governance: stale issue / PR, security audit, dependency update

### Maintenance

1. ตรวจสอบ dependency update process
2. ตรวจสอบ technical debt tracking
3. ตรวจสอบ refactoring planning
4. ตรวจสอบ legacy code management
5. ตรวจสอบ deprecation process
6. ตรวจสอบ system health monitoring
7. ตรวจสอบ alert response process
8. ตรวจสอบ audit trails
9. ตรวจสอบ risk assessment

## Severity

- Critical: no governance for critical decisions, missing security/compliance/data policy, no code review requirement, no ownership for critical path, no CI in critical path, no audit trail for critical systems, no alert response process
- High: unclear roles, incomplete ownership, missing coding standards, no CHANGELOG, missing PR template, single reviewer for critical code, missing status checks, no dependency update process, no technical debt tracking
- Medium: outdated owner, informal decision process, policy gaps, inconsistent policy enforcement, stale PR handling missing, no deprecation process, no system health monitoring
- Low: documentation gap, naming convention, minor process improvement, no risk assessment cadence
