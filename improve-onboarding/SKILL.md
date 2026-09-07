---
name: improve-onboarding
description: ปรับ onboarding experience ให้ dev ใหม่ setup project ได้เร็วผ่าน docs และ automation
argument-hint: "[doc-or-step]"
related:
  - check-repo-hygiene
  - report-table
---

## Goal

ปรับ developer onboarding ให้คนใหม่ clone แล้ว run ได้เร็ว — README ที่ครบ, setup automation, prerequisites ชัดเจน และ time-to-first-success สั้น

## Scope

- ตรวจ: `README.md`, `CONTRIBUTING.md`, setup scripts, `.env.example`, devcontainer/mise/asdf configs, docs/ ที่เกี่ยวกับ setup
- ครอบคลุม: prerequisites, install steps, env setup, first-run experience, troubleshooting section, architecture overview
- Action-oriented: แก้ docs/scripts จริง — วัดด้วยการจำลอง onboarding จริง

## Execute

### 1. Simulate Fresh Onboarding

> Goal: เดินตาม docs ปัจจุบันเหมือน dev ใหม่

1. อ่าน README/CONTRIBUTING ตามลำดับ — จดทุก step ที่คาดเดา หรือขาด
2. หา implicit requirements: tools ที่ต้องมีแต่ไม่เขียน (node version, docker, OS-specific)
3. จับเวลาและนับ steps ที่ต้องทำจนถึง "app รันได้" (time-to-first-success)

### 2. Identify Gaps

> Goal: หาสิ่งที่ทำให้ onboarding ช้าหรือพัง

1. Missing: prerequisites, env setup, seed data, troubleshooting
2. Stale: commands/versions ที่ไม่ตรงกับ repo ปัจจุบัน
3. Manual: steps ที่ script ทำแทนได้ (copy .env, install, migrate, seed)
4. Ambiguous: "configure X" โดยไม่บอกว่าอยู่ไหน/ค่าอะไร
5. Undocumented failures: errors ที่เจอบ่อยแต่ไม่มีใน troubleshooting
6. ทำ `/check-repo-hygiene` เพื่อดูไฟล์ essential ที่ขาด

### 3. Apply Improvements

> Goal: แก้ตาม friction ที่เจอ

1. README: prerequisites table (tool + version + install link), copy-paste setup commands, architecture diagram สั้น, common commands
2. Automation: setup script เดียว (`scripts/setup` หรือ `mise tasks`) ที่ทำ install→env→migrate→seed
3. Env: `.env.example` ครบทุก key พร้อม comment แหล่งที่มา/ค่า default
4. Tool versions: pin ผ่าน `mise.toml`/`asdf`/`devcontainer`/`engines` field
5. Troubleshooting: เพิ่ม errors ที่เจอจริงระหว่าง simulate พร้อมวิธีแก้
6. Verify step: เพิ่ม "รัน X แล้วควรเห็น Y" ให้ dev รู้ว่าสำเร็จ

### 4. Verify

> Goal: ยืนยัน onboarding ทำงานจริง

1. ถ้าเป็นไปได้ ทดสอบใน clean environment (fresh clone, container, worktree)
2. ทุก command ใน docs ต้องรันจริงได้ — ไม่ copy จากความจำ
3. ใช้ `/report-table` สรุป: `No.`, `Gap`, `Fix`, `Impact`

## Rules

### 1. Test Every Step

- ทุกคำสั่งใน docs ต้อง verify ว่ารันได้จริง — ห้ามเขียนจากความจำ
- ระบุ OS-specific differences ถ้ามี (Windows/macOS/Linux)

### 2. Minimal Friction

- ลดจำนวน manual steps — automate ที่ทำซ้ำได้
- อย่าเพิ่ม tooling ใหม่ถ้า tools เดิมของ project ทำได้

### 3. Keep Docs Honest

- เขียนเฉพาะสิ่งที่ verify แล้ว — ไม่เขียน features ที่ "จะมี"
- ลบเนื้อหา stale ทันทีเมื่อเจอ

## Expected Outcome

- Dev ใหม่ clone → run ได้ด้วย steps น้อยและชัดเจน
- Setup automation ครอบคลุม install/env/migrate/seed
- README ครบ prerequisites + troubleshooting จริง
