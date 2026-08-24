---
name: follow-release-docker
description: ตั้งค่า Docker images สำหรับ automated releases
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

ตั้งค่า Docker images สำหรับ automated releases ไปยัง Docker Hub หรือ GHCR

## Scope

Use `follow-release-docker` for the specific tasks and workflows it covers

## Execute

### 1. Setup Docker Configuration
> Goal: Setup Docker Configuration

1. ตรวจสอบ Dockerfile มีข้อมูลครบถ้วน
2. เพิ่ม base image ที่เหมาะสม
3. เพิ่ม labels สำหรับ metadata
4. ตั้งค่า multi-stage build
5. เพิ่ .dockerignore

### 2. Setup Registry
> Goal: Setup Registry

1. สร้าง repository บน Docker Hub หรือ GitHub Container Registry
2. ตั้งค่า registry URL
3. เพิ่ม image name และ tags

### 3. Setup Authentication
> Goal: Setup Authentication

1. สร้าง access token จาก Docker Hub
2. หรือใช้ GITHUB_TOKEN สำหรับ GHCR
3. เพิ่ม DOCKER_USERNAME, DOCKER_PASSWORD ใน environment variables

### 4. Create GitHub Workflow
> Goal: Create GitHub Workflow

1. สร้างไฟล์ .github/workflows/release.yml
2. เพิ่ม permissions: contents write, packages write
3. เพิ่ม environment variables: DOCKER_USERNAME, DOCKER_PASSWORD
4. ตั้งค่า trigger บน push ไป main branch

## Rules

### 1. Docker Configuration

- ต้องมี Dockerfile ที่ valid
- ต้องมี base image ที่เหมาะสม
- ต้องมี labels สำหรับ metadata

### 2. Registry Configuration

- ต้องมี registry URL ที่ valid
- ต้องมี image name และ tags

### 3. Authentication

- ต้องมี DOCKER_USERNAME และ DOCKER_PASSWORD
- สำหรับ GHCR: ต้องมี GITHUB_TOKEN
- token ต้องมีสิทธิ์ push

## Expected Outcome

- Docker configuration ถูกต้อง
- Registry พร้อมใช้งาน
- Docker credentials พร้อมใช้งาน
- Image build และ push อัตโนมัติ
