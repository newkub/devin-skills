---
name: learn-from-web
description: เรียนรู้จาก web sources — docs, articles, repo pages — สรุปเป็น learning path พร้อม citations
argument-hint: "[url-or-topic]"
related:
  - learn-from-codebase
  - learn-from-references
  - deep-research
  - report
  - create-report-in-dot-devin
---

## Goal

สร้าง learning path จาก web sources จริง — ลำดับเนื้อหาที่ควรอ่าน, concepts ที่ต้องเข้าใจ, map ของหัวข้อหลัก — เพื่อให้เข้าใจ topic หรือ external system เร็ว

## Scope

- ใช้เมื่อต้องเรียนรู้จาก URL/docs/article/repo ภายนอก — ไม่ใช่ codebase ในเครื่อง (ใช้ `/learn-from-codebase`)
- ครอบคลุม: official docs, guides, API references, blog posts, GitHub repos
- Output: learning path ในแชท หรือ `.devin/` — ไม่แก้ code

## Execute

### 1. Gather Sources

> Goal: รวบรวมแหล่งข้อมูลที่น่าเชื่อถือ

1. ถ้า user ให้ URL → `webfetch` อ่านตรงๆ ก่อน
2. ถ้าเป็น topic → `web_search` หา official docs ก่อน (docs > blog > forum)
3. ใช้ `crw` tools (`crw_scrape`, `crw_map`, `crw_crawl`) สำหรับ deep site crawl เมื่อต้องการหลายหน้า
4. ระบุ source หลัก 1-3 แหล่ง + supporting สูงสุด 5 แหล่ง

### 2. Identify Critical Path

> Goal: หาเส้นทาง "เข้าใจได้เร็วสุด"

1. เรียงลำดับการอ่าน: overview → concepts หลัก → getting started → 1-2 flows แบบ end-to-end
2. ตัด: marketing pages, changelogs, legacy docs ที่ไม่ใช้แล้ว
3. ระบุส่วนที่ต้องอ่านจริง vs skim ได้

### 3. Build Concept Ladder

> Goal: concepts ที่ต้องรู้ก่อนอ่านแต่ละส่วน

1. ระบุ prerequisite knowledge ต่อ section
2. ลิงก์กลับไป skills/`follow-*` ที่ตรง stack ถ้าเกี่ยว
3. ระบุ "gotchas" — จุดที่ docs หลอกหรือ deprecated

### 4. Write Learning Path

> Goal: เอกสารที่ตามได้จริง

โครงสร้าง output:

```markdown
# Learning Path: <topic>

## Level 0: Big Picture (10 min)
- อ่าน: <main docs URL> — overview/landing
- เข้าใจ: <core concept diagram>

## Level 1: Concepts
- อ่าน: <concepts URL> — domain terms และ mental model

## Level 2: Hands-on
- ตาม: <tutorial/guide URL> — step-by-step จริง

## Level 3: Depth
- API reference, edge cases, advanced topics

## Gotchas
- <สิ่งที่ docs ไม่บอกหรือคนมักพลาด>

## Sources
- <URL ทั้งหมดที่ใช้พร้อม one-line summary>
```

5. บันทึกด้วย `/create-report-in-dot-devin` ถ้า user ต้องการเก็บ

## Rules

### 1. From Real Sources

- ทุก step ต้องชี้ URL จริงที่ fetch แล้ว verify — ไม่ใช่ generic "อ่าน docs"
- cite sources เสมอ — แต่ละ claim ต้อง trace กลับไปหา source ได้

### 2. Minimal Path

- เลือกเส้นทางสั้นที่สุดที่ให้ความเข้าใจ 80% — ไม่ใช่ครอบทุกหน้า
- ระบุสิ่งที่ข้ามและเหตุผล

### 3. Freshness

- ตรวจ last-updated ของ docs — เตือนถ้า stale หรือ deprecated
- ถ้า source ต่อกันขัดแย้ง → ระบุและเลือก official/current

## Expected Outcome

- Learning path ที่ตามอ่านได้จริงพร้อม URLs และ concepts
- Source map ชัดเจนพร้อม citations
- Gotchas ที่ช่วยเลี่ยงความเข้าใจผิด
