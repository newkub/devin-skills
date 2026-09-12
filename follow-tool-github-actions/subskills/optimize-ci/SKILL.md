---
name: follow-tool-github-actions-optimize-ci
description: ปรับ GitHub Actions CI — caching, matrix, concurrency, artifact reuse ให้เร็วขึ้น
argument-hint: "[scope]"
related:
  - follow-tool-github-actions
  - check-bottlenecks
  - run-verify
---

## Goal

ลดเวลาและ cost ของ GitHub Actions workflows — dependency caching, matrix strategy, concurrency groups, artifact reuse — โดยวัดผลก่อนและหลัง

## Scope

ใช้เมื่อ workflows ที่มีอยู่ช้าหรือรันซ้ำซ้อน — ไม่ครอบคลุมการสร้าง workflow ใหม่ (ดู `subskills/setup-workflows/SKILL.md`)

## Execute

### 1. Baseline

> Goal: วัดเวลา CI ปัจจุบันก่อน optimize

1. ดู workflow run history ใน GitHub — บันทึก duration ของ jobs ที่ช้าที่สุด
2. ระบุ steps ที่กินเวลามากสุด: dependency install, build, test — ทำ `/check-bottlenecks` ถ้าต้องวิเคราะห์ลึก
3. ตรวจ cache hit rate ของ `actions/cache` หรือ setup-action caching ที่มีอยู่

### 2. Dependency Caching

> Goal: cache dependencies ให้ install เร็วขึ้น

1. ใช้ `cache` option ของ setup actions เมื่อรองรับ (เช่น `actions/setup-node` มี `cache: npm|pnpm|yarn|bun`) — ดู official docs สำหรับ action ที่ใช้
2. ถ้าต้อง manual: ใช้ `actions/cache` กับ key จาก lockfile hash และ path ของ cache dir ที่ถูกต้อง
3. ใช้ `restore-keys` เป็น fallback เมื่อ lockfile เปลี่ยน
4. ไม่ cache `node_modules` ทั้งโฟลเดอร์ถ้า package manager มี store cache ของตัวเองที่เหมาะกว่า

### 3. Matrix Strategy

> Goal: parallelize ด้วย matrix อย่างมีเหตุผล

1. ใช้ `strategy.matrix` สำหรับ multiple OS/versions เฉพาะเมื่อจำเป็น — matrix ใหญ่เกิน = cost สูง
2. ใช้ `fail-fast: false` เมื่อต้องการเห็นผลทุก combination; `true` เมื่อต้องการ fail เร็ว
3. ใช้ `include`/`exclude` เพื่อตัด combinations ที่ไม่จำเป็น

### 4. Concurrency And Artifact Reuse

> Goal: ลด runs ซ้ำซ้อนและงานซ้ำข้าม jobs

1. ตั้ง `concurrency: ${{ github.workflow }}-${{ github.ref }}` พร้อม `cancel-in-progress: true` สำหรับ CI — cancel runs เก่าเมื่อ push ใหม่
2. ใช้ `actions/upload-artifact` + `actions/download-artifact` เพื่อ share build outputs ข้าม jobs แทน rebuild (เช่น build ครั้งเดียว → test/deploy jobs ใช้ artifact)
3. ใช้ `needs` เพื่อ order jobs — build ก่อน test/deploy
4. ใช้ `paths`/`paths-ignore` filters ใน triggers เพื่อ skip runs เมื่อเปลี่ยนเฉพาะ docs ฯลฯ

### 5. Compare And Report

> Goal: วัดผลหลังแก้เทียบ baseline

1. Trigger runs ใหม่ — compare duration และ cache hit rate กับ step 1
2. ถ้าไม่ดีขึ้นหรือทำ CI พัง → revert จุดนั้นแล้ว report
3. ผ่าน → `/report-before-after` พร้อมตัวเลขจริง

## Rules

### 1. Evidence-Based

- baseline จาก run history จริงก่อนเสมอ — ห้าม optimize โดยไม่มีตัวเลข
- แก้ทีละจุดเรียง impact มาก → น้อย

### 2. Correctness

- preserve behavior — ห้ามลด test coverage หรือข้าม checks เพื่อความเร็ว
- cache keys ต้องรวม lockfile hash — stale cache = broken builds
- artifact reuse ต้องมั่นใจว่า output deterministic — ถ้าไม่ ให้ rebuild

### 3. Cost

- matrix ใหญ่และ fail-fast ปิด = minutes สูง — balance coverage vs cost
- `cancel-in-progress: true` สำหรับ PR workflows; ระวังบน release workflows (อาจ cancel release กลางคัน — ใช้เฉพาะ CI)

- ใช้ /check-bottlenecks ถ้าจำเป็น

## Expected Outcome

- CI duration ลดลงวัดได้จาก run history ก่อน/หลัง
- Dependency cache hit rate สูง
- Concurrency groups ป้องกัน runs ซ้ำซ้อน
- Artifacts reuse ข้าม jobs ลด rebuild
