---
name: list-deployment-fails
description: สรุป deployment failures จาก CI/CD และ cloud (GitHub Actions, Cloudflare Workers)
argument-hint: "[limit]"
related:
  - list-github-action-fail
  - resolve-all-github-actions-fails
  - resolve-all-cloudflare-worker-fails
  - report-table
  - suggest-next-action
  - watch-github-actions
  - watch-cicd-and-resolve
  - follow-service-vercel
  - follow-service-cloudflare
  - open-cloudflare-workers
---

## Goal

สรุป deployment และ CI/CD failures ทีเกิดขึ้นจาก GitHub Actions และ Cloudflare Workers

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `follow-service-vercel`, `follow-service-cloudflare`, `open-cloudflare-workers`

ใช้สำหรับตรวจสอบ failures ทั้งหมดจาก CI/CD (GitHub Actions) และ cloud deployment (Cloudflare Workers) โดยไม่แก้ไขหรือ re-run อะไร

## Execute

### 1. Verify Authentication

> Goal: ตรวจสอบ auth ของเครื่องมือทีใช้

1. รัน `gh auth status` เพื่อตรวจ GitHub
2. รัน `wrangler --version` เพื่อตรวจ Cloudflare
3. รัน `wrangler whoami` ถ้าต้องการ cloud status
4. ถ้าไม่ authenticated → ทำ `/ask-me` ให้ user login

### 2. List CI/CD Failures

> Goal: รวบรวม GitHub Actions failures

1. ทำ `/list-github-action-fail` เพื่อหา workflow runs ทีล้มเหลว
2. จำกัดจำนวนตาม `limit` (default 50)
3. บันทึก: repo, workflow, branch, commit, event, started at, url

### 3. List Cloud Failures

> Goal: รวบรวม Cloudflare Workers failures

1. ทำ `/resolve-all-cloudflare-worker-fails` เพื่อหา workers ที deploy/health ล้มเหลว
2. จำกัดจำนวนตาม `limit` (default 50)
3. บันทึก: worker, type, latest deployment, status, errors

### 4. Aggregate Failures

> Goal: รวม failures จากทุกแหล่ง

1. รวมข้อมูลจาก CI/CD และ cloud เป็น list เดียว
2. ระบุประเภทแหล่งทีมา: `github-actions` หรือ `cloudflare`
3. เรียงตามเวลาเกิดล่าสุด

### 5. Build Report

> Goal: สรุปผลเป็นตาราง

1. ใช้ `/report-table` คอลัมน์:
   - No.
   - Source
   - Name
   - Status
   - Time
   - URL / Notes
2. แยกสรุปย่อยตามแหล่ง: GitHub Actions count, Cloudflare count
3. ระบุสรุปจำนวน failures ทั้งหมด

### 6. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป

1. ทำ `/suggest-next-action` เพื่อแนะนำ debug, re-run, watch, หรือ fix
2. ถ้ามี failures จาก Cloudflare → แนะนำ `/watch-cicd-and-resolve`
3. ถ้ามี failures จาก GitHub Actions → แนะนำ `/watch-github-actions`

## Rules

### 1. Read Only

- ไม่ re-run, cancel, delete, deploy หรือแก้ไขอะไร
- แค่ query และ report

### 2. Secret Safety

- ไม่ expose tokens, account ID หรือ credentials ใน output
- ใช้ `gh` และ `wrangler` credentials ทีมีอยู่

### 3. Rate Limit

- ถ้ามีข้อมูลมาก ให้ batch และ pagination
- ถ้า API คืน 429 ให้รอและ retry

### 4. Scope

- ครอบคลุม GitHub Actions และ Cloudflare Workers เป็นค่าเริ่มต้น
- ถ้าต้องการแหล่งอื่น เช่น Vercel, Railway ให้ระบุใน argument

## Expected Outcome

- รายการ deployment failures จาก CI/CD และ cloud
- ตารางที sort ตามเวลาเกิดล่าสุด
- ระบุ source, name, status, time, url/notes
- ไม่มีการแก้ไข deployment หรือ workflow ใดๆ
