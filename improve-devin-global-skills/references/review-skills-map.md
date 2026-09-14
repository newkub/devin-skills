# Review Skills Map

Catalog ครบทุก `review-*` skill (57 ตัว) สำหรับ dispatch ใน improve workflow — เลือกตาม tier แล้วรัน independent แบบ parallel ผ่าน `/follow-parallel` (≤10 ต่อ batch)

> Canonical dispatch catalog สำหรับ codebase review อยู่ที่ `deep-review/references/review-skills.md` — ไฟล์นี้เก็บเฉพาะ tier/dispatch condition สำหรับ context "improve devin global skills"; ถ้าเพิ่ม/ลบ/merge `review-*` skill ให้อัปเดตทั้งสองไฟล์

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
| 1 | `/review-quality` | quality, naming, consistency, bug-prone patterns ของ SKILL.md/references/scripts | default |
| 2 | `/review-writing` | writing quality, naming conventions, discoverability | default |
| 3 | `/review-docs` | docs structure, README/AGENTS ก่อน update | default |
| 4 | `/review-coverage` | declared surface เทียบของจริง — skills ที่อ้างใน rules/AGENTS มีจริง | default |
| 5 | `/review-dot-devin` | `.devin/` structure, hooks, `.devin/rules`, ast-grep rules, `AGENTS.md` ถูกต้อง ไม่ซ้ำซ้อน | default |
| 6 | `/review-workflow` | workflow ในแต่ละ skill เร็ว ปลอดภัย ไม่ซ้ำซ้อน ไม่เกิน scope | default |
| 7 | `/review-config` | config files ใน repo: `package.json`, hooks config, MCP config, drift | default |
| 8 | `/review-architecture` | modularity, isolation, boundaries ของ skill packages และ orchestration | default |
| 9 | `/review-cli` | CLI tools ใน `src/`, `tools/`, scripts ของ skills — commands, exit codes, I/O contract | เมื่อ repo มี CLI/scripts |
| 10 | `/review-mcp` | MCP server configs ที่ skills อ้างถึง — tool naming, schemas, auth | เมื่อมี MCP references |
| 11 | `/review-security` | secrets ใน skills, unsafe commands, hooks ที่อาจรัน code อันตราย | default |
| 12 | `/review-techstack` | tools/CLI ที่ skills อ้าง — versions, security, ยัง maintained | default |
| 13 | `/review-dependencies` | deps ใน `package.json`/`Cargo.toml` ของ repo — outdated, vulnerabilities | เมื่อมี manifest |
| 14 | `/review-delivery` | docs, DX, CI/CD, release pipeline ของ skills repo | default |
| 15 | `/review-workspace` | workspace manifest, deps, scripts, config ของ repo | เมื่อ repo เป็น monorepo หรือมี manifest |

## Domain

dispatch เมื่อ skill ที่กำลัง improve ครอบคลุม domain นั้น (ดูจากชื่อ/description ของ skill) — ใช้ตรวจ technical accuracy ของ content ใน skill

