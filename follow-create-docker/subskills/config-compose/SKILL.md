---
name: follow-create-docker-config-compose
description: สร้าง docker-compose สำหรับ multi-service — networks, volumes, healthchecks, profiles
argument-hint: "[services]"
related:
  - follow-create-docker
  - follow-secret-manager
  - ask-me
---

## Goal

สร้าง `docker-compose.yml` สำหรับ multi-service stack — networks, volumes, healthcheck dependencies และ env wiring ถูกต้อง

## Scope

- ครอบคลุม compose สำหรับ dev และ production profiles
- Dockerfile ของแต่ละ service → `subskills/setup-dockerfile`

## Execute

### 1. Inventory Services

> Goal: รู้ services ทั้งหมดและ dependencies

1. list services จาก architecture — app, db, cache, queue, proxy
2. ระบุ depends_on ด้วย `condition: service_healthy`
3. แยก dev vs prod profiles (`profiles:`)

### 2. Write Compose

> Goal: compose file ครบและ reproducible

1. networks แยก frontend/backend ตาม boundary
2. named volumes สำหรับ stateful services
3. env ผ่าน `env_file` หรือ `${VAR}` — ห้าม hardcode secrets
4. healthcheck ทุก long-running service

### 3. Verify

> Goal: stack ขึ้นครบ

1. `docker compose config` validate ผ่าน
2. `docker compose up -d` แล้วทุก service healthy

## Rules

- secrets ต้องมาจาก env/`/follow-secret-manager` — ห้าม commit ค่าจริง
- pin image versions — ห้าม `latest`

## Expected Outcome

- `docker-compose.yml` + env example พร้อมใช้ dev/prod
