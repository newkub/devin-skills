| Command | Use when |
|---|---|
| `bunx e2e run` | run the whole suite on every target |
| `bunx e2e run tests/x.e2e.ts:12` | run the test at line 12 |
| `bunx e2e run --grep checkout` | tests whose title matches |
| `bunx e2e run --target web` | a single target |
| `bunx e2e explore` | the agent pursues a goal with no test file → reports findings |
| `bunx e2e mcp` | MCP server letting a coding agent inspect/interact with a live app |

| Topic | Details |
|---|---|
| Exit codes | see `docs/reference/errors` — per-agent-step verdicts (`ASSERTION_FAILED`, `ASSERTION_INCONCLUSIVE`, `STEP_NOT_AWAITED`) |
| Output | report + trace page + evidence per run (secrets redacted) |
| CI | GitHub Actions / EAS Workflows / Bitrise / Codemagic — the Node runtime suffices for web; mobile needs simulators |
| Model config | subscriptions (`ChatGPT`, `GitHub Copilot`, `SuperGrok`), API keys via AI SDK provider env (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `AI_GATEWAY_API_KEY`, ...), local servers |
| Env vars | complete list in `docs/reference/environment` — engine + runner variables |
| Custom | tools (test APIs/data setup/device ops), executors (custom agent loop), reporters (custom run events), engines (new platform) |

> Full flag details: https://e2e.tester.army/docs/reference/cli
