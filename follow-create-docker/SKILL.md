---
name: follow-create-docker
description: สร้าง Dockerfile, .dockerignore และ docker-compose ตาม best practices ตาม stack
argument-hint: "[path]"
related:
  - follow-my-tech-stack
  - review-techstack
  - follow-deploy
  - setup-cicd
  - follow-secret-manager
  - check-secrets-leak
  - run-check
  - report
---

## Goal

สร้าง Docker artifacts ที่ production-ready สำหรับ project: `Dockerfile`, `.dockerignore`, และ `docker-compose.yml` (ถ้าจำเป็น) ด้วย multi-stage builds, minimal base images และ security best practices

## Scope

- ใช้เมื่อต้องการ containerize application หรือเพิ่ม Docker support ให้ project ที่มีอยู่
- รองรับ Bun/Node, Rust, Go, Python และ static sites
- ครอบคลุม `Dockerfile`, `.dockerignore`, `docker-compose.yml` และ health checks
- ไม่ครอบคลุม Kubernetes manifests หรือ orchestration ระดับ production cluster

## Execute

### 1. Review Tech Stack

> Goal: รู้ stack และ requirements ก่อนเขียน Dockerfile

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review dependencies และ library design
3. ตรวจ manifest: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`
4. ระบุ runtime, build command, start command, port และ required env vars

### 2. Choose Base Image

> Goal: เลือก base image ที่เล็กและปลอดภัย

1. Bun/Node → `oven/bun:<version>-alpine` หรือ `node:<version>-alpine`
2. Rust → `rust:<version>-alpine` build แล้ว copy binary ไป `alpine` หรือ `scratch`/`distroless`
3. Go → `golang:<version>-alpine` build แล้ว copy binary ไป `scratch` หรือ `distroless`
4. Python → `python:<version>-slim` หรือ `alpine`
5. Static site → build stage แล้ว serve ด้วย `nginx:alpine` หรือ `oven/bun` ด้วย static server
6. Pin version เสมอ ห้ามใช้ `latest`

### 3. Write Dockerfile

> Goal: Dockerfile แบบ multi-stage ที่ build เร็วและ image เล็ก

1. แยก build stage และ runtime stage
2. Copy dependency manifests ก่อน (`package.json` + lockfile) เพื่อใช้ layer cache
3. Install dependencies ตาม ecosystem: `bun install --frozen-lockfile`, `cargo build --release`, `pip install -r requirements.txt`
4. Copy source code แล้ว build
5. Runtime stage: copy เฉพาะ artifacts ที่จำเป็น
6. สร้าง non-root user (`USER` directive) ก่อน `CMD`
7. ใส่ `HEALTHCHECK` ถ้า app มี health endpoint
8. ใช้ `CMD` exec form `["binary", "arg"]` ไม่ใช่ shell form

### 4. Write .dockerignore

> Goal: build context เล็กและไม่หลุด secrets

1. เพิ่ม `node_modules`, `target`, `dist`, `build`, `.git`, `.env*`, `*.log`
2. เพิ่ม test files, docs, CI configs ที่ไม่จำเป็นใน image
3. ทำ `/check-secrets-leak` เพื่อยืนยันว่าไม่มี secrets ใน context

### 5. Write docker-compose.yml

> Goal: local orchestration สำหรับ dev ถ้าจำเป็น

1. สร้างเฉพาะเมื่อ app ต้องการ services อื่น (database, cache, queue)
2. ใช้ `services`, `ports`, `environment`, `volumes`, `depends_on` กับ `condition: service_healthy`
3. อ่าน env จาก `.env` ไม่ hardcode secrets — ใช้ `/follow-secret-manager`
4. เพิ่ม `healthcheck` ให้ stateful services

### 6. Build And Verify

> Goal: image build ได้และรันได้จริง

1. รัน `docker build -t <name>:local .` และตรวจ image size
2. รัน `docker run --rm -p <port>:<port> <name>:local` แล้ว smoke test
3. ทำ `/run-check` กับ project ก่อน ship
4. รายงานผลด้วย `/report`: image size, layers, warnings

## Rules

### 1. Image Quality

- Multi-stage build เสมอเมื่อมี compilation step
- Runtime image ต้องไม่มี build tools, source code หรือ lockfiles ที่ไม่จำเป็น
- ใช้ non-root user ใน final image เสมอ
- Pin base image version และ digest สำหรับ reproducibility

### 2. Security

- ไม่ copy `.env` หรือ secrets เข้า image — inject ตอน runtime
- ไม่ `EXPOSE` port ที่ไม่ใช้
- ห้ามรัน container ด้วย `--privileged` หรือ mount docker socket โดยไม่จำเป็น

### 3. Deterministic Builds

- ใช้ lockfile ทุก ecosystem (`--frozen-lockfile`, `--locked`)
- Build ซ้ำด้วย input เดิมต้องได้ image digest เดิม (ถ้า base image pin digest)

### 4. Minimal Changes

- ถ้า project มี Dockerfile อยู่ → ปรับปรุงเดิม ไม่ rewrite ทั้งไฟล์
- ไม่เพิ่ม docker-compose ถ้า app รันได้ด้วย container เดียว

- ใช้ /follow-deploy ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## Expected Outcome

- `Dockerfile` multi-stage build ผ่านและ image มีขนาดเหมาะสม
- `.dockerignore` ครบและไม่มี secrets ใน build context
- `docker-compose.yml` (ถ้าสร้าง) รัน services ครบพร้อม healthcheck
- Container รันได้ด้วย non-root user และผ่าน smoke test
