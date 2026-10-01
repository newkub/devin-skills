---
name: research-setup-integrations
description: ค้นหา setup integration จาก official sources — plugins, extensions, providers, adapters, marketplace items — ก่อนเลือกและติดตั้ง
argument-hint: "[tool-or-integration]"
related:
  - deep-research
  - update-devin-global-skills
  - update-config
  - setup-cicd
  - follow-tool-usage
  - check-reference
  - follow-best-practice
  - report
---

## Goal

ค้นหาและเปรียบเทียบ integration options ของ tool/service จาก official sources — plugins, extensions, providers, adapters, middleware, marketplace items — เพื่อเลือกตัวที่ official, maintained และ compatible ก่อน setup จริง

## Scope

ใช้เมื่อต้องหา/เลือก integration ของ tool หรือ platform — editor extensions, framework plugins (vite/astro/nuxt), CI actions, deploy providers, database drivers, MCP servers, lint presets — ไม่ใช่ setup flow ทั้งตัว (general setup research → `/deep-research setup`) และไม่ใช่เลือก library dependency (`/deep-research dependencies`)

## Execute

### 1. Identify Integration Need

> Goal: ระบุ host + integration type + version target

1. ระบุ host tool/platform และ version ที่ติดตั้งอยู่ (อ่าน `package.json`/lockfile/`mise.toml` จริง ไม่เดา)
2. ระบุ integration type: plugin, extension, provider, adapter, preset, middleware, driver, action
3. ระบุ constraints: official-only หรือ community ได้, license, bundle/runtime cost

### 2. Search Official Sources

> Goal: catalog จาก official sources ก่อน community

1. Official integrations/plugins/extensions page ของ host (docs → `/learn-from-web`, `crw_scrape`, `context7`)
2. Official registries/marketplaces: npm scoped orgs (`@vitejs`, `@astrojs`, `@clack`, `@biomejs`), VS Code/JetBrains/Chrome marketplaces, GitHub Actions marketplace, Terraform/Pulumi registry, MCP server lists
3. Monorepo ของ host เอง — integrations มักอยู่ใน `packages/*` ของ repo เดียวกัน (DeepWiki/GitHub)
4. เก็บ per candidate: name, type, maintainer (official/community), install command, config surface, version compat

### 3. Verify Quality

> Goal: เหลือเฉพาะ integration ที่ maintained และ compatible

1. Official vs community — prefer official, community ต้องมี traction ชัด
2. Maintenance: last release ≤ 6 เดือน, open issues, release cadence
3. Compatibility: peer/version range เข้ากับ host version ที่ติดตั้งจริง — deprecated/abandoned ตัดออก + ระบุใน report
4. ถ้า config surface ต้องเช็ค options/defaults → `/check-types-definition` บน type defs ของ integration

### 4. Synthesize And Report

> Goal: recommendation พร้อม evidence

1. ทำ `/report` table: `No.`, `Integration`, `Type`, `Official`, `Latest`, `Compat`, `Install`, `Verdict`
2. Primary recommendation + install command + config snippet ขั้นต่ำ
3. ระบุ alternatives + เหตุผลที่ตัดออก (deprecated, incompatible, unmaintained)
4. Report-only — ห้าม install/แก้ config เอง; เมื่อ user เลือกแล้วส่งต่อ `/update-config` หรือ setup skill ที่เกี่ยวข้อง

## Rules

- Official docs/registries เป็นแหล่งหลักเสมอ — blog/community เป็น fallback เท่านั้น
- ทุก candidate ต้องมี source URL + version ที่เช็ค — ไม่เดา install command หรือ config key
- แยก stable vs preview/experimental/deprecated ชัดเจนใน report
- ใช้ `/deep-research` ถ้าจำเป็น (cross-check หลายแหล่งลึก)
- ใช้ `/check-reference` ถ้าจำเป็น

## Expected Outcome

- Integration catalog จาก official sources พร้อม quality/compatibility check
- Recommendation + install + minimal config พร้อมใช้ — sources ครบ
