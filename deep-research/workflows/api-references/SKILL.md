---
name: deep-research-api-references
description: ค้นหา API references จากหลายแหล่ง — official docs, examples, type surface — สรุปพร้อมแหล่งอ้างอิง
argument-hint: "[api-or-library]"
related:
  - deep-research
  - follow-best-practice
  - learn
  - check-reference
  - check-types-definition
  - ask-me
---

## Goal

ค้นหา API references ที่น่าเชื่อถือสำหรับ API, library หรือ tool ที่ระบุ — สรุปเป็นรายการพร้อมแหล่งอ้างอิง (merged `/research-api-references`)

## Scope

ใช้เมื่อต้องการหา references ของ API/library/tool ใหม่หรือตรวจสอบ API ที่มีอยู่ — ค้นหาจากหลายแหล่งภายใต้ deep-research pipeline

## Execute

### 1. Parse Query

> Goal: เข้าใจสิ่งที่ต้องค้นหา

1. อ่านชื่อ API/library/tool จาก argument
2. ระบุ scope: version, language, framework, platform + ประเภทข้อมูล (official docs, examples, tutorials, benchmarks)
3. ถ้า query ไม่ชัดเจน → ใช้ `/ask-me` ก่อน

### 2. Plan Research

> Goal: กำหนด strategy การค้นหา

1. เลือก sources หลัก: official docs, GitHub repo, NPM registry, DeepWiki, Context7
2. ระบุคำค้นหาย่อยเพื่อ cross-reference — ลำดับ: official → code repo → community

### 3. Gather References

> Goal: รวบรวม references จากหลายแหล่ง

1. รัน general pipeline ของ `/deep-research` ด้วย query หลัก
2. ใช้ `/learn-from-web` เพื่ออ่าน official docs เฉพาะเจาะจงถ้ามี URL
3. Type surface (options, defaults, signatures) → `/check-types-definition` บน type defs จริง
4. ใช้ `/follow-best-practice` ถ้าหา best practices ของ API นั้น
5. บันทึก source, URL, version และ credibility ของแต่ละ reference

### 4. Synthesize References

> Goal: สรุปผลการค้นหา

1. กรอง references ซ้ำซ้อน — จัดกลุ่มตามหมวด (official, examples, tutorials, comparisons)
2. เรียงตามความน่าเชื่อถือ/ความเกี่ยวข้อง — สรุป key takeaways 2-5 ข้อ

### 5. Format Output

> Goal: นำเสนอในรูปแบบที่อ่านง่าย

1. markdown table หรือ numbered list — ระบุ URL, คำอธิบายสั้น, แหล่งที่มา, ปี/version
2. ใช้ภาษาเดียวกับ query — แสดงผลในแชททันที

## Rules

- Official docs เป็นแหล่งหลักเสมอ; GitHub repo สำหรับ source/examples; registry สำหรับ package info; community sources เป็น fallback เท่านั้น
- ต้องผ่าน research pipeline ทุกกรณี — ไม่ใช่การค้นหาผิวเดียว; ถ้าไม่พบข้อมูลให้รายงาน gaps
- Credibility: ตรวจปี/version, maintenance status (last commit, release), ระบุข้อมูลที่ไม่แน่ใจ
- No execution — ไม่แก้ไขไฟล์ project, ไม่ติดตั้ง dependencies
- ใช้ `/check-reference` ถ้าจำเป็น

## Expected Outcome

- รายการ API references ครบถ้วน ไม่ซ้ำซ้อน — official เป็น primary, ระบุ URL/version/takeaways — ส่งต่อ `/follow-best-practice` หรือ `/learn-from-web` ได้
