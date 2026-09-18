# Validate Findings

ตรวจสอบว่า findings แต่ละอย่างถูกต้อง

## Goal

Findings ถูกต้องและจัดลำดับตาม severity

## Execute

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/deep-validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low

## Expected Outcome

- Findings ที่ผ่านการ cross-reference, type safety, runtime, security, compliance validation
- Findings เรียงตาม severity
- รายการ findings ที่ต้อง re-verify หรือขาด evidence
