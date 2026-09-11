# review-compliance — Full Dimension Checklist

## 1. Privacy Regulations (GDPR/CCPA/PDPA)

- [ ] lawful basis, consent management (granular, withdrawable)
- [ ] DSAR: access, portability, rectification, erasure workflows
- [ ] data retention/deletion schedules, right-to-be-forgotten
- [ ] privacy notice, cookie consent, DPO contact
- [ ] cross-border transfer mechanisms (SCCs, adequacy)

## 2. Healthcare/Finance (HIPAA/PCI-DSS/SOC2)

- [ ] HIPAA: PHI handling, BAA, audit controls, minimum necessary
- [ ] PCI-DSS: cardholder data scope, no PAN storage, SAQ level
- [ ] SOC2: trust criteria evidence, access reviews, change mgmt

## 3. Data Governance

- [ ] data inventory/classification (PII/PHI/PCI)
- [ ] data lineage, processing records (RoPA)
- [ ] third-party/vendor assessment, DPAs
- [ ] encryption at rest/in transit, key management

## 4. Audit And Accountability

- [ ] audit logs: who/what/when, tamper-evident
- [ ] access reviews, least privilege evidence
- [ ] incident response + breach notification timeline (72h GDPR)
- [ ] vendor/subprocessor list current

## 5. Accessibility/Other

- [ ] ADA/WCAG compliance (เชื่อม `/review-accessibility`)
- [ ] COPPA/age gates ถ้าเกี่ยวข้อง
- [ ] export controls, sanctions ถ้าเกี่ยวข้อง

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
