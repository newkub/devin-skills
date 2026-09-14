# Review Skills Dispatch

Catalog `review-*` ทั้งหมด (58 ตัว) สำหรับ `deep-review` — dispatch ครบทุกตัว **ยกเว้น `/review-github-pr`** (PR-scoped — ใช้แยกต่างหากผ่าน `/review-github-pr`)

## Pipeline ต่อ Workspace

รันตามลำดับ phase ต่อ workspace — entry/config ก่อนเสมอ แล้วไล่ไป source code → cross-cutting metrics → meta

### Phase 1 — Entry (config/stack/structure)

| No. | Skill | ตรวจอะไร | Condition |
|-----|-------|----------|-----------|
| 1 | `/review-config` | config files, drift, missing, duplicate, shared config | ทุก workspace |
| 2 | `/review-techstack` | tech stack, versions, library design | ทุก workspace |
| 3 | `/review-architecture` | modularity, isolation, boundaries, resilience | ทุก workspace |
| 4 | `/review-workspace` | manifest, deps, scripts ของ workspace | monorepo members |
| 5 | `/review-workflow` | workflows/pipelines ใน workspace | ทุก workspace |
| 6 | `/review-dot-devin` | `.devin/` structure, hooks, `.devin/rules`, ast-grep rules, `AGENTS.md` | workspace ที่มี `.devin/` หรือ rules |
| 7 | `/review-docs` | docs structure, README, USAGE, FEATURES | workspace ที่มี docs |

### Phase 2 — Source Code

| No. | Skill | ตรวจอะไร | Condition |
|-----|-------|----------|-----------|
| 1 | `/review-quality` | code quality, naming, bug-prone patterns, correctness | ทุก workspace ที่มี source |
| 2 | `/review-writing` | writing quality, discoverability | ทุก workspace |
| 3 | `/review-algorithm` | time/space complexity, hot paths | workspace ที่มี logic |
| 4 | `/review-data-validation` | validation coverage, type-safety | workspace ที่รับ input |
| 5 | `/review-cli` | commands, I/O contract, exit codes | workspace ที่เป็น CLI/TUI |
| 6 | `/review-api` | REST conventions, versioning, errors | workspace ที่ expose API |
| 7 | `/review-sdk` | public API surface, exports, semver, types | workspace ที่ publish package/library |
| 8 | `/review-backend` | backend sub-reviews, data flow | workspace ที่มี backend |
| 9 | `/review-frontend` | components, state, rendering, forms | workspace ที่มี UI code |
| 10 | `/review-mobile` | touch targets, lifecycle, platform conventions | workspace ที่เป็น mobile app |
| 11 | `/review-desktop-app` | window, tray, IPC security, packaging, auto-update | workspace ที่เป็น desktop app |
| 12 | `/review-browser-ext` | manifest v3, permissions, content scripts, CSP | workspace ที่เป็น browser extension |
| 13 | `/review-iac` | Terraform/Pulumi/CDK/K8s, state, secrets, drift | workspace ที่มี IaC |
| 14 | `/review-usage` | usage surface parity — API/CLI/web vs docs promise | workspace ที่มี public usage surface |
| 15 | `/review-database` | schema, indexes, queries, migrations | workspace ที่แตะ DB |
| 16 | `/review-events` | event schemas, ordering, idempotency, DLQ | workspace ที่ใช้ events/queues |
| 17 | `/review-auth` | sessions, tokens, OAuth, RBAC | workspace ที่มี auth |
| 18 | `/review-business` | payment, subscription, feature flags | workspace ที่มี business logic |

### Phase 3 — Cross-Cutting Metrics

| No. | Skill | ตรวจอะไร | Condition |
|-----|-------|----------|-----------|
| 1 | `/review-security` | OWASP, secrets, injection, supply chain | ทุก workspace |
| 2 | `/review-performance` | network, build, runtime, memory, I/O | ทุก workspace |
| 3 | `/review-stability` | error handling, recovery, debuggability | ทุก workspace |
| 4 | `/review-observability` | metrics, tracing, logging, alerting | workspace ที่ deploy จริง |
| 5 | `/review-compliance` | GDPR, PDPA, consent, retention | workspace ที่เก็บ user data |
| 6 | `/review-cost` | compute, storage, idle resources | workspace ที่มี infra |
| 7 | `/review-bundle` | bundle size, chunks, tree-shaking, static assets | workspace ที่ build frontend/lib |
| 8 | `/review-seo` | technical SEO, structured data, CWV | workspace ที่เป็น public web |
| 9 | `/review-i18n` | message catalogs, RTL, formats | workspace ที่มี i18n |
| 10 | `/review-accessibility` | WCAG, ARIA, keyboard, contrast | workspace ที่มี UI |
| 11 | `/review-uxui` | design system, interaction, handoff | workspace ที่มี UI |
| 12 | `/review-ai` | prompts, token cost, guardrails, evals | workspace ที่ใช้ AI/LLM |
| 13 | `/review-mcp` | MCP tool naming, schemas, auth | workspace ที่เป็น/ใช้ MCP |
| 14 | `/review-test` | test strategy, quality, coverage | ทุก workspace ที่มี tests |
| 15 | `/review-coverage` | declared surface เทียบของจริง | ทุก workspace |
| 16 | `/review-dependencies` | outdated, vulnerabilities, unused | workspace ที่มี manifest |
| 17 | `/review-delivery` | docs, DX, CI/CD, infra | ทุก workspace |
| 18 | `/review-dx` | dev loop, onboarding, error messages, ergonomics | workspace ที่มี dev workflow |
| 19 | `/review-release` | release/deploy readiness | workspace ที่ release/deploy |

