# Agents And Tool-Use Checklist — review-ai

## Tool Surface

- [ ] ทุก tool มี name/description/params ชัด — model เลือกถูกจากคำอธิบายอย่างเดียว
- [ ] input schema validate ที่ boundary — types, required, enums, ranges ก่อน execute
- [ ] tool output bounded — ไม่ส่ง 1MB response กลับเข้า context
- [ ] destructive/side-effect tools มี confirmation หรือ dry-run flag
- [ ] least privilege — agent ใช้ได้เฉพาะ tools ที่ task ต้องการ

## Loop Control

- [ ] max iterations — loop จบแน่นอน (เช่น ≤10 turns)
- [ ] max tokens/time per run — hard timeout + token ceiling
- [ ] stop conditions ชัด — "done" state เช็คจริง ไม่พึ่ง model บอกเองอย่างเดียว
- [ ] no-progress detection — tool ซ้ำเหมือนเดิม N รอบ → abort

## State And Memory

- [ ] session/tenant scope — memory ไม่ leak ข้าม users
- [ ] history summarization/compaction ตอน context ยาว — ไม่ตัดกลาง tool call
- [ ] idempotent side effects — retry ไม่กระทำซ้ำ (dedup key)
- [ ] audit log — tool calls + outcomes เก็บ trace ได้

## Failure Handling

- [ ] tool error → structured error กลับให้ model (ไม่ใช่ stack trace ดิบ)
- [ ] model refuse/timeout → graceful degrade + user message
- [ ] parallel tool calls ไม่ race กัน (shared state)

## Detection

- grep `tools:`, `function_call`, `toolCall`, `maxIter`, `while` loops รอบ LLM call
- ตรวจว่า tool dispatch มี allowlist/permission layer หรือไม่

Severity: unguarded destructive tool = Critical, no loop bound = High, no audit log = Medium
