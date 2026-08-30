---
name: learn-from-web
description: เรียนรู้จากเว็บไซต์หลักและเอกสารด้วย DeepWiki, Context7 และ Official Documentation
related:
  - list-website-all-routes
  - update-devin-global-skills
  - check-reference
  - deep-research
  - research-setup
  - follow-best-practice
---

## Goal

เรียนรู้จากเว็บไซต์หลักและเอกสารอย่างเป็นระบบ เพื่อให้ได้ข้อมูลที่ครบถ้วนและถูกต้องที่สุด

## Scope

ค้นหาและเรียนรู้จาก DeepWiki, Context7, Web Search และ Official Documentation

## Execute

### 1. Research Strategy

> Goal: กำหนดลำดับความสำคัญของแหล่งข้อมูลก่อนเริ่มค้นหา

1. กำหนดลำดับความสำคัญของแหล่งข้อมูล
2. ใช้ Official Documentation เป็นแหล่งหลักเสมอ (priority สูงสุด)
3. ใช้ DeepWiki สำหรับ GitHub repositories
4. ใช้ Context7 สำหรับ libraries และ frameworks
5. ใช้ Web Search เป็น fallback

### 2. Official Website Research

> Goal: อ่าน documentation โดยตรงจาก official website ของ tool, library หรือ framework

1. ระบุ official website ของ tool, library หรือ framework ที่ต้องการเรียนรู้
2. ใช้ `read_url_content` เพื่ออ่านหน้า documentation โดยตรง
3. ใช้ CRW (`crw_scrape`, `crw_map`, `crw_crawl`) สำหรับ crawl documentation ทั้ง site
4. เริ่มจากหน้า getting started หรือ quickstart เสมอ
5. อ่าน API reference และ guides ตามลำดับ
6. บันทึก code examples และ configuration examples จาก official site
7. ตรวจสอบ version ที่ตรงกับ project ปัจจุบัน
8. ใช้ domain filter ใน Web Search เพื่อจำกัดผลลัพธ์เฉพาะ official site เช่น domain: "bun.sh"

### 3. DeepWiki Research

> Goal: ใช้ DeepWiki สำหรับ GitHub repositories เพื่อดู topics และถามคำถามเฉพาะเจาะจง

1. ใช้ `read_wiki_structure` เพื่อดู topics ทั้งหมด
2. ใช้ `read_wiki_contents` เพื่ออ่านเนื้อหาของ topic ที่เลือก
3. ใช้ `ask_question` สำหรับคำถามเฉพาะเจาะจง
4. เริ่มด้วย structure เพื่อดู topics ทั้งหมดก่อน
5. เลือก topics ที่เกี่ยวข้องกับงานปัจจุบัน
6. อ่าน getting started ก่อน advanced topics
7. บันทึก code examples และ configuration examples

### 4. Context7 Research

> Goal: ใช้ Context7 สำหรับ libraries และ frameworks ที่มี documentation ในระบบ

1. ใช้ `resolve-library-id` เพื่อหา library ID ที่ถูกต้อง
2. ใช้ `query-docs` สำหรับ documentation ที่ต้องการ
3. Query ให้เฉพาะเจาะจง เช่น "How to setup authentication with JWT in Express.js"
4. ตรวจสอบ source reputation และ benchmark scores
5. เลือก library ที่มี source reputation High หรือ Medium
6. อ่าน examples และ code snippets ที่ Context7 ให้มา
7. ตรวจสอบ version ที่เข้ากันได้กับ project
8. ไม่เรียก Context7 เกิน 3 ครั้งต่อคำถาม

### 5. Web Search Research

> Goal: ใช้ Web Search เป็น fallback เมื่อไม่มีข้อมูลจากแหล่งอื่น

1. ใช้ `search_web` เมื่อไม่มีข้อมูลจาก DeepWiki หรือ Context7
2. กำหนด query ที่ชัดเจนและเฉพาะเจาะจง
3. ใช้ domain filter ถ้าจำเป็น เช่น domain: "bun.sh"
4. เปรียบเทียบข้อมูลจากหลายแหล่ง
5. ตรวจสอบว่าข้อมูลเป็นปัจจุบัน (check publish date)

### 6. Knowledge Extraction

> Goal: สกัดและบันทึกความรู้ที่ได้จากทุกแหล่งข้อมูล

1. จดบันทึกหลักการที่สำคัญและ core concepts
2. ระบุ features และ capabilities หลักทั้งหมด
3. บันทึก best practices และ recommendations
4. บันทึก code examples ที่สำคัญพร้อมคำอธิบาย
5. บันทึก configuration examples ที่สำคัญ
6. บันทึก edge cases และ common pitfalls
7. สร้าง summary สำหรับแต่ละ source

### 7. Validation

> Goal: ตรวจสอบความถูกต้องของข้อมูลและ code examples ที่ได้จากการเรียนรู้

1. ทดลองใช้งานตามที่เรียนรู้
2. สร้างโปรเจกต์ตัวอย่างเพื่อทดสอบ
3. เปรียบเทียบข้อมูลจากหลายแหล่ง
4. ยืนยันว่าข้อมูลเป็นปัจจุบัน
5. ตรวจสอบว่า code examples ทำงานได้จริง
6. ทดสอบ edge cases และ error handling

