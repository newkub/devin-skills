---
name: follow-js-delivr
description: ใช้ jsDelivr CDN สำหรับโหลด bun packages และ GitHub repositories บน web pages
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

ใช้ jsDelivr CDN สำหรับโหลด bun packages และ GitHub repositories บน web pages

## Scope

ใช้สำหรับการโหลด JavaScript libraries, CSS frameworks, และ static assets บน web pages ด้วย multi-CDN infrastructure

## Execute

- Load packages ด้วย URL format: `https://cdn.jsdelivr.net/npm/package@version`
- ใช้ ES Modules ด้วย `<script type="module">` และ import จาก jsDelivr
- ใช้ combine feature เพื่อลด HTTP requests
- Pin version เสมอเพื่อ stability
- ใช้ `+semver` สำหรับ version ranges
- Test ใน production ก่อน deploy
- ใช้ SRI hashes สำหรับ security
- Monitor CDN performance

## Rules

- ใช้ URL format: `https://cdn.jsdelivr.net/npm/package@version`
- Pin version เสมอเพื่อ stability
- ใช้ `+semver` สำหรับ version ranges
- Test ใน production ก่อน deploy
- ใช้ SRI hashes สำหรับ security
- Monitor CDN performance

## Expected Outcome

- Loading performance ที่ดีขึ้นด้วย multi-CDN
- Global reach รวมถึง China
- High availability ด้วย failover
