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

## Severity Classification

- Critical: payment data leak, unverified webhook, missing renewal handling, cross-tenant data access, flag crash when off, broken connection, data loss during reconnect, broken unsubscribe, no SPF/DKIM, email injection vulnerability
- High: missing idempotency, incorrect proration, inconsistent tenant propagation, stale flags, missing reconnection, missing bounce handling, broken template, no DMARC
- Medium: suboptimal checkout UX, inconsistent billing cycle, missing per-tenant quota, inconsistent naming, inconsistent connection pattern, missing suppression list, inconsistent template
- Low: minor payment UI improvement, subscription naming convention, tenant naming convention, flag naming convention, cosmetic improvement, minor email improvement

## Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification

