---
name: follow-run-on
description: ติดตั้ง กำหนดค่า และ validate self-hosted GitHub Actions runners บน AWS ด้วย RunsOn
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

### 1. Prepare Context

> Goal: ตรวจสอบ context และสิทธิ์ก่อนติดตั้ง

1. ตรวจสอบ `aws --version` และ AWS credentials ที่มีสิทธิ์สร้าง CloudFormation stack
2. ยืนยัน GitHub organization/personal account และ RunsOn license key
3. เลือก AWS region เช่น `us-east-1`, `us-west-2`, `eu-west-1`
4. ถ้า context ไม่พร้อม → หยุดและ `/ask-me`

### 2. Deploy RunsOn Stack

> Goal: ติดตั้ง AWS infrastructure สำหรับ RunsOn

1. ใช้ CloudFormation quick-create URL:
   `https://<region>.console.aws.amazon.com/cloudformation/home?region=<region>#/stacks/quickcreate?templateUrl=https://runs-on.s3.eu-west-1.amazonaws.com/cloudformation/template-v3.2.2.yaml&stackName=runs-on`
2. กรอก parameters หลัก: GitHub org, `LicenseKey`, email สำหรับ cost alerts, `Environment` (optional)
3. ถ้า stack fail ด้วย `Unable to assume the service linked role` ให้รัน:
   `aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com`
4. รอ stack status `CREATE_COMPLETE` แล้วบันทึก `RunsOnEntryPoint` output URL
5. ถ้าต้องการ Terraform: ใช้ module `runs-on/runs-on/aws//flex` version `v3.2.2`

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
5. ถ้า workflow fail ให้ทำ `validate` แล้ว `/ask-me`

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

## Expected Outcome

- RunsOn stack ทำงานบน AWS และ GitHub App ลงทะเบียนเรียบร้อย
- `.github/runs-on.yml` และ workflow ถูกต้องตาม Flex/Fleet mode ที่เลือก
- Workflow รันบน self-hosted runner บน EC2 สำเร็จ
- validation logs แสดง instance launch ตาม labels ที่กำหนด
