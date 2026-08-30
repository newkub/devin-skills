---
name: list-ci-configs
description: รายการ CI/CD config files ใน repository แบบ read-only
related:
  - watch-ci-and-resolve
  - watch-github-actions
  - list-github-action-fail
  - report-config-files
  - review-config
  - review-delivery
  - report-table
  - check-reference
---

## Goal

รายการ CI/CD config files ที่มีอยู่ใน repository เพื่อ detect platform, verify config files, และ report เป็นตาราง โดยไม่แก้ไขไฟล์

## Scope

ใช้สำหรับตรวจสอบว่า repository มี CI/CD configuration ของ platform ใดบ้าง รองรับ GitHub Actions, GitLab CI, Azure DevOps, CircleCI, Jenkins

## Execute

### 1. Detect CI Config Files

> Goal: หา config files ทั้งหมด

1. ใช้ `find_file_by_name` pattern `.github/workflows/*.yml` ใน repo
2. ใช้ `find_file_by_name` pattern `.github/workflows/*.yaml` ใน repo
3. ใช้ `find_file_by_name` pattern `.gitlab-ci.yml` ใน repo
4. ใช้ `find_file_by_name` pattern `azure-pipelines.yml` ใน repo
5. ใช้ `find_file_by_name` pattern `.circleci/config.yml` ใน repo
6. ใช้ `find_file_by_name` pattern `Jenkinsfile` ใน repo
7. ถ้าไม่พบไฟล์ใด ๆ → report ว่าไม่มี CI config

### 2. Identify Platforms

> Goal: ระบุ CI/CD platform จาก config files

1. ถ้ามี `.github/workflows/*.yml` หรือ `.github/workflows/*.yaml` → GitHub Actions
2. ถ้ามี `.gitlab-ci.yml` → GitLab CI
3. ถ้ามี `azure-pipelines.yml` → Azure DevOps
4. ถ้ามี `.circleci/config.yml` → CircleCI
5. ถ้ามี `Jenkinsfile` → Jenkins
6. ถ้ามีหลาย platform ให้เรียงลำดับตามข้อ 1 ถึง 5

### 3. Validate Config Files

> Goal: ตรวจสอบว่า config files สมบูรณ์เบื้องต้น

1. อ่านแต่ละ config file เพื่อตรวจ syntax เบื้องต้น
2. ถ้าเป็น YAML → ตรวจหา syntax error ด้วย `grep` หรือ tools ทีเหมาะสม
3. บันทึก `Status` เป็น `valid`, `invalid`, หรือ `unknown`
4. ไม่แก้ไข config file

### 4. Build Report

> Goal: สรุปผลเป็นตาราง

1. ใช้ `/report-table` ด้วยคอลัมน์:
   - `No.`
   - `Platform`
   - `Config File`
   - `Status`
   - `Notes`
2. เรียงตามลำดับ platform ตาม `### 2`
3. ทำ `/suggest-next-action`

## Rules

### 1. Read Only

- ไม่แก้ไข config files
- ไม่ trigger CI/CD pipeline
- ไม่ push code

### 2. Platform Detection

- ตรวจจากไฟล์จริง ไม่เดา
- ถ้ามีหลาย platform ให้ระบุทั้งหมด
- ถ้าไม่มี config ให้ report ชัดเจน

### 3. Safety

- ไม่ expose secrets ใน config files
- ถ้า config file มี credential ให้รายงานว่าควรใช้ `/follow-secret-manager` หรือ `/check-secrets-leak`
- ห้าม share เนื้อหา config ไปยัง external services โดยไม่จำเป็น

### 4. Concise

- ไม่ list เนื้อหา config ทั้งหมด
- ระบุแค่ platform, file path, status และ notes สั้น ๆ

## Expected Outcome

- รายการ config files ใน repo ทีพบ
- ระบุ platform ชัดเจน
- report เป็นตาราง 3–5 คอลัมน์
- ไม่มีการแก้ไข repo
- มี next action ผ่าน `/suggest-next-action`
