---
name: follow-release-deploy-docker
description: Release Docker image — build, tag, push ไป registry พร้อม verify
argument-hint: "[image-tag]"
related:
  - run-release
  - run-check
  - follow-secret-manager
  - resolve-errors
  - learn
---

## Goal

Build และ publish Docker image ไปยัง registry (Docker Hub หรือ GHCR) — tag ถูก convention และ image pull ใช้ได้จริง

## Scope

- ครอบคลุม: `docker build`, `docker tag`, `docker push`, registry auth, post-push verify
- CI automation (workflow สำหรับ auto-release) → ทำตาม parent `/follow-release` Step 4

## Execute

### 1. Verify Image Readiness

> Goal: Dockerfile พร้อม build production image

1. ตรวจ `Dockerfile`: multi-stage build, base image pinned, labels (`org.opencontainers.image.*` ถ้าใช้)
2. ตรวจ `.dockerignore` ครอบคลุม secrets, `node_modules`, build artifacts
3. ระบุ image name และ tag ตาม convention: `<registry>/<owner>/<name>:<version>` + `latest` ถ้าต้องการ

### 2. Authenticate Registry

> Goal: push ได้กับ registry เป้าหมาย

1. Docker Hub: `docker login` ด้วย username + access token
2. GHCR: `docker login ghcr.io` ด้วย `GITHUB_TOKEN` (scope `write:packages`)
3. เก็บ credentials ผ่าน `/follow-secret-manager` — ห้ามใส่ใน scripts/config

### 3. Build And Tag

> Goal: image build สำเร็จและ tag ครบ

1. ทำ `/run-check` ก่อน — code ใน image ต้องผ่าน tests
2. รัน `docker build -t <image>:<version> .`
3. tag เพิ่มตาม convention: `docker tag <image>:<version> <image>:latest` (ถ้าใช้)
4. smoke test image local: `docker run` แล้วเช็ค entrypoint/health ทำงาน

### 4. Push

> Goal: image ขึ้น registry

1. `docker push <image>:<version>` และ tags อื่นที่กำหนด
2. เก็บ image digest จาก push output

### 5. Post-Push Verify

> Goal: image pull ใช้ได้จาก registry

1. pull กลับใน clean context: `docker pull <image>:<version>` แล้วเช็ค digest ตรง
2. verify บน registry UI (Docker Hub หรือ GHCR package page)
3. ถ้า push ผิด → untag/delete บน registry ตาม policy ของ registry นั้นแล้ว `/resolve-errors`
4. สำเร็จ → report tags + digest แล้วทำ `/run-release` ถ้า parent ต้องการ multi-platform release

## Rules

### 1. Immutable Tags

- version tag push แล้วห้าม overwrite — ถ้าต้องแก้ให้ bump version
- `latest` เป็น mutable tag เท่านั้นที่ย้ายได้

### 2. No Secrets In Image

- ห้าม COPY secrets เข้า image หรือ bake ใน layers — ตรวจ `.dockerignore` ทุกครั้ง
- credentials ผ่าน `/follow-secret-manager`

### 3. Docs First

- registry-specific features (provenance, attestations, multi-arch) → ดู official docs ผ่าน `/learn web` แทนการเดา flags

## Expected Outcome

- image อยู่บน registry พร้อม version tag + digest
- pull และ run ได้จริงจาก registry
