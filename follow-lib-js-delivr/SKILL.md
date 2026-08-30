---
name: follow-lib-js-delivr
description: ใช้ jsDelivr CDN สำหรับโหลด bun packages และ GitHub repositories บน web pages
related:
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ jsDelivr CDN สำหรับโหลด bun packages และ GitHub repositories บน web pages

## Scope

ใช้สำหรับการโหลด JavaScript libraries, CSS frameworks, และ static assets บน web pages ด้วย multi-CDN infrastructure

## Execute

### 1. Load Packages

> Goal: โหลด packages ผ่าน jsDelivr CDN

1. Load packages ด้วย URL format: `https://cdn.jsdelivr.net/npm/package@version`
2. ใช้ ES Modules ด้วย `<script type="module">` และ import จาก jsDelivr

### 2. Optimize Requests

> Goal: ลด HTTP requests

1. ใช้ combine feature เพื่อลด HTTP requests

### 3. Ensure Stability

> Goal: รักษา stability ของ production

1. Pin version เสมอเพื่อ stability
2. ใช้ `+semver` สำหรับ version ranges

### 4. Ensure Security

> Goal: รักษา security

1. ใช้ SRI hashes สำหรับ security

### 5. Monitor

> Goal: ติดตาม performance

1. Monitor CDN performance

## Rules

- ใช้ URL format: `https://cdn.jsdelivr.net/npm/package@version`
- Pin version เสมอเพื่อ stability
- ใช้ `+semver` สำหรับ version ranges
- Test ใน production ก่อน deploy
- ใช้ SRI hashes สำหรับ security
- Monitor CDN performance

- ใช้ /follow-lib-animejs ถ้าจำเป็น
- ใช้ /follow-lib-arktype ถ้าจำเป็น
- ใช้ /follow-lib-better-auth ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /use-my-packages-on-registry ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## Expected Outcome

- Loading performance ที่ดีขึ้นด้วย multi-CDN
- Global reach รวมถึง China
- High availability ด้วย failover
