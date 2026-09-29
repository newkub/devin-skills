---
name: review-ai-check-rag
description: Check RAG pipeline — retrieval quality, chunking, thresholds, staleness
argument-hint: "[scope]"
related:
  - review-ai
  - report
---

## Goal

Run the RAG/retrieval dimension of `/review-ai` แบบ focused — retrieval คืน context ที่ถูกและพอ

## Scope

- ใช้เมื่อ `/review-ai` dispatch มาที่ `rag`/`retrieval` หรือเรียก standalone
- ครอบคลุม: chunking strategy, embedding/retrieval quality, score thresholds, rerank, freshness/re-embed

## Execute

### 1. RAG Checks

> Goal: retrieval quality วัดและคุมได้

ทำตาม `../../subagents/ai-reviewer/rag.md`

1. chunking — size/overlap เหมาะกับ content type, ไม่ตัดกลางประโยค/semantic unit
2. retrieval — top-k + score threshold มี, fallback เมื่อ retrieval ว่าง
3. rerank/filtering — metadata filters, reranker เมื่อ recall สำคัญ
4. freshness — re-embed path เมื่อ source เปลี่ยน, stale index detection
5. grounding — context ส่งเข้า prompt มี citation/source tracking หรือไม่

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Component`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี evidence: pipeline code + config
- no-threshold retrieval ที่ผลลัพธ์ผิดเข้า prompt = High

## Expected Outcome

- RAG findings แยก chunking/retrieval/rerank/freshness/grounding
- Quality gaps พร้อม fix direction
