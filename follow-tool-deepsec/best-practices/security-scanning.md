# deepsec best practices

## Do

- เริ่มด้วย `--scaffold-only` หรือ `--plan --output json` บน repo ใหม่ — review `.deepsec/` skeleton ก่อนเสียเงิน
- ตั้ง `--max-cost-usd` + `--max-duration` เสมอในรอบแรก — AI review อาจใช้หลายชั่วโมงบน repo ใหญ่
- แก้ `INFO.md` ให้แม่น (entry points, auth boundaries, risky areas) — คุณภาพ findings ขึ้นตรงๆ
- Commit `generated-matchers.ts` หลัง review — มันคือ scan coverage ของ repo นั้น
- Re-run command เดิมหลัง interrupt — state ใน `.deepsec/` ทำ resume ให้ฟรี

## Don't

- อย่ารันบน untrusted PR/code แบบตรงๆ — ใช้ guarded CI mode หรือ `sandbox` (isolate บน Vercel, host เก็บ creds)
- อย่าเก็บ API key ใน config — deepsec เก็บแค่ env var *name*; key อยู่ใน `.env.local` หรือ env
- อย่าคาดหวัง `--model-auth local` กับ `sandbox` — machine login broker เข้า sandbox ไม่ได้ ต้อง `AI_GATEWAY_API_KEY`
- อย่าเพิกเฉย coverage pause — เช็ค inventory state + repair `generated-matchers.ts` ก่อน process

## Flow

- `scan` (free) → ดู candidates → `process` (paid) → `revalidate` (cut FPs) → `export`/`report`
- findings → triage เข้า `/deep-review` domain `review-security` หรือ fix pipeline ของ project
