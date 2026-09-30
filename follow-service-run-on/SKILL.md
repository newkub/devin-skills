---
name: follow-service-run-on
description: ติดตั้ง กำหนดค่า และ validate self-hosted GitHub Actions runners บน AWS ด้วย RunsOn
argument-hint: "[scope]"
related:
  - ask-me
  - deep-validate
  - git-commit
---

## Goal

ติดตั้งและกำหนดค่า self-hosted GitHub Actions runners บน AWS ด้วย RunsOn ตั้งแต่ AWS stack, IAM, GitHub App, `.github/runs-on.yml` จนถึง validation

## Scope

ใช้สำหรับ:
- ติดตั้ง RunsOn stack บน AWS ด้วย CloudFormation หรือ Terraform
- กำหนดค่า IAM, VPC, GitHub App
- สร้าง/แก้ไข `.github/runs-on.yml` และ `.github/workflows/*.yml`
- validate ว่า runner รันได้จริง
ไม่รวม: การสร้าง AWS account, การซื้อ license, หรือการ commit/push อัตโนมัติ

## Execute

### Workflows

| Topic  | Workflow |
|--------|----------|
| Setup  | `workflows/setup-run-on/SKILL.md` — AWS stack, GitHub App registration |
| Config | `workflows/config-run-on/SKILL.md` — `runs-on.yml` runner definitions, workflow labels |
| Verify | `workflows/verify-connection/SKILL.md` — stack healthy, runners register, labels ตรง |

อ่าน `workflows/<name>/SKILL.md` ตาม topic แล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง

### 1. Prepare Context

> Goal: ตรวจสอบ context และสิทธิ์ก่อนติดตั้ง

1. ตรวจสอบ `aws --version` และ AWS credentials ที่มีสิทธิ์สร้าง CloudFormation stack
2. ยืนยัน GitHub organization/personal account และ RunsOn license key
3. เลือก AWS region เช่น `us-east-1`, `us-west-2`, `eu-west-1`
4. ถ้า context ไม่พร้อม → หยุดและ `/ask-me`

### 2. Deploy RunsOn Stack

> Goal: ติดตั้ง AWS infrastructure สำหรับ RunsOn

หมายเหตุ: template version `v3.3.1` เป็น pinned snapshot — ตรวจ latest template ที่ `https://runs-on.com/installation/` ก่อนใช้งาน (verified 2026-09-12)

1. ใช้ CloudFormation quick-create URL:
   `https://<region>.console.aws.amazon.com/cloudformation/home?region=<region>#/stacks/quickcreate?templateUrl=https://runs-on.s3.eu-west-1.amazonaws.com/cloudformation/template-v3.3.1.yaml&stackName=runs-on`
2. กรอก parameters หลัก: GitHub org, `LicenseKey`, email สำหรับ cost alerts, `Environment` (optional)
3. ถ้า stack fail ด้วย `Unable to assume the service linked role` ให้รัน:
   `aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com`
4. รอ stack status `CREATE_COMPLETE` แล้วบันทึก `RunsOnEntryPoint` output URL
5. ถ้าต้องการ Terraform: ใช้ module `runs-on/runs-on/aws//flex` version `v3.3.1`

### 3. Register GitHub App And Repository

> Goal: เชื่อมต่อ GitHub repo กับ RunsOn

1. เปิด `RunsOnEntryPoint` URL แล้วกด `Register app` เพื่อสร้าง private GitHub App
2. เลือก repositories ที่ให้ app เข้าถึง
3. เปิด `https://github.com/organizations/<org>/settings/actions` เพื่อ enable repository-level self-hosted runners
4. ถ้าต้องการ warm pools หรือ shared runner definitions ให้สร้าง `.github-private/.github/runs-on.yml` ใน org (ไม่บังคับ)

### 4. Configure Runners

> Goal: กำหนดค่า custom runners และ workflow labels

