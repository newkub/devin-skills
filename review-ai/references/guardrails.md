# Guardrails And Output Checklist — review-ai

## Output Validation

- [ ] structured output ใช้ schema (JSON schema / zod / instructor-style) — ไม่ parse free text
- [ ] validation failure → retry-with-fix หรือ fallback ไม่ใช่ crash
- [ ] ไม่ trust raw model output เข้า eval/SQL/shell/HTML โดยตรง — injection รอบสอง
- [ ] output length caps — ไม่มี runaway generation

## Hallucination Mitigation

- [ ] grounding — output ต้องอ้าง source ที่ retrieve มา (สำหรับ factual tasks)
- [ ] "I don't know" path ชัด — model บอกได้เมื่อข้อมูลไม่พอ
- [ ] confidence/citation check บน claims สำคัญ
- [ ] human review path สำหรับ high-stakes output

## Moderation And PII

- [ ] input moderation — user content ผ่าน filter ก่อนเข้า prompt (ถ้า UGC-facing)
- [ ] output moderation — model output ผ่าน filter ก่อนแสดง (ถ้า user-facing)
- [ ] PII redaction ก่อนส่ง prompt/telemetry — patterns: email, phone, ID, card
- [ ] ไม่ log raw prompts ที่มี PII/secrets ลง telemetry ดิบ

## Streaming UX

- [ ] stream errors → graceful message ไม่ใช่ partial garbage
- [ ] abort/cancel ทำงาน — user หยุดได้จริง
- [ ] mid-stream invalid → recover หรือ restart ไม่ใช่ corrupt output

## Detection

- grep `JSON.parse` บน LLM output โดยไม่มี schema
- grep `dangerouslySetInnerHTML`, `eval`, `exec` ใกล้ AI output
- ตรวจ redaction helpers + log redaction

Severity: PII/secret leakage = Critical, no validation on production path = High, no moderation on UGC = Medium–High
