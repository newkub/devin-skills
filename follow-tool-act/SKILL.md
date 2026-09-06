---
name: follow-tool-act
description: ใช้ act (nektos/act) รัน GitHub Actions workflows บน local ก่อน push ลด CI fails
argument-hint: "[workflow-or-job]"
related:
  - follow-tool-github-actions
  - watch-github-actions
  - list-cicd-fails
  - resolve-cicd
  - follow-tool-mise
  - download-program
  - run-check
  - report-table
---

## Goal

ติดตั้งและใช้งาน `act` (nektos/act) เพื่อรัน GitHub Actions workflows บน local machine ก่อน push — ลด CI/CD failures และ debug workflows ได้เร็วขึ้น

## Scope

- ใช้เมื่อต้องการทดสอบ `.github/workflows/*.yml` โดยไม่ต้อง push
- ครอบคลุมการรัน workflow เต็ม, job เดียว, event simulation และ secrets injection
- ใช้ร่วมกับ `/list-cicd-fails` (ดู fails บน remote) และ `/watch-github-actions` (remote)

## Execute

### 1. Install act

> Goal: `act` พร้อมใช้งาน

1. ตรวจ `act --version`
2. ถ้าไม่มี → ติดตั้งตาม `/follow-my-package-manager`: `mise use -g act` ก่อน แล้วค่อย `scoop install act` หรือ `winget install nektos.act`
3. ตรวจ Docker daemon รันอยู่ (`docker info`) เพราะ `act` รัน jobs ใน containers

### 2. Inspect Workflows

> Goal: รู้ว่าจะรันอะไร

1. ตรวจ `.github/workflows/*.yml` ว่ามีอยู่และ syntax ถูกต้อง (YAML parse ได้)
2. รัน `act -l` หรือ `act --list` เพื่อดู jobs ทั้งหมดที่จำลองได้
3. เลือก workflow/job จาก argument หรือ `act -l` output
4. ถ้า job ไม่ชัด → ถาม user ว่าจะรัน workflow ไหน

### 3. Prepare Inputs And Secrets

> Goal: จำลอง event และ secrets ให้ครบ

1. สร้าง event payload ถ้าจำเป็น: `act <event> -e event.json` (pull_request, push, workflow_dispatch)
2. เตรียม secrets ด้วย `-s KEY=value` หรือ `--secret-file .env.act` — ใช้ `/follow-secret-manager` ดึงค่า ห้าม hardcode
3. ใช้ `--var` สำหรับ GitHub variables และ `-W` เลือก workflow file เฉพาะ

### 4. Run Workflow Locally

> Goal: รันและอ่านผล

1. รัน `act <event>` เต็ม workflow หรือ `act <event> -j <job>` เฉพาะ job
2. ใช้ `-n` (`--dryrun`) ก่อนเพื่อดู execution plan โดยไม่รันจริง
3. ใช้ `--container-architecture linux/amd64` บนเครื่อง ARM
4. ถ้า image ใหญ่ → ใช้ `-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest` (medium image)

### 5. Debug Failures

> Goal: หา root cause เมื่อ job fail

1. อ่าน log ของ step ที่ fail — เทียบกับ runner environment จริง
2. ใช้ `-v` (verbose) เมื่อ log ไม่พอ
3. แยกแยะระหว่าง workflow bug กับ act limitation (services, `runs-on` ที่ไม่ใช่ ubuntu, GitHub-specific contexts)
4. ถ้า fail จาก workflow → แก้ `.github/workflows/*.yml` แล้ว re-run
5. ถ้าเป็น act limitation → document และทำ `/watch-github-actions` บน remote แทน

### 6. Report

> Goal: สรุปผลก่อน push จริง

1. ทำ `/report-table` คอลัมน์: `No.`, `Workflow`, `Job`, `Result`, `Duration`, `Note`
2. ระบุ jobs ที่ผ่าน local และความมั่นใจว่าจะผ่าน remote
3. ถ้าผ่านหมด → พร้อม push; ถ้าไม่ → ทำ `/resolve-cicd`

## Rules

### 1. Dry Run First

- รัน `act -n` ก่อนเสมอเพื่อดู plan
- รันเฉพาะ job ที่เปลี่ยน ไม่จำเป็นต้องรันทุก workflow

### 2. Secrets Safety

- ไม่ commit `.env.act` หรือ secrets file — เพิ่มใน `.gitignore`
- ใช้ dummy values สำหรับ secrets ที่ workflow ใช้จริงเท่านั้น
- ไม่ log secret values

### 3. Know The Limits

- `act` ไม่รองรับทุก GitHub features: reusable workflows บาง pattern, OIDC, hosted runner services
- Windows/macOS jobs มักรันไม่ได้ใน container — skip และรันบน remote
- ถ้า act ทำไม่ได้ → fallback ไป `/watch-github-actions`

- ใช้ /follow-tool-github-actions ถ้าจำเป็น
- ใช้ /watch-github-actions ถ้าจำเป็น
- ใช้ /resolve-cicd ถ้าจำเป็น

## Expected Outcome

- `act` ติดตั้งและรัน workflows บน local ได้
- รู้ก่อน push ว่า workflow จะผ่านหรือ fail
- Secrets ถูกจัดการอย่างปลอดภัย ไม่มีการหลุดใน repo
