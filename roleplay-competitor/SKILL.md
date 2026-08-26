---
name: roleplay-competitor
description: รับบทเป็นคู่แข่งอ่าน code แล้ววิเคราะห์จุดอ่อน ช่องโหว่ และโอกาสที่คู่แข่งจะเอาชนะได้
---

## Goal

จำลองเป็นคู่แข่งที่กำลังวิเคราะห์ project ของเราจาก source code เพื่อหาจุดอ่อน ช่องโหว่ และโอกาสที่คู่แข่งสามารถเอาชนะได้ โดยไม่รันโปรแกรมจริง

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมองคู่แข่ง ครอบคลุม product, technical, business, และ market dimensions โดย AI จำลอง competitor mindset จากการอ่าน source code

## Execute

### 1. Read Code Context

> Goal: Read Code Context

1. ทำ `/scan-codebase` หรือใช้ `read_file`, `grep_search`, `find_by_name`, `list_dir` เพื่อเข้าใจ project structure
2. อ่าน package.json, README, AGENTS.md, docs เพื่อเข้าใจ product และ tech stack
3. อ่าน routes, API endpoints, database schema, features list
4. อ่าน config files, environment variables, deployment setup
5. ถ้าเข้าใจ project ไม่ได้ ให้ถามผู้ใช้ว่า project นี้ทำอะไร

### 2. Identify Competitor Profile

> Goal: Identify Competitor Profile

1. ระบุว่าถ้าเป็นคู่แข่ง จะเป็นแบบไหน (startup, enterprise, niche player, open source)
2. ระบุว่าคู่แข่งมีทรัพยากรอะไรบ้าง (budget, team, tech, data, network)
3. ระบุ target market เดียวกันหรือต่าง segment
4. บันทึก assumptions ที่ทำจาก code ไว้ชัดเจน

### 3. Simulate Competitor Analysis

> Goal: Simulate Competitor Analysis

Goal reminder: คิดเหมือนคู่แข่งที่จะเอาชนะ project นี้ ไม่ใช่ developer ที่รัก project

1. เลือก 3-5 มุมมองคู่แข่งที่แตกต่างกัน (fast follower, premium player, low-cost disruptor, niche specialist, platform play)
2. สำหรับแต่ละมุมมอง จำลอง: "ถ้าเราเป็นคู่แข่ง จะโจมตีจุดไหน?"
3. ระบุว่าคู่แข่งเห็นอะไรจาก code ที่บอกว่า project นี้มีจุดอ่อน
4. ระบุว่าคู่แข่งจะใช้จุดอ่อนนั้นอย่างไรให้ได้เปรียบ

### 4. Analyze Every Competitive Dimension

> Goal: Analyze Every Competitive Dimension

Product and Features:

1. Feature gaps: ฟีเจอร์ที่ขาดและคู่แข่งมี หรือคู่แข่งสร้างได้ง่ายกว่า
2. Feature quality: ฟีเจอร์ที่มีแต่ทำไม่ดี ใช้ยาก หรือไม่สมบูรณ์
3. Unique selling points: จุดที่ project นี้แข็งแกร่งและคู่แข่งต้องระวัง
4. Time to market: จาก code structure และ complexity คู่แข่งสร้างเทียบได้เร็วแค่ไหน
5. Innovation barriers: มีอะไรที่ทำให้คู่แข่ง copy ยาก (network effects, data moat, integrations, patents)

Technical and Architecture:

6. Tech stack choices: เทคโนโลยีที่เลือกมีข้อจำกัดอะไร คู่แข่งเลือกดีกว่าได้ไหม
7. Code quality and maintainability: โค้ดซับซ้อนไหม ยากต่อการเพิ่มฟีเจอร์ไหม คู่แข่งพัฒนาเร็วกว่าได้ไหม
8. Scalability: จาก architecture รองรับ growth ได้แค่ไหน คู่แข่ง scale ดีกว่าได้ไหม
9. Performance: จาก code มี bottleneck ที่คู่แข่งจะเอาได้เปรียบไหม
10. Security posture: มีช่องโหว่ที่คู่แข่งจะใช้โจมตี reputation ได้ไหม
11. Technical debt: มี debt มากไหม ชะลอการพัฒนาไหม

Business and Market:

12. Monetization weakness: รายได้พึ่งพา source เดียวไหม คู่แข่ง diversify ได้ไหม
13. Pricing vulnerability: คู่แข่งตัดราคาได้ไหม หรือ freemium ได้ไหม
14. Customer acquisition: มี onboarding friction ที่คู่แข่งจะทำให้ง่ายกว่าได้ไหม
15. Switching costs: user ย้ายไปคู่แข่งได้ง่ายไหม มี lock-in ไหม
16. Market positioning: จาก code และ features project นี้ position แบบไหน คู่แข่ง reposition ได้ไหม

Data and AI:

