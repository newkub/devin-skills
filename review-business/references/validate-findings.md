---
name: validate-findings
description: Issues ถูกต้องและจัดลำดับตาม severity
---

# Validate Findings

ตรวจสอบและ validate issues จากทุก section

## Goal

Issues ถูกต้องและจัดลำดับตาม severity

## Checks

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/deep-validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low

