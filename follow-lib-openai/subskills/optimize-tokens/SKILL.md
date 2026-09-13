---
name: follow-lib-openai-optimize-tokens
description: ลด token usage และ cost — prompt sizing, caching, model selection
argument-hint: "[scope]"
related:
  - follow-lib-openai
  - deep-optimize
  - check-bottlenecks
  - report-before-after
---

## Goal

ลด token usage และ cost ของ OpenAI API calls — prompt sizing, context trimming, caching, model selection และ usage tracking

## Scope

ใช้เมื่อต้อง optimize cost/latency ของ OpenAI usage ที่มีอยู่ — ครอบคลุม baseline usage, prompt/context reduction, model routing และ verification (ต้องวัดผลก่อนและหลัง)

## Execute

### 1. Baseline Usage

> Goal: เก็บ token/cost baseline ก่อน optimize

1. Log `usage` field จากทุก response (`prompt_tokens`, `completion_tokens`, `total_tokens`) — ถ้ายังไม่ได้ log → เพิ่มก่อนเพื่อมี baseline
2. ระบุ calls ที่แพงสุด — model × tokens × frequency คือ cost drivers จริง ทำ `/check-bottlenecks`
3. คำนวณ cost จาก pricing ปัจจุบันของ model ที่ใช้ — ดู `https://openai.com/api/pricing` (อย่าเดาราคา)

### 2. Reduce Prompt And Context Size

> Goal: ตัด tokens ที่ไม่จำเป็นออกจาก inputs

1. Trim system prompts — เอาเฉพาะ instructions ที่เปลี่ยน output จริง
2. ลด context: summarize history แทนส่ง full conversation, retrieve เฉพาะ relevant chunks (RAG) แทนส่งทั้ง document
3. ใช้ `max_completion_tokens` cap output — กัน runaway generations
4. Structured output ด้วย `zodResponseFormat` — output สั้นและตรง schema กว่า free-form text

### 3. Cache And Reuse

> Goal: ลด repeated input tokens

1. ใช้ prompt caching — static prefix (system prompt, shared context) วางก่อน dynamic parts เพื่อให้ cache hit (ดู official docs สำหรับ cache requirements)
2. Cache responses ฝั่ง app — identical requests ไม่ต้องเรียกซ้ำ
3. Batch API สำหรับงานที่ไม่ต้อง real-time — ถูกกว่า sync calls (ดู official docs)

### 4. Route Models

> Goal: ใช้ model ที่ถูกพอสำหรับงาน

1. งานง่าย (classification, extraction, short answers) → ใช้ mini/nano tier แทน flagship
2. Route ตาม complexity — flagship เฉพาะงานที่ต้อง reasoning หนัก
3. ทดสอบ quality หลัง downgrade — cost saving ต้องไม่ทำ output แย่ลงเกินรับได้

### 5. Verify And Compare

> Goal: วัดผลหลังแก้เทียบ baseline

1. Compare `usage` tokens และ cost ก่อน/หลัง ด้วย `/report-before-after`
2. ตรวจ output quality ไม่ degrade — run existing evals/tests ถ้ามี
3. ถ้าไม่ดีขึ้นหรือ quality regression → revert จุดนั้นแล้ว report

## Rules

- Log `usage` เสมอ — ห้าม optimize โดยไม่มีข้อมูล consumption
- แก้ทีละจุด — แยกผลของ prompt trim vs caching vs model routing ได้
- preserve output quality — ต้องมีเกณฑ์ยอมรับชัดเจนก่อน downgrade model
- อย่าเดาราคา/limits — ดู official pricing และ model docs เสมอ
- ใช้ `/follow-lib-openai` สำหรับ API reference
- ใช้ `/deep-optimize` ถ้าต้อง optimization pass ที่กว้างกว่า token cost

## Expected Outcome

- Token usage และ cost ลดลงเทียบ baseline ด้วยตัวเลขจริง
- Model routing ใช้ tier ที่เหมาะกับงาน
- Output quality ไม่ degrade เกินเกณฑ์
- Usage logging ครบสำหรับ monitor ต่อเนื่อง
