---
name: report-idea-cleanup-files-in-computer
description: รายงานไอเดียไฟล์และโฟลเดอร์ในเครื่องที่สามารถลบหรือทำความสะอาดได้
---

## Goal

วิเคราะห์และรายงานไฟล์/โฟลเดอร์ในเครื่องที่สามารถลบหรือทำความสะอาดได้ เพื่อช่วยตัดสินใจก่อน cleanup จริง

## Scope

ใช้กับ computer ของผู้ใช้ทั่วไป (ไม่จำกัด workspace) ครอบคลุม package caches, temp files, logs, editor caches, browser caches, และ artifacts เก่า
- เป็น `report-only` ไม่ลบอัตโนมัติ
- ไม่รวมการลบไฟล์ส่วนบุคคล, source code, หรือ secrets

## Execute

### 1. Plan And Confirm Scope

> Goal: เตรียมขอบเขตและความปลอดภัยก่อนเริ่ม

1. ยืนยันกับผู้ใช้ว่า workflow นี้ `report-only`
2. ระบุ scope: home directory, temp, package caches, editor/browser caches, หรือทั้งหมด
3. เลือก OS commands ตาม shell (PowerShell, bash, zsh)
4. ทำ `/list-system-env` เพื่อดู paths หลัก
   - ทำ `/follow-tool-my-global-cli` เพื่อดู CLI tools ที่ติดตั้ง

### 2. Scan System Caches And Temp Files

> Goal: รวบรวม candidates ตามระบบและเครื่องมือที่ติดตั้ง

1. ค้นหา directories ใหญ่ใน home:
   - `~/.cache`, `~/.cargo`, `~/.bun/install/cache`, `~/.pnpm-store`, `~/.npm`
   - `%TEMP%`, `%LOCALAPPDATA%`, `%APPDATA%`
   - `scoop/cache`, `mise cache`, `uv tool dir`, `pip cache`
2. ค้นหา editor/IDE caches:
   - `.nvim-swap`, `nvim-data/swap`, `.codeium`, `.windsurf`
   - `sccache`, `ccache`, `cargo target` ใน home
3. ค้นหา browser caches:
   - Chrome/Edge/Brave/Firefox profile caches
4. ค้นหา logs และ old artifacts:
   - `*.log`, `*.old`, `Downloads/*.exe`, `Downloads/*.zip`
5. ถ้าข้อมูลมาก ∥ ต้อง aggregate ให้ทำ `/use-scripts` เพื่อประมวลผล

### 3. Analyze And Classify

> Goal: จัดกลุ่มและประเมินความปลอดภัยของแต่ละ candidate

1. จัดกลุ่มตาม category: package cache, temp, logs, editor cache, browser cache, old artifacts
2. คำนวณขนาดโดยประมาณของแต่ละ group
3. กำหนดระดับความปลอดภัย:
   - `safe` = temp/cache ที่ปิดโปรแกรมแล้วลบได้
   - `review` = เก่าแต่ต้องเช็คก่อน
   - `risky` = เกี่ยวข้องกับ config หรืออาจมีข้อมูล
4. ตรวจสอบว่ามี process ทำงานอยู่หรือไม่ (ใช้ `Get-Process` หรือ `ps`) สำหรับ cache ที่ active
5. สร้าง suggested cleanup command สำหรับแต่ละ item

### 4. Format Report

> Goal: จัดรูปแบบ report ให้เห็นภาพรวมและรายละเอียด

1. ทำ `/report-table` ด้วย columns:
   - `#`, `Category`, `Path/Pattern`, `Estimated Size`, `Safety`, `Suggested Command`, `Notes`
2. ทำ `/report-file-structure` สำหรับ top 10 directories ที่ใหญ่ที่สุด
3. สรุป:
   - จำนวน candidates
   - ขนาดรวมที่ประหยัดได้
   - รายการ `safe` ที่ลบได้ทันที
   - รายการที่ต้อง review

### 5. Suggest Next Actions

> Goal: นำเสนอทางเลือกถัดไป

1. ทำ `/suggest-next-action` จากรายงาน
2. แนะนำ workflows ที่เหมาะสม:
   - `/remove-unnecessary` สำหรับลบสิ่งที่ไม่จำเป็น
   - `scoop cleanup *`, `mise prune`, `bun pm cache clean`, `pip cache purge`, `sccache --stop-server` + ลบ cache
3. ถ้าผู้ใช้ตอบตกลงจึงค่อยรัน cleanup จริง (ใช้ dry-run ก่อน)

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Report-Only

- ห้ามลบ ย้าย หรือแก้ไขไฟล์อัตโนมัติ
- ทุก suggested command ต้องแสดงให้ผู้ใช้เห็นก่อน
- ถ้าจะลบจริง ต้องได้รับ explicit confirmation จากผู้ใช้

### 2. Safety First

- ไม่แนะนำลบ source code, config files, `.env`, secrets, credentials
- ไม่ลบ cache ที่มี process กำลังใช้งานอยู่
- ใช้ tool-specific cleanup commands เมื่อมี เช่น `scoop cleanup *` แทน `rm -rf scoop/cache`

### 3. Accuracy

- ระบุขนาดโดยประมาณและวิธีคำนวณ
- ระบุสาเหตุว่าทำไมถึงเป็น candidate
- ถ้าไม่แน่ใจ ให้ระบุ `manual review required` ใน `Notes`

### 4. Cross-Platform

- ใช้ commands ตาม OS ที่ตรวจพบ
- Windows: ใช้ PowerShell commands
- macOS/Linux: ใช้ bash/zsh commands
- ใช้ `dua`, `duf`, `ncdu`, `gt5` ถ้าติดตั้ง

## Expected Outcome

- ตารางรายงาน candidates สำหรับ cleanup บนเครื่อง
- ขนาดรวมโดยประมาณที่ประหยัดได้
- ระดับความปลอดภัยของแต่ละรายการ
- คำสั่ง cleanup ที่แนะนำ
- next actions ชัดเจน