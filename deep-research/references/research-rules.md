# Deep Research Rules

## 1. When To Use Deep Research

ใช้ deep research เมื่อ:

- ต้องเปรียบเทียบ libraries, frameworks, หรือ tools
- ต้องการ best practices จาก multiple sources
- ต้องตรวจสอบ compatibility และ version requirements
- ต้องการข้อมูลลึกกว่าที่ single source ให้ได้
- ผลลัพธ์มีผลต่อการตัดสินใจสำคัญ

## 2. When Not To Use Deep Research

ไม่ใช้ deep research เมื่อ:

- แค่ต้องการอ่าน docs เฉพาะ library (ใช้ `/follow-best-practice`)
- แค่ต้องการเรียนรู้ concept เร็วๆ (ใช้ `/learn-from-web`)
- ต้องการแค่ตรวจสอบ reference เดียว (ใช้ `/check-reference`)
- เป็น low-risk ที่ไม่ต้องข้อมูลลึก
- การค้นหานานกว่าการทำจะเสียเวลามากกว่า

## 3. Source Selection

เลือกใช้ multiple sources เพื่อความถูกต้อง:

- ใช้ `NPM Registry` สำหรับ package information
- ใช้ `GitHub` + `GitHub MCP` สำหรับ repositories และ code
- ใช้ `DeepWiki` สำหรับ GitHub repositories
- ใช้ `Context7` สำหรับ library documentation
- ใช้ `CRW` สำหรับ crawl official documentation
- ใช้ `Windsurf WebSearch` สำหรับ web search และ sources ที่ไม่มี MCP

## 4. Credibility Check

ตรวจสอบ credibility ของ sources:

- ตรวจสอบ source reputation และ benchmark scores
- ตรวจสอบ download counts และ maintenance
- ตรวจสอบ stars, forks, issues บน GitHub
- กรองผลลัพธ์จาก credible sources
- เปรียบเทียบข้อมูลจากหลายแหล่ง

## 5. AI Documentation Tools

ใช้ AI documentation tools อย่างมีประสิทธิภาพ:

- ใช้ DeepWiki (`mcp3_ask_question`, `mcp3_read_wiki_contents`, `mcp3_read_wiki_structure`) สำหรับ GitHub repositories
- ใช้ Context7 (`context7_resolve-library-id`, `context7_get-library-docs`) สำหรับ library documentation
- ใช้ GitHub MCP (`mcp7_search_code`, `mcp7_search_repositories`) สำหรับ code search
- ถามคำถามเฉพาะเจาะจงแทนอ่านทั้งหมด

## 6. CRW For Official Documentation

ใช้ CRW สำหรับ crawl official documentation อย่างมีประสิทธิภาพ:

- ใช้ `crw map <domain>` เพื่อ discover URLs ทั้งหมดจาก official site
- ใช้ `crw crawl <domain> --depth <n>` เพื่อ crawl และอ่านทุกหน้า
- ใช้ `--format markdown` สำหรับ output ที่ LLM อ่านง่าย
- ใช้ `--output <file>` เพื่อบันทึกผลลัพธ์
- ทำตาม `/follow-tool-crw` สำหรับการใช้งาน CRW อย่างเต็มประสิทธิภาพ

## 7. Windsurf WebSearch Usage

ใช้ Windsurf WebSearch อย่างมีประสิทธิภาพ:

- ใช้ `search_web` สำหรับ web search ทั่วไป
- ใช้ `read_url_content` สำหรับอ่าน content จาก official documentation URLs
- ใช้ `view_content_chunk` สำหรับ large documents
- ใช้สำหรับ sources ที่ไม่มี MCP integration

## 8. Information Freshness

ตรวจสอบ dates และ recency ของข้อมูล โดยเน้นการค้นหาปีล่าสุด:

- ค้นหาปีล่าสุดจากทุก sources ก่อนใช้ข้อมูล
- ใช้ `search_web` กับ query ที่มีปีปัจจุบัน เช่น `<topic> 2026`
- เปรียบเทียบ publish dates และ release dates จาก NPM, GitHub, และ official docs
- ตรวจสอบ version compatibility กับปีล่าสุด
- เลือกข้อมูลที่มีปีล่าสุดเป็น primary source
- ติดตาม updates จาก sources หลัก

## 9. Time Budget

- ถ้าเป็น research เล็ก ใช้เวลาไม่เกิน 5 นาที (2-3 sources)
- ถ้าเป็น research กลาง ใช้เวลาไม่เกิน 15 นาที (3-5 sources)
- ถ้าเป็น research ใหญ่ ใช้เวลาตามความจำเป็น แต่ต้องสรุปได้
- ถ้า research นานเกินไป ให้ใช้ `/ask-me` เพื่อขอ scope จากผู้ใช้

## 10. Integration With Other Workflows

เชื่อมโยงกับ workflows อื่น:

- ทำ `/pondering` ก่อน research เพื่อทบทวน scope
- ทำ `/learn-from-web` สำหรับการเรียนรู้เร็วๆ
- ทำ `/follow-best-practice` หลัง research เพื่อ apply ที่พบ
- ทำ `/follow-tool-crw` สำหรับการใช้ CRW อย่างเต็มประสิทธิภาพ
- ทำ `/check-reference` เพื่อตรวจสอบ references ที่พบ
- ทำ `/ask-me` ถ้า research แล้วยังไม่ชัดเจน
