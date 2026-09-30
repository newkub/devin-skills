# Review Skills Map

Catalog ครบทุก `review-*` skill (58 ตัว) สำหรับ dispatch ใน improve workflow — เลือกตาม tier แล้วรัน independent แบบ parallel ผ่าน `/follow-parallel` (≤10 ต่อ batch)

> Canonical dispatch catalog สำหรับ codebase review อยู่ที่ `deep-review/SKILL.md` — ไฟล์นี้เก็บเฉพาะ tier/dispatch condition สำหรับ context "improve devin global skills"; ถ้าเพิ่ม/ลบ/merge `review-*` skill ให้อัปเดตทั้งสองไฟล์

## Tiers

- `core` — ทำเสมอทุกครั้ง ก่อนและหลัง improve
- `skills-repo` — ครอบคลุม content/structure/config ของ skills repo โดยตรง — dispatch เป็น default เมื่อ scope คือ global skills
- `domain` — dispatch เมื่อ skill ที่ปรับปรุงครอบคลุม domain นั้น หรือ findings ชี้ไป domain นั้น (เช่น skill ที่สอน API, frontend, security)
- `target` — dispatch เมื่อ target ไม่ใช่ skill content โดยตรง แต่เป็น diff, PR, issue, plan, idea, refactor, migration
- `meta` — aggregation และ alias — ใช้รวม findings หรือส่งต่อ ไม่ใช่ content domain

## Core

| No. | Skill | ตรวจอะไร |
|-----|-------|----------|
| 1 | `/review-devin-global-harness` | ทุก layer ของ harness: skills, subagents, hooks, MCP, global rules + cross-layer alignment, redundancy, refs integrity, context rot |

## Skills-Repo

| No. | Skill | ตรวจอะไร | Dispatch Condition |
|-----|-------|----------|-------------------|
| 1 | `/deep-review` | quality, naming, consistency, bug-prone patterns ของ SKILL.md/references/scripts | default |
| 2 | `/deep-review` | writing quality, naming conventions, discoverability | default |
| 3 | `/deep-review` | docs structure, README/AGENTS ก่อน update | default |
| 4 | `/deep-review` | declared surface เทียบของจริง — skills ที่อ้างใน rules/AGENTS มีจริง | default |
| 5 | `/deep-review` | `.devin/` structure, hooks, `.devin/rules`, ast-grep rules, `AGENTS.md` ถูกต้อง ไม่ซ้ำซ้อน | default |
| 6 | `/deep-review` | workflow ในแต่ละ skill เร็ว ปลอดภัย ไม่ซ้ำซ้อน ไม่เกิน scope | default |
| 7 | `/deep-review` | config files ใน repo: `package.json`, hooks config, MCP config, drift | default |
| 8 | `/deep-review` | modularity, isolation, boundaries ของ skill packages และ orchestration | default |
| 9 | `/deep-review` | CLI tools ใน `src/`, `tools/`, scripts ของ skills — commands, exit codes, I/O contract | เมื่อ repo มี CLI/scripts |
| 10 | `/deep-review` | MCP server configs ที่ skills อ้างถึง — tool naming, schemas, auth | เมื่อมี MCP references |
| 11 | `/deep-review` | secrets ใน skills, unsafe commands, hooks ที่อาจรัน code อันตราย | default |
| 12 | `/deep-review` | tools/CLI ที่ skills อ้าง — versions, security, ยัง maintained | default |
| 13 | `/deep-review` | deps ใน `package.json`/`Cargo.toml` ของ repo — outdated, vulnerabilities | เมื่อมี manifest |
| 14 | `/deep-review` | docs, DX, CI/CD, release pipeline ของ skills repo | default |
| 15 | `/deep-review` | workspace manifest, deps, scripts, config ของ repo | เมื่อ repo เป็น monorepo หรือมี manifest |

## Domain

dispatch เมื่อ skill ที่กำลัง improve ครอบคลุม domain นั้น (ดูจากชื่อ/description ของ skill) — ใช้ตรวจ technical accuracy ของ content ใน skill

