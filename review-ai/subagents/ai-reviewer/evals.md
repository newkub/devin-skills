# Evals And Observability Checklist — review-ai

## Eval Suite

- [ ] golden sets มีจริง — input → expected output/behavior per feature
- [ ] regression gate — prompt/model change → eval run ก่อน merge/deploy
- [ ] eval metrics ชัด — accuracy, faithfulness, refusal rate, latency, cost per case
- [ ] adversarial cases — injection attempts, out-of-scope, PII probes ใน suite
- [ ] human eval path — sample review สำหรับสิ่งที่ auto-eval วัดไม่ได้

## Observability

- [ ] per-call-site tracing — prompt version, model, tokens, latency, finish reason
- [ ] error rates ต่อ feature — timeouts, refusals, parse failures
- [ ] replay/debug — re-run prompt+context เดิมได้
- [ ] dashboard/alert — quality/cost/latency drift เห็นได้

## Fallback And Degradation

- [ ] LLM down/timeout → user-facing message สุภาพ ไม่ใช่ spinner ตลอดไป
- [ ] degraded mode — non-AI path ยังใช้งานได้ (search fallback, cached answer)
- [ ] retry กับ idempotency — retry ไม่กระทำ side effects ซ้ำ

## Feedback Loop

- [ ] user feedback (thumbs up/down, corrections) เก็บเป็น eval data
- [ ] production failures → กลายเป็น eval cases ใหม่
- [ ] eval data freshness — cases สะท้อน distribution จริงปัจจุบัน

## Detection

- grep `eval`, `golden`, `trace`, `langfuse`, `helicone`, `openlit`, `otel`
- ตรวจ CI workflow มี eval step หรือไม่

Severity: no evals + frequent prompt changes = High, no tracing = Medium, no feedback loop = Low
