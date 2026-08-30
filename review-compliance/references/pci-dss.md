# PCI-DSS Validation Rules

## Cardholder Data Handling

- PAN masking: mask PAN แสดงเฉพาะ first 6 และ last 4
- Truncation: ใช้ truncation แทนเก็บ full PAN
- Storage minimization: ไม่เก็บข้อมูลที่ไม่จำเป็น
- No CVV storage: ห้ามเก็บ CVV หลัง authorization
- ตรวจ data: ไม่เก็บ CVV, มี masking, มี minimization

## Network Security

- Firewall config: มี firewall, มี config, มี review
- Network segmentation: CDE แยกจาก corporate network
- CDE isolation: cardholder data environment isolated
- ตรวจ network: มี firewall, มี segmentation, มี isolation

## Access Control

- Unique ID: ทุก user มี unique ID, ไม่ใช้ shared account
- RBAC: role-based access, least privilege
- MFA for CDE: MFA สำหรับ access CDE
- Physical access: physical access control สำหรับ CDE
- ตรวจ access: มี unique ID, มี RBAC, มี MFA

## Encryption

- Strong cryptography: AES-256, RSA-2048+, TLS 1.2+
- Key management: key generation, key storage, key rotation
- Key rotation: rotate key regularly
- TLS for transmission: encrypt cardholder data in transit
- ตรวจ encryption: มี strong crypto, มี key management, มี rotation

## Monitoring

- Audit logs: log ทุก access to cardholder data
- Log review: review log regularly
- File integrity monitoring: FIM สำหรับ critical file
- Intrusion detection: IDS/IPS สำหรับ CDE
- ตรวจ monitoring: มี audit log, มี review, มี FIM, มี IDS

## Vulnerability Management

- Patch management: patch ภายใน 1 เดือน (critical), 3 เดือน (high)
- Vulnerability scan: scan ทุกไตรมาส
- Penetration test: test ปีละครั้ง
- ตรวจ vulnerability: มี patch, มี scan, มี pentest

## Secure Coding

- Secure development: มี secure coding standard
- Change management: มี change management process
- Code review: review code ก่อน deploy
- ตรวจ coding: มี standard, มี change management, มี review

## Review Checklist

1. ตรวจสอบ cardholder data handling: PAN masking, truncation, storage minimization, no CVV storage
2. ตรวจสอบ network security: firewall config, network segmentation, cardholder data environment isolation
3. ตรวจสอบ access control: unique ID, RBAC, MFA for CDE access, physical access
4. ตรวจสอบ encryption: strong cryptography, key management, key rotation, TLS for transmission
5. ตรวจสอบ monitoring: audit logs, log review, file integrity monitoring, intrusion detection
6. ตรวจสอบ vulnerability management: patch management, vulnerability scan, penetration test
7. ตรวจสอบ secure coding: secure development, change management, code review

## Severity Criteria

- Critical: CVV storage, unencrypted PAN, no network segmentation, shared credentials, no audit log, no MFA for CDE
- High: missing MFA, weak encryption, missing vulnerability scan, no file integrity monitoring, no penetration test
- Medium: suboptimal patch management, missing log review, incomplete change management
- Low: documentation gap, minor naming
