---
name: report-ai-this-week
description: รายงานข่าว AI และ open source projects รายสัปดาห์ด้วย deep research
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related: []
---
## Goal

รวบรวมและสรุปข่าวสารล่าสุดเกี่ยวกับ AI และ open source projects ประจำสัปดาห์ เพื่อให้ผู้ใช้ติดตามเทรนด์และการเปลี่ยนแปลงที่สำคัญ

## Scope

ครอบคลุมการค้นหาข่าวและอัพเดทจากหลายแหล่ง:
- AI models, frameworks, และ tools
- Open source project releases และ updates
- AI research papers และ breakthroughs
- Open source community trends

## Execute

### 1. Define News Categories

> Goal: กำหนดหมวดข่าวที่ต้องการติดตาม
> Goal: รู้หมวดข่าวและ keywords สำหรับค้นหา

1. ระบุหมวดข่าว AI: models, frameworks, tools, research papers, industry news
2. ระบุหมวดข่าว Open Source: new releases, major updates, trending repositories, community news
3. กำหนด time range เป็น "สัปดาห์นี้" หรือ "สัปดาห์ที่แล้ว" ตามความต้องการ
4. ระบุ keywords สำคัญสำหรับแต่ละหมวด

### 2. Research AI News

> Goal: ทำ `/deep-research` สำหรับข่าว AI
> Goal: ได้ข่าว AI ล่าสุดตาม time range

1. ทำ `/deep-research` ด้วย keywords: `AI news this week`, `AI latest releases`, `AI breakthroughs`
2. ค้นหาด้วย `search_web` ใช้ query ที่ระบุปีและสัปดาห์ เช่น `AI news July 2026 week 2`
3. ค้นหา AI model releases จาก `GitHub` ด้วย `mcp7_search_repositories` ใช้ query `AI model sort:updated`
4. ค้นหา AI framework updates จาก `NPM Registry` และ `GitHub releases`
5. ใช้ `mcp7_list_releases` สำหรับ repositories ที่ติดตาม
6. กรองเฉพาะข่าวที่เป็นปัจจุบันตาม time range ที่กำหนด

### 3. Research Open Source News

> Goal: ทำ `/deep-research` สำหรับข่าว open source
> Goal: ได้ข่าว open source ล่าสุดตาม time range

1. ทำ `/deep-research` ด้วย keywords: `open source releases this week`, `trending GitHub repositories`
2. ค้นหา trending repositories ด้วย `mcp7_search_repositories` ใช้ query `stars:>1000 sort:updated`
3. ค้นหา major releases ด้วย `mcp7_list_releases` จาก repositories ที่สนใจ
4. ค้นหา open source community news ด้วย `search_web`
5. ตรวจสอบ `GitHub trending` ผ่าน `search_web` ด้วย query `GitHub trending repositories this week`
6. กรองเฉพาะข่าวที่เป็นปัจจุบันตาม time range ที่กำหนด

### 4. Research AI Research Papers

> Goal: ค้นหา AI research papers ล่าสุด
> Goal: ได้ papers ล่าสุดที่มี impact สูง

1. ค้นหาด้วย `search_web` ใช้ query `AI research papers latest`, `machine learning breakthroughs`
2. ค้นหาจาก `arxiv.org` ด้วย `search_web` ใช้ query `arxiv AI latest`
3. ใช้ `read_url_content` สำหรับอ่าน abstract ของ papers ที่น่าสนใจ
4. ระบุ papers ที่มี impact สูงและเกี่ยวข้องกับการพัฒนา

### 5. Verify And Cross-Reference

> Goal: ตรวจสอบความถูกต้องและความใหม่ของข่าว
> Goal: ข่าวผ่านการตรวจสอบความถูกต้องและ freshness

1. เปรียบเทียบข่าวจาก multiple sources เพื่อยืนยันความถูกต้อง
2. ตรวจสอบ publish dates และ release dates ของทุก item
3. กรองข่าวที่เก่ากว่า time range ที่กำหนดออก
4. ระบุแหล่งที่มาของแต่ละข่าว

### 6. Compile Report

> Goal: สร้างรายงานข่าวรายสัปดาห์
> Goal: รายงานพร้อมตารางและ executive summary

1. ทำ `/report-table` สร้างตารางข่าว
2. กำหนด columns: No., Category, Title, Source, Date, Impact, Summary
3. จัดกลุ่มข่าวตามหมวด: AI News, Open Source News, Research Papers
4. จัดลำดับตาม impact (High, Medium, Low)
5. เพิ่ม summary สั้นๆ สำหรับแต่ละข่าว
6. ทำ `/report` สร้าง executive summary พร้อม top highlights

## Rules

### Report UX/UI
> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. News Categories

- AI News: models, frameworks, tools, APIs, industry announcements
- Open Source News: releases, major updates, trending repos, community events
- Research Papers: AI/ML breakthroughs, notable publications
- ปรับหมวดตามความสนใจของผู้ใช้

### 2. Source Selection

- ใช้ `search_web` สำหรับ general news search
- ใช้ `mcp7_search_repositories` สำหรับ GitHub trending
- ใช้ `mcp7_list_releases` สำหรับ release tracking
- ใช้ `read_url_content` สำหรับอ่าน full articles
- ใช้ `NPM Registry` สำหรับ package releases
- ทำตาม `/deep-research` สำหรับ source selection rules

### 3. Freshness Requirements

- ข่าวต้องเป็นปัจจุบันตาม time range ที่กำหนด (สัปดาห์นี้ หรือ สัปดาห์ที่แล้ว)
- ใช้ query ที่ระบุปีและสัปดาห์ เช่น `AI news July 2026 week 2`
- ตรวจสอบ publish dates และ release dates ทุก item
- เลือกข่าวที่มี date ใหม่ล่าสุดเป็น primary
- ทำตาม `/deep-research` Rules ข้อ 6 Information Freshness

### 4. Credibility Check

- ตรวจสอบ credibility ของ sources
- ใช้ official sources เป็นหลัก (official blogs, GitHub releases, NPM registry)
- เปรียบเทียบข่าวจาก multiple sources
- ระบุแหล่งที่มาของทุกข่าว

### 5. Report Format

- ใช้ `/report-table` สำหรับ structured output
- จัดกลุ่มตามหมวดและจัดลำดับตาม impact
- ใช้ `/report` สำหรับ executive summary
- สรุป top 5 highlights ของสัปดาห์

## Expected Outcome

- รายงานข่าว AI และ open source ประจำสัปดาห์
- ข่าวจัดกลุ่มตามหมวดและจัดลำดับตาม impact
- แหล่งที่มาของแต่ละข่าวชัดเจน
- Executive summary พร้อม top highlights
- ข่าวผ่านการ cross-reference จาก multiple sources
- สามารถใช้เป็น weekly briefing สำหรับผู้ใช้
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
