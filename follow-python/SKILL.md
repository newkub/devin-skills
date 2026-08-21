---
name: follow-python
description: แนวทางการพัฒนาโปรเจกต์ Python ด้วย best practices
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

พัฒนา Python project ด้วย best practices และ Clean Architecture

## Scope

ใช้สำหรับ project ที่พัฒนาด้วย Python 3.11+

## Execute

### 1. Installation

ติดตั้ง Python และ dependencies

> Goal: มี Python environment พร้อมใช้งาน

1. ติดตั้ง Python 3.11+ จาก `https://python.org`
2. ใช้ `pyproject.toml` เป็น single source of truth
3. ติดตั้ง `ruff` สำหรับ lint/format และ `pyright` สำหรับ type checking

### 2. Configuration

ตั้งค่า `pyproject.toml`

> Goal: มี config ครบสำหรับ Python project

1. กำหนด dependencies ใน `[project.dependencies]`
2. กำหนด dev dependencies ใน `[project.optional-dependencies]`
3. กำหนด ruff config ใน `[tool.ruff]`
4. กำหนด pyright config ใน `[tool.pyright]`

### 3. Project Structure

จัดโครงสร้างตาม Clean Architecture

> Goal: โครงสร้าง project เป็น Clean Architecture

1. แบ่งเป็น `domain/`, `application/`, `adapters/`, `presentation/`
2. `domain/` มี pure business logic ไม่มี side effects
3. `application/` มี orchestration layer
4. `adapters/` มี I/O layer
5. `presentation/` มี entry points

### 4. Core Principles

เขียน Python ตาม best practices

> Goal: โค้ดเป็นไปตาม Python best practices

1. ใช้ type hints ทุก function
2. ใช้ `ruff` สำหรับ lint และ format
3. ใช้ `pyright` สำหรับ type checking
4. ใช้ `dataclass` หรือ `pydantic` สำหรับ data models

### 5. Folder Rules

จัดโครงสร้าง folders อย่างเป็นระบบ

> Goal: folders แบ่งตาม responsibility ชัดเจน

1. แยก modules ตาม domain
2. ใช้ `__init__.py` สำหรับทุก package
3. ใช้ `tests/` สำหรับ unit tests

### 6. Import Rules

จัดลำดับ imports อย่างเป็นระบบ

> Goal: imports เรียงลำดับชัดเจน

1. เรียง: stdlib → third-party → local
2. แบ่ง groups ด้วยบรรทัดว่าง
3. ใช้ `from __future__ import annotations` สำหรับ forward references

## Rules

- ใช้ Python 3.11+ พร้อม type hints
- ใช้ `ruff` สำหรับ lint/format, `pyright` สำหรับ type checking
- ใช้ `pyproject.toml` เป็น single source of truth
- จัดโครงสร้างตาม Clean Architecture
- ใช้ `dataclass` หรือ `pydantic` สำหรับ data models

## Expected Outcome

- Python project ใช้ Clean Architecture
- มี `pyproject.toml` พร้อม ruff และ pyright config
- ทุก function มี type hints
- โค้ดผ่าน ruff lint และ pyright type check
