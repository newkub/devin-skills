---
name: optimize-docker
description: หา Docker optimization — image size, layers, cache, multi-stage — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - optimize-bundle
  - improve-iac
  - cleanup-docker
  - deep-review
  - deep-review-then-fix
  - follow-create-docker
  - report-before-after
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "Docker optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-iac` เฉพาะ Docker artifacts เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "Docker image/container ควร optimize อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-iac` (Docker scope) — Dockerfile best practices, image size, layer caching, multi-stage builds, .dockerignore, base image choice, non-root user, healthchecks, compose config
- Dockerfile/compose สร้างใหม่ → `/follow-create-docker`; infra กว้างกว่า container → `/improve-iac`; ล้าง artifacts เก่า → `/cleanup-docker`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-iac` scope Docker — fat images, poor layer ordering (cache busts), missing .dockerignore, root user, missing healthcheck, unpinned base
3. รวบรวม prioritized list พร้อม severity และ evidence — security issues (root, secrets in layers) เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. วัด baseline ก่อนแก้เสมอ — image size + build time เดิม (`docker images`, `docker build --target`)
2. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-iac`) — แก้ทีละจุด impact มาก→น้อย
3. Build ใหม่วัดซ้ำแล้ว `/report-before-after` — ถ้าไม่เล็กลง/เร็วขึ้น → revert
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-iac` (Docker scope)
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- optimize ≠ เปลี่ยน output — container ต้องรันเหมือนเดิม; verify ด้วย container boot + smoke check
- ห้าม pin `latest` — base image ต้อง pinned version/digest
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized Docker optimization list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม before/after image metrics
