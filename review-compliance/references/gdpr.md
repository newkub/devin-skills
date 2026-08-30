# GDPR Validation Rules

## Lawful Basis (Article 6)

- Consent: user ให้ consent อย่างชัดเจน, สามารถ withdraw ได้
- Contract: จำเป็นสำหรับ contract performance
- Legal obligation: จำเป็นตามกฎหมาย
- Vital interest: ปกป้อง life ของ user
- Public task: ภารกิจสาธารณะ
- Legitimate interest: มี legitimate interest, ไม่ override user right
- ตรวจ basis: ทุก processing activity มี lawful basis ชัดเจน

## Data Subject Rights

- Article 15 (Access): user สามารถ request ข้อมูลตัวเองได้
- Article 16 (Rectification): user สามารถแก้ข้อมูลตัวเองได้
- Article 17 (Erasure): user สามารถ request ลบข้อมูลได้ (right to be forgotten)
- Article 20 (Portability): user สามารถ request ข้อมูลใน machine-readable format ได้
- Article 21 (Objection): user สามารถ object processing ได้
- ตรวจ rights: มี process สำหรับทุก right, response ภายใน 1 เดือน

## Consent Management

- Granular consent: consent แยกตาม purpose
- Consent withdrawal: withdraw ง่ายเท่ากับให้ consent
- Consent record: who, when, what, version
- Consent versioning: re-collect consent เมื่อ policy change
- ตรวจ consent: ไม่มี pre-ticked box, มี withdrawal mechanism

## Privacy By Design (Article 25)

- Data minimization: เก็บข้อมูลน้อยที่สุดที่จำเป็น
- Purpose limitation: ใช้ข้อมูลตาม purpose ที่ระบุ
- Storage limitation: เก็บข้อมูลตามระยะเวลาที่จำเป็น
- Default privacy settings: default เป็น private
- ตรวจ privacy by design: มี implementation ในทุก feature

## DPIA (Article 35)

- High-risk processing: ระบุ high-risk processing activity
- DPIA document: มี DPIA สำหรับ high-risk activity
- DPIA review: review DPIA regularly
- ตรวจ DPIA: มีสำหรับ high-risk activity (large scale, profiling, health data)

## Data Breach Notification (Article 33-34)

- 72-hour notification: notify authority ภายใน 72 ชม.
- Breach detection: มี mechanism สำหรับ detect breach
- Breach record: มี record ของ breach
- User notification: notify user ถ้า high risk
- ตรวจ breach: มี process, มี detection, มี notification

## DPO (Article 37-39)

- DPO requirement: จำเป็นสำหรับ public authority, large scale, regular monitoring
- DPO contact: มี contact point สำหรับ user และ authority
- DPO independence: DPO ไม่มี conflict of interest
- ตรวจ DPO: มี appointment, มี contact

## Review Checklist

1. ตรวจสอบ lawful basis: consent, contract, legal obligation, vital interest, public task, legitimate interest
2. ตรวจสอบ data subject rights: access (Article 15), rectification (Article 16), erasure (Article 17), portability (Article 20), objection (Article 21)
3. ตรวจสอบ consent management: granular consent, consent withdrawal, consent record, consent versioning
4. ตรวจสอบ privacy by design: data minimization, purpose limitation, storage limitation, default privacy settings
5. ตรวจสอบ DPIA: data protection impact assessment, high-risk processing identification
6. ตรวจสอบ data breach notification: 72-hour notification, breach detection, breach record
7. ตรวจสอบ DPO appointment: Data Protection Officer requirement, DPO contact

## Severity Criteria

- Critical: no lawful basis, no consent mechanism, no DSAR process, no breach notification, data minimization violation, no DPO when required
- High: missing consent withdrawal, no DPIA, no privacy by design, incomplete DSAR, no breach detection
- Medium: incomplete consent record, suboptimal privacy settings, missing DPIA review
- Low: documentation gap, minor naming
