---
name: update-devin-global-skills
description: "จัดการ global Devin skills: สร้าง อัปเดต refactor และตรวจสอบมาตรฐาน"
argument-hint: "[@files-or-topic...]"
related:
  - idea-use-skills-relations
  - new-skills
  - refactor-skills
  - follow-single-of-source
  - review-delivery
  - review-release
  - review-docs
  - check-content-correctness
  - deep-research
  - deep-validate
  - learn-from-web
  - learn-from-cli
  - learn-from-dts
  - report
  - ship
  - use-subagents

---

## Goal

สร้าง อัปเดต หรือ refactor global Devin skills ใน `%APPDATA%\devin\skills` ให้ทันสมัย ถูกต้อง และสอดคล้องมาตรฐาน repo — skill นี้เป็น single-file package เก็บ conventions ทั้งหมดใน `## Conventions`

## Scope

ใช้สำหรับ skill ใหม่หรือ skill ที่มีอยู่: อัปเดต skill เดียว หลาย skill หรือทั้ง repo; สร้าง skill ใหม่จาก idea/topic (skill เดียวแบบ focused → `/new-skills`); refactor ให้ SRP ชัดเจน (restructure → `/refactor-skills`); จัด `subskills/`/`subagents/` ตาม `## Conventions → Subskills And Subagents`

## Execute

### 1. Prepare Context
> Goal: รู้ environment, conventions, และ scope ก่อนลงมือ

1. ตรวจจับ skills dir จาก path: Devin CLI → `%APPDATA%\devin\skills\` หรือ `~/.config/devin/skills/`; Windsurf → `%APPDATA%\Codeium\Windsurf\skills\`; Codex → `~/.codex/skills/`; Claude → `~/.claude/skills/`; OpenCode → `~/.opencode/skills/` — ตรวจไม่ได้ → `/ask-me`
2. อ่าน `global_rules.md` + `AGENTS.md` ของ repo นั้น; ทำ `/review-devin-global-harness` + `/check-reference` ดู skills ที่เกี่ยวข้อง และ `/use-related-skills` พิจารณาใช้ร่วม/ขยาย
3. skill มีอยู่แล้ว → อ่านไฟล์เดิมระบุสิ่งที่ต้องปรับ; long-horizon/context ใกล้เต็ม → `/follow-context-engineering`; context ไม่พร้อมหรือ reference จำเป็นไม่มี → stop และ report

### 2. Identify Targets
> Goal: รู้ว่าต้องสร้าง อัปเดต หรือ refactor skill ใด

1. `@files` → อัปเดตเฉพาะที่ระบุ (`SKILL.md` ยังไม่มี → `/new-skills`); ไม่มี `@files` → เลือก target set จาก topic/family prefix (`follow-*`, `review-*`); ไม่มี scope เลย → `/ask-me` ก่อน ห้าม sweep ทั้ง repo
2. เก็บ target list เป็นตาราง No./Skill/Reason/Priority; ชื่อไม่ชัด → `/ask-me`; หา skills เกี่ยวข้องด้วย `/use-related-skills` + `/search-skills`
3. skills อิสระกันหลายตัว (scope ทั้ง family หรือ >10 skills) → spawn profile `skill-updater` (contract ใน `## Conventions → Subskills And Subagents`) ผ่าน `/use-subagents` ทีละ skill; skills ที่ share refs หรือแก้ `AGENTS.md`/`global_rules.md` ชนกัน → sequential ห้าม spawn — parent sync living documents + `/git-commit` ต่อ batch + validate รวมเสมอ

### 3. Check Duplicates And Refactor Scope
> Goal: ไม่ซ้ำ และรู้ว่าต้องแยกไฟล์ย่อยเมื่อไหร่

1. `/scan-codebase` หา skills ซ้ำ/คล้าย — ซ้ำมาก → แนะนำ update/extend/rename แทนสร้างใหม่
2. `SKILL.md` >250 บรรทัดหรือหลาย responsibility → แยกตาม `## Conventions → When To Split`; restructure → `/refactor-skills`