1. สร้าง/แก้ไข `.github/runs-on.yml` ใน repository (Flex) สำหรับ custom runner definitions:
   ```yaml
   runners:
     gpu-type1:
       family: ["g4dn", "g5"]
       image: ubuntu24-gpu-x64
       cpu: [4, 16]
       spot: price-capacity-optimized
       extras: ["s3-cache"]
   ```
2. แก้ไข `.github/workflows/<file>.yml` ให้ใช้ `runs-on` label:
   ```yaml
   jobs:
     build:
       runs-on: runs-on=${{ github.run_id }}/runner=gpu-type1
   ```
3. ถ้าไม่ใช้ `.github/runs-on.yml` ให้ระบุ labels ตรงในค่า `runs-on:`:
   - `runs-on=${{ github.run_id }}` เพื่อป้องกัน runner ถูกยึด
   - `runner=2cpu-linux-x64` หรือ `cpu=`, `ram=`, `family=`, `image=`, `volume=`, `spot=`, `extras=`
4. สำหรับ Fleet ให้ใช้ `runs-on: runs-on/fleet=<fleet-name>/env=<env>`

### 5. Validate Deployment

> Goal: ยืนยันว่า runner ทำงานได้

1. push commit หรือ trigger `workflow_dispatch`
2. ตรวจสอบ GitHub Actions logs ว่างานรันอยู่บน `runs-on` runner
3. ดู AWS EC2 console / CloudWatch logs ว่า instance ถูก launch และ terminate ถูกต้อง
4. ยืนยัน email สำหรับ SNS cost/alert subscription
5. ถ้า workflow fail ให้ทำ `/deep-validate` แล้ว `/ask-me`

## Rules

### 1. AWS And IAM

- ติดตั้ง RunsOn ใน dedicated AWS sub-account เพื่อแยก isolations
- CloudFormation จะสร้าง IAM role ที่จำกัดสิทธิ์สำหรับ service โดยอัตโนมัติ
- ห้าม hardcode `LicenseKey` ลงในไฟล์ skill หรือ source code

### 2. GitHub Actions Integration

- ใช้ `runs-on=${{ github.run_id }}` เป็น routing key ทุกครั้ง
- ใช้ `runner=<name>` เมื่อมี `.github/runs-on.yml`
- ใช้ backticks สำหรับ `commands`, `paths`, และ runner labels

### 3. Configuration Files

- `.github/runs-on.yml` ใช้สำหรับ custom runners ใน Flex
- `.github-private/.github/runs-on.yml` ใช้สำหรับ warm pools และ org-wide runner definitions
- แก้ไข `.github/workflows/*.yml` ด้วย `edit` หรือ `write` ตามสถานการณ์

### 4. Safety

- ถาม user ก่อน deploy stack หรือเปลี่ยนแปลง repo สำคัญ
- ไม่ commit/push อัตโนมัติ ให้ user รันหรือใช้ `git-commit` ตามต้องการ
- ถ้าขาดข้อมูลหรือสิทธิ์ → หยุดและรายงาน

## Merged Details

### config-run-on

##### Goal

ตั้งค่า/แก้ไข RunsOn runner configuration — `.github/runs-on.yml` runner definitions และ `runs-on:` labels ใน workflows — โดย merge กับ config เดิม

##### Scope

- ครอบคลุม `.github/runs-on.yml`, `.github-private/.github/runs-on.yml` และ `.github/workflows/*.yml`
- ถ้ายังไม่ได้ deploy stack → ทำ `workflows/setup-run-on/SKILL.md` ก่อน
- ไม่รวม commit/push อัตโนมัติ

##### Execute

###### 1. Read Current Config

> Goal: รู้ runner config ปัจจุบันก่อนแก้

1. อ่าน `.github/runs-on.yml` และ workflows ที่ใช้ `runs-on:` อยู่แล้ว
2. ทำ `/check-config-drift` ถ้าต้องเทียบ config กับ stack ที่ deploy จริง
3. ถ้าไม่พบ config → ทำ `workflows/setup-run-on/SKILL.md` ก่อน

