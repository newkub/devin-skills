---
title: Monorepo Coverage Checks
description: ตรวจ monorepo coverage ว่าทุก workspace ถูกวิเคราะห์และระบุ workspace ในแต่ละ feature
related:
  - review-features
---

## Goal

ตรวจว่า features จากทุก workspace ใน monorepo ถูกวิเคราะห์และระบุ workspace ในแต่ละ feature

## Scope

ใช้ใน Execute step "Check Monorepo Coverage" ของ `review-features` — ตรวจ monorepo coverage เท่านั้น ไม่ตรวจ format หรือ duplication

## Checks

### 1. All Workspaces Analyzed

1. อ่าน workspace list จาก Prepare Context step
2. ตรวจว่า features จากทุก workspace ถูกวิเคราะห์ใน `docs/project/features.md`
3. สำหรับแต่ละ workspace ให้ตรวจ source code areas (routes, modules, schema, API) เหมือน `references/coverage.md`
4. ถ้า workspace ขาดจาก docs → flag เป็น `High`

### 2. Each Feature Specifies Workspace

1. ตรวจว่าแต่ละ feature row ใน `docs/project/features.md` ระบุ workspace ที่เกี่ยวข้อง
2. workspace สามารถระบุใน column `Module` หรือใน domain heading
3. ถ้า feature ไม่ระบุ workspace → flag เป็น `Medium`
4. ถ้าเป็น single-repo (ไม่ใช่ monorepo) → skip check นี้

## Validation Steps

1. ยืนยัน monorepo status จาก `/check-monorepo`
2. ถ้าไม่ใช่ monorepo → บันทึกเป็น `Info` และ skip
3. ถ้าเป็น monorepo ให้รวบรวม workspace list
4. สำหรับแต่ละ workspace ตรวจว่ามี features ใน docs
5. ตรวจว่าแต่ละ feature row ระบุ workspace
6. บันทึก findings พร้อม file path และ evidence

## Severity Mapping

- `High`: workspace ขาดจาก docs ทั้งที่มี source code
- `Medium`: feature ไม่ระบุ workspace ใน monorepo
- `Low`: workspace ระบุไม่ตรงกับ workspace list
- `Info`: ไม่ใช่ monorepo — skip check

## Expected Outcome

- ยืนยันทุก workspace ใน monorepo ถูกวิเคราะห์ใน `docs/project/features.md`
- ยืนยันแต่ละ feature ระบุ workspace ที่เกี่ยวข้อง
- รายงาน findings พร้อม severity และ evidence