### 4. Select Template And Structure
> Goal: skill มีโครงสร้างเริ่มต้นที่ถูกต้อง

1. เลือก execute pattern ตาม prefix จาก `## Conventions → Templates` (longest match); ไม่ตรง prefix ใด → `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`
2. สร้าง directory structure ตาม `## Conventions → Directory Structure`; สร้าง app/CLI → `/review-dependencies` ก่อน; user ส่ง URL/domain → `## Conventions → Create From URL`

### 5. Deep Research
> Goal: มีข้อมูลล่าสุดก่อนแก้ไข

1. `/deep-research` ระบุ topic/skill (ข้ามถ้าไม่ต้อง research); เลือก source: docs/site → `/learn-from-web`, CLI → `/learn-from-cli`, library API → `/learn-from-dts` — official docs เป็นแหล่งหลัก
2. `/review-docs` หา stale versions/commands/links; `/review-release` verify latest + breaking changes; `/review-delivery` verify `references/routes.md` เทียบ routes จริง
3. บันทึก latest version, breaking changes, new commands, deprecations, env vars, URLs — หาตัวอย่างจริง ห้ามเดา

### 5b. Prefer Existing CLI Tools Over Custom How-To
> Goal: how-to ใช้ tool จริงที่ติดตั้งแล้ว ไม่เขียน script เองถ้า CLI ทำได้

1. ก่อนเขียน how-to (search/replace, JSON/YAML, diff, benchmark, git, API, screenshots) → เช็ค `check-my-global-cli/references/global-cli-commands.md` + `follow-skills-map/references/tool-map.md` ก่อนเสมอ; tool ตรงปัญหา → อ้าง command จริง (`sd`/`sad` แทน replace เอง, `yq`/`jq` แทน parse, `hyperfine` แทน timing, `xh` แทน curl, `ast-grep` แทน regex refactor, `agent-browser`/`playwright` แทน browser automation)
2. ไม่รู้ว่ามี tool ไหน → `/check-my-global-cli` หรือ `/deep-research`; เขียนเองเฉพาะเมื่อไม่มี tool เลย; พบ tool ที่ไม่มีใน inventory/map → อัปเดตทั้งคู่พร้อมกัน; ติดตั้งผ่าน `mise use -g <tool>` (หรือ scoop/winget)

### 6. Write Or Update SKILL.md
> Goal: `SKILL.md` ถูกต้องตาม spec

1. อัปเดต frontmatter ตาม `## Conventions → Frontmatter Spec`; sections ตาม `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`; `## Execute` ≤10 steps ใช้ `### N. Step Name` + `> Goal:` + numbered list
2. เรียก skill อื่น → `## Conventions → Invoke Skills`; อัปเดต commands/options/examples/env vars/URLs ลบ deprecated ออก; >250 บรรทัด → ย้ายลง `references/` ตาม `When To Split`

### 7. Add References, Subskills, Examples, And Src
> Goal: skill package ครบถ้วนและไม่ซ้ำซ้อน

1. มี dependencies → เขียน `references/` จริงตาม `## Conventions → Write References` (บังคับ); sub-workflows invoke แยกได้ → `subskills/`, subagent profiles → `subagents/` ตาม `Subskills And Subagents`
2. CLI/web/MCP → `src/` ตาม `## Conventions → Src`; templates/examples → `templates/`, `examples/`; ตรวจ markdown links ชี้ไฟล์จริงทั้งหมด

### 8. Validate, Sync And Update References
> Goal: skill ผ่านเกณฑ์ทั้งหมด และ living documents ไม่ stale