### Phase 4 — Meta / Conditional

| No. | Skill | ใช้เพื่อ | Condition |
|-----|-------|---------|-----------|
| 1 | `/review-gaps` | รวม findings จาก dimensional reviews เป็น prioritized list | หลัง phase 1-3 เสมอ |
| 2 | `/review-by-stakeholder` | persona lens (staff-engineer, qa, pm, user) | เมื่อต้องการ prioritization หลายมุม |
| 3 | `/review-risk` | probability, impact, mitigation | เมื่อ findings เสี่ยงสูง |
| 4 | `/review-diff` | git diff keep/revert | เมื่อ scope มี diff |
| 5 | `/review-update` | drift current vs target | เมื่อมี target state ให้อัปเดต |
| 6 | `/review-refactor` | pre-refactor baseline | เมื่อ findings ชี้ refactor |
| 7 | `/review-migration` | migration plan + checklist | เมื่อมี migration |
| 8 | `/review-plan` | plan quality | เมื่อ scope คือ plan |
| 9 | `/review-idea` | idea assessment | เมื่อ scope คือ idea |
| 10 | `/review-implement` | implementation readiness/completeness | เมื่อ scope คือ implement |
| 11 | `/review-issue` | issue clarity, scope, acceptance criteria | เมื่อ scope คือ issue |
| 12 | `/review-devin-global-harness` | devin harness layers | เฉพาะเมื่อ target คือ devin skills/agents repo |
| 13 | `/review-then-fix` | alias → `/deep-review-then-fix` | เมื่อ user confirm แก้ findings |

### Phase 5 — Deep (via `/follow-deep`)

dispatch ผ่าน `/follow-deep` ต่อ workspace หลัง phase 1-4 — `follow-deep` เลือก `deep-*` ที่ตรง context; ตารางนี้คือ coverage ที่ต้องพิจารณาครบทุกตัว

| No. | Skill | ตรวจอะไร | Condition |
|-----|-------|----------|-----------|
| 1 | `/deep-analyze` | วิเคราะห์ลึกทุกมิติด้วย tools/scripts/CLI | ทุก workspace |
| 2 | `/deep-trace` | trace execution flow, logs, distributed trace | workspace ที่มี runtime/async flow |
| 3 | `/deep-debug` | debug หลายมิติ reproduce → prevent | เมื่อมี bug findings |
| 4 | `/deep-test` | testing domains: api, cli, contract, coverage, e2e, integration, mutation, visual | ทุก workspace ที่มี tests |
| 5 | `/deep-build` | build หลาย target/platform, bundle analysis | workspace ที่ build |
| 6 | `/deep-optimize` | optimize ครบทุก layer แล้ว dispatch review-* | เมื่อมี perf/quality findings |
| 7 | `/deep-impact` | impact analysis ก่อน change ใหญ่ | เมื่อ findings ชี้ refactor/upgrade |
| 8 | `/deep-research` | ค้นหลายแหล่ง: packages, docs, security | เมื่อต้อง external knowledge |
| 9 | `/deep-validate` | validate ละเอียดหลายมิติ cross-reference | ท้าย pipeline เสมอ |
| 10 | `/deep-retro` | post-incident retrospective | เมื่อเจอ incident/root-cause findings |
| 11 | `/deep-thinking` | วิเคราะห์ปัญหาเป็นระบบไม่ใช้ tools | เมื่อ findings ซับซ้อน/ไม่ชัด |
| 12 | `/deep-plan` | plan ระดับ implementation-ready | เมื่อ findings ต้องการ plan ก่อน fix |

Excluded จาก dispatch: `/deep-review` (ตัวเอง), `/deep-review-then-fix` (fix path ไม่ใช่ review), aliases (`deep-refactor`→`refactor`, `deep-verify`→`run-verify`, `deep-implement-to-production`→`implement-to-production`, `deep-update-project`→`update-project`)

## Excluded

| No. | Skill | เหตุผล |
|-----|-------|--------|
| 1 | `/review-github-pr` | PR-scoped — ใช้แยกเมื่อ review pull request ไม่ใช่ codebase |

## Rules

1. dispatch ครบ phase 1-3 ทุก workspace ยกเว้น condition ที่ N/A ชัดเจน — ห้ามข้ามเพราะ "ไม่น่าจะมีปัญหา"
2. independent skills → `/use-subagents` หรือ `/follow-parallel` ≤10 ต่อ batch
3. subagent อ่าน `reports/review-report.json` + เฉพาะไฟล์ใน evidence — ห้ามรัน CLI ซ้ำ ห้าม sweep ทั้ง codebase
4. ทุก finding ต้องระบุ `ใน update-review-cli` = Y/N — N หมายถึง analyzer gap → ส่งต่อ `/update-review-cli`
5. `fixSkill` field ใน finding เป็น canonical owner — ห้าม map ซ้ำเอง
6. Phase 5 ทำผ่าน `/follow-deep` เสมอ — ครอบคลุม `deep-*` ทุกตัวที่ condition ตรง ไม่เลือกบางตัวเอง
