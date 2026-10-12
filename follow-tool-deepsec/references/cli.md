| Command | ใช้เมื่อ |
|---|---|
| `bunx deepsec init` | setup + first scan (interactive: model + payment) |
| `bunx deepsec init --plan --output json` | preview setup โดยไม่แก้อะไร |
| `bunx deepsec init --yes --model-profile value --output jsonl` | unattended run — profile: `best`/`value`/`budget` |
| `bunx deepsec init --scaffold-only` | สร้าง `.deepsec/` skeleton เฉยๆ |
| `bunx deepsec init --max-cost-usd 100 --max-duration 2h` | bound run (unit: `ms`/`s`/`m`/`h`) |
| `bunx deepsec status` | สถานะ pipeline (ใน `.deepsec/`) |
| `bunx deepsec scan` | fast local pattern scan — free |
| `bunx deepsec process` | AI review ของ new/changed candidates — paid |
| `bunx deepsec revalidate` | re-check findings, ตัด false positives |
| `bunx deepsec triage` | triage findings |
| `bunx deepsec export --format md-dir --out ./findings` | markdown file ต่อ finding |
| `bunx deepsec report` | overview เร็ว |
| `bunx deepsec setup` | ทำ setup ต่อจาก scaffold |
| `bunx deepsec init-project ../svc --id svc` | เพิ่ม repo เข้า workspace เดิม |
| `bunx deepsec sandbox process --sandboxes 10 --concurrency 4` | isolated Vercel sandbox run |

| Flag | ความหมาย |
|---|---|
| `--agent codex\|claude` | harness ที่รัน AI review |
| `--model-auth direct\|local` | own API key / machine login |
| `--ai-provider openai\|anthropic` + `--ai-api-key-env NAME` | direct provider + env var *name* (ไม่เก็บ key) |
| `--headless` | ไม่ prompt/เปิด browser (auto เมื่อไม่มี TTY) |
| `--project-id` | เลือก project เมื่อ workspace มีหลาย repo |

| Exit code | ความหมาย |
|---|---|
| `2` | ต้องการ input ที่ headless ให้ไม่ได้ — JSON output บอกขั้นตอน resume |
| `3` | ถึง cost/duration limit — re-run command เดิมต่อได้ |

| File | บทบาท |
|---|---|
| `.deepsec/deepsec.config.ts` | project/model route/env config |
| `.deepsec/data/<project>/INFO.md` | คำอธิบาย codebase inject เข้า AI investigation — hand-edit ได้ |
| `.deepsec/generated-matchers.ts` | generated scan patterns — review + commit |
| `.deepsec/.env.local` | env vars สำหรับ commands ถัดไป |
| `.deepsec/node_modules/deepsec/SKILL.md` | docs ตรง version ที่ install — agent อ่านที่นี่ก่อน |

> Docs: https://deepsec.sh/docs/getting-started (+ configuration, writing-matchers, vercel-setup, architecture)