###### 2. Define Runners

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

###### 3. Update Workflow Labels

> Goal: jobs route ไป runner ที่ถูกต้อง

1. แก้ `runs-on:` ใน `.github/workflows/<file>.yml` เช่น `runs-on: runs-on=${{ github.run_id }}/runner=gpu-type1`
2. ถ้าไม่ใช้ `runs-on.yml` → ระบุ labels ตรง เช่น `runner=2cpu-linux-x64`, `cpu=`, `ram=`, `image=`, `spot=`
3. ใช้ `runs-on=${{ github.run_id }}` เป็น routing key ทุกครั้งเพื่อกัน runner ถูกยึด
4. ถ้าสร้าง workflow ใหม่ → ทำตาม `/follow-create-github-action`

###### 4. Validate

> Goal: config ทำงานบน runner จริง

1. trigger `workflow_dispatch` หรือ push commit แล้วดู Actions logs
2. ยืนยัน instance launch ตาม labels และ cost/spot behavior ถูกต้อง
3. ถ้า fail → ทำ `/deep-validate` แล้ว `/ask-me`

##### Rules

- แก้เฉพาะ runner definitions/labels ที่จำเป็น — ห้าม rewrite workflows ทั้งไฟล์
- ใช้ `runs-on=${{ github.run_id }}` เสมอใน routing key
- ไม่ commit/push อัตโนมัติ — ให้ user ยืนยัน

##### Expected Outcome

- `.github/runs-on.yml` และ workflow labels ถูกต้องตาม Flex/Fleet mode
- workflow รันบน runner ที่กำหนดสำเร็จ

### setup-run-on

##### Goal

ติดตั้ง RunsOn stack บน AWS (CloudFormation/Terraform), register GitHub App และเปิด self-hosted runners ให้ repo — first-time setup

##### Scope

- ครอบคลุม AWS stack, GitHub App registration และ org settings
- ไม่รวมการสร้าง AWS account, การซื้อ license หรือ commit/push อัตโนมัติ
- config runner labels/workflows → `workflows/config-run-on/SKILL.md`

##### Execute

###### 1. Check Prerequisites

> Goal: context และสิทธิ์พร้อมก่อน deploy stack

1. ตรวจ `aws --version` และ AWS credentials ว่ามีสิทธิ์สร้าง CloudFormation stack
2. ยืนยัน GitHub organization/account และ RunsOn license key กับ user
3. เลือก AWS region เช่น `us-east-1`
4. ถ้าขาด context → หยุดและทำ `/ask-me`

###### 2. Deploy AWS Stack

> Goal: RunsOn infrastructure ทำงานบน AWS

1. ใช้ CloudFormation quick-create URL จาก https://runs-on.com/installation/ — ตรวจ latest template ก่อนใช้เสมอ
2. กรอก parameters: GitHub org, `LicenseKey`, email สำหรับ cost alerts
3. ถ้า fail ด้วย `Unable to assume the service linked role` → รัน `aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com`
4. รอ stack status `CREATE_COMPLETE` แล้วบันทึก `RunsOnEntryPoint` output URL
5. เก็บ `LicenseKey` ผ่าน `/follow-secret-manager` — ห้าม commit

###### 3. Register GitHub App

> Goal: repo เชื่อมกับ RunsOn

1. เปิด `RunsOnEntryPoint` URL แล้วกด `Register app` เพื่อสร้าง private GitHub App
2. เลือก repositories ที่ให้ app เข้าถึง
3. เปิด org settings → Actions เพื่อ enable repository-level self-hosted runners

###### 4. Validate

> Goal: runner รันได้จริง

1. สร้าง workflow ทดสอบหรือ trigger `workflow_dispatch` ด้วย `runs-on:` label
2. ตรวจ GitHub Actions logs ว่ารันบน `runs-on` runner และ EC2 instance launch/terminate ถูกต้อง
3. ถ้า fail → ทำ `/deep-validate` แล้ว `/ask-me`

