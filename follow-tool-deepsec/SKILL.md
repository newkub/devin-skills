---
name: follow-tool-deepsec
description: ใช้ deepsec ครบวงจร — AI security review ของ codebase — init/scan/process/revalidate/export, matcher generation, sandboxed runs, resume
argument-hint: "[command] [--project-id <id>]"
allowed-tools:
  - exec
  - read
  - write
  - edit
  - grep
  - find_file_by_name
related:
  - check-secrets
  - deep-review
  - report
---

## Goal

รัน deepsec (deepsec.sh — Vercel OSS) เพื่อ AI-driven security review ของ repo — pipeline: inventory codebase → fast pattern scan (free) → AI review ของ flagged files (paid) → findings ใน `.deepsec/` workspace ที่ resume ได้เสมอ

## Scope

ใช้เมื่อต้องการ security audit เชิงลึกของ codebase ด้วย AI agent — secrets hygiene ระดับ config/env → `/check-secrets`; general code review → `/deep-review`; deepsec = dedicated security pipeline ที่ track state, matchers และ findings ต่อ project

- Boundary: deepsec อ่าน source code ด้วย AI agent ที่ auth เข้า model provider — รันเฉพาะบน code ที่ trust ระดับนั้น; untrusted PRs → guarded CI mode หรือ sandboxes

## Execute

### 1. Init

> Goal: ตั้งค่า workspace และรัน scan แรก

1. `bunx deepsec init` ที่ repo root — เลือก model (ตาม DeepSecBench score/cost) + model access (Vercel AI Gateway default, own API key, หรือ local subscriptions)
2. สร้าง `.deepsec/` (สิ่งเดียวที่เพิ่มใน repo) → inventory → pattern scan → AI review
3. Headless/CI: `bunx deepsec init --yes --model-profile value --output jsonl` (profile: `best`/`value`/`budget`); preview: `--plan --output json`
4. Scaffold เฉยๆ: `bunx deepsec init --scaffold-only` → review `.deepsec/` skeleton ก่อนรันจริง

### 2. Resume And Bound

> Goal: คุมเวลา/ต้นทุนและต่อจากจุดเดิม

1. รัน command เดิมซ้ำ — finished steps ถูก skip อัตโนมัติ (หลัง Ctrl-C, cost limit, connection loss)
2. Bound ด้วย `--max-cost-usd 100 --max-duration 2h` — duration ต้องมี unit (`ms`/`s`/`m`/`h`)
3. Exit code `2` = ต้องการ input ที่ headless ให้ไม่ได้ (JSON output บอกวิธี resume); `3` = ถึง cost/duration limit

### 3. Everyday Commands

> Goal: ทำงานใน `.deepsec/` workspace

```bash
cd .deepsec
bunx deepsec status       # สถานะ pipeline
bunx deepsec scan         # fast pattern scan — free, local
bunx deepsec process      # AI review — ตัวเสียเงิน
bunx deepsec revalidate   # re-check findings, ตัด false positives
bunx deepsec export --format md-dir --out ./findings
bunx deepsec report       # overview เร็ว
```

- Multi-repo: `bunx deepsec init-project ../svc --id svc` + `bunx deepsec setup --project-id svc`; commands อื่นส่ง `--project-id`

### 4. Auth Options

> Goal: เลือก credential route ให้ถูก

1. **Vercel AI Gateway** (default): login Vercel อัตโนมัติ ระหว่าง init
2. **Own key**: `MY_KEY=... bunx deepsec init --agent codex --model-auth direct --ai-provider openai --ai-api-key-env MY_KEY` — deepsec เก็บแค่ *ชื่อ* env var ไม่เก็บ key; ใส่ใน `.deepsec/.env.local` สำหรับรอบถัดไป
3. **Local subscriptions**: `--model-auth local` ถ้า `claude`/`codex` CLI login อยู่แล้ว — ยกเว้น `sandbox` ที่ยังต้อง `AI_GATEWAY_API_KEY`

### 5. Review Artifacts

> Goal: ปรับคุณภาพ findings

1. `data/<project>/INFO.md` — คำอธิบาย codebase ที่ inject เข้าทุก AI investigation — แก้ให้แม่น = findings ดีขึ้น
2. `.deepsec/generated-matchers.ts` — scan patterns ที่ deepsec gen เพื่อ cover gaps — review + commit
3. Coverage pause (setup หยุดเพราะ inventory ไม่ครบ) → แก้ matchers แล้ว re-run (repair attempts ≤2)

### 6. Sandboxes และ Report

> Goal: รันแบบ isolated / สรุปผล

- `bunx deepsec sandbox process --project-id my-app --sandboxes 10 --concurrency 4` — isolated Vercel sandboxes, host เก็บ credentials (sandbox ไม่เห็น real keys)
- สรุป findings ให้ user ด้วย `/report`; triage เข้า fix pipeline ผ่าน `/deep-review`

## Rules

### 1. Trust Boundary

- รันเฉพาะบน repo ที่ trust ให้ AI agent อ่าน — untrusted code → CI guarded mode หรือ `--sandboxes`
- secrets ไม่ commit ลง `.deepsec` ที่ share กับคนอื่น — เก็บใน `.env.local`

### 2. Cost Discipline

- `scan` = free (local patterns); `process`/`revalidate`/`triage` = paid AI — bound ด้วย `--max-cost-usd` เสมอใน session แรก
- Resume-friendly: ไม่ต้องกลัว interrupt — re-run command เดิมเสมอ

### 3. Own The Matchers

- Review `generated-matchers.ts` ก่อน commit — มันกำหนด scan coverage
- `INFO.md` stale = findings หลอก — อัปเดตเมื่อ codebase เปลี่ยนใหญ่

- ใช้ /check-secrets ก่อน/หลัง scan สำหรับ hygiene ทั่วไป
- ใช้ /report สำหรับสรุป findings

## Expected Outcome

- `.deepsec/` workspace พร้อม scan → AI review → exportable findings
- ทุก run resume ได้, bounded cost, credentials ไม่ leak เข้า sandbox/report
