---
name: follow-containerize-app
description: สร้าง container images ด้วย Docker, Podman และ container engines อื่น รองรับ monorepo และ mise
---

## Goal

สร้าง `Dockerfile` หรือ `Containerfile` ที่ปลอดภัย มีขนาดเล็ก และ build เร็ว สำหรับ Docker, Podman และ container engines อื่น รองรับ monorepo และใช้ mise จัดการ tool versions ภายใน container

## Scope

ใช้กับ project ที่ต้อง containerize เป็น image สำหรับ dev, CI หรือ production รองรับ monorepo, multi-stage builds, non-root user, health checks, layer caching และ image publishing

## Execute

### 1. Analyze Project

> Goal: วิเคราะห์ project structure, manifest และ build tool

1. ทำตาม `/check-monorepo` เพื่อตรวจสอบ monorepo
2. อ่าน `package.json`, `Cargo.toml` หรือ manifest ที่เหมาะสม
3. ทำตาม `/follow-package-manifest` เพื่อตรวจ build scripts
4. ทำตาม `/run-build` เพื่อยืนยันว่า build ผ่านก่อน containerize
5. ถ้า build ไม่ผ่าน → แก้ไขก่อน continue

### 2. Select Engine and Base Image

> Goal: เลือก container engine และ base image ที่เหมาะสม

1. ระบุ engine: `docker`, `podman`, `buildah` หรือ `nerdctl`
2. เลือก base image ที่เล็ก เช่น `alpine`, `distroless`, `debian:slim`
3. ใช้ image digest แทน tag ถ้าต้องการ reproducible builds
4. ตรวจสอบ license ของ base image ด้วย `/follow-lib-license-md` ถ้าจำเป็น

### 3. Configure Multi-Stage Build

> Goal: ออกแบบ multi-stage build เพื่อแยก build environment กับ runtime

1. สร้าง `builder` stage ด้วย full toolchain
2. ทำตาม `/follow-tool-mise` เพื่อติดตั้ง tool versions ใน builder stage
3. ทำตาม `/review-delivery` เพื่อลด build output และขนาด image
4. สร้าง `runtime` stage จาก base image ที่เล็ก
5. คัดลอกเฉพาะ build artifacts จาก builder ไป runtime
6. ใช้ non-root user ใน runtime stage

### 4. Optimize Build Context

> Goal: ลด build context ด้วย `.dockerignore` หรือ `.containerignore`

1. ทำตาม `/follow-gitignore` เพื่อหา patterns ที่ควร ignore
2. สร้าง `.dockerignore` หรือ `.containerignore` ที่ root
3. ignore `node_modules`, `.git`, `dist`, `*.log`, `.env`, cache files
4. ถ้าเป็น monorepo ทำตาม `/follow-monorepo` เพื่อระบุเฉพาะ workspace files ที่ต้อง copy
5. ระบุ `COPY` เฉพาะไฟล์ที่จำเป็น

### 5. Create Containerfile

> Goal: เขียน `Dockerfile` หรือ `Containerfile` ตาม best practices

ดู Dockerfile syntax และ supported instructions ใน [references/docker.md](references/docker.md)

1. เรียงคำสั่งจาก least-frequent เปลี่ยน ไป frequent เพื่อ layer caching
2. copy dependency manifests ก่อนแล้ว install ก่อน copy source
3. รวม `RUN` layers ที่เกี่ยวข้อง แต่แยก cache layers ที่เปลี่ยนบ่อย
4. ตั้ง `USER` เป็น non-root โดยใช้ `USER 1000` หรือสร้าง user
5. กำหนด `WORKDIR` และสิทธิ์ที่เหมาะสม
6. ใช้ `HEALTHCHECK` สำหรับ production services
7. ใช้ `EXPOSE` เฉพาะ ports ที่ใช้งานจริง
8. ใช้ `LABEL` สำหรับ metadata (version, license, source)

### 6. Handle Monorepo Context

