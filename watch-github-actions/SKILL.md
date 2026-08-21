---
name: watch-github-actions
description: รันและตรวจสอบ GitHub Actions จนกว่าจะผ่าน
---

## Goal

รันและตรวจสอบ GitHub Actions จนกว่าจะผ่านทั้งหมม

## Scope

ใช้สำหรับตรวจสอบและรัน GitHub Actions หลังจาก push code

## Execute

### 1. Check Workflows

1. ทำตาม `gh workflow list` เพื่อตรวจสอบว่ามี GitHub Actions ใน repository ไหม
2. ตรวจสอบ workflow ที่ trigger จาก push นี้
3. ทำตาม `gh run list --limit 5` เพื่อดู recent workflow runs

### 2. Watch And Fix

1. ทำตาม `gh run list --limit 1` เพื่อดู recent workflow run
2. ทำตาม `gh run watch <run-id>` เพื่อติดตาม real-time
3. ถ้า workflow ล้มเหลว ให้ทำ `/follow-github-actions` เพื่อแก้ไข
4. ทำตาม `gh run list` เพื่อดูสถานะ runs ทั้งหมด
5. ทำซ้ำจนกว่าทุก workflow ผ่าน

## Rules

### 1. Watch Real-time

ติดตาม workflow แบบ real-time:

- ใช้ `gh run watch` เพื่อติดตาม workflow แบบ real-time
- ตรวจสอบ logs จาก GitHub UI ถ้าจำเป็น

### 2. Fix Failures

แก้ไข workflow ที่ล้มเหลว:

- ใช้ `/follow-github-actions` เพื่อแก้ไข workflow ที่ล้มเหลว
- อ่าน logs อย่างละเอียดเพื่อหา root cause
- แก้ไขและ push ใหม่จนกว่าจะผ่าน

### 3. Loop Until Pass

ต้อง loop จนกว่าทุก workflow ผ่าน:

- ต้อง loop จนกว่าทุก workflow ผ่าน
- ไม่ยอมรับ workflow ที่ล้มเหลว
- ตรวจสอบทุก run ก่อนสิ้นสุด

### 4. Clean Failed Runs

ลบ run ที่ failure ทั้งหมด:

- หลังจาก workflow ผ่านแล้ว ให้ใช้ `gh run list` เพื่อดูสถานะ runs ทั้งหมด
- ใช้ `gh run delete <run-id>` เพื่อลบ run ที่ error
- ลบ run ที่ failure ทั้งหมดเพื่อให้ history สะอาด

## Expected Outcome

- ทุก GitHub Actions ผ่านสำเร็จ
- ไม่มี workflow ที่ล้มเหลวเหลืออยู่
- Repository อยู่ในสถานะ CI/CD ผ่าน
