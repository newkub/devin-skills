# Workflow SDK best practices

## Do

- แยก `workflows/<name>/index.ts` (orchestration) จาก `steps.ts`/`steps/` (work) + `shared/` สำหรับ steps ที่ใช้ร่วม — ลด bundler bugs
- ทำ steps ให้ idempotent — retry 3x อาจรันซ้ำ; charge/email/webhook side-effects ต้อง dedup key
- Return data จาก step เสมอ — pass-by-value, mutation ไม่กลับ workflow
- ใช้ `sleep()`/`createWebhook()` แทน polling loops — suspension ไม่เผา compute
- Generate tokens/secrets ใน step (workflow-seeded random ไม่ใช่ secret จริง)

## Don't

- อย่าเรียก network/fs/db ใน `"use workflow"` — ไม่มี runtime นั้นและทำ replay พัง → `"use step"` เท่านั้น
- อย่า assume step context เมื่อเรียก step นอก workflow — directive เป็น no-op, `getStepMetadata()` throw
- อย่า deploy Vercel โดยไม่เปิด System Env Vars — fallback Local World + read-only FS = ทุก run fail
- อย่าเก็บ state ที่โตเรื่อยๆ ผ่าน step args — replay recompute ดีกว่า ส่ง id แล้ว fetch ใน step

## Perf (v5)

- Inline steps รันหลายตัวต่อ suspension — fan-out ด้วย `Promise.all` ได้ถูกกว่า sequential
- Payloads ถูก compress + encrypt ก่อนเข้า storage — stream ใหญ่ (AI tokens) ~80% เล็กลง
- Prefer many small steps บน Vercel — batching + sealed log ทำให้ถูกลงถึง ~80% compute
