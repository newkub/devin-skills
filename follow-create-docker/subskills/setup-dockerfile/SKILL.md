---
name: follow-create-docker-setup-dockerfile
description: สร้าง Dockerfile ที่ production-ready — multi-stage, non-root, layer caching
argument-hint: "[app-type]"
related:
  - follow-create-docker
  - review-docker
  - follow-best-practice
  - ask-me
---

## Goal

สร้าง Dockerfile ที่ถูกต้องตาม ecosystem — multi-stage build, non-root user, layer caching และ image เล็ก

## Scope

- ครอบคลุม Dockerfile สำหรับ app ตาม ecosystem (node/bun, rust, go, python)
- ไม่ครอบคลุม compose orchestration (ใช้ `subskills/config-compose`) หรือ image size tuning เชิงลึก (ใช้ `subskills/optimize-image`)

## Execute

### 1. Detect Ecosystem

> Goal: รู้ base image และ build steps ที่เหมาะ

1. ตรวจ `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml` เพื่อระบุ runtime
2. เลือก slim/distroless base ตาม stack
3. ถ้า runtime ไม่ชัด → `/ask-me`

### 2. Write Dockerfile

> Goal: Dockerfile production-ready

1. multi-stage: build stage แยกจาก runtime stage
2. copy dependency manifests ก่อน source → layer caching
3. non-root `USER`, `HEALTHCHECK` ถ้าเป็น service
4. `.dockerignore` ครอบ `node_modules`, `.git`, build artifacts

### 3. Verify

> Goal: image build ได้และรันจริง

1. `docker build` ผ่านไม่มี warning สำคัญ
2. container start และ health check ผ่าน

## Rules

- ห้าม `latest` tag ใน base image — pin version
- ห้ามรันเป็น root
- ถ้าต้องหลาย services → delegate `subskills/config-compose`

## Expected Outcome

- Dockerfile + `.dockerignore` build ได้และรัน production ได้
