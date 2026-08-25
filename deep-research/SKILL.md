---
name: deep-research
description: ค้นหาข้อมูลลึกจาก multiple sources เพื่อให้ได้คำตอบที่ครบถ้วนและถูกต้อง
argument-hint: "[query]"
---

## Goal

ค้นหาข้อมูลลึกจาก multiple sources เพื่อให้ได้คำตอบที่ครบถ้วน ถูกต้อง และ current

## Scope

ใช้สำหรับงานที่ต้องการข้อมูลลึกจากหลายแหล่ง เช่น เปรียบเทียบ libraries, หา best practices, ตรวจสอบ compatibility ไม่ใช่การค้นหาเร็วๆ (ใช้ `/learn-from-web`) และไม่ใช่การอ่าน docs เฉพาะ library (ใช้ `/follow-best-practice`)

## Execute

### 1. Identify Research Topic

> Goal: Identify Research Topic

ระบุหัวข้อและ scope ให้ชัดเจน:

1. เขียนหัวข้อในรูปแบบคำถามที่ต้องการคำตอบ
2. แยก keywords สำคัญ 2-5 คำ
3. ระบุประเภทข้อมูลที่ต้องการ (API, benchmark, tutorial, comparison, best practices)
4. กำหนด scope: ใช้สำหรับอะไร, ระดับความลึกที่ต้องการ
5. ระบุ constraints: เวอร์ชัน, ปี, ภาษา, framework

### 2. Select Sources By Topic Type

> Goal: Select Sources By Topic Type

เลือก sources ตามประเภทของข้อมูลที่ต้องการ:

1. Package info → NPM Registry + GitHub
2. Library docs → Context7 + CRW crawl official docs
3. GitHub repo analysis → DeepWiki + GitHub MCP
4. Web search / comparisons → Windsurf WebSearch (`search_web`)
5. Official documentation → CRW crawl + `read_url_content`
6. Community / discussions → `search_web` + GitHub Issues
7. เลือกอย่างน้อย 2-3 sources เพื่อ cross-reference

### 3. Search Package And Code Sources

> Goal: Search Package And Code Sources

ค้นหาจาก package registries และ code repositories:

1. ค้นหา NPM package info: versions, downloads, dependencies
2. ค้นหา GitHub repos: stars, forks, issues, recent commits
3. ใช้ GitHub MCP (`mcp7_search_code`, `mcp7_search_repositories`) สำหรับ code search
4. ตรวจสอบ maintenance: last commit, release frequency, open issues
5. บันทึก package names, versions, และ URLs ที่พบ

### 4. Use AI Documentation Tools

> Goal: Use AI Documentation Tools

ใช้ AI tools สำหรับ documentation ที่มี MCP integration:

1. ใช้ DeepWiki (`mcp3_ask_question`, `mcp3_read_wiki_contents`, `mcp3_read_wiki_structure`) สำหรับ GitHub repositories
2. ใช้ Context7 (`context7_resolve-library-id`, `context7_get-library-docs`) สำหรับ library documentation
3. ใช้ DeepWiki `ask_question` เพื่อถามคำถามเฉพาะเจาะจงเกี่ยวกับ repo
4. ใช้ Context7 สำหรับดึง docs ของ library ที่ต้องการ
5. บันทึก key findings จากแต่ละ tool

### 5. Use CRW For Official Documentation

> Goal: Use CRW For Official Documentation

ใช้ CRW สำหรับ crawl official documentation:

1. ใช้ `crw map <domain>` เพื่อ discover URLs ทั้งหมดจาก official site
2. ใช้ `crw crawl <domain> --depth <n>` เพื่อ crawl และอ่านทุกหน้า
3. ใช้ `--format markdown` สำหรับ output ที่ LLM อ่านง่าย
4. ใช้ `--output <file>` เพื่อบันทึกผลลัพธ์
5. ทำตาม `/follow-tool-crw` สำหรับการใช้งาน CRW อย่างเต็มประสิทธิภาพ

### 6. Use Windsurf WebSearch

> Goal: Use Windsurf WebSearch

