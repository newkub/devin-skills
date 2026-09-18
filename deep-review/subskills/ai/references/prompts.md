# Prompt Checklist — review-ai

## Structure And Versioning

- [ ] prompts อยู่ศูนย์กลาง (dir เดียว เช่น `prompts/` หรือ `ai/prompts.ts`) ไม่กระจาย inline ตาม call sites
- [ ] ทุก prompt มี name/version หรือ commit-tracked file — เปลี่ยนแล้ว diff ได้
- [ ] system vs user vs few-shot แยกชัด — ไม่ concat สุ่มใน string เดียว
- [ ] output contract ระบุใน prompt (format, fields, length, language)
- [ ] few-shot examples ตรง contract ปัจจุบัน — ไม่ stale หลัง schema เปลี่ยน

## Injection Surface

- [ ] user input ถูก wrap ด้วย delimiters/structured fields — ไม่แปะดิบเข้า system prompt
- [ ] retrieved/external content (RAG, web, files) ถูก mark เป็น untrusted data — "ข้อมูล" ไม่ใช่ "คำสั่ง"
- [ ] prompt ไม่มี secrets, internal URLs, credentials, หรือ implementation details ที่ leak ผ่าน output ได้
- [ ] มี length cap ต่อ input — user ยัด 100KB เข้า prompt ไม่ได้
- [ ] instruction hierarchy ชัด — system > developer > user > retrieved

## Detection

- grep `system`, `role:`, `prompt`, template literals ที่ยัด user data
- grep patterns ที่น่าสงสัย: `You are`, `prompt +=`, `` `${input}` `` ใน prompt construction
- ตรวจว่า prompt templates ผ่าน unit test หรือ snapshot หรือไม่

## Evidence Format

| file:line | issue | risk |
|---|---|---|
| `ai.ts:42` | user input concat เข้า system prompt ดิบ | injection |

Severity: injection/leak = Critical–High, no versioning/contract = Medium, stale examples = Low
