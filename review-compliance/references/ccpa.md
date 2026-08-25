# CCPA Validation Rules

## Consumer Rights

- Know: consumer สามารถ request ข้อมูลที่เก็บได้
- Delete: consumer สามารถ request ลบข้อมูลได้
- Opt-out of sale: consumer สามารถ opt-out การขายข้อมูลได้
- Non-discrimination: ไม่ discriminate consumer ที่ exercise right
- ตรวจ rights: มี process สำหรับทุก right, response ภายใน 45 วัน

## Notice At Collection

- Privacy policy: มี privacy policy ที่ accessible
- Categories collected: ระบุ category ที่เก็บ
- Purpose: ระบุ purpose ของการเก็บ
- Retention: ระบุ retention period
- ตรวจ notice: มี notice ก่อนหรือตอนเก็บข้อมูล

## Opt-Out Mechanism

- `Do Not Sell My Personal Information` link: มี link ที่ homepage
- Opt-out signal: รองรับ Global Privacy Control (GPC)
- Opt-out process: process ง่าย, ไม่ require login ถ้าไม่จำเป็น
- ตรวจ opt-out: มี link, มี GPC support, มี process

## Sale Of Data

- Sale definition: ขาย, ให้เช่า, แลกเปลี่ยนข้อมูลเพื่อ consideration
- Third-party sale: ระบุ third party ที่รับข้อมูล
- Service provider exception: service provider ไม่นับเป็น sale
- ตรวจ sale: ระบุ sale activity, มี opt-out

## Verification

- Identity verification: verify identity ก่อน fulfill request
- Authorized agent: รองรับ authorized agent
- Verification method: สำหรับ know/delete, สำหรับ opt-out
- ตรวจ verification: มี process, มี authorized agent support

## Financial Incentive

- Notice: ระบุ financial incentive
- Value: ระบุ value ของ incentive
- Opt-out right: consumer สามารถ opt-out ของ incentive
- ตรวจ incentive: มี notice, มี opt-out

## Severity Criteria

- Critical: no opt-out mechanism, no notice at collection, no consumer right process, selling data without notice, no verification
- High: missing GPC support, incomplete privacy policy, no authorized agent process, missing financial incentive notice
- Medium: suboptimal verification, incomplete notice, missing retention period
- Low: documentation gap, minor naming
