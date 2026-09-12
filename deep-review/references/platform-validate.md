# Validate Findings

## Goal

ตรวจสอบและ validate issues จากทุก section

## Checks

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/deep-validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ตรวจสอบ evidence: file path, line number, และข้อมูลรองรับ
