---
name: list-uncommit-unpush-in-drive-d
description: สแกน git projects ใน drive D แล้วแสดง status uncommit/unpush
argument-hint: "[filter]"
related:
  - list-projects-git-in-drive-d
  - check-uncommit
  - report
  - suggest-next-action
---

## Goal

สแกน git projects ทั้งหมดใน drive D แล้วรายงาน status ของแต่ละ repo ว่ามี uncommit หรือ unpush หรือไม่

## Scope

ใช้หลังจาก `/list-projects-git-in-drive-d` เพื่อตรวจสอบสุขภาพของ repositories ใน drive D

## Execute

### 1. List Git Projects

> Goal: ได้รายการ git projects ใน drive D

1. ทำ `/list-projects-git-in-drive-d` เพื่อหา projects ทั้งหมด
2. บันทึก list ไว้เป็น input สำหรับตรวจสถานะ

### 2. Check Each Repo Status

> Goal: ตรวจ uncommit และ unpush

1. วนลูป project แต่ละตัว
2. ถ้าต้องการรายละเอียด uncommit → ทำ `/check-uncommit`
3. ถ้าต้องการรายละเอียด unpush → ทำ `/check-unpush`
4. รัน `git status --short` เพื่อหา uncommit
5. รัน `git log --branches --not --remotes --oneline` เพื่อหา unpush
6. รัน `git branch -vv` เพื่อหา branch ที่ lag behind remote

### 3. Report

> Goal: สรุปสถานะ

1. ทำ `/report` คอลัมน์: `No.`, `Project`, `Path`, `Uncommit`, `Unpush`, `Status`
2. ระบุ repo ที่ต้อง action
3. ทำ `/suggest-next-action`

## Rules

- รองรับทั้ง PowerShell และ Bash
- ข้าม repo ที่ไม่สามารถอ่านได้ แล้วรายงานเป็น warning
- ไม่แก้ไข repo ใดๆ โดยอัตโนมัติ
- ใช้ dry run ก่อนถ้า project จำนวนมาก

## Expected Outcome

- รายการ git projects ใน drive D พร้อม status uncommit/unpush
- รู้ว่า repo ใดต้อง commit, push หรือ sync
