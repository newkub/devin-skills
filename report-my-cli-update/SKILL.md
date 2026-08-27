---
name: report-my-cli-update
description: รายงานอัปเดต CLI tools ที่ติดตั้งในเครื่องรายสัปดาห์
---

## Goal

รวบรวมและสรุปข่าวสารและอัปเดตของ CLI tools ที่ติดตั้งในเครื่อง (mise, scoop, winget) ประจำสัปดาห์ เพื่อให้ผู้ใช้ติดตามการเปลี่ยนแปลงและอัปเดตที่สำคัญ

## Scope

ครอบคลุมการตรวจสอบและรวบรวมอัปเดตจาก:
- CLI tools ที่ติดตั้งด้วย mise
- Packages ที่ติดตั้งด้วย scoop
- Apps ที่ติดตั้งด้วย winget
- Release notes และ changelogs ของแต่ละ tool

## Execute

### 1. Check Installed CLI Tools

> Goal: ตรวจสอบ CLI tools ที่ติดตั้งในเครื่อง

1. ทำ `/follow-my-global-cli` เพื่อเช็ค tools ที่ติดตั้งทั้งหมด
2. รัน `mise list` เพื่อดู tools ที่ติดตั้งด้วย mise
3. รัน `scoop list` เพื่อดู packages ที่ติดตั้งด้วย scoop
4. รัน `winget list` เพื่อดู apps ที่ติดตั้งด้วย winget
5. รวบรวมรายการ tools ทั้งหมดพร้อมเวอร์ชันปัจจุบัน

### 2. Check For Updates

> Goal: ตรวจสอบอัปเดตที่มีอยู่

1. รัน `mise outdated` เพื่อเช็ค mise tools ที่มีอัปเดต
2. รัน `scoop status` เพื่อเช็ค scoop packages ที่มีอัปเดต
3. รัน `winget upgrade` เพื่อเช็ค winget apps ที่มีอัปเดต
4. รวบรวมรายการ tools ที่มีอัปเดตพร้อมเวอร์ชันใหม่

### 3. Research Release Notes

> Goal: ค้นหา release notes และ changelogs

1. ทำ `/deep-research` สำหรับ tools ที่มีอัปเดตสำคัญ
2. ค้นหา release notes ด้วย `search_web` ใช้ query `<tool-name> release notes <version>`
3. ใช้ `mcp7_list_releases` สำหรับ repositories ของ tools ที่ติดตาม
4. ใช้ `read_url_content` สำหรับอ่าน changelogs ที่น่าสนใจ
5. ระบุ breaking changes และ features ใหม่ที่สำคัญ

### 4. Categorize Updates

> Goal: จัดกลุ่มอัปเดตตามประเภท

1. จัดกลุ่มตาม package manager: mise, scoop, winget
2. จัดลำดับตาม impact: Breaking Changes, New Features, Bug Fixes, Security
3. ระบุ tools ที่ต้องอัปเดตด่วน (security patches, breaking changes)
4. ระบุ tools ที่อัปเดตได้ปกติ

### 5. Compile Report

> Goal: สร้างรายงานอัปเดตรายสัปดาห์

1. ทำ `/report-table` สร้างตารางอัปเดต
2. กำหนด columns: No., Tool, Manager, Current Version, Latest Version, Impact, Summary
3. จัดกลุ่มตาม package manager และจัดลำดับตาม impact
4. เพิ่ม summary สั้นๆ สำหรับแต่ละอัปเดต
5. ทำ `/report` สร้าง executive summary พร้อม top highlights

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้คอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... โดย headers ชัดเจน จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Update Categories

- Breaking Changes: อัปเดตที่อาจกระทบการใช้งานปัจจุบัน
- New Features: ฟีเจอร์ใหม่ที่น่าสนใจ
- Bug Fixes: แก้ไขบั๊กที่สำคัญ
- Security: แก้ไขช่องโหว่ด้านความปลอดภัย
- จัดลำดับความสำคัญ: Security > Breaking Changes > New Features > Bug Fixes

### 2. Source Selection

- ใช้ `mise outdated`, `scoop status`, `winget upgrade` สำหรับเช็คเวอร์ชัน
- ใช้ `search_web` สำหรับค้นหา release notes
- ใช้ `mcp7_list_releases` สำหรับ GitHub release tracking
- ใช้ `read_url_content` สำหรับอ่าน full changelogs
- ทำตาม `/follow-my-global-cli` สำหรับ tool selection rules

### 3. Freshness Requirements

- ตรวจสอบเฉพาะอัปเดตที่เกิดขึ้นในสัปดาห์นี้หรือสัปดาห์ที่แล้ว
- ใช้ query ที่ระบุปีและสัปดาห์ เช่น `<tool-name> release July 2026`
- ตรวจสอบ release dates ของทุก item
- ทำตาม `/deep-research` Rules ข้อ 6 Information Freshness

### 4. Report Format

- ใช้ `/report-table` สำหรับ structured output
- จัดกลุ่มตาม package manager และจัดลำดับตาม impact
- ใช้ `/report` สำหรับ executive summary
- สรุป top 5 highlights ของสัปดาห์

## Expected Outcome

- รายงานอัปเดต CLI tools ประจำสัปดาห์
- ข่าวจัดกลุ่มตาม package manager และจัดลำดับตาม impact
- Breaking changes และ security updates ถูกระบุชัดเจน
- Executive summary พร้อม top highlights
- สามารถใช้เป็น weekly briefing สำหรับผู้ใช้
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน