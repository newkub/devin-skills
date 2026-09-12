---
name: follow-service-run-on-config-run-on
description: ตั้งค่า RunsOn runner definitions ใน runs-on.yml และ workflow labels
argument-hint: "[workflow-or-runner-name]"
related:
  - ask-me
  - deep-validate
  - check-config-drift
  - follow-create-github-action
---

## Goal

ตั้งค่า/แก้ไข RunsOn runner configuration — `.github/runs-on.yml` runner definitions และ `runs-on:` labels ใน workflows — โดย merge กับ config เดิม

## Scope

- ครอบคลุม `.github/runs-on.yml`, `.github-private/.github/runs-on.yml` และ `.github/workflows/*.yml`
- ถ้ายังไม่ได้ deploy stack → ทำ `subskills/setup-run-on/SKILL.md` ก่อน
- ไม่รวม commit/push อัตโนมัติ

## Execute

### 1. Read Current Config

> Goal: รู้ runner config ปัจจุบันก่อนแก้

1. อ่าน `.github/runs-on.yml` และ workflows ที่ใช้ `runs-on:` อยู่แล้ว
2. ทำ `/check-config-drift` ถ้าต้องเทียบ config กับ stack ที่ deploy จริง
3. ถ้าไม่พบ config → ทำ `subskills/setup-run-on/SKILL.md` ก่อน

### 2. Define Runners

> Goal: runner definitions ตรง workload

1. สร้าง/แก้ `.github/runs-on.yml` ใน repo (Flex) เช่น:
   ```yaml
   runners:
     gpu-type1:
       family: ["g4dn", "g5"]
       image: ubuntu24-gpu-x64
       cpu: [4, 16]
       spot: price-capacity-optimized
       extras: ["s3-cache"]
   ```
2. สำหรับ org-wide definitions/warm pools → ใช้ `.github-private/.github/runs-on.yml`
3. เลือก `family`, `image`, `cpu`, `ram`, `spot`, `extras` ตาม workload — ดู official docs ถ้าไม่แน่ใจ

### 3. Update Workflow Labels

> Goal: jobs route ไป runner ที่ถูกต้อง

1. แก้ `runs-on:` ใน `.github/workflows/<file>.yml` เช่น `runs-on: runs-on=${{ github.run_id }}/runner=gpu-type1`
2. ถ้าไม่ใช้ `runs-on.yml` → ระบุ labels ตรง เช่น `runner=2cpu-linux-x64`, `cpu=`, `ram=`, `image=`, `spot=`
3. ใช้ `runs-on=${{ github.run_id }}` เป็น routing key ทุกครั้งเพื่อกัน runner ถูกยึด
4. ถ้าสร้าง workflow ใหม่ → ทำตาม `/follow-create-github-action`

### 4. Validate

> Goal: config ทำงานบน runner จริง

1. trigger `workflow_dispatch` หรือ push commit แล้วดู Actions logs
2. ยืนยัน instance launch ตาม labels และ cost/spot behavior ถูกต้อง
3. ถ้า fail → ทำ `/deep-validate` แล้ว `/ask-me`

## Rules

- แก้เฉพาะ runner definitions/labels ที่จำเป็น — ห้าม rewrite workflows ทั้งไฟล์
- ใช้ `runs-on=${{ github.run_id }}` เสมอใน routing key
- ไม่ commit/push อัตโนมัติ — ให้ user ยืนยัน

## Expected Outcome

- `.github/runs-on.yml` และ workflow labels ถูกต้องตาม Flex/Fleet mode
- workflow รันบน runner ที่กำหนดสำเร็จ
