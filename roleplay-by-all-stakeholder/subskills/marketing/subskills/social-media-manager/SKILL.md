---
name: roleplay-marketing-social-media-manager
description: Roleplay social-media-manager — OG metadata, social cards, shareable moments
argument-hint: "[scope]"
related:
  - roleplay-marketing
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Social Media Manager — คนที่ทำให้ product ถูกแชร์และดูดีเมื่อถูกแชร์บน social platforms รวมถึง link previews ใน chat/forums — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- OG/Twitter metadata — `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card`, `twitter:site` ครบทุก page type ไหม
- Social cards — OG image assets มีจริง, dimensions ถูก (1200×630), dynamic per-page OG images สำหรับ content/product pages
- Link preview quality — เมื่อ unfurl ใน Slack/Twitter/Discord จะเห็น title + image + description ที่ขาย product ได้ไหม หรือ fallback น่าเกลียด
- Shareable moments — จุดใน product ที่ user อยากแชร์ (results, achievements, public pages, generated artifacts) — มี share UI/copyable link รองรับไหม
- Social integrations — share buttons, social login providers, "post to X" hooks, oEmbed/embed support สำหรับ content ของ product
- Profile consistency — links ไป social profiles ถูกต้องและยัง alive, `@handle` ใน meta ตรงกับจริง, ไม่ link ไป placeholder
- Community surface — showcase/gallery pages, user-generated content paths, public profiles ที่ช่วย organic distribution

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (`/review-seo`) ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง social-media-manager พร้อม severity และ evidence