ใช้ Windsurf WebSearch สำหรับ sources ที่ไม่มี MCP integration:

1. ใช้ `search_web` สำหรับ web search ทั่วไป
2. ใช้ `read_url_content` สำหรับอ่าน content จาก official documentation URLs
3. ใช้ `view_content_chunk` สำหรับ large documents
4. ใช้สำหรับ comparisons, tutorials, blog posts, community discussions
5. กรองผลลัพธ์จาก credible sources เท่านั้น

### 7. Find Latest Year

> Goal: Find Latest Year

ค้นหาปีล่าสุดเพื่อให้ได้ข้อมูลที่ current ที่สุด:

1. ค้นหาด้วย keywords ที่ระบุปี เช่น `<topic> 2025`, `<topic> 2026`, `<topic> latest`
2. ใช้ `search_web` กับ query ที่มีปีปัจจุบัน
3. ตรวจสอบ publish dates และ release dates จากทุก sources
4. เปรียบเทียบปีจาก NPM registry, GitHub releases, และ official documentation
5. ตรวจสอบ version compatibility กับปีล่าสุด
6. เลือกข้อมูลที่มีปีล่าสุดเป็น primary source

### 8. Cross-Reference And Validate

> Goal: Cross-Reference And Validate

ตรวจสอบความถูกต้องโดย cross-reference:

1. เปรียบเทียบข้อมูลจากอย่างน้อย 2 sources
2. ระบุ contradictions ระหว่าง sources
3. ถ้าข้อมูลขัดแย้ง ให้เลือกจาก source ที่ credible กว่า
4. ตรวจสอบ credibility: download counts, stars, maintenance, reputation
5. ระบุข้อมูลที่ยังไม่แน่ใจและต้องตรวจสอบเพิ่ม

### 9. Synthesize Findings

> Goal: Synthesize Findings

รวบรวมและสรุปผลการค้นหา:

1. จัดกลุ่ม findings ตามหมวดหมู่
2. เรียงลำดับตามความสำคัญและความเกี่ยวข้อง
3. ระบุ source และปีของแต่ละ finding
4. สรุป key takeaways 2-5 ข้อ
5. ระบุ gaps ที่ยังไม่พบข้อมูล
6. ถ้ามี gaps สำคัญ ให้ใช้ `/ask-me` เพื่อถามผู้ใช้ หรือค้นหาเพิ่ม

## Rules

### 1. When To Use Deep Research

ใช้ deep research เมื่อ:

- ต้องเปรียบเทียบ libraries, frameworks, หรือ tools
- ต้องการ best practices จาก multiple sources
- ต้องตรวจสอบ compatibility และ version requirements
- ต้องการข้อมูลลึกกว่าที่ single source ให้ได้
- ผลลัพธ์มีผลต่อการตัดสินใจสำคัญ

### 2. When Not To Use Deep Research

ไม่ใช้ deep research เมื่อ:

- แค่ต้องการอ่าน docs เฉพาะ library (ใช้ `/follow-best-practice`)
- แค่ต้องการเรียนรู้ concept เร็วๆ (ใช้ `/learn-from-web`)
- ต้องการแค่ตรวจสอบ reference เดียว (ใช้ `/check-reference`)
- เป็น low-risk ที่ไม่ต้องข้อมูลลึก
- การค้นหานานกว่าการทำจะเสียเวลามากกว่า

### 3. Source Selection

เลือกใช้ multiple sources เพื่อความถูกต้อง:

- ใช้ `NPM Registry` สำหรับ package information
- ใช้ `GitHub` + `GitHub MCP` สำหรับ repositories และ code
- ใช้ `DeepWiki` สำหรับ GitHub repositories
- ใช้ `Context7` สำหรับ library documentation
- ใช้ `CRW` สำหรับ crawl official documentation
- ใช้ `Windsurf WebSearch` สำหรับ web search และ sources ที่ไม่มี MCP

### 4. Credibility Check

ตรวจสอบ credibility ของ sources:

