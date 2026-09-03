---
name: alternative
description: ค้นหาและแนะนำ alternatives ทีดีกว่าสำหรับสิ่งที user ระบุ
argument-hint: "<subject>"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - exec
  - ask_user_question
  - todo_write
  - skill
  - web_search
  - webfetch
  - mcp_call_tool
triggers:
  - user
  - model
related:
  - deep-research
  - learn-from-web
  - vs
  - follow-best-practice
  - follow-my-tech-stack
  - use-lib-effective
  - suggest-next-action
  - resolve-errors
---

## Goal

ค้นหาและแนะนำ alternatives ทีดีกว่าสำหรับสิ่งที user ระบุ

## Scope

ใช้เมื่อ user ถามเกี่ยวกับ libraries, tools, frameworks, patterns หรือ solutions ต่าง ๆ

ดูเพิ่มเติม: /learn-from-web, /vs, /follow-best-practice, /follow-my-tech-stack, /use-lib-effective, /suggest-next-action, /resolve-errors

## Execute

### 1. Identify Subject

> Goal: ระบุสิ่งทีต้องหา alternative

1. ระบุสิ่งที user ถาม (library, tool, framework, pattern)
2. แยก keywords และ requirements สำคัญ
3. กำหนด context และ use case

### 2. Deep Research

> Goal: รวบรวมข้อมูล alternatives

1. ทำ `/deep-research` เพื่อค้นหาข้อมูลจาก multiple sources
2. ใช้ CRW สำหรับ web search และ scraping
3. ค้นหาใน NPM Registry และ GitHub
4. ใช้ DeepWiki และ Context7 สำหรับ documentation

### 3. Compare Alternatives

> Goal: เปรียบเทียบ alternatives

1. รวบรวม alternatives ทีเกี่ยวข้อง
2. เปรียบเทียบ features, performance, maintenance
3. วิเคราะห์ pros/cons ของแต่ละตัวเลือก
4. ตรวจสอบ community support และ ecosystem

### 4. Recommend Best Option

> Goal: แนะนำตัวเลือกทีเหมาะสมทีสุด

1. แนะนำตัวเลือกทีเหมาะสมทีสุด
2. อธิบายเหตุผลการเลือก
3. ให้ examples หรือ migration guides
4. ระบุ trade-offs ทีต้องพิจารณา

## Rules

### Research Strategy

- ทำ `/deep-research` เสมอก่อนแนะนำ
- ใช้ multiple sources (CRW, NPM, GitHub, DeepWiki, Context7)
- ตรวจสอบ credibility ของ sources
- เปรียบเทียบข้อมูลจากหลายแหล่ง
- ตรวจสอบว่าข้อมูลเป็นปัจจุบัน

### Comparison Criteria

- Features และ capabilities
- Performance และ benchmarks
- Maintenance และ updates
- Community support และ ecosystem
- Learning curve และ documentation
- License และ commercial support

### Context Awareness

- Tech stack ทีใช้อยู่
- Team expertise และ experience
- Project requirements และ constraints
- Long-term maintenance considerations
- Migration cost และ effort

### Recommendation Guidelines

- อธิบายเหตุผลอย่างชัดเจน
- ระบุ trade-offs ทีต้องพิจารณา
- ให้ examples หรือ code snippets
- แนะนำ migration paths ถ้าจำเป็น
- ให้ references สำหรับ deeper learning

## Expected Outcome

- Alternatives ทีดีกว่าพร้อมเปรียบเทียบ
- Recommendation ทีเหมาะสมกับ context
- Pros/cons และ trade-offs ทีชัดเจน
- Examples หรือ migration guides
- References สำหรับ deeper learning