1. `/review-devin-global-harness` — conventions/naming/structure; `/check-content-correctness` — commands/APIs/claims; `/think-reframe` เมื่อ skill ใหม่หรือ rewrite ใหญ่
2. `/deep-validate` — frontmatter, sections, ความยาว, `related` missing/unused, TODO/MOCK/placeholder; แก้ `related` → `/check-repo-hygiene circular-dependencies`; มี `.devin/rules/` → `/review-dot-devin`
3. `/update-references` sync refs ทั่ว repo + `/use-related-skills` หา integration; rename/ย้าย → อัปเดต `AGENTS.md`; เกี่ยว global rules → `global_rules.md` + `/update-devin-global-rules`
4. หลังเพิ่ม/ลบ/merge/rename skill หรือ tool → sync living documents ตาม `## Conventions → Living Documents` เสมอ — ไม่ใช่ optional; ไม่ผ่าน → แก้และ recheck (max 3 → stop/report)

### 9. Ship
> Goal: ส่งมอบงาน

ทำ `/ship` — ไม่ผ่าน → report สถานะและ stop — แล้ว `/report` สรุป topic, old/new info, files changed, next actions

## Conventions

### Frontmatter Spec

- Required: `name` (ตรง dir, lowercase คั่น `-`), `description` ≤100 ตัวอักษร; recommended: `argument-hint`, `allowed-tools` (เฉพาะที่จำเป็น), `related` ≤15 (มี dir จริง + ถูก mention ใน body)
- Optional: `model` (`sonnet`/`swe`/`opus`/`codex`), `subagent: true`, `agent: <profile>` (มี precedence เหนือ subagent), `permissions` (`allow`/`deny`/`ask`), `triggers` (default `['user','model']`)
- Body: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome` (+`## Key Concepts`/`## Principles`/`## Guide`/`## Examples` เมื่อต้องการ); backticks สำหรับ tools/commands/paths/skills; ห้าม `**` bold
- `check-*` skills → `allowed-tools` ต้องรวม `exec`, `grep`, `glob`, `find_file_by_name` และใช้ commands/scripts/linters แทนตาเปล่า — ผล reproducible อ้างไฟล์/บรรทัดได้

### Skill Prefixes

`follow-lang-*` runtime · `follow-framework-*` meta/app framework · `follow-service-*` external service/cloud · `follow-lib-*` importable lib · `follow-tool-*` CLI/build tool · `follow-create-*` สร้าง plugins/extensions/CLI/lib · `follow-*` concept/practice (`follow-tdd`, `follow-deploy`) — ไม่ตรง prefix ใด → `follow-` คงเดิม; ครอบหลาย category → เลือกตาม primary responsibility

`check-*` detector pass/fail + locations (read-only) · `review-*` assessor 1 มิติ (findings + severity + evidence) · `deep-*` orchestrator หลายขั้น/หลายมิติ — ทิศทางเดียว `check` → `review` → `## Fix`; ห้ามสร้าง `improve-*`/`optimize-*` top-level ใหม่ — fixer อยู่ใน `## Fix` ของ `review-*`; เบี่ยงจาก template → ระบุเหตุผลใน `## Scope`

ทุก `review-*` ต้องมี `/use-subagents` ใน `related` + กฎ `ใช้ /use-subagents ถ้าจำเป็น` ใน body (ก่อน `## Expected Outcome`) — spawn subagent เมื่อ review items/areas อิสระกันหลายรายการ

### Templates

Execute pattern core ต่อ prefix (เลือก longest match ก่อน เช่น `follow-lib-*` มากว่า `follow-*`):

