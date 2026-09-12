---
name: optimize-cost
description: Optimize infra/cloud cost ตาม review-cost findings — rightsizing, waste, egress, idle resources
argument-hint: "[scope]"
related:
  - review-cost
  - optimize-ci
  - use-subagents
  - run-check
  - report
  - suggest-next-action
---

## Goal

ลด infrastructure/cloud cost ตาม findings จาก `/review-cost` — idle resources, over-provisioning, egress, CI minutes, storage waste — พร้อมประมาณ savings จริง

## Scope

ใช้หลัง `/review-cost` มี findings หรือเมื่อต้องการ cost pass — apply changes ที่ปลอดภัยก่อน, เสนอ high-risk changes พร้อม evidence

- ถ้า CI minutes เป็นประเด็น → `/optimize-ci` ทำงานร่วม
- ถ้า scope ใหญ่หลาย services → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Collect Findings And Baseline

> Goal: รู้ว่าเงินหายไปไหน

1. ทำ `/review-cost` หรืออ่าน findings เดิม
2. เก็บ baseline: cost per service/resource, top spenders, trend
3. จัดกลุ่ม: idle waste, over-provisioning, data transfer, storage, CI/CD, licensing

### 2. Kill Idle Waste

> Goal: ไม่จ่ายสิ่งที่ไม่ใช้

1. idle/unattached resources → stop/schedule/delete (dev environments off-hours)
2. orphaned volumes, old snapshots, unused IPs → cleanup พร้อม backup/confirmation
3. auto-scaling schedules สำหรับ non-production

### 3. Right-Size

> Goal: resources ตรง usage จริง

1. over-provisioned compute → ลด size ตาม utilization evidence (CPU/mem <20% sustained)
2. storage tiers — cold data ไป cheaper class
3. managed services → เปรียบเทียบ self-managed/spot ถ้าคุ้ม

### 4. Reduce Transfer And Request Costs

> Goal: egress/per-request costs ลด

1. egress → CDN caching, compression, regional colocation
2. chatty calls → batching, caching, pagination
3. logging/metrics volume → sampling หรือ retention ลดที่ไม่จำเป็น

### 5. Optimize CI/CD Spend

> Goal: ไม่เผา minutes

1. wasted CI runs → path filters, concurrency cancel ตาม `/optimize-ci` findings
2. oversized runners → right-size
3. artifact storage retention → ลดตามจริง

### 6. Verify

> Goal: savings จริงโดยไม่พัง

1. `/run-check` + deploy config valid
2. monitoring ครบ — cost alerts/budgets ตั้งไว้
3. high-risk changes (deletion, downsizing prod) → มี rollback plan

### 7. Report

> Goal: ส่งมอบ

1. ทำ `/report` — savings estimate ต่อ item, changes applied, residual opportunities
2. ทำ `/suggest-next-action`

## Rules

### 1. Evidence-Based Savings

- ทุก change มี utilization/cost evidence — ห้าม downsize ตามความรู้สึก
- ระบุ estimated savings และ confidence ใน report

### 2. No Reliability Trade

- ห้ามลด redundancy/capacity ที่จำเป็นต่อ availability
- prod changes ต้องมี rollback plan + confirmation

### 3. Destructive Safety

- ลบ resources → backup/snapshot + dry-run + user confirmation เสมอ
- ห้าม force-delete resources ที่ไม่แน่ใจว่า idle

## Expected Outcome

- waste ถูกกำจัดพร้อม evidence และ estimated savings
- sizing ตรง usage, transfer costs ลด
- cost alerts/budgets ครบ — ไม่มี surprise bills
