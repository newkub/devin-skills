# RAG / Retrieval Checklist — review-ai

## Ingestion

- [ ] chunking strategy ระบุชัด — size (เช่น 500–1000 tokens), overlap (10–15%), semantic boundaries (heading/paragraph)
- [ ] metadata ต่อ chunk — source, section, updated_at, ACL/tenant id
- [ ] dedup ตอน ingest — content hash หรือ doc version
- [ ] stale content path — เอกสารเปลี่ยน/ลบแล้ว index อัปเดตได้

## Embeddings

- [ ] embedding model pinned — version/dimension ระบุ, ไม่ auto-upgrade
- [ ] index dimension ตรง model — mismatch ทำ retrieval พังเงียบๆ
- [ ] re-embed path ตอนเปลี่ยน model — migration script/job
- [ ] query vs document embedding — ใช้ model/task type เดียวกัน (asymmetric vs symmetric)

## Retrieval Quality

- [ ] top-k สมเหตุสมผล (ไม่ over-fetch แล้วตัดทิ้ง)
- [ ] score threshold — ไม่มี result ต่ำกว่า floor หลุดเข้า context
- [ ] rerank pass สำหรับ candidate หลายตัว (cross-encoder หรือ LLM rerank)
- [ ] metadata filter — tenant/user scope บังคับที่ query ไม่ใช่หลังคำตอบ
- [ ] citation mapping — chunk → source ส่งกลับให้ model/user อ้างถึงได้

## Context Assembly

- [ ] token budget ต่อ retrieval — ไม่ล้น context window หลังรวม history
- [ ] ordering สอดคล้อง — ตำแหน่งสำคัญ (ต้น/ท้าย) ได้ context ที่ relevant ที่สุด
- [ ] fallback เมื่อ retrieval ว่าง/คุณภาพต่ำ — บอก "ไม่พบข้อมูล" แทนการ hallucinate

## Detection

- grep `embed`, `vector`, `chunk`, `topK`, `similarity`, `rerank`, `retriev`
- ตรวจ index config + migration history

Severity: wrong-dimension/ACL-bypass = Critical, no threshold = High, no rerank/dedup = Medium
