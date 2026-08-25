# HIPAA Validation Rules

## PHI Handling

- PHI identification: ระบุ protected health information
- Minimum necessary: ใช้ข้อมูลน้อยที่สุดที่จำเป็น
- De-identification: Safe Harbor หรือ Expert Determination
- ตรวจ PHI: มี data classification, มี minimum necessary policy

## Administrative Safeguards (45 CFR 164.308)

- Workforce training: security training สำหรับ workforce
- Access management: role-based access, access review
- Incident response: incident response procedure
- Sanction policy: sanction สำหรับ violation
- ตรวจ admin: มี training, มี access management, มี incident response

## Physical Safeguards (45 CFR 164.310)

- Facility access: physical access control
- Workstation security: workstation policy, screen lock
- Device media controls: device disposal, media disposal
- ตรวจ physical: มี access control, มี workstation policy

## Technical Safeguards (45 CFR 164.312)

- Access control: unique user ID, emergency access, auto logoff
- Audit controls: audit log, audit review
- Integrity: data integrity, alteration detection
- Transmission security: encryption, integrity control
- Encryption: encrypt PHI at rest และ in transit
- ตรวจ technical: มี access control, มี audit, มี encryption

## Business Associate Agreement (BAA)

- Vendor BAA: มี BAA กับทุก vendor ที่ handle PHI
- Subcontractor BAA: vendor ต้องมี BAA กับ subcontractor
- BAA scope: ระบุ scope, term, termination
- ตรวจ BAA: มี BAA กับทุก vendor, มี scope

## Breach Notification (45 CFR 164.404)

- 60-day notification: notify affected individual ภายใน 60 วัน
- HHS notification: notify HHS ภายใน 60 วัน
- Media notification: notify media สำหรับ breach > 500 individual
- ตรวจ breach: มี process, มี timeline

## Notice of Privacy Practices (NPP)

- Content: ระบุ use, disclosure, right, obligation
- Acknowledgment: มี acknowledgment record
- Availability: มี NPP ที่ accessible
- ตรวจ NPP: มี content, มี acknowledgment, มี availability

## Severity Criteria

- Critical: no BAA with vendor, unencrypted PHI, no access control, no audit log, no breach notification, no NPP
- High: missing workforce training, incomplete NPP, no de-identification, missing transmission security, no auto logoff
- Medium: suboptimal access review, missing sanction policy, incomplete audit review
- Low: documentation gap, minor naming