| Prefix | Execute Pattern Core |
|--------|----------------------|
| `run-*` | prereq check (ขาด → stop) → run พร้อม timeout (non-block long-running, block short tasks) → fail: `/resolve-errors`, dep → `/run-install` retry×1, config → `/review-delivery`; ซ้ำ×3 → stop; report success/duration/metrics; ห้าม destructive โดยไม่ confirm |
| `follow-lib-*` | เช็ค manifest+registry+ecosystem → `/learn` official ยืนยัน install cmd/version/peer deps → config+entry point → `/deep-validate`; บังคับ `references/api/`+`cli.md`+`components/` ตามที่ lib มี (ไม่มี CLI → ระบุเหตุผลใน `## Scope`); หลาย use cases → `subskills/<lib>/` |
| `follow-create-*` | ระบุ target → `../shared/techstack-catalog.md` + `/review-dependencies` → dispatch `follow-create-cli`/`-web`/`-mcp` → scaffold `src/` → dev/build/test ผ่าน → MCP → `mcp_config.json` → `/deep-validate` + `/ship` |
| `follow-*` | เช็ค version ใน manifest (ไม่พบ tool → stop) → `/learn` official + version compat → config minimal diff → typecheck/lint/tests → `/ship`; ไม่ rewrite ทั้งไฟล์ ไม่บังคับ upgrade |
| `setup-*` | prereq + idempotent check (setup แล้ว → verify เท่านั้น) → official docs, secrets → `/follow-secret-manager` ห้าม commit → smoke check (`--version`/`doctor`/`status`); fail → `/resolve-errors`×3 |
| `config-*` | อ่าน current config ก่อน (`/check-config-drift`) → merge เฉพาะ keys จำเป็น ห้าม clobber, secrets ห้ามใน config → verify ด้วย validate command ของ tool → `/report-before-after` |
| `deploy-*` | readiness (build/tests/secrets; มี `deploy-to-<platform>` → ใช้ตัวนั้น) → official CLI staging→prod เก็บ URL+revision, destructive → confirm → smoke test+logs fail → rollback/`/resolve-errors`×3 |
| `migrate-*` | `/plan` from→to + official migration guide + rollback path + backup data → incremental config→deps→code→data ใช้ `/use-astgrep` แทน manual, แยก commit → lint/test/smoke + เช็ค deprecated เหลือ → `/report-before-after`+`/ship` |
| `optimize-*` | baseline ก่อนเสมอ (`/run-bench`, `/check-bottlenecks`) → แก้ทีละจุด impact มาก→น้อย preserve behavior (optimize ≠ เปลี่ยน output) → วัดซ้ำ `/report-before-after`; ไม่ดีขึ้น → revert |
| `improve-*` | `/review-*`/`/check-*` หา targets จริงก่อน ห้ามเดา → apply ทีละตัว preserve behavior ไม่ผสม refactor+behavior ใน commit เดียว → verify lint/tests → `/report` สิ่งที่ดีขึ้น |
| `fix-*` | ยืนยัน root cause ก่อน ห้ามแก้ตาม symptom (ไม่ชัด → `/analyze-root-cause-analysis`/`/deep-debug`) → minimal fix → verify `/run-check` ไม่ regression; fail → `/resolve-errors`×3 |
| `update-*` | อ่านของเดิมเข้าใจ intent ก่อน → minimal + idempotent + `/update-references` ถ้า move/rename → diff before/after verify refs ไม่ stale → `/report-before-after` |
| `check-*` | target+criteria → `/scan-codebase` + grep/ast-grep/jscpd/knip → `scripts/<name>.ts` runnable ซ้ำได้ → Critical/Warning/Info + file:line + recommendation ทุก finding; ครบทุก workspaces รวม gitignored; `allowed-tools` รวม `exec`/`grep`/`find_file_by_name` |
| `analyze-*` | agent วิเคราะห์เองก่อน → ข้อมูลไม่พอ → `/deep-analyze`; repeatable → `/use-scripts` helper ไม่ใช่แทน agent → `/report table` เรียง impact ทุก finding มี evidence (assumption → ระบุ) |
| `deep-*` | ระบุ dimensions → `/deep-research`+`/deep-analyze` ต่อ dimension → cross-reference หา shared root causes → `/report table` เรียง impact/effort + immediate/long-term; ครบทุก dimensions หรือ "no issues" |
| `review-*` | `/scan-codebase`+`/deep-review`+ast-grep → cross-check evidence กรอง false positives → severity Critical/High/Medium/Low/Info + score (weighted 0/25/50/75/100) → fixes grouped immediate/short/long-term `/report-review` |
| `report-*` | `/scan-codebase` จัดกลุ่ม+metrics+patterns → `/report table` headings/lists สรุปบนสุด → next actions + `/suggest-next-action`; ระบุ source+วันที่ ไม่ dump ทั้งหมด |
| `idea-*` | `/deep-analyze`+`/bench-competitors` หา gaps/opportunities → ideas + continuous numbering + scope/impact/effort `/report table` เรียง impact/effort; actionable เท่านั้น ไม่ reset numbering |
| `think-*` | ระบุ frame/assumptions ก่อน → `/deep-thinking` alternatives + `/deep-research` precedents → verdict keep/reframe/split พร้อม pros/cons/rework cost — ไม่ rewrite เอง route ไป `/rewrite`/`/refactor`/`update-*`; เสี่ยง → `/ask-me`; read-only tools |

