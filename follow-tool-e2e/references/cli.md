| Command | ใช้เมื่อ |
|---|---|
| `bunx e2e run` | รัน suite ทั้งหมดทุก target |
| `bunx e2e run tests/x.e2e.ts:12` | รัน test ที่ line 12 |
| `bunx e2e run --grep checkout` | tests ที่ title match |
| `bunx e2e run --target web` | target เดียว |
| `bunx e2e explore` | agent ทำ goal โดยไม่มี test file → report findings |
| `bunx e2e mcp` | MCP server ให้ coding agent inspect/interact live app |

| หัวข้อ | รายละเอียด |
|---|---|
| Exit codes | ดู `docs/reference/errors` — verdicts ต่อ agent step (`ASSERTION_FAILED`, `ASSERTION_INCONCLUSIVE`, `STEP_NOT_AWAITED`) |
| Output | report + trace page + evidence ต่อ run (redacted secrets) |
| CI | GitHub Actions / EAS Workflows / Bitrise / Codemagic — Node runtime พอสำหรับ web; mobile ต้อง simulators |
| Model config | subscriptions (`ChatGPT`, `GitHub Copilot`, `SuperGrok`), API keys ผ่าน AI SDK provider env (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `AI_GATEWAY_API_KEY`, ...), local servers |
| Env vars | ครบใน `docs/reference/environment` — engine + runner variables |
| Custom | tools (test APIs/data setup/device ops), executors (custom agent loop), reporters (custom run events), engines (platform ใหม่) |

> รายละเอียดทุก flag: https://e2e.tester.army/docs/reference/cli
