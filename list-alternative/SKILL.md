---
name: list-alternative
description: List alternatives ที่ดีกว่าสำหรับ libraries, tools, frameworks หรือ patterns
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ค้นหาและแนะนำ alternatives ที่ดีกว่าสำหรับสิ่งที่ user ระบุ

## Scope

ใช้เมื่อ user ถามเกี่ยวกับ libraries, tools, frameworks, patterns หรือ solutions ต่างๆ

## Execute

### 1. Identify Subject

1. ระบุสิ่งที่ user ถาม (library, tool, framework, pattern)
2. แยก keywords และ requirements สำคัญ
3. กำหนด context และ use case

### 2. Deep Research

1. ทำ `/deep-research` เพื่อค้นหาข้อมูลจาก multiple sources
2. ใช้ CRW สำหรับ web search และ scraping
3. ค้นหาใน NPM Registry และ GitHub
4. ใช้ DeepWiki และ Context7 สำหรับ documentation

### 3. Compare Alternatives

1. รวบรวม alternatives ที่เกี่ยวข้อง
2. เปรียบเทียบ features, performance, maintenance
3. วิเคราะห์ pros/cons ของแต่ละตัวเลือก
4. ตรวจสอบ community support และ ecosystem

### 4. Recommend Best Option

1. แนะนำตัวเลือกที่เหมาะสมที่สุด
2. อธิบายเหตุผลการเลือก
3. ให้ examples หรือ migration guides
4. ระบุ trade-offs ที่ต้องพิจารณา

## Rules

### 1. Research Strategy

ใช้ deep research เพื่อความถูกต้อง:

- ทำ `/deep-research` เสมอก่อนแนะนำ
- ใช้ multiple sources (CRW, NPM, GitHub, DeepWiki, Context7)
- ตรวจสอบ credibility ของ sources
- เปรียบเทียบข้อมูลจากหลายแหล่ง
- ตรวจสอบว่าข้อมูลเป็นปัจจุบัน

### 2. Comparison Criteria

เปรียบเทียบด้วย criteria ที่ชัดเจน:

- Features และ capabilities
- Performance และ benchmarks
- Maintenance และ updates
- Community support และ ecosystem
- Learning curve และ documentation
- License และ commercial support

### 3. Context Awareness

พิจารณา context ของ project:

- Tech stack ที่ใช้อยู่
- Team expertise และ experience
- Project requirements และ constraints
- Long-term maintenance considerations
- Migration cost และ effort

### 4. Recommendation Guidelines

แนะนำตัวเลือกที่เหมาะสม:

- อธิบายเหตุผลอย่างชัดเจน
- ระบุ trade-offs ที่ต้องพิจารณา
- ให้ examples หรือ code snippets
- แนะนำ migration paths ถ้าจำเป็น
- ให้ references สำหรับ deeper learning

## Expected Outcome

- Alternatives ที่ดีกว่าพร้อมเปรียบเทียบ
- Recommendation ที่เหมาะสมกับ context
- Pros/cons และ trade-offs ที่ชัดเจน
- Examples หรือ migration guides
- References สำหรับ deeper learning
