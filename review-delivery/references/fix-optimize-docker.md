# Fix Guide

(merged from: optimize-docker)

## Goal

วิเคราะห์ Dockerfile แล้วลด image size, build time และ attack surface — multi-stage builds, layer ordering, base image ที่เล็กลง และ `.dockerignore` ที่ครบ

## Scope

- ตรวจ `Dockerfile*`, `.dockerignore`, `docker-compose*.yml`
- ครอบคลุม: image size, layer caching, build time, security (non-root, minimal base), reproducibility
- Action-oriented: แก้ Dockerfile จริง — วัดผล size/time ก่อนหลัง

## Execute

### 1. Measure Baseline

> Goal: จับขนาดและเวลาปัจจุบัน

1. `docker build` พร้อมจับเวลา — บันทึก image size (`docker images`)
2. ดู layer breakdown (`docker history` หรือ `dive`)
3. อ่าน `.dockerignore` — flag ถ้าไม่มีหรือไม่ครอบ `node_modules`, `.git`, `*.log`

### 2. Analyze Layers

> Goal: หา layers ที่ใหญ่และ cache ไม่ได้

1. flag: `COPY . .` ก่อน install deps → ทำ cache พังทุกครั้งที่ code เปลี่ยน
2. flag: install tools/build deps ใน final stage ทั้งที่ไม่จำเป็น
3. flag: base image หนัก (`node:latest`, `ubuntu`) ทั้งที่ใช้ `alpine`/`slim`/`distroless` ได้
4. flag: คำสั่ง apt/apk ที่ไม่ clean cache ใน layer เดียวกัน
5. flag: secrets หรือ env ที่ bake เข้า image

### 3. Apply Optimizations

> Goal: แก้ Dockerfile ตาม best practices

1. แปลงเป็น multi-stage: build stage แยกจาก runtime stage
2. เรียง layers: copy manifests → install deps → copy source → build
3. เลือก base image ที่เล็กและ pin version (`node:22-alpine`, `gcr.io/distroless/...`)
4. ใช้ cache mounts (`--mount=type=cache`) สำหรับ package managers
5. เพิ่ม `.dockerignore` ครบ: `.git`, `node_modules`, `*.md`, test dirs
6. รัน non-root user, `HEALTHCHECK` ถ้าเป็น service
7. รวม RUN commands ที่เกี่ยวข้องเป็น layer เดียวและ clean ในคำสั่งเดียวกัน

### 4. Verify

> Goal: ยืนยัน image ทำงานและเล็กลง

1. `docker build` ใหม่ — เทียบ size และ build time กับ baseline
2. ทดสอบ container รันจริง (`docker run`, health check)
3. ใช้ `/report-before-after` แสดง size/time delta

## Rules

### 1. Measure First

- ต้องมี baseline size/time ก่อนแก้
- ทดสอบ container รันจริงหลัง optimize — ไม่ใช่แค่ build ผ่าน

### 2. Security Aware

- ห้าม bake secrets เข้า image — ใช้ build args หรือ runtime env
- final image ต้องไม่มี build tools และรันเป็น non-root ถ้าเป็นไปได้

### 3. Reproducible

- pin base image และ package versions — ไม่ใช้ `latest`
- build ซ้ำต้องได้ image เดิม (deterministic deps install)

## Expected Outcome

- Image เล็กลงและ build เร็วขึ้นพร้อมตัวเลข before/after
- Layer cache ใช้งานได้ — rebuild เมื่อ code เปลี่ยนไม่ต้อง install deps ใหม่
- `.dockerignore` ครบและไม่มี secrets ใน image
