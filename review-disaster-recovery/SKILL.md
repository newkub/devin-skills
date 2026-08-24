---
name: review-disaster-recovery
description: Review disaster recovery: RPO/RTO, backups, restore, runbooks, failover
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---


## Goal

Review disaster-recovery ของ project ครอบคลุม DR plan, backups, restore procedures, runbooks, RPO/RTO, failover, และ resilience พร้อม review score

## Scope

ใช้กับ disaster-recovery ใน project หรือ workspace ที่ต้องการ review สถานะปัจจุบัน โดยไม่แก้ไข code ระหว่าง review

## Execute

### 1. Gather Context

รวบรวม context ก่อน review disaster-recovery

> Goal: เข้าใจ DR setup, dependencies, และ critical services

1. ทำ `/scan-codebase` เพื่อหาไฟล์และ config ที่เกี่ยวข้องกับ disaster-recovery, backup, restore, runbooks
2. ระบุ critical services, databases, storage, และ external dependencies
3. หาเอกสาร DR plan, runbooks, backup schedules, และ incident response ที่มีอยู่
4. ถ้าไม่พบ DR setup หรือ backup ใดๆ -> บันทึก finding Critical และไปที่ `Validate and Report`

### 2. Disaster Recovery Plan Review

ตรวจสอบ DR plan

> Goal: DR plan ครอบคลุม goals, scope, และ recovery objectives

1. ตรวจสอบ RPO/RTO targets: มีการกำหนดต่อ service, วัดผลได้, และสอดคล้องกับ business requirements
2. ตรวจสอบ failover strategy: active-passive vs active-active, trigger condition, failback procedure
3. ตรวจสอบ single points of failure บน critical service: redundancy, replication, geographic distribution
4. ตรวจสอบ DR roles and responsibilities: owner, contact list, escalation path
5. ตรวจสอบ DR testing: test frequency, test scope, test documentation, automated DR test
6. Critical: ไม่มี DR plan, ไม่มี RPO/RTO, ไม่มี failover, single point of failure บน critical service
7. High: RPO/RTO ไม่ชัดเจน, ไม่มี DR testing, ไม่มี contact list, ไม่มี failback procedure

### 3. Backup Review

ตรวจสอบ backup strategy

> Goal: ข้อมูลสำคัญมี backup ที่สมบูรณ์และปลอดภัย

1. ตรวจสอบ backup coverage: databases, files, object storage, config, secrets, source code, infra state
2. ตรวจสอบ backup frequency: สอดคล้องกับ RPO หรือไม่
3. ตรวจสอบ backup type: full, incremental, differential, point-in-time, snapshot
4. ตรวจสอบ backup storage: on-site, off-site, cross-region, immutable, encryption
5. ตรวจสอบ backup retention policy: lifecycle, compliance, cost
6. ตรวจสอบ backup integrity: checksum, verification, corrupted backup detection
7. ตรวจสอบ backup automation: scheduled job, CI/CD, Infrastructure as Code
8. Critical: ไม่มี backup, ไม่มี backup ของ database หลัก, backup ไม่มี encryption, backup ถูกเก็บไว้ในที่เดียวกับ primary
9. High: backup frequency ไม่สอดคล้อง RPO, ไม่มี retention policy, ไม่มี integrity check, ไม่มี cross-region backup

### 4. Restore Review

ตรวจสอบ restore procedures

> Goal: สามารถกู้คืนข้อมูลและ service ได้ตาม RTO

1. ตรวจสอบ restore procedures: step-by-step, มี recovery time estimation, ระบุ prerequisites
2. ตรวจสอบ restore testing: มีการทดสอบ restore เป็นระยะ, มีบันทึกผล, มี rollback plan
3. ตรวจสอบ point-in-time recovery: database logs, snapshots, binlog, WAL
4. ตรวจสอบ cross-region restore: สามารถกู้คืนที่ region อื่นได้
5. ตรวจสอบ dependency restore order: database, cache, storage, external services
6. ตรวจสอบ data consistency หลัง restore: validation, smoke tests, integrity checks
7. Critical: ไม่มี restore procedure, ไม่เคยทดสอบ restore, restore ใช้เวลาเกิน RTO
8. High: restore procedure ไม่สมบูรณ์, ไม่มี point-in-time recovery, ไม่มี validation หลัง restore

### 5. Runbook Review

ตรวจสอบ runbooks และ incident response

> Goal: ทีมสามารถตอบสนองต่อ incident และดำเนินการ recovery ได้

1. ตรวจสอบ disaster-recovery runbook: ขั้นตอนการ failover, failback, restore, rollback
2. ตรวจสอบ incident response runbook: detection, triage, communication, escalation
3. ตรวจสอบ contact list and escalation path: มีการ update ล่าสุด, มี owner ต่อ service
4. ตรวจสอบ dependency map: critical dependencies, ลำดับการกู้คืน, จุดเชื่อมโยงระหว่าง services
5. ตรวจสอบ communication plan: ช่องทางแจ้งเหตุ, ผู้มีส่วนได้ส่วนเสีย, public status page
6. ตรวจสอบ runbook accessibility: สถานที่เก็บ, สามารถเข้าถึงได้ขณะเกิด outage
7. Critical: ไม่มี runbook, ไม่มี contact list, ไม่มี escalation path
8. High: runbook ไม่สมบูรณ์, ไม่มี dependency map, ไม่มี communication plan

### 6. Validate and Report

> Goal: ยืนยัน findings และรายงานผล

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ findings จากทุก section
3. จัดลำดับ findings ตาม severity: Critical -> High -> Medium -> Low
4. คำนวณ review score เป็น percentage 0-100
5. ทำ `/report` พร้อม `/report-table` สร้างตาราง findings
6. ทำ `/suggest-next-action`

## Rules

### 1. Scope

- ทำ review เท่านั้น ไม่แก้ไข code, config, หรือเอกสารระหว่าง review
- ไม่แก้ไขนอก scope disaster-recovery
- ถ้าไม่แน่ใจ -> บันทึกเป็น finding และ `/ask-me`

### 2. Severity

- Critical: ไม่มี DR plan, ไม่มี backup, ไม่มี restore procedure, ไม่มี runbook, single point of failure บน critical service, RPO/RTO non-compliance
- High: ไม่มี RPO/RTO ที่ชัดเจน, ไม่มี DR testing, ไม่มี backup integrity check, ไม่มี point-in-time recovery, ไม่มี cross-region backup, runbook ไม่สมบูรณ์
- Medium: backup frequency ไม่สมบูรณ์, retention policy ไม่ชัดเจน, restore documentation ไม่ update, missing dependency map
- Low: documentation gap, minor backup improvement, minor runbook improvement

### 3. Evidence

- ทุก finding ต้องมี file path หรือเอกสาร reference
- ระบุ RPO/RTO, backup frequency, restore time ที่ขาดหรือไม่สอดคล้อง

### 4. Formatting

- ห้ามใช้ `**` (bold markers) - ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน disaster-recovery findings จากทุก dimension
- Review score
- RPO/RTO gap analysis
- Backup, restore, runbook gap analysis
- Recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

