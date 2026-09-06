---
name: optimize-terminal
description: ลดเวลา shell startup — profile profiling, plugin audit และ lazy loading
argument-hint: "[shell]"
related:
  - check-shell-profile
  - use-pwsh-shell
  - use-nu-shell
  - follow-tool-mise
  - report-before-after
---

## Goal

ลด shell startup time — profile ที่ช้า, plugins ที่หนัก, init scripts ที่ blocking — ให้เปิด terminal แล้วพร้อมใช้เร็ว

## Scope

- ครอบคลุม: PowerShell `$PROFILE`, bash/zsh rc files, nushell config, prompt engines (starship/oh-my), tool init (`mise activate`, `zoxide`, completions)
- Action-oriented: แก้ profile จริง — จับเวลาก่อน-หลัง
- ทำ `/check-shell-profile` ก่อนเพื่อ audit — skill นี้คือการแก้ไข

## Execute

### 1. Measure Baseline

> Goal: จับเวลา startup แยกตามส่วน

1. จับ total startup: `Measure-Command { pwsh -NoProfile -Command exit }` vs full profile
2. Instrument profile: เพิ่ม timing marks ต่อ section (`$sw = [Diagnostics.Stopwatch]::StartNew()`)
3. บันทึก per-section times — prompt engine, tool inits, completions, aliases

### 2. Identify Slow Parts

> Goal: หาส่วนที่กินเวลาที่สุด

1. flag: synchronous network calls ตอน init (update checks, remote fetches)
2. flag: heavy completions/module imports ที่โหลดทั้งหมด
3. flag: prompt engines ที่ run subprocess ต่อ render
4. flag: duplicate PATH manipulations, repeated `Get-Command` probes

### 3. Apply Optimizations

> Goal: แก้ตาม impact

1. **Lazy/defer**: ย้าย inits ที่ไม่ต้องการทันที — first-use hooks หรือ background jobs
2. **Cache**: cache ผลของ slow commands (completions, tool versions) พร้อม invalidation
3. **Trim**: ลบ plugins/modules ที่ไม่ใช้จริง — ทำ `/check-shell-profile` findings
4. **Probe once**: รวม `Get-Command`/`Test-Path` checks ไม่ให้ซ้ำ
5. **Async prompt**: ใช้ prompt engine ที่ non-blocking หรือ minimal prompt
6. **Shims**: เช็ค shim overhead (`mise`, `scoop` shims) — ใช้ direct paths สำหรับ tools หนัก

### 4. Verify

> Goal: ยืนยันเร็วขึ้นและไม่พัง

1. เปิด shell ใหม่จริงหลายครั้ง — เทียบเวลา median
2. ทดสอบ commands สำคัญยังทำงาน: aliases, completions, tools ที่ lazy-load
3. `/report-before-after` แสดง startup delta per section

## Rules

### 1. Functionality Preserved

- ทุก feature ที่ defer ต้องพร้อมเมื่อถูกใช้ — lazy loading ต้องไม่ทำคำสั่งพัง
- ทดสอบ interactive use จริง ไม่ใช่แค่จับเวลา

### 2. Measure First

- ต้องมี baseline per-section — ไม่เดาว่าอะไรช้า
- รายงาน median ของหลาย runs

### 3. Cross-Shell Aware

- ตรวจ shell ที่ใช้จริง (pwsh/bash/zsh/nu) ก่อนแก้ — ไม่แก้ profile ที่ไม่ได้ใช้
- เคารพ dotfiles management (chezmoi) ถ้ามี — แก้ที่ source ไม่ใช่ deployed copy

## Expected Outcome

- Shell startup เร็วขึ้นพร้อมตัวเลข per-section
- Slow inits ถูก lazy/cache อย่างถูกต้อง
- ไม่มี functionality ที่หายหรือพัง