### Directory Structure

```text
<skill>/ SKILL.md (entry — workflow + dispatch) · references/ (passive knowledge, flat) ·
subskills/<name>/SKILL.md (invocable child) · subagents/<name>.md|<name>/AGENT.md ·
templates/ examples/ scripts/ src/ guide/ .devin/rules/
```

เริ่มต้นด้วย `SKILL.md` เดียว — เพิ่ม subdirs เฉพาะเมื่อจำเป็นจริง; ทุกไฟล์ ≤250 บรรทัด SRP ชัดเจน; `references/` flat — nested → `/flatten-directory --mode refs`; `## Execute` ระบุ CLI/web/MCP → `src/` (`### Src` ด้านล่าง)

`review-*` package = `SKILL.md` + `subagents/` เท่านั้น — ไม่มี `references/`; domain checklists อยู่ใน `subagents/<domain>-reviewer/` (`AGENT.md` profile + topic files ที่ agent อ่านเอง); knowledge ที่ skill อื่นอ่านข้าม (living docs, shared catalogs) → `shared/` ที่ repo root + sync living-documents registry

`follow-create-*` package = `SKILL.md` เดียวเท่านั้น — ไม่มี `references/`; version pins/doc links ไม่ pin ในไฟล์ (stale เร็ว) — Execute ต้องมี step `ทำ /deep-research + /follow-best-practice` เพื่อ live-check เวอร์ชัน/แนวทางล่าสุดก่อน implement ทุกครั้ง; file structure/command pattern ที่จำเป็น inline ใน SKILL.md ได้; merge เนื้อหา references เดิมเข้า `## Execute`/`## Rules` แบบ condensed ก่อนลบ dir

### When To Split

1. `SKILL.md` >250 → ดึงเนื้อหาละเอียดไป `references/<topic>.md` เหลือ high-level workflow + pointer; หลาย responsibility → แยก `references/`; หลาย execute pattern → `templates/`; เนื้อหาซ้ำ skill อื่น → merge; หลาย goals ต่างกันมาก → `subskills/`/`subagents/` ตาม matrix
2. How: ระบุส่วนเกิน/ซ้ำ → สร้างไฟล์ย่อย → แทนด้วย pointer สั้น → อัปเดต internal links → `/review-devin-global-harness` + `/deep-validate`

### Subskills And Subagents

| เนื้อหา | ไปที่ |
|---------|-------|
| parent อ่านเป็น context/lookup (docs, checklists, snapshots) | `references/` |
| workflow invoke แยกได้ มี Goal/Execute ของตัวเอง | `subskills/` |
| งานอิสระต้อง context แยก ทำขนาน หรือ custom tools/model | `subskills/` ตั้ง `subagent: true`/`agent:` หรือ `subagents/` |
| งาน mechanical/deterministic | `scripts/` |

Subskills: `subskills/<name>/SKILL.md` spec เดียวกับ skill ปกติ, `name` = `<parent>-<name>`; runtime ไม่ register เป็น `/command` — parent dispatch ผ่าน `argument-hint` + dispatch table; งาน self-contained → `subagent: true`/`agent:`