17. Data advantage: มี data collection ที่สร้าง moat ไหม คู่แข่ง collect ได้ไหม
18. AI/ML capabilities: มี AI features ไหม คู่แข่งทำได้ดีกว่าไหม
19. Automation: มี automated workflows ไหม คู่แข่ง automate ได้มากกว่าไหม

Ecosystem and Partnerships:

20. Integration breadth: มี integrations กี่ตัว คู่แข่งมีมากกว่าได้ไหม
21. API strategy: API เปิดหรือปิด คู่แข่งสร้าง ecosystem ได้ดีกว่าไหม
22. Platform vs product: เป็น product หรือ platform คู่แข่งเปลี่ยน model ได้ไหม

### 5. Map Findings To Code

> Goal: Map Findings To Code

1. แต่ละ finding ต้องมี file path และ line number หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ dimension ที่เกี่ยวข้อง (product, technical, business, data, ecosystem)
4. ระบุ competitor perspective ที่เห็นจุดนี้
5. ถ้าไม่มี evidence ใน code ให้ระบุเป็น assumption

### 6. Generate Competitive Intelligence Report

> Goal: Generate Competitive Intelligence Report

1. ทำ `/report` ด้วย `/report-markdown-table`
2. สร้างตาราง: Severity, Dimension, Location, Weakness, Competitor Opportunity, Recommendation
3. สร้างตาราง strengths: Dimension, Location, Strength, Why Hard To Copy
4. สรุป top 3-5 จุดอ่อนที่คู่แข่งจะโจมตีก่อน
5. สรุป top 3-5 จุดแข็งที่ต้องรักษาไว้
6. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution

- ไม่รัน dev server, test, build, browser, emulator, CLI, หรือ script จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow เป็น `/bench-competitors` หรือ `/update-review-codebase-cli-and-run`

### 2. Think Like A Competitor

- คิดเหมือนคู่แข่งที่ต้องการเอาชนะ ไม่ใช่ developer ที่รัก project
- ถามตัวเอง "ถ้าเราเป็นคู่แข่ง จะโจมตีจุดไหน?" ทุก dimension
- พิจารณาคู่แข่งหลายประเภท (fast follower, premium, low-cost, niche, platform)
- ไม่จำกัดแค่คู่แข่งตรง รวมคู่แข่งทางอ้อมและ disruptors

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path/line number หรือ code snippet
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence
- แยกหน้าที่ระหว่าง weakness (จุดอ่อน) และ strength (จุดแข็ง)

### 4. Coverage

- ตรวจทุก dimension ทุกหมวด (product, technical, business, data, ecosystem)
- ตรวจจากหลาย competitor perspective
- ถ้า dimension ไหนไม่มี code ให้ตรวจ ให้ระบุเป็น "not applicable" ไม่ใช่ข้าม
- ระบุทั้งจุดอ่อนและจุดแข็ง

### 5. Severity

- Critical: จุดอ่อนที่คู่แข่งเอาชนะได้ทันที เช่น ขาดฟีเจอร์หลัก, security hole, scale ไม่ได้
- High: จุดอ่อนที่คู่แข่งเอาชนะได้ใน 1-3 เดือน เช่น ช้ากว่า, UX แย่กว่า, ขาด integration
- Medium: จุดอ่อนที่คู่แข่งเอาชนะได้ใน 3-6 เดือน เช่น ขาด AI, ขาด automation, code quality ต่ำ
- Low: จุดอ่อนเล็กน้อยที่คู่แข่งอาจเอาได้เปรียบ เช่น tech debt, naming, docs

### 6. Balance Weakness And Strength

- ไม่ได้หาแค่จุดอ่อน ต้องระบุจุดแข็งด้วย
- จุดแข็งต้องระบุว่าทำไมคู่แข่ง copy ยาก
- ถ้าจุดแข็ง copy ง่าย ให้ระบุเป็น "temporary advantage"

### 7. Integration

- ถ้า analysis ซับซ้อน ให้ทำ `/deep-thinking` ก่อนเริ่ม simulate
- ถ้าต้องการ research คู่แข่งจริง ให้ทำ `/deep-research`
- ถ้าต้องการทบทวนมุมมองก่อนสรุป ให้ทำ `/pondering`
- ถ้าต้องการ benchmark จริงและ implement ให้ใช้ `/bench-competitors`
- ถ้าต้องการ review ทุกมิติ ให้ใช้ `/update-review-codebase-cli-and-run`

### 8. Output

- รายงานตาราง weaknesses และ strengths ชัดเจน จัดกลุ่มตาม dimension
- สรุป top weaknesses ที่คู่แข่งจะโจมตี
- สรุป top strengths ที่ต้องรักษา
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน competitive intelligence จากมุมมองคู่แข่งที่จำลองจาก source code
- ตาราง weaknesses มี Severity, Dimension, Location, Weakness, Competitor Opportunity, Recommendation
- ตาราง strengths มี Dimension, Location, Strength, Why Hard To Copy
- ครอบคลุม 22 dimensions ครบ 5 หมวด (product, technical, business, data, ecosystem)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`