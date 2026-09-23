# Consent Management Validation Rules

## Consent Collection

- Granular consent: consent แยกตาม purpose (marketing, analytics, third-party)
- Purpose-specific: ระบุ purpose ชัดเจน
- Pre-ticked box avoidance: ห้าม pre-ticked box
- Explicit consent: explicit action สำหรับ consent
- ตรวจ collection: มี granular, มี purpose, ไม่มี pre-ticked

## Consent Withdrawal

- Easy withdrawal: withdraw ง่ายเท่ากับให้ consent
- Withdrawal mechanism: มี mechanism ที่ accessible
- Withdrawal effect: หยุด processing ทันทีหลัง withdrawal
- ตรวจ withdrawal: มี mechanism, มี effect

## Consent Record

- Who: user ID, identifier
- When: timestamp, timezone
- What: purpose, scope
- Version: policy version, consent version
- Proof of consent: มี evidence ของ consent
- ตรวจ record: มีครบทุก field, มี proof

## Consent Versioning

- Policy version: ระบุ version ของ privacy policy
- Consent re-collection: re-collect consent เมื่อ policy change
- Version history: มี history ของ consent version
- ตรวจ versioning: มี version, มี re-collection, มี history

## Consent For Minors

- Age verification: verify age ก่อน collect consent
- Parental consent: สำหรับ user ต่ำกว่า age limit (13 GDPR, 16 บางประเทศ)
- Age-appropriate design: design ที่เหมาะสมกับ age
- ตรวจ minors: มี age verification, มี parental consent

## Consent For Marketing

- Opt-in vs opt-out: marketing ใช้ opt-in (GDPR), ไม่ใช้ opt-out
- Unsubscribe: มี unsubscribe ในทุก email
- Frequency: ระบุ frequency, ให้ user เลือกได้
- ตรวจ marketing: มี opt-in, มี unsubscribe, มี frequency control

## Review Checklist

1. ตรวจสอบ consent collection: granular consent, purpose-specific, pre-ticked box avoidance, explicit consent
2. ตรวจสอบ consent withdrawal: easy withdrawal, withdrawal mechanism, withdrawal effect
3. ตรวจสอบ consent record: who, when, what, version, proof of consent
4. ตรวจสอบ consent versioning: policy version, consent re-collection on change, version history
5. ตรวจสอบ consent for minors: age verification, parental consent, age-appropriate design
6. ตรวจสอบ consent for marketing: opt-in vs opt-out, unsubscribe, frequency

## Severity Criteria

- Critical: no consent mechanism, pre-ticked consent, no withdrawal, no consent record, no minor protection
- High: missing granular consent, missing versioning, no unsubscribe, inconsistent consent record, no parental consent
- Medium: suboptimal withdrawal, missing frequency control, incomplete consent record
- Low: documentation gap, minor naming
