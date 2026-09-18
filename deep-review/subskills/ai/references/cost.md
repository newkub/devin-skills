# Token Cost Checklist — review-ai

## Measurement

- [ ] in/out token counts เก็บต่อ call — ไม่ใช่แค่ "เรียกแล้ว"
- [ ] cost attribution per feature/user/tenant — รู้ว่าใครเผาเงิน
- [ ] latency วัดคู่กัน — cost ต่ำแต่ช้า 10s ก็ไม่ดี

## Control

- [ ] context budget — max context ต่อ call, truncation/summarize ตอนเกิน
- [ ] model routing — งานง่ายใช้ cheap model, งานยากใช้ expensive
- [ ] caching — prompt prefix cache, embedding cache, response cache (semantic cache ถ้าเหมาะ)
- [ ] retry/backoff — 429/quota → exponential backoff + jitter, max retries
- [ ] budget alerts — spend > threshold → warn/block

## Efficiency

- [ ] prompts กระชับ — ไม่ยัด few-shot ยาวเกินจำเป็น
- [ ] system prompt ไม่ repeat ทุก call ถ้า cache ได้
- [ ] batch endpoints สำหรับงานที่ไม่ต้อง real-time
- [ ] small model สำหรับ routing/classification — ไม่ใช่ model ใหญ่ทุกงาน

## Detection

- grep `usage`, `total_tokens`, `cost` — มี logging หรือไม่
- ตรวจ retry config, timeout, rate-limit handling รอบ SDK calls
- เช็คว่า model ถูก hardcode ตัวเดียวกันทุกที่ (no routing)

Severity: no tracking at all = High, no retry/budget = Medium, no routing = Low–Medium
