# PDPA Validation Rules

PDPA = พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Thailand Personal Data Protection Act B.E. 2562)

## Data Controller And Data Processor (Section 4)

- data controller: กำหนด purpose และ means ของ processing
- data processor: ประมวลผลตามคำสั่ง controller
- joint controller: ร่วมกำหนด purpose และ means — ต้องมี arrangement
- data processing agreement (DPA): controller และ processor ต้องมี DPA เป็นลายลัยษักษ์
- ตรวจ role: ระบุ role ของ organization, มี DPA กับทุก processor

## Lawful Basis (Section 24)

- Consent: data subject ให้ consent อย่างชัดเจน
- Contract: จำเป็นสำหรับ contract performance
- Legal obligation: จำเป็นตามกฎหมาย
- Vital interest: ปกป้อง life ของ data subject
- Public task: ภารกิจสาธารณะ
- Legitimate interest: มี legitimate interest ที่ไม่ override สิทธิ data subject
- ตรวจ basis: ทุก processing activity มี lawful basis ชัดเจน

## Sensitive Data (Section 26)

- หมวดข้อมูลอ่อนไหว: race, ethnicity, political opinion, religious/philosophical belief, sexual behavior, health, disability, labor union, genetic, biometric, sex, criminal record
- explicit consent: ต้องได้ explicit consent จาก data subject
- statutory exception: จำเป็นตามกฎหมาย, public interest, ปกป้อง vital interest
- ตรวจ sensitive data: ระบุข้อมูลอ่อนไหว, มี explicit consent หรือ exception, มี safeguard เพิ่มเติม

## Data Subject Rights (Section 30-37)

- Section 30 (Access): data subject สามารถ request ข้อมูลตัวเองได้
- Section 32 (Rectification): data subject สามารถแก้ข้อมูลตัวเองได้
- Section 33 (Erasure): data subject สามารถ request ลบข้อมูลได้
- Section 34 (Portability): data subject สามารถ request ข้อมูลใน machine-readable format ได้
- Section 35 (Objection): data subject สามารถ object processing ได้
- Section 36 (Restriction): data subject สามารถ request จำกัดการประมวลผลได้
- ตรวจ rights: มี process สำหรับทุก right, response ภายใน 30 วันนับแต่วันรับคำขอ

## Consent Management (Section 19-20)

- explicit consent: consent ต้องชัดเจน, แยกตาม purpose
- consent withdrawal: withdraw ง่ายเท่ากับให้ consent
- consent record: who, when, what, version
- consent versioning: re-collect consent เมื่อ policy change
- minor consent (Section 20): ผู้เยาว์ (under 10) ต้องมีผู้ปกครองให้ consent, ผู้เยาว์ (10-15) ต้องมีผู้ปกครองให้ consent ยกเว้น routine activity
- ตรวจ consent: ไม่มี pre-ticked box, มี withdrawal mechanism, มี minor protection

## Privacy Notice (Section 23)

- ให้ privacy notice ก่อนหรือขณะเก็บข้อมูล
- ระบุ: purpose, categories ของข้อมูล, retention period, rights, contact, disclosure purpose
- ภาษาที่เข้าใจได้: ใช้ภาษาง่าย, ไม่ซับซ้อน
- ตรวจ notice: มี privacy notice, ครบถ้วน, เข้าใจได้

## Data Breach Notification (Section 37)

- แจ้ง PDPC: ภายใน 72 ชม. หลังรู้เรื่อง breach
- breach detection: มี mechanism สำหรับ detect breach
- breach record: มี record ของ breach (fact, effect, remedy)
- data subject notification: แจ้ง data subject ถ้ามี high risk ต่อสิทธิและเสรีภาพ
- ตรวจ breach: มี process, มี detection, มี notification ภายใน 72 ชม.

## Cross-Border Transfer (Section 28-29)

- แจ้ง PDPC และได้รับอนุมัติ: สำหรับ transfer ไปยังประเทศที่ไม่ adequate
- adequate protection: ประเทศที่มีกฎหมายคุ้มครอง adequate
- Standard Contractual Clauses (SCC): สัญญาระหว่าง controller/processor
- Binding Corporate Rules (BCR): สำหรับ corporate group
- exception: consent, contract, public interest, vital interest
- ตรวจ transfer: มี mechanism, มี safeguard, มี PDPC approval ถ้าจำเป็น

## DPO (Section 41)

- DPO requirement: จำเป็นสำหรับ public authority, ประมวลผลข้อมูลจำนวนมาก, เฝ้าระวังข้อมูลเป็นประจำ
- DPO contact: มี contact point สำหรับ data subject และ PDPC
- DPO independence: DPO ไม่มี conflict of interest
- ตรวจ DPO: มี appointment, มี contact, มี independence

## Review Checklist

1. ตรวจสอบ data controller และ data processor: ระบุ role, ระบุ joint controller, มี data processing agreement (DPA) ระหว่าง controller และ processor
2. ตรวจสอบ lawful basis (Section 24): consent, contract, legal obligation, vital interest, public task, legitimate interest — ทุก processing activity มี lawful basis
3. ตรวจสอบ sensitive data (Section 26): race, ethnicity, political opinion, religious belief, sexual behavior, health, disability, labor union, genetic, biometric, sex, criminal record — ต้องมี explicit consent หรือ statutory exception
4. ตรวจสอบ data subject rights (Section 30-37): access, rectification, erasure, portability, objection, restriction — มี process สำหรับทุก right, response ภายใน 30 วัน
5. ตรวจสอบ consent management (Section 19): explicit consent, withdrawal mechanism, consent record, consent versioning, minor consent (Section 20 — ผู้เยาว์ต้องมีผู้ปกครองให้ consent)
6. ตรวจสอบ privacy notice (Section 23): มี privacy notice ก่อนหรือขณะเก็บข้อมูล, ระบุ purpose, categories, retention, rights, contact
7. ตรวจสอบ data breach notification (Section 37): แจ้ง PDPC ภายใน 72 ชม. หลังรู้, แจ้ง data subject ถ้ามี high risk, มี breach record
8. ตรวจสอบ cross-border transfer (Section 28-29): แจ้ง PDPC และได้รับอนุมัติ, หรือ adequate protection, หรือ SCC, หรือ BCR, หรือ exception
9. ตรวจสอบ DPO (Section 41): แต่งตั้ง DPO ถ้าเป็น public authority, ประมวลผลข้อมูลจำนวนมาก, เฝ้าระวังข้อมูลเป็นประจำ — มี contact point

## Severity Criteria

- Critical: no lawful basis, no consent mechanism, no sensitive data protection (Section 26), no DSAR process, no breach notification, no privacy notice, cross-border transfer without PDPC approval, no DPA with processor
- High: missing consent withdrawal, no DPO when required, incomplete DSAR, no minor protection (Section 20), missing cross-border safeguard, no breach detection
- Medium: incomplete consent record, suboptimal privacy notice, missing DPIA-equivalent assessment, suboptimal DPO contact
- Low: documentation gap, minor naming, minor notice improvement