| No. | Skill | Domain | Dispatch เมื่อ improve skill ที่เกี่ยวกับ |
|-----|-------|--------|------------------------------------------|
| 1 | `/deep-review` | REST conventions, versioning, errors | API design, OpenAPI, endpoints |
| 2 | `/deep-review` | identity, sessions, tokens, OAuth, RBAC | auth, login, permission |
| 3 | `/deep-review` | backend 7 sub-reviews | backend, service, database flow |
| 4 | `/deep-review` | components, state, rendering, forms | frontend, React/Vue/Solid/Svelte |
| 5 | `/deep-review` | design system, visual, interaction | UX/UI, design |
| 6 | `/deep-review` | WCAG, ARIA, keyboard, contrast | a11y, accessible UI |
| 7 | `/deep-review` | touch targets, safe areas, lifecycle | iOS, Android, Capacitor, Flutter |
| 8 | `/deep-review` | technical SEO, structured data, CWV | SEO, sitemap, meta |
| 9 | `/deep-review` | message catalogs, RTL, pluralization | i18n, l10n, translation |
| 10 | `/deep-review` | schema, indexes, queries, migrations | database, ORM, Drizzle |
| 11 | `/deep-review` | event schemas, ordering, idempotency, DLQ | event-driven, webhooks |
| 12 | `/deep-review` | metrics, tracing, logging, alerting | observability, SigNoz, monitoring |
| 13 | `/deep-review` | network, build, runtime, memory, caching | performance, optimization |
| 14 | `/deep-review` | error handling, recovery, debuggability | stability, resilience |
| 15 | `/deep-review` | bundle size, chunks, tree-shaking, images/fonts/media | bundler, build output, assets |
| 16 | `/deep-review` | prompts, token cost, guardrails, evals | AI, LLM, agent SDK |
| 17 | `/deep-review` | complexity, correctness, hot paths | algorithms, data structures |
| 18 | `/deep-review` | validation ใน API, forms, schemas | validation, Zod, ArkType |
| 19 | `/deep-review` | payment, subscription, feature flags | business logic, Stripe, billing |
| 20 | `/deep-review` | test strategy, quality, coverage | testing, TDD, Vitest, Playwright |
| 21 | `/deep-review` | migration plan, execution checklist | migration, upgrade path |
| 22 | `/deep-review` | infra cost, idle resources | cost, cloud resources |
| 23 | `/deep-review` | GDPR, HIPAA, PCI-DSS, PDPA, consent | compliance, privacy, regulations |
| 24 | `/deep-review` | release/deploy readiness | release, deploy, publish |
| 25 | `/deep-review` | dev loop, onboarding, error messages, ergonomics | DX, scripts, tooling |
| 26 | `/deep-review` | window, tray, IPC, packaging, auto-update | desktop, Tauri, Electron |
| 27 | `/deep-review` | manifest, permissions, content scripts | extension, manifest v3, content script |
| 28 | `/deep-review` | IaC state, secrets, drift, K8s specs | Terraform, Pulumi, CDK, Helm |
| 29 | `/deep-review` | public API surface, exports, semver, types | library, package, SDK, exports |
| 30 | `/deep-review` | usage surface parity — docs promise vs API/CLI/web จริง | usage, USAGE.md, CLI, public API |

## Target

dispatch เมื่อ target ของ improve เป็น artifact เหล่านี้แทนที่จะเป็น skill content

| No. | Skill | Target | Dispatch Condition |
|-----|-------|--------|-------------------|
| 1 | `/deep-review` | git diff | มี diff ที่ต้องตัดสินใจ keep/revert |
| 2 | `/review-github-pr` | GitHub PR | target คือ PR ที่เปิดอยู่ |
| 3 | `/deep-review` | issue | target คือ issue/plan item |
| 4 | `/deep-review` | plan document | มี plan ก่อน execute |
| 5 | `/deep-review` | idea | มี idea ที่ต้องประเมินก่อน implement |
| 6 | `/deep-review` | pre-refactor baseline | ก่อน refactor skill ใดๆ |
| 7 | `/deep-review` | risk assessment | change เสี่ยงสูง, breaking |
| 8 | `/deep-review` | persona lens | ต้องการ multi-perspective review |

## Meta

| No. | Skill | ใช้เพื่อ |
|-----|-------|----------|
| 1 | `/deep-review` | รวม findings จาก dimensional reviews เป็น prioritized improvement list (ใช้โดย `/improve`) |
| 2 | `/deep-review` | alias → `/deep-review-then-fix` เมื่อ user confirm ให้แก้ตาม findings |

## Selection Rules

1. ทำ `core` เสมอ — baseline และ re-check หลังแก้ไข
2. เลือก `skills-repo` ทั้งหมดที่ condition ตรง — ค่า default สำหรับ global skills repo
3. เลือก `domain` เฉพาะที่ตรงกับ skill ใน scope — ห้าม dispatch domain ที่ไม่เกี่ยว
4. เลือก `target` ตาม artifact ที่อยู่ใน scope
5. ใช้ `meta` เพื่อ aggregate — `/deep-review` หลัง dimensional reviews, `/deep-review` เมื่อ confirm แก้
6. Independent skills → `/follow-parallel` ≤10 ต่อ batch; มี dependency → รันตามลำดับ