Lifecycle prefixes (ใช้เมื่อมีหลาย lifecycle จริง — workflow เดียว/knowledge → `references/`): `setup-` install/config ครั้งแรก · `config-` แก้ config โดยไม่ clobber · `follow-` best practices domain ย่อย · `optimize-` วัด baseline ก่อน-หลัง · `improve-` ปรับคุณภาพ preserve behavior · `update-` minimal diff idempotent · `deploy-` deploy จน live + verify · `migrate-` ย้ายมี rollback · `integrate-` bridge/pipeline · `verify-` post-action check domain · `check-` read-only domain check (parent `check-*` → bare name) · `report-` report format พิเศษ · ~~`fix-`~~ retired → `## Fix` (`shared/review-fix.md`)

Consolidation: top-level skills หลายตัวงานเดียวกันใน domain เดียว → ย้ายไป `parent/subskills/<domain>/`, parent เป็น dispatcher, bulk-update callers `/old` → `/parent` + verify ไม่มี dangling refs ก่อนลบ dir เดิม; กลับกัน subskill เป็น standalone intent → promote เป็น `<parent>-<domain>`; ห้าม `subskills/` สำหรับ pure knowledge → `references/`; ห้ามซ้ำ workflow ทั้ง `references/`+`subskills/`; workflow ของ merged skills ไป `subskills/` ไม่ใช่ `references/`; `/update-references` หลังย้ายเสมอ

Subagents: `subagents/<name>.md` หรือ `subagents/<name>/AGENT.md` — runtime ไม่ register ตรงๆ ต้อง materialize ผ่าน `/update-devin-global-subagents` ไป `.devin/agents/`, `.agents/agents/`, `~/.config/devin/agents/` หรือ `%APPDATA%\devin\agents\`; role มีอยู่แล้ว (`reviewer`, `qa`, `security-auditor`) → อ้าง `agent:` ตรงๆ ห้ามสร้างใหม่; profile frontmatter: `name`, `description`, `model`, `allowed-tools`, `permissions`

Profile `skill-updater` (bulk update): inputs `skill`, `instructions`, `conventions`, `references?`; tools read/write/edit/exec/grep; อ่าน package → apply instructions minimal diff → เช็ค callers (report refs ต้อง follow-up ไม่แก้เอง) → validate frontmatter+≤250+no-placeholder → คืน per-file result table + summary; constraints: แก้เฉพาะ skill ของตัวเอง ห้ามแตะ `AGENTS.md`/`global_rules.md`, ไม่ commit, ไม่เดา content

### Invoke Skills

- Delegate เมื่อ skill อื่นครอบแล้ว — `ทำ /skill-name เพื่อ <เหตุผล>` แทน copy steps; ห้าม copy `## Execute` ของ skill อื่น (SSOT); inline เฉพาะ step เล็กที่ไม่มี skill ครอบ
- Syntax: unconditional `ทำ /x เพื่อ <เหตุผล>`; conditional `ถ้า <เงื่อนไขวัดผลได้> → ทำ /x`; optional `ใช้ /x ถ้าจำเป็น`; pointer `ดูเพิ่มเติม: /x, /y` — ระบุ context ที่ส่งต่อเสมอ (paths, args, evidence)
- Ordering: Foundation → Dependencies → High impact → Critical path → High risk; เคารพ `check` → `review` → `## Fix`; อิสระกัน → parallel ตาม `/follow-parallel`
- `related` contract: ทุกตัวมี dir จริง + ถูก mention ใน body; invocation ควรอยู่ใน `related` (≤15); ห้ามใส่ตัวเอง/ซ้ำ; A เรียก B → พิจารณา reverse link; เปลี่ยน → `/update-references` ทั้งสองทิศ
- Limits: nested dispatch ≤2 ระดับ (ลึกกว่านั้น → orchestrator `deep-*` หรือ `/use-subagents`); ≤~5 skill calls ต่อ step; ห้ามเรียกตัวเอง/deprecated; scope ทับมาก → merge แทน chain ยาว
- Validate: อ่าน SKILL.md ปลายทาง verify contract → `/review-devin-global-harness` (cycles + broken refs) → `/deep-validate`

