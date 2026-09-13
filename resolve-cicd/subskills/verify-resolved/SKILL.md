---
name: resolve-cicd-verify-resolved
description: ยืนยัน CI/CD กลับมา green หลัง resolve — re-run/watch workflow จนยืนยันผลจริง
argument-hint: "[--repo <owner/repo> | --run-id <id>]"
related:
  - use-gh-cli
  - use-wrangler
  - report
---

## Goal

ยืนยันหลัง `/resolve-cicd` ว่า pipeline กลับมา green จริงบน remote — ไม่ใช่แค่ local fix ผ่าน

## Scope

- ใช้เมื่อ parent dispatch มาที่ `verify` หรือเรียกหลัง resolve CI/CD failure
- ครอบคลุม: re-run status, all jobs green, deploy target healthy
- Read-only: watch/ตรวจสอบ — ไม่แก้ไข

## Execute

### 1. Trigger Or Watch Re-Run

> Goal: ได้ผล run ใหม่จาก remote

1. ถ้า fix commit แล้ว → run ใหม่ auto-trigger — watch ด้วย `gh run watch` หรือ `gh run list`
2. ถ้าไม่ auto-trigger → `gh run rerun <run-id>` (หรือ `--failed` สำหรับ failed jobs เท่านั้น)
3. รอจน run complete — อย่า verdict ก่อน run จบ

### 2. Verify All Jobs Green

> Goal: ไม่ใช่แค่ job ที่ fail — ทุก job ผ่าน

1. `gh run view <run-id>` — ทุก job เป็น `success`
2. flag jobs ที่ skip/cancel โดยไม่ตั้งใจ
3. ถ้า job ใหม่ fail → verdict `not-resolved` พร้อม logs pointer

### 3. Verify Deploy Target

> Goal: CD side สำเร็จถ้ามี deploy

1. Cloudflare: `wrangler deployments list` — deployment ใหม่ active
2. อื่นๆ: ตรวจ deploy step ใน run + target URL ตอบกลับ
3. ถ้า deploy target unhealthy → verdict `degraded`

### 4. Report

> Goal: สรุป pipeline status

1. ใช้ `/report` คอลัมน์: `No.`, `Job/Check`, `Result`, `Evidence`
2. Verdict: `green` / `not-resolved` / `degraded` พร้อม run URL

## Rules

- verdict ต้องอิง remote run ล่าสุด — local pass ไม่พอ
- ถ้า re-run fail → report กลับให้ `/resolve-cicd` loop ต่อ — ไม่แก้เอง
- ระบุ run URL + commit sha ในรายงานเสมอ

## Expected Outcome

- Verdict จาก remote run จริง พร้อม run URL
- รายการ jobs/deploys ที่ยังไม่ green ถ้ามี
