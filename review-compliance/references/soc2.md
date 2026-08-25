# SOC2 Validation Rules

## Security Criteria (Common)

- Access control: unique ID, RBAC, MFA, access review
- Network monitoring: intrusion detection, network monitoring
- Vulnerability management: patch, scan, pentest
- ตรวจ security: มี access control, มี monitoring, มี vulnerability management

## Availability Criteria

- Performance monitoring: monitor uptime, latency, throughput
- Incident response: มี incident response process
- Backup recovery: มี backup, มี recovery test
- Capacity planning: มี capacity monitoring, มี planning
- ตรวจ availability: มี monitoring, มี incident response, มี backup, มี capacity

## Processing Integrity Criteria

- Input validation: validate input ก่อน process
- Processing accuracy: ตรวจสอบ accuracy ของ processing
- Error handling: มี error handling, มี reconciliation
- Reconciliation: reconcile data ระหว่าง system
- ตรวจ integrity: มี validation, มี accuracy check, มี reconciliation

## Confidentiality Criteria

- Data classification: classify data (public, internal, confidential, restricted)
- Encryption: encrypt confidential data
- NDA: มี NDA กับ employee, vendor
- Data disposal: มี secure disposal process
- ตรวจ confidentiality: มี classification, มี encryption, มี NDA, มี disposal

## Privacy Criteria

- Notice: มี privacy notice
- Consent: มี consent mechanism
- Choice: มี opt-out, opt-in
- Collection: ระบุ collection purpose
- Use: ใช้ข้อมูลตาม purpose
- Retention: มี retention policy
- Disposal: มี disposal process
- Disclosure: ระบุ disclosure to third party
- ตรวจ privacy: มี notice, มี consent, มี choice, มี retention, มี disposal

## Control Monitoring

- Control testing: test control regularly
- Control exception: ระบุ exception, ระบุ remediation
- Remediation plan: มี plan, มี owner, มี due date
- ตรวจ monitoring: มี testing, มี exception tracking, มี remediation

## Severity Criteria

- Critical: missing access control, no incident response, no backup, no encryption, no privacy notice, no NDA
- High: missing monitoring, incomplete control documentation, no remediation tracking, missing data classification
- Medium: suboptimal capacity planning, incomplete reconciliation, missing disposal process
- Low: documentation gap, minor naming