### Write References

ทุก skill ที่มี dependencies ต้องมี `references/` (บังคับ ห้ามข้าม) — ทุก dependency มีไฟล์ของตัวเองเขียนจริงจาก `/learn-from-web`/`/learn-from-cli`/`/learn-from-dts` (ห้าม placeholder/TODO — learn แล้วไม่เขียน = task ล้มเหลว):

- แต่ละไฟล์ต้องมี: install command จริง, stable version (เผยแพร่ ≥7 วัน — หลีกเลี่ยง `latest`/`*`/unbounded `>=`), peer deps, config + examples จาก official docs, source URL, migration steps ถ้ามี breaking; optional dep → ถามก่อน install
- `website.md` บังคับ: `Website`, `Documentation`, `Repository`, `Package Registry` + description สั้น; `package-manifest.md` สำหรับ lib/package: package, registry, latest + release date, author, license, repo, website, docs, changelog; `cli.md` ตาราง `| commands | description | default | options |`
- `apis.md` สำหรับ `follow-lib-*`/`follow-service-*` มี `## Install`, `## Version`, `## Dependencies`, `## Common API/Commands`, `## Source`; `routes.md` สำหรับ website framework — `/report-uxui-all-routes`, sections `## Page Routes`, `## API Routes`, `## Dynamic Patterns`, `## Authentication Required`; >250 บรรทัด → แยก `references/<dep>/api.md` ฯลฯ; library มี CLI → `cli.md` แยก; หลังเขียน → `/check-reference`

### Src

CLI/terminal/web/browser/MCP → สร้าง `src/`: CLI → `/follow-create-cli` (Rust หรือ Bun/TS); web → `/review-frontend` ก่อน + `/visualize-in-web` HTML entry; MCP → `/follow-create-mcp` (พยายาม Rust) + อัปเดต `mcp_config.json`; ทดสอบ dev/build/run ตาม stack; helper scripts → `/use-scripts`; มี `src/` → `/convert-git-submodules` + `/ship` หลัง validation

### Create From URL

user ส่ง URL/domain → สร้าง parent + subskills:

1. URL เดียว → `/webfetch`; domain → `/web_search` หาหน้าสำคัญ; หลาย URL → `run_subagent` ขนาน ≤10/batch (crawl ลึก → `/learn-from-web` ≤20 URLs/batch); สรุปแต่ละหน้า: หัวข้อ, commands, config, examples — official docs เท่านั้น
2. จัดกลุ่มตามลักษณางาน → `subskills/<domain>/<subskill>/SKILL.md` ชื่อ `<domain>-<subskill>`; parent `<domain>-subskills/SKILL.md` dispatch ตาม argument — `related` ครบทุก subskill; เริ่ม parent + 3-5 subskills ก่อน ไม่สร้างเกินจน user ยืนยัน; validate → `/deep-validate` + `/check-reference` + `/git-commit` + `/report`

### Skill Usage Audit

Audit dead/dying skills (argument `usage`/`skill-usage` — read-only): parse `related:` ทุก `SKILL.md` → นับ inbound + `/review-devin-global-harness`; classify Orphaned (0 inbound + ไม่ถูกอ้างใน `AGENTS.md`/`global_rules.md`), Leaf (0 inbound แต่เป็น entry-point — ไม่ใช่ dead), Hub, Self-referencing; flag ตัวกว้างเกิน/ซ้ำ; report `/report` คอลัมน์ No./Skill/Inbound/Tier/Recommendation (`keep`/`integrate`/`merge`/`delete`) — "0 references ≠ ไร้ค่า"; ลบต้องผ่าน `/delete` + `/update-references`