### 8. Application

> Goal: นำความรู้ที่ได้ไปใช้ในโปรเจกต์จริงและแชร์กับทีม

1. นำความรู้ไปใช้ในโปรเจกต์จริง
2. สร้าง examples หรือ tutorials สำหรับทีม
3. ติดตาม updates จากเว็บไซต์หลักอย่างสม่ำเสมอ
4. สร้าง learning loop สำหรับพัฒนาตนเอง
5. บันทึก lessons learned สำหรับ future reference
6. แชร์ความรู้กับทีมผ่าน documentation

### 9. Write References

> Goal: เขียน reference files จริงเมื่อถูกเรียกเพื่อ dependency ของ skill (บังคับ ห้ามข้าม)

1. ตรวจ context การเรียก: ถ้าถูกเรียกจาก `/update-devin-global-skills` หรือ skill ที่มี dependencies → ต้องเขียน reference files จริง ไม่ใช่แค่ research
2. ระบุ target `references/` directory ของ skill ที่เรียก (เช่น `<skill-dir>/references/<dep>.md`)
3. เขียน reference file สำหรับทุก dependency ที่ research ครอบคลุม โดยแต่ละไฟล์ต้องมีอย่างน้อย: install command จริง, version ที่ stable, peer dependencies, configuration examples, code examples จาก official docs, และ source URL
4. ใช้ข้อมูลจาก section 6 (Knowledge Extraction) เป็นเนื้อหา reference. ห้ามใช้ placeholder หรือ TODO. ทุก code example ต้องมาจาก official docs จริง
5. ตรวจว่าทุกไฟล์ไม่เกิน 250 บรรทัด. ถ้าเกิน → แบ่งเป็น sub-files (เช่น `references/<dep>/api.md`, `references/<dep>/config.md`)
6. ถ้า library มี CLI → เขียน `references/<dep>/cli.md` แยก. ถ้ามี components/API หลายส่วน → เขียน `references/<dep>/api/` แยกตามส่วน
7. หลังเขียน → ทำ `/check-reference` เพื่อยืนยันว่า reference มีอยู่จริงและเนื้อหาครบถ้วน
8. ถ้าเขียน reference ไม่สำเร็จ → stop และ report ไม่ผ่านการ validate ของ `/update-devin-global-skills`

### 10. Extract Website Routes

> Goal: สร้าง route reference สำหรับ website project เมื่อจำเป็น

1. ถ้า skill หรือ project มี dependencies กับ website framework/library/tool → ทำ `/list-website-all-routes`
2. ระบุ framework จาก `package.json` ก่อน
3. รวบรวม page routes, API routes, redirects, catch-all, dynamic segments, และ auth-required routes
4. จัดกลุ่ม routes ตาม feature/module (auth, billing, settings, admin)
5. หา patterns ทีซ้ำ เช่น nested resources `/resource/:id/subresource`
6. สร้างหรืออัปเดต `references/routes.md` ใน project หรือ skill directory
7. ใช้ sections: `## Page Routes`, `## API Routes`, `## Dynamic Patterns`, `## Authentication Required`
8. ไม่รวม test routes หรือ mock routes ยกเว้นระบุชัดเจน
9. ทำ `/check-reference` เพื่อตรวจ broken links

## Rules

### 1. Information Source Priority

กำหนดลำดับความสำคัญของแหล่งข้อมูล:

- ลำดับแหล่งข้อมูล: `Official Docs` → `DeepWiki` → `Context7` → `Web Search`
- ใช้ `Official Documentation` เป็นแหล่งหลักเสมอ พยายามเข้า official website โดยตรงก่อน
- ใช้ `DeepWiki` สำหรับ GitHub repositories
- ใช้ `Context7` สำหรับ libraries และ frameworks
- ใช้ `Web Search` เป็น fallback โดยใช้ domain filter เฉพาะ official site ก่อน

### 2. Deep Research Integration

สำหรับการค้นหาข้อมูลลึกจาก multiple sources:

- ทำ `/deep-research` เมื่อต้องการค้นหาจาก NPM, GitHub, DeepWiki, Context7 และ Windsurf WebSearch
- ใช้ CRW สำหรับ crawl official documentation เมื่อจำเป็น
- ตรวจสอบ credibility และ freshness ของข้อมูล

### 3. Best Practices Application

สำหรับการนำความรู้ไปใช้งาน:

- ทำ `/follow-best-practice` เพื่อใช้ความรู้ตามมาตรฐานของ language, runtime, และ library
- ตรวจสอบความถูกต้องด้วย linter และ typecheck
- รัน tests เพื่อยืนยันว่าไม่มี regression

- ใช้ /research-setup ถ้าจำเป็น

## Expected Outcome

- ข้อมูลที่ครบถ้วนจาก multiple sources
- ความรู้ที่ถูกต้องและเป็นปัจจุบัน
- Code examples และ best practices ที่บันทึกไว้
- การนำความรู้ไปใช้งานจริง
- การทดสอบและ validation ที่ครบถ้วน
- ถ้าถูกเรียกเพื่อ dependency ของ skill → ต้องมี reference files จริงใน `references/` ของ skill ที่เรียก ครบทุก dependency ไม่มี placeholder
