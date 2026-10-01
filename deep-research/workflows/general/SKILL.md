---
name: deep-research-general
description: Core research pipeline — topic → sources → gather → validate → synthesize สำหรับหัวข้อที่ไม่มี focused workflow
argument-hint: "[topic]"
related:
  - deep-research
  - rethink
  - follow-best-practice
  - learn
  - check-reference
  - report
---

## Goal

Pipeline หลักของ `/deep-research` — ค้นหาข้อมูลลึกจาก multiple sources สำหรับหัวข้อทั่วไปที่ไม่ตรง workflow เฉพาะทาง (dependencies, setup, integrations, api-references, improve)

## Scope

ใช้เมื่อต้องการข้อมูลลึกจากหลายแหล่ง เช่น เปรียบเทียบ approaches, หา best practices, ตรวจสอบ compatibility, benchmarks, security, migration, licensing — ไม่ใช่การค้นหาเร็วๆ (`/learn-from-web`) และไม่ใช่ docs ของ library เดียว (`/follow-best-practice`)

## Execute

### 1. Identify Topic And Scope

> Goal: ระบุหัวข้อและ scope

ทำตาม `references/topic-and-scope.md`

### 2. Select Sources

> Goal: เลือก sources ตามประเภทข้อมูล

ทำตาม `references/sources.md`

### 3. Research Packages And Code

> Goal: ค้นหาจาก package registries และ code repositories

ทำตาม `references/package-code-research.md`

### 4. Use AI Documentation Tools

> Goal: ใช้ DeepWiki, Context7, GitHub MCP

ทำตาม `references/ai-docs.md`

### 5. Crawl Official Documentation

> Goal: ใช้ CRW สำหรับ official docs

ทำตาม `references/crw.md`

### 6. Use Web Search

> Goal: ใช้ Windsurf WebSearch สำหรับ sources ทั่วไป

ทำตาม `references/websearch.md`

### 7. Check Freshness And Compatibility

> Goal: ตรวจปี, version, breaking changes, migration

ทำตาม `references/freshness.md`

### 8. Cross-Reference And Validate

> Goal: ตรวจ credibility, security, license

ทำตาม `references/cross-validate.md`

### 9. Synthesize Findings

> Goal: รวบรวมและสรุปผล

ทำตาม `references/synthesize.md` — แล้ว output ผ่าน `/deep-research report` (`workflows/report-findings/SKILL.md`)

## Rules

- Multiple sources เสมอ: NPM, GitHub, DeepWiki, Context7, CRW, WebSearch, security DB — รายละเอียด `references/research-rules.md`
- ตรวจ credibility: reputation, maintenance, GitHub activity, เปรียบเทียบหลายแหล่ง
- ตรวจ security: advisories, CVE, open issues
- เน้นข้อมูลปีล่าสุดและระบุ gaps
- Fan-out subtasks อิสระผ่าน `subagents/source-researcher.md` เมื่อหลาย dimensions
- ใช้ `/rethink` ถ้าจำเป็น
- ใช้ `/check-reference` ถ้าจำเป็น

## Expected Outcome

- ข้อมูลครบถ้วนจาก multiple sources ที่ cross-referenced พร้อม source, version, ปี และ gaps
