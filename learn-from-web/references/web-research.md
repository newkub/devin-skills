# Web Research

เรียนรู้จากเว็บไซต์หลักและเอกสารอย่างเป็นระบบ — ใช้เมื่อ source เป็น tool, library, framework หรือ topic ที่ต้องการข้อมูลจากภายนอก

## 1. Research Strategy

กำหนดลำดับความสำคัญของแหล่งข้อมูล:

1. `Official Documentation` — แหล่งหลักเสมอ (priority สูงสุด)
2. `DeepWiki` — สำหรับ GitHub repositories
3. `Context7` — สำหรับ libraries และ frameworks
4. `Web Search` — fallback เมื่อไม่มีข้อมูลจากแหล่งอื่น

## 2. Official Website Research

1. ระบุ official website ของ tool, library หรือ framework ที่ต้องการเรียนรู้
2. ใช้ `webfetch`/`read_url_content` เพื่ออ่านหน้า documentation โดยตรง
3. ใช้ CRW (`crw_scrape`, `crw_map`, `crw_crawl`) สำหรับ crawl documentation ทั้ง site
4. เริ่มจากหน้า getting started หรือ quickstart เสมอ
5. อ่าน API reference และ guides ตามลำดับ
6. บันทึก code examples และ configuration examples จาก official site
7. ตรวจสอบ version ที่ตรงกับ project ปัจจุบัน
8. ใช้ domain filter ใน Web Search เพื่อจำกัดผลลัพธ์เฉพาะ official site เช่น domain: "bun.sh"

## 3. DeepWiki Research

1. ใช้ `read_wiki_structure` เพื่อดู topics ทั้งหมด
2. ใช้ `read_wiki_contents` เพื่ออ่านเนื้อหาของ topic ที่เลือก
3. ใช้ `ask_question` สำหรับคำถามเฉพาะเจาะจง
4. เริ่มด้วย structure เพื่อดู topics ทั้งหมดก่อน
5. เลือก topics ที่เกี่ยวข้องกับงานปัจจุบัน
6. อ่าน getting started ก่อน advanced topics
7. บันทึก code examples และ configuration examples

## 4. Context7 Research

1. ใช้ `resolve-library-id` เพื่อหา library ID ที่ถูกต้อง
2. ใช้ `query-docs` สำหรับ documentation ที่ต้องการ
3. Query ให้เฉพาะเจาะจง เช่น "How to setup authentication with JWT in Express.js"
4. ตรวจสอบ source reputation และ benchmark scores
5. เลือก library ที่มี source reputation High หรือ Medium
6. อ่าน examples และ code snippets ที่ Context7 ให้มา
7. ตรวจสอบ version ที่เข้ากันได้กับ project
8. ไม่เรียก Context7 เกิน 3 ครั้งต่อคำถาม

## 5. Web Search Research

1. ใช้ `web_search`/`search_web` เมื่อไม่มีข้อมูลจาก DeepWiki หรือ Context7
2. กำหนด query ที่ชัดเจนและเฉพาะเจาะจง
3. ใช้ domain filter ถ้าจำเป็น เช่น domain: "bun.sh"
4. เปรียบเทียบข้อมูลจากหลายแหล่ง
5. ตรวจสอบว่าข้อมูลเป็นปัจจุบัน (check publish date)

## 6. Knowledge Extraction

1. จดบันทึกหลักการที่สำคัญและ core concepts
2. ระบุ features และ capabilities หลักทั้งหมด
3. บันทึก best practices และ recommendations
4. บันทึก code examples ที่สำคัญพร้อมคำอธิบาย
5. บันทึก configuration examples ที่สำคัญ
6. บันทึก edge cases และ common pitfalls
7. สร้าง summary สำหรับแต่ละ source

## 7. Validation

1. ทดลองใช้งานตามที่เรียนรู้
2. สร้างโปรเจกต์ตัวอย่างเพื่อทดสอบ
3. เปรียบเทียบข้อมูลจากหลายแหล่ง
4. ยืนยันว่าข้อมูลเป็นปัจจุบัน
5. ตรวจสอบว่า code examples ทำงานได้จริง
6. ทดสอบ edge cases และ error handling

## 8. Application

1. นำความรู้ไปใช้ในโปรเจกต์จริง
2. สร้าง examples หรือ tutorials สำหรับทีม
3. ติดตาม updates จากเว็บไซต์หลักอย่างสม่ำเสมอ
4. สร้าง learning loop สำหรับพัฒนาตนเอง
5. บันทึก lessons learned สำหรับ future reference
6. แชร์ความรู้กับทีมผ่าน documentation

## Notes

- ทำ `/deep-research` เมื่อต้องการค้นหาจาก NPM, GitHub, DeepWiki, Context7 และ WebSearch พร้อมกัน
- ทำ `/follow-best-practice` เพื่อใช้ความรู้ตามมาตรฐานของ language, runtime, และ library
- ทำ `/research-setup` ถ้าจำเป็น