- ตรวจสอบ source reputation และ benchmark scores
- ตรวจสอบ download counts และ maintenance
- ตรวจสอบ stars, forks, issues บน GitHub
- กรองผลลัพธ์จาก credible sources
- เปรียบเทียบข้อมูลจากหลายแหล่ง

### 5. AI Documentation Tools

ใช้ AI documentation tools อย่างมีประสิทธิภาพ:

- ใช้ DeepWiki (`mcp3_ask_question`, `mcp3_read_wiki_contents`, `mcp3_read_wiki_structure`) สำหรับ GitHub repositories
- ใช้ Context7 (`context7_resolve-library-id`, `context7_get-library-docs`) สำหรับ library documentation
- ใช้ GitHub MCP (`mcp7_search_code`, `mcp7_search_repositories`) สำหรับ code search
- ถามคำถามเฉพาะเจาะจงแทนอ่านทั้งหมด

### 6. CRW For Official Documentation

ใช้ CRW สำหรับ crawl official documentation อย่างมีประสิทธิภาพ:

- ใช้ `crw map <domain>` เพื่อ discover URLs ทั้งหมดจาก official site
- ใช้ `crw crawl <domain> --depth <n>` เพื่อ crawl และอ่านทุกหน้า
- ใช้ `--format markdown` สำหรับ output ที่ LLM อ่านง่าย
- ใช้ `--output <file>` เพื่อบันทึกผลลัพธ์
- ทำตาม `/follow-tool-crw` สำหรับการใช้งาน CRW อย่างเต็มประสิทธิภาพ

### 7. Windsurf WebSearch Usage

ใช้ Windsurf WebSearch อย่างมีประสิทธิภาพ:

- ใช้ `search_web` สำหรับ web search ทั่วไป
- ใช้ `read_url_content` สำหรับอ่าน content จาก official documentation URLs
- ใช้ `view_content_chunk` สำหรับ large documents
- ใช้สำหรับ sources ที่ไม่มี MCP integration

### 8. Information Freshness

ตรวจสอบ dates และ recency ของข้อมูล โดยเน้นการค้นหาปีล่าสุด:

- ค้นหาปีล่าสุดจากทุก sources ก่อนใช้ข้อมูล
- ใช้ `search_web` กับ query ที่มีปีปัจจุบัน เช่น `<topic> 2026`
- เปรียบเทียบ publish dates และ release dates จาก NPM, GitHub, และ official docs
- ตรวจสอบ version compatibility กับปีล่าสุด
- เลือกข้อมูลที่มีปีล่าสุดเป็น primary source
- ติดตาม updates จาก sources หลัก

### 9. Time Budget

- ถ้าเป็น research เล็ก ใช้เวลาไม่เกิน 5 นาที (2-3 sources)
- ถ้าเป็น research กลาง ใช้เวลาไม่เกิน 15 นาที (3-5 sources)
- ถ้าเป็น research ใหญ่ ใช้เวลาตามความจำเป็น แต่ต้องสรุปได้
- ถ้า research นานเกินไป ให้ใช้ `/ask-me` เพื่อขอ scope จากผู้ใช้

### 10. Integration With Other Workflows

เชื่อมโยงกับ workflows อื่น:

- ทำ `/pondering` ก่อน research เพื่อทบทวน scope
- ทำ `/learn-from-web` สำหรับการเรียนรู้เร็วๆ
- ทำ `/follow-best-practice` หลัง research เพื่อ apply ที่พบ
- ทำ `/follow-tool-crw` สำหรับการใช้ CRW อย่างเต็มประสิทธิภาพ
- ทำ `/check-reference` เพื่อตรวจสอบ references ที่พบ
- ทำ `/ask-me` ถ้า research แล้วยังไม่ชัดเจน

## Expected Outcome

- ข้อมูลครบถ้วนจาก multiple sources ที่ cross-referenced
- สรุป findings ที่สำคัญพร้อม source และปี
- ข้อมูลที่ใช้เป็นปีล่าสุด (latest year)
- ระบุ gaps ที่ยังไม่พบข้อมูล
- คำตอบที่ credible และ actionable