> Goal: จัดการ build context สำหรับ monorepo

1. ทำตาม `/follow-monorepo` เพื่อเลือก workspace ที่เกี่ยวข้อง
2. ใช้ build arguments หรือ Dockerfile หลายไฟล์ (`apps/<name>/Dockerfile`) ถ้าจำเป็น
3. copy root manifest แล้ว install workspace dependencies
4. copy เฉพาะ package ที่ app ต้องการจาก `packages/<name>`
5. หลีกเลี่ยง copy ทั้ง root ถ้าไม่จำเป็น

### 7. Build and Verify Image

> Goal: build image และตรวจสอบ

ดู CLI commands สำหรับแต่ละ engine ใน [references/docker.md](references/docker.md)

1. รัน `docker build -t <image>:<tag> .` หรือ `podman build -t <image>:<tag> .`
2. ถ้าใช้ buildah: `buildah bud -t <image>:<tag> .`
3. ตรวจสอบ image size ด้วย `docker images` หรือ `podman images`
4. รัน container เบื้องต้นเพื่อทดสอบ
5. ตรวจสอบ `HEALTHCHECK` ทำงานถูกต้อง
6. ตรวจสอบว่า non-root user ทำงานได้

### 8. Publish Image

> Goal: publish ด้วย `/follow-release`

1. ทำตาม `/follow-release` เพื่อตั้งค่า registry, tag และ pipeline
2. ใช้ CI workflow สำหรับ build และ push
3. ใช้ image digest หรือ semver tag
4. ตรวจสอบ image บน registry หลัง push

## Rules

### 1. Base Image Selection

- เลือก base image ที่เล็กและได้รับการดูแล เช่น `alpine`, `distroless`, `debian:slim`
- หลีกเลี่ยง `latest` tag สำหรับ production
- ใช้ image digest เมื่อต้องการ reproducible build
- ตรวจ license ของ base image ด้วย `/follow-lib-license-md` ถ้าจำเป็น

### 2. Multi-Stage Build

- แยก `builder` stage กับ `runtime` stage
- ไม่ copy toolchains หรือ build cache ไป runtime
- ทำตาม `/review-delivery` เพื่อลด output

### 3. Security

- ใช้ non-root user ใน runtime stage
- กำหนด `WORKDIR` และ file permissions ที่เหมาะสม
- ไม่ commit secrets หรือ `.env` ไป image
- ใช้ `.dockerignore` หรือ `.containerignore` ครบถ้วน

### 4. Layer Caching

- copy dependency manifests ก่อน source code
- เรียง `RUN` จาก least-frequent ไป most-frequent
- แยก layers ที่ install dependencies กับ build app
- ใช้ build cache mount เช่น `--mount=type=cache` ถ้า engine รองรับ

### 5. Container Engine Support

ดู engine equivalence table ใน [references/docker.md](references/docker.md)

- รองรับ Docker, Podman, buildah, nerdctl
- ใช้คำสั่ง equivalent ตาม engine
- `Containerfile` ใช้ได้กับ Podman โดย default

### 6. Monorepo Build Context

- copy เฉพาะ workspace ที่ app ต้องการ
- ใช้ `/check-monorepo` และ `/follow-monorepo` ก่อนออกแบบ context
- ลด context size เพื่อลด build time และ layer size

### 7. Health Checks and Labels

- ใช้ `HEALTHCHECK` สำหรับ services ที่ต้อง monitor
- ใช้ `LABEL` สำหรับ version, source, license
- ระบุ `EXPOSE` เฉพาะ ports ที่ใช้งาน

## Expected Outcome

- `Dockerfile` หรือ `Containerfile` ที่ valid พร้อม multi-stage build
- Image เล็กลง, build เร็วขึ้น, ปลอดภัยด้วย non-root user
- `.dockerignore` หรือ `.containerignore` ลด build context
- Image ผ่านการ build, health check และทดสอบรัน
- พร้อม publish ด้วย `/follow-release`
