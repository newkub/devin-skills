---
name: follow-create-docker-optimize-image
description: ลดขนาดและ harden docker image — layer analysis, distroless, security scan
argument-hint: "[image]"
related:
  - follow-create-docker
  - review-security
  - ask-me
---

## Goal

ลด image size และเพิ่ม security posture — วิเคราะห์ layers, เปลี่ยน base, scan vulnerabilities

## Scope

- ใช้หลังมี Dockerfile แล้ว — เชิง optimization
- สร้าง Dockerfile ใหม่ → `subskills/setup-dockerfile`

## Execute

### 1. Analyze Image

> Goal: รู้ว่า size มาจากไหน

1. `docker history <image>` หรือ `dive` ดู layer sizes
2. ระบุ dev deps, build tools, caches ที่หลงเหลือใน final stage

### 2. Optimize

> Goal: image เล็กลงอย่างมีนัยสำคัญ

1. multi-stage: ย้าย build artifacts อย่างเดียวเข้า runtime stage
2. พิจารณา distroless/alpine/slim base ตาม compatibility
3. merge RUN layers, ลบ cache ใน layer เดียวกัน (`--no-cache-dir`, `apt clean`)
4. `.dockerignore` ครบ — context เล็ก

### 3. Harden And Verify

> Goal: image ปลอดภัยและทำงานเหมือนเดิม

1. `docker scout` หรือ `trivy image` scan vulnerabilities
2. non-root user, read-only filesystem ถ้าได้
3. build + run + health check ผ่านเหมือนเดิม

## Rules

- ลด size ห้ามทำ runtime พัง — verify ทุกครั้ง
- ไม่ pin base เป็น `latest` — pin digest/tag version

## Expected Outcome

- image เล็กลงอย่างเห็นได้ชัด, scan ผ่าน, runtime เหมือนเดิม
