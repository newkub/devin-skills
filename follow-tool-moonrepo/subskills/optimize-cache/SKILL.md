---
name: follow-tool-moonrepo-optimize-cache
description: ปรับ moonrepo cache และ affected targets ให้ build/test เร็วขึ้น
argument-hint: "[scope]"
related:
  - follow-monorepo
  - run-build
  - check-bottlenecks
---

## Goal

เพิ่ม cache hit rate และลดเวลา `moon run` — local/remote cache tuning และ affected-target filtering โดยวัดผลก่อนและหลัง

## Scope

ใช้เมื่อ monorepo ที่ใช้ moonrepo ช้าหรือ cache miss บ่อย — ไม่ครอบคลุม setup/tasks definition (ดู `subskills/setup-moonrepo/SKILL.md` และ `subskills/config-pipeline/SKILL.md`)

## Execute

### 1. Baseline

> Goal: เก็บตัวเลขเดิมก่อน optimize

1. รัน `moon run :build` แบบ cold และจับเวลา
2. รัน warm run ซ้ำ — บันทึกว่า tasks ใด cache hit/miss จาก output
3. ใช้ `moon query` ดู project/task graph เพื่อหา bottlenecks — ทำ `/check-bottlenecks` ถ้าต้องวิเคราะห์ลึก

### 2. Fix Cache Misses

> Goal: ลด cache miss จาก config ที่ไม่แม่น

1. ตรวจ `inputs` ของแต่ละ task — ถ้ากว้างเกินหรือรวมไฟล์ที่เปลี่ยนบ่อย (generated files, timestamps) → จำกัดเฉพาะ source globs ที่ affect output
2. ตรวจ `outputs` ครบถ้วน — miss outputs = artifacts หายเมื่อ cache restore
3. ตรวจ env vars ที่เข้า hash — ย้ายตัวที่เปลี่ยนบ่อยออกจาก inputs/env ที่ hash
4. ทีละจุด — แก้ทีละ key แล้ววัดซ้ำ ห้ามแก้หลายจุดพร้อมกัน

### 3. Remote Cache

> Goal: ตั้งค่า remote cache สำหรับ team/CI

1. moonrepo รองรับ remote caching — ตั้งค่าตาม official docs สำหรับ backend ที่ใช้ (ไม่ invent config keys)
2. เก็บ credentials/tokens ผ่าน `/follow-secret-manager` ห้าม commit
3. ใน CI ให้ pass env vars ที่จำเป็น — verify ด้วย cache hit ข้าม CI runs

### 4. Affected Targets

> Goal: รันเฉพาะสิ่งที่เปลี่ยน

1. ใช้ `moon run :<task> --affected` เพื่อรันเฉพาะ projects ที่เปลี่ยนเทียบ base
2. ใช้ `--base`/`--head` flags เพื่อกำหนด comparison range ใน CI (ดู `moon run --help` สำหรับ flags ล่าสุด)
3. ใช้ `moon query affected` หรือ query ที่เกี่ยวข้องเพื่อ inspect ก่อนรันจริง
4. ใช้ project/task selectors (`moon run <project>:<task>`) สำหรับ scoped runs

### 5. Compare And Report

> Goal: วัดผลหลังแก้เทียบ baseline

1. รัน cold + warm runs ซ้ำ — compare เวลาและ hit rate กับ step 1
2. ถ้าไม่ดีขึ้นหรือ regression → revert จุดนั้นแล้ว report
3. ผ่าน → `/report-before-after` ด้วยตัวเลขจริง

## Rules

### 1. Evidence-Based

- baseline ก่อนเสมอ — ห้าม optimize โดยไม่มีตัวเลขเดิม
- แก้ทีละจุดเรียง impact มาก → น้อย

### 2. Cache Correctness

- preserve behavior — optimize ≠ เปลี่ยน build output
- ไม่ตัด `inputs` ที่ affect output จริงเพื่อเพิ่ม hit rate (stale cache = bug)

### 3. Safety

- credentials ของ remote cache ผ่าน secrets manager เท่านั้น
- ถ้าไม่แน่ใจ option/flag ให้ดู `moon <cmd> --help` หรือ official docs

- ใช้ /check-bottlenecks ถ้าจำเป็น

## Expected Outcome

- Cache hit rate ดีขึ้นวัดได้จากก่อน/หลัง
- Affected-target runs ใช้ใน CI ลดงานที่ไม่จำเป็น
- Remote cache ทำงานข้าม local และ CI (ถ้าตั้งค่า)