### Living Documents

เอกสารที่เก็บข้อมูล (ไม่ใช่ workflow) — sync ทันทีเมื่อสิ่งที่อ้างเปลี่ยน:

| Document | Path | Sync เมื่อ |
|----------|------|-----------|
| CLI inventory | `check-my-global-cli/references/global-cli-commands.md` | tool ติดตั้งใหม่ / list เก่า >30 วัน |
| Tool map | `check-my-global-cli/references/tool-map.md` | skill/tool เพิ่ม/ลบ/merge |
| Tech catalog | `../shared/techstack-catalog.md` | เลือก dep ใหม่ / lib EOL / major release |
| Skills index | `skills/AGENTS.md` | เพิ่ม/ลบ/merge/rename skill |
| Subagent registry | `use-subagents/SKILL.md` | เพิ่ม/ลบ `subagents/*` ใน skill ใดก็ได้ |
| `related:` frontmatter | ทุก `SKILL.md` | skill ที่อ้างถูก merge/rename/ลบ |

Triggers: `mise use -g`/`scoop install` → 1+2; สร้าง skill → 2,4,6; ลบ/merge → 2,4,5,6; rename → 4,6 + ทุกไฟล์ที่อ้าง; dep ใหม่ → 3. Verify: `rg "<old-name>" skills/` — เหลือแค่ mentions ที่จงใจ (เช่น "merged จาก …")

## Rules

### 1. Single Responsibility And Refactor

- ทุกไฟล์ใน skill package ≤250 บรรทัด; `SKILL.md` = entry point เก็บ high-level workflow + pointer; แยกไฟล์ย่อยตาม `## Conventions → When To Split`/`Directory Structure`; เนื้อหาซ้ำ skill อื่น → merge เข้าตัวเดิม

### 2. Official Sources And Evidence

- ใช้ official docs, changelog, repository เป็นแหล่งหลัก — ไม่ใช้ third-party ถ้า official มี และระบุ source URLs; ทุกการแก้มี evidence + บันทึก version ที่ research — ไม่เดา API, command หรือ version

### 3. Safety

- dry run ก่อน destructive/high-risk; overwrite ไฟล์เดิม → user confirmation; ไม่ทำลาย references หรือ existing skills; `permissions` ระบุ `deny` สำหรับ system paths เสี่ยง; ไม่ใส่ secrets/credentials ใน prompt

### 4. Content Standard

- how-to อ้าง CLI tools ที่ติดตั้งจริง (inventory `check-my-global-cli/references/global-cli-commands.md`, map `follow-skills-map/references/tool-map.md`) — ห้ามเขียน script เองถ้า CLI ทำได้; ไม่มี → `/deep-research` หา หรือ `mise use -g`
- `name` ตรง directory name, `description` ≤100 ตัวอักษร; ไม่มี TODO/MOCK/placeholder — ไม่ชัดให้ระบุความไม่แน่นอน; global skills เขียนภาษาไทยคงคำศัพท์เทคนิคอังกฤษ; ห้าม `**` bold; ใช้ `/check-content-correctness`, `/follow-single-of-source` ถ้าจำเป็น
- install commands ตาม ecosystem: `bun add`/`bun install` (JS/TS — default), `cargo add` (Rust), `go get` (Go), `pip install` (Python), `mise use -g npm:<package>` global npm CLI — หลีกเลี่ยง floating ranges

## Expected Outcome

- Skill ใหม่/อัปเดตสะท้อน latest version, APIs, commands และ best practices; deprecated ถูกลบออก; `SKILL.md` ผ่าน `/deep-validate`, ≤250 บรรทัด, ไม่มี TODO/MOCK/placeholder; `related` ครบไม่มี missing/unused
- References อัปเดตครบทั้ง `AGENTS.md`, `global_rules.md` และ skills ที่เกี่ยวข้อง; `/report` สรุป findings และการเปลี่ยนแปลง
