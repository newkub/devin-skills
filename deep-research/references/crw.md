# CRW For Official Docs

## Goal

ใช้ CRW สำหรับ crawl official documentation

## Steps

1. ใช้ `crw map <domain>` เพื่อ discover URLs ทั้งหมดจาก official site
2. ใช้ `crw crawl <domain> --depth <n>` เพื่อ crawl และอ่านทุกหน้า
3. ใช้ `--format markdown` สำหรับ output ที่ LLM อ่านง่าย
4. ใช้ `--output <file>` เพื่อบันทึกผลลัพธ์
5. ทำตาม `/follow-tool-crw` สำหรับการใช้งาน CRW อย่างเต็มประสิทธิภาพ