| No. | Skill | Domain | Dispatch เมื่อ improve skill ที่เกี่ยวกับ |
|-----|-------|--------|------------------------------------------|
| 1 | `/review-api` | REST conventions, versioning, errors | API design, OpenAPI, endpoints |
| 2 | `/review-auth` | identity, sessions, tokens, OAuth, RBAC | auth, login, permission |
| 3 | `/review-backend` | backend 7 sub-reviews | backend, service, database flow |
| 4 | `/review-frontend` | components, state, rendering, forms | frontend, React/Vue/Solid/Svelte |
| 5 | `/review-uxui` | design system, visual, interaction | UX/UI, design |
| 6 | `/review-accessibility` | WCAG, ARIA, keyboard, contrast | a11y, accessible UI |
| 7 | `/review-mobile` | touch targets, safe areas, lifecycle | iOS, Android, Capacitor, Flutter |
| 8 | `/review-seo` | technical SEO, structured data, CWV | SEO, sitemap, meta |
| 9 | `/review-i18n` | message catalogs, RTL, pluralization | i18n, l10n, translation |
| 10 | `/review-database` | schema, indexes, queries, migrations | database, ORM, Drizzle |
| 11 | `/review-events` | event schemas, ordering, idempotency, DLQ | event-driven, webhooks |
| 12 | `/review-observability` | metrics, tracing, logging, alerting | observability, SigNoz, monitoring |
| 13 | `/review-performance` | network, build, runtime, memory, caching | performance, optimization |
| 14 | `/review-stability` | error handling, recovery, debuggability | stability, resilience |
| 15 | `/review-bundle` | bundle size, chunks, tree-shaking, images/fonts/media | bundler, build output, assets |
| 16 | `/review-ai` | prompts, token cost, guardrails, evals | AI, LLM, agent SDK |
| 17 | `/review-algorithm` | complexity, correctness, hot paths | algorithms, data structures |
| 18 | `/review-data-validation` | validation ใน API, forms, schemas | validation, Zod, ArkType |
| 19 | `/review-business` | payment, subscription, feature flags | business logic, Stripe, billing |
| 20 | `/review-test` | test strategy, quality, coverage | testing, TDD, Vitest, Playwright |
| 21 | `/review-migration` | migration plan, execution checklist | migration, upgrade path |
| 22 | `/review-cost` | infra cost, idle resources | cost, cloud resources |
| 23 | `/review-compliance` | GDPR, HIPAA, PCI-DSS, PDPA, consent | compliance, privacy, regulations |
| 24 | `/review-release` | release/deploy readiness | release, deploy, publish |
| 25 | `/review-dx` | dev loop, onboarding, error messages, ergonomics | DX, scripts, tooling |
| 26 | `/review-desktop-app` | window, tray, IPC, packaging, auto-update | desktop, Tauri, Electron |
| 27 | `/review-browser-ext` | manifest, permissions, content scripts | extension, manifest v3, content script |
| 28 | `/review-iac` | IaC state, secrets, drift, K8s specs | Terraform, Pulumi, CDK, Helm |
| 29 | `/review-sdk` | public API surface, exports, semver, types | library, package, SDK, exports |

## Target

dispatch เมื่อ target ของ improve เป็น artifact เหล่านี้แทนที่จะเป็น skill content

| No. | Skill | Target | Dispatch Condition |
|-----|-------|--------|-------------------|
| 1 | `/review-diff` | git diff | มี diff ที่ต้องตัดสินใจ keep/revert |
| 2 | `/review-github-pr` | GitHub PR | target คือ PR ที่เปิดอยู่ |
| 3 | `/review-issue` | issue | target คือ issue/plan item |
| 4 | `/review-plan` | plan document | มี plan ก่อน execute |
| 5 | `/review-idea` | idea | มี idea ที่ต้องประเมินก่อน implement |
| 6 | `/review-implement` | implementation readiness | ก่อน execute implement-* |
| 7 | `/review-update` | drift current vs target | ก่อน update เพื่อจัดลำดับ |
| 8 | `/review-refactor` | pre-refactor baseline | ก่อน refactor skill ใดๆ |
| 9 | `/review-risk` | risk assessment | change เสี่ยงสูง, breaking |
| 10 | `/review-by-stakeholder` | persona lens | ต้องการ multi-perspective review |

## Meta

| No. | Skill | ใช้เพื่อ |
|-----|-------|----------|
| 1 | `/review-gaps` | รวม findings จาก dimensional reviews เป็น prioritized improvement list (ใช้โดย `/improve`) |
| 2 | `/review-then-fix` | alias → `/deep-review-then-fix` เมื่อ user confirm ให้แก้ตาม findings |

## Selection Rules

1. ทำ `core` เสมอ — baseline และ re-check หลังแก้ไข
2. เลือก `skills-repo` ทั้งหมดที่ condition ตรง — ค่า default สำหรับ global skills repo
3. เลือก `domain` เฉพาะที่ตรงกับ skill ใน scope — ห้าม dispatch domain ที่ไม่เกี่ยว
4. เลือก `target` ตาม artifact ที่อยู่ใน scope
5. ใช้ `meta` เพื่อ aggregate — `/review-gaps` หลัง dimensional reviews, `/review-then-fix` เมื่อ confirm แก้
6. Independent skills → `/follow-parallel` ≤10 ต่อ batch; มี dependency → รันตามลำดับ
