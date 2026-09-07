---
name: optimize-token-usage
description: ลด LLM token usage และ cost ด้วย prompt trimming, context pruning, caching และ model routing
argument-hint: "[feature-or-call-site]"
related:
  - report-before-after
---

## Goal

วิเคราะห์และลด token usage/cost ของ LLM features — prompt bloat, context ที่เกินจำเป็น, missing caching และ model selection ที่แพงเกินงาน

## Scope

- ตรวจ LLM call sites: prompts, system messages, context assembly, tool schemas, RAG injection, conversation history
- ครอบคลุม: input tokens (prompt/context), output tokens (verbosity, format), caching (prompt cache, response cache), model routing, retry amplification
- Action-oriented: แก้ prompts/call sites จริง — วัด token ก่อน/หลัง

## Execute

### 1. Baseline Usage

> Goal: วัด token usage ปัจจุบันต่อ feature

1. หา LLM call sites — `openai`, `anthropic`, SDK calls, agents
2. เก็บตัวเลข: avg input/output tokens ต่อ call, calls per user action, model ที่ใช้
3. ถ้ามี usage logs/billing → ใช้ข้อมูลจริง; ไม่มีก็ estimate จาก tokenizer (`tiktoken`, `count_tokens`)

### 2. Find Waste

> Goal: หาแหล่ง token ที่ไม่จำเป็น

1. Prompt bloat: system prompts ยาว, instructions ซ้ำ, few-shot examples เยอะเกิน, docs ที่ dump ทั้งไฟล์
2. Context เกิน: history ทั้งหมดทุก turn, RAG chunks ไม่ filter, tool outputs ดิบทั้งก้อน
3. No caching: prompts ซ้ำที่ cache ได้ (prompt caching, response cache สำหรับ identical inputs)
4. Wrong model: model แพงกับงานง่าย (classification, extraction, simple QA)
5. Retry amplification: retries ที่ส่ง context เต็มซ้ำโดยไม่จำเป็น
6. Verbose output: ขอ prose ทั้งที่ structured output พอ, missing `max_tokens`

### 3. Apply Optimizations

> Goal: แก้ตาม impact × effort

1. Trim prompts: ตัด instructions ซ้ำ, ย้าย stable content ไป prefix (cache-friendly), ลด examples เหลือที่จำเป็น
2. Prune context: sliding window/summarization สำหรับ history, relevance filtering สำหรับ RAG, truncate tool outputs
3. Cache: เปิด prompt caching (anthropic `cache_control`), response cache สำหรับ deterministic calls
4. Model routing: เพิ่ม tier — model เบาสำหรับงานง่าย, model หนักเฉพาะที่ต้อง reasoning
5. Output control: `max_tokens` ที่เหมาะ, structured output/JSON mode แทน prose
6. Batch: รวมหลายคำถามใน call เดียวเมื่อ independent

### 4. Verify

> Goal: ยืนยัน quality ไม่ลดและ tokens ลดจริง

1. วัด tokens ต่อ call ก่อน-หลัง — ใช้ `/report-before-after`
2. ทดสอบ output quality บน representative cases — ห้าม degrade
3. ถ้ามี evals (promptfoo ฯลฯ) → รันเทียบก่อน-หลัง

## Rules

### 1. Quality Preserved

- token cuts ต้องไม่ทำ output quality ลดลงอย่างมีนัยสำคัญ — verify กับ real cases
- ระบุ trade-off ชัดเจนถ้า quality vs cost ขัดกัน

### 2. Measure First

- ต้องมี baseline tokens/cost ก่อนแก้ — รายงานตัวเลขจริง
- แยก input vs output tokens ใน report

### 3. Provider Aware

- ใช้ caching/batching features ของ provider ที่ project ใช้จริง
- ตรวจ rate limits เมื่อเพิ่ม batching

## Expected Outcome

- Token usage ต่อ call และต่อ user action ลดลงพร้อมตัวเลข
- Caching และ model routing ตั้งค่าเหมาะสม
- Output quality คงเดิมตามการทดสอบ