##### Rules

- ถาม user ก่อน deploy stack — เป็น infrastructure change ที่มี cost
- ติดตั้งใน dedicated AWS sub-account เพื่อ isolation
- ห้าม hardcode `LicenseKey` ในไฟล์ใดๆ
- ใช้ official docs https://runs-on.com เป็นแหล่งหลัก

##### Expected Outcome

- RunsOn stack `CREATE_COMPLETE` และ GitHub App register แล้ว
- workflow ทดสอบรันบน self-hosted runner สำเร็จ
- พร้อมไป `workflows/config-run-on/SKILL.md`

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า RunsOn (self-hosted GitHub runners บน AWS) ทำงานจริง — stack healthy, runners register กับ repo/org, workflow labels ตรง

##### Scope

- ใช้เมื่อ `/follow-service-run-on` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ stack หรือ workflows

##### Execute

###### 1. Check AWS Stack

> Goal: RunsOn CloudFormation stack สุขภาพดี

1. `aws cloudformation describe-stacks --stack-name runs-on` — status `CREATE_COMPLETE`/`UPDATE_COMPLETE`
2. flag stack ที่อยู่ใน `*_FAILED` หรือ `ROLLBACK_*` state

###### 2. Check Runner Registration

> Goal: runners register กับ GitHub ได้

1. `gh api repos/{owner}/{repo}/actions/runners` — มี runners online
2. flag: ไม่มี runner, runners offline ทั้งหมด, runner labels ไม่ตรง `runs-on.yml`

###### 3. Check Workflow Labels

> Goal: workflows ใช้ labels ที่ runners รองรับ

1. เทียบ `runs-on:` labels ใน workflows กับ runner definitions ใน `runs-on.yml`
2. flag label ที่ไม่มี runner definition — job จะค้างไม่รัน

###### 4. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `stack-unhealthy` / `no-runners` / `label-mismatch`

##### Rules

- ใช้ describe/list calls เท่านั้น — ห้ามแก้ stack
- label mismatch = common silent failure — flag เสมอ
- stack issues → รายงานให้ setup workflow จัดการ

##### Expected Outcome

- Verdict พร้อม stack status + runner count + label evidence

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `runs-on/runs-on` |
| Registry | `GitHub Releases` |
| Latest Version | `v3.3.1` |
| Release Date | `2026-09-10` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | RunsOn |
| License | `unknown` (commercial product — no SPDX license published on the repo) |
| Repository | `https://github.com/runs-on/runs-on` |
| Website | `https://runs-on.com/` |
| Documentation | `https://runs-on.com/installation/` |
| Releases / Changelog | `https://github.com/runs-on/runs-on/releases` |

##### Install

```bash
#### No package install — deploy the CloudFormation template:
#### https://runs-on.s3.eu-west-1.amazonaws.com/cloudformation/template-v3.3.1.yaml
#### or Terraform module: runs-on/runs-on/aws//flex (version v3.3.1)
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `runs-on/runs-on/aws//flex` | `Terraform Registry` | `v3.3.1` | Alternative Terraform install path (Flex mode) |
| `aws-cli` | `system` | `unknown` | Required for stack deploy and `create-service-linked-role` |

##### Notes

- Breaking changes in latest major: v3.x uses CloudFormation quick-create or Terraform `flex` module; verify the current template version at `https://runs-on.com/installation/` before use
- Version pinned in SKILL.md: `v3.3.1` (template snapshot — updated from `v3.2.3`)

## Expected Outcome

- RunsOn stack ทำงานบน AWS และ GitHub App ลงทะเบียนเรียบร้อย
- `.github/runs-on.yml` และ workflow ถูกต้องตาม Flex/Fleet mode ที่เลือก
- Workflow รันบน self-hosted runner บน EC2 สำเร็จ
- validation logs แสดง instance launch ตาม labels ที่กำหนด
