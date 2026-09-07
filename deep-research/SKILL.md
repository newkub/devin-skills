---
name: deep-research
description: ค้นหาข้อมูลลึกจาก multiple sources — packages, repos, docs, benchmarks, security, compatibility
argument-hint: "[query]"
related:
  - rethink
  - research-dependencies
  - research-setup
  - follow-best-practice
  - learn-web
  - check-reference
  - follow-my-tech-stack
---

## Goal

ค้นหาข้อมูลลึกจาก multiple sources เพื่อให้ได้คำตอบที่ครบถ้วน ถูกต้อง และ current

## Scope

ใช้สำหรับงานที่ต้องการข้อมูลลึกจากหลายแหล่ง เช่น เปรียบเทียบ libraries, หา best practices, ตรวจสอบ compatibility, benchmarks, security, migration, licensing ไม่ใช่การค้นหาเร็วๆ (ใช้ `/learn-web`) และไม่ใช่การอ่าน docs เฉพาะ library (ใช้ `/follow-best-practice`)

## Execute

### 0. Dispatch To Focused Research Skill

> Goal: ใช้ research skill เฉพาะทางถ้ามี

1. ถ้าหัวข้อเกี่ยวกับ dependencies/libraries → ใช้ `/research-dependencies` แล้ว stop
2. ถ้าหัวข้อเกี่ยวกับ architecture patterns → ใช้ `/research-architecture` ถ้ามี หรือทำต่อ
3. ถ้าหัวข้อเป็น tech stack ทังชุด → ใช้ `/follow-my-tech-stack` หรือ `/research-stack` ถ้ามี
4. ถ้าไม่มี focused skill ทีตรง → ทำตามขั้นตอนด้านล่าง

### 1. Identify Topic And Scope

> Goal: ระบุหัวข้อและ scope

ทำตาม [references/topic-and-scope.md](references/topic-and-scope.md)

### 2. Select Sources

> Goal: เลือก sources ตามประเภทข้อมูล

ทำตาม [references/sources.md](references/sources.md)

### 3. Research Packages And Code

> Goal: ค้นหาจาก package registries และ code repositories

ทำตาม [references/package-code-research.md](references/package-code-research.md)

### 4. Use AI Documentation Tools

> Goal: ใช้ DeepWiki, Context7, GitHub MCP

ทำตาม [references/ai-docs.md](references/ai-docs.md)

### 5. Crawl Official Documentation

> Goal: ใช้ CRW สำหรับ official docs

ทำตาม [references/crw.md](references/crw.md)

### 6. Use Web Search

> Goal: ใช้ Windsurf WebSearch สำหรับ sources ทั่วไป

ทำตาม [references/websearch.md](references/websearch.md)

### 7. Check Freshness And Compatibility

> Goal: ตรวจปี, version, breaking changes, migration

ทำตาม [references/freshness.md](references/freshness.md)

### 8. Cross-Reference And Validate

> Goal: ตรวจ credibility, security, license

ทำตาม [references/cross-validate.md](references/cross-validate.md)

### 9. Synthesize Findings

> Goal: รวบรวมและสรุปผล

ทำตาม [references/synthesize.md](references/synthesize.md)

## Rules

1. ใช้เมื่อต้องเปรียบเทียบ tools, best practices หลายแหล่ง หรือตัดสินใจสำคัญ
2. ไม่ใช้สำหรับอ่าน docs ตัวเดียว (ใช้ `/follow-best-practice`) หรือ low-risk
3. ใช้ multiple sources: NPM, GitHub, DeepWiki, Context7, CRW, Windsurf WebSearch, security DB
4. ตรวจ credibility: reputation, maintenance, GitHub activity, เปรียบเทียบหลายแหล่ง
5. ตรวจ security: advisories, CVE, open issues
6. เน้นข้อมูลปีล่าสุดและระบุ gaps
7. ดูรายละเอียดใน [references/research-rules.md](references/research-rules.md)

- ใช้ /rethink ถ้าจำเป็น
- ใช้ /research-setup ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น

## Expected Outcome

- ข้อมูลครบถ้วนจาก multiple sources ที่ cross-referenced
- สรุป findings ที่สำคัญพร้อม source, version, และปี
- ข้อมูลที่ใช้เป็นปีล่าสุด
- ระบุ gaps, risks, breaking changes
- คำตอบที่ credible และ actionable
