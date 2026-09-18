---
name: detect-project-status
description: รู้ context ก่อนเลือก stakeholder
---

# Detect Project Status

## Goal

รู้ context ก่อนเลือก stakeholder

## Checks

1. อ่าน `package.json`, `Cargo.toml`, `pyproject.toml`, `moon.yml`, `README`, `AGENTS.md`
2. ทำ `/scan-codebase` หรือ `find_file_by_name` เพื่อหา stack และ boundaries
3. ระบุ project type: web app, mobile, library, CLI, data platform, marketplace
4. ระบุ maturity: MVP, growth, enterprise, open source, internal
5. ระบุ critical domains: payment, auth, data, compliance, public API

