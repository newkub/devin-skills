# Subskills And Subagents

## Goal

กำหนดมาตรฐาน `subskills/` และ `subagents/` ใน skill package — เมื่อไหร่ใช้อะไร รูปแบบไฟล์ และข้อจำกัดของ runtime

## Directory Layout

```text
<skill>/
  SKILL.md                  # entry point — workflow + dispatch table เท่านั้น
  references/               # passive knowledge — parent อ่านเป็น context
  subskills/
    <name>/
      SKILL.md              # invocable child workflow
      references/           # knowledge เฉพาะ subskill นั้น (ถ้ามี)
  subagents/
    <name>.md               # หรือ subagents/<name>/AGENT.md — subagent profile
```

## Decision Matrix

| เนื้อหา | ไปที่ |
|---------|-------|
| parent อ่านเป็น context/lookup (API docs, checklists, snapshots) | `references/` |
| workflow ที่ invoke แยกได้ มี Goal/Execute ของตัวเอง หรือ dispatch ตาม argument | `subskills/` |
| งานอิสระที่ต้อง context window แยก ทำขนาน หรือต้อง custom tools/model | `subskills/` ที่ตั้ง `subagent: true`/`agent:` หรือ `subagents/` |
| งาน mechanical/deterministic ที่ script ทำได้ | `scripts/` |

## Subskills

1. รูปแบบ: `subskills/<name>/SKILL.md` — frontmatter และ body ตาม spec เดียวกับ skill ปกติ ดู [frontmatter.md](frontmatter.md)
2. `name` ตั้งเป็น `<parent>-<name>` (lowercase คั่นด้วย `-`) เพื่อไม่ชนถ้าภายหลัง promote เป็น top-level skill
3. runtime ไม่ register `subskills/` เป็น `/command` — parent `SKILL.md` เป็นผู้ dispatch ผ่าน `argument-hint` แล้วอ่าน `subskills/<name>/SKILL.md` มา execute
4. parent ต้องมี dispatch table ใน `## Execute` ที่ map argument → `subskills/<name>/SKILL.md` ชัดเจน
5. subskill อาจมี `references/`, `examples/` ของตัวเองถ้าเนื้อหาเฉพาะ platform/domain นั้น
6. ถ้า subskill เป็นงาน self-contained ที่ไม่ต้องการ context ของ parent → ตั้ง `subagent: true` หรือ `agent: <profile>` ใน frontmatter (experimental ตาม Devin spec)

## Lifecycle Prefixes

เมื่อ parent มีหลาย lifecycle workflows ให้ใช้ prefix เหล่านี้ใน subskill name (หลัง `<parent>-`) เพื่อสื่อ phase ของงาน:

| Prefix | ใช้เมื่อ | ตัวอย่าง |
|--------|---------|---------|
| `setup-` | install/config ครั้งแรก ให้ tool/service พร้อมใช้ | `follow-service-cloudflare` → `subskills/setup-wrangler` |
| `config-` | แก้ config/env/options ของที่มีอยู่ โดยไม่ clobber | `follow-service-*` → `subskills/config-env` |
| `follow-` | best practices/conventions ของ domain ย่อย | `follow-service-*` → `subskills/follow-auth` |
| `optimize-` | ปรับ performance/bundle/cost โดยวัด baseline ก่อน-หลัง | `deep-optimize` → `subskills/optimize-bundle` |
| `improve-` | ปรับคุณภาพของที่มีอยู่ โดย preserve behavior | `review-uxui` → `subskills/improve-contrast` |
| `fix-` | แก้ findings/bugs ที่รู้ root cause — minimal + verify | `review-security` → `subskills/fix-secrets` |
| `update-` | อัปเดตของที่มีอยู่ให้ทันสมัย — minimal diff, idempotent | `update-tests` → `subskills/update-e2e` |
| `deploy-` | deploy ไปยัง platform/target จน live + verify | `follow-deploy` → `subskills/deploy-cloudflare` |
| `migrate-` | ย้าย tool/version/pattern อย่างปลอดภัย มี rollback | `follow-monorepo` → `subskills/migrate-to-monorepo` |
| `integrate-` | เชื่อม tools/systems เข้าด้วยกัน — export→import, sync, bridge, pipeline ระหว่าง tools | `deep-test` → `subskills/integrate-bruno`, top-level `integrate-openapi-bruno` |
| `verify-` | ยืนยันผลหลัง action ของ parent — domain-specific post-action check ที่ `run-verify`/`deep-validate` ไม่ครอบ (deploy live, release published, connection works, merge clean) | `follow-deploy` → `subskills/verify-deploy`, `ship` → `subskills/verify-release` |
| `check-` | read-only domain check ใต้ parent ที่มีหลาย dimensions — dispatch ทีละ dimension ได้; ถ้า parent เป็น `check-*` อยู่แล้วให้ใช้ bare domain name แทน | `deep-validate` → `subskills/check-security`, `check-files` → `subskills/encoding` |
| `report-` | report workflow เฉพาะ domain ที่ต้องใช้ data ที่ parent gather เอง — format ที่ generic `/report` ทำไม่ได้ (severity matrix, benchmark delta, cited findings, status timeline) หรือ regenerate ได้จากผลเดิมโดยไม่รัน flow ใหม่; ถ้า parent เป็น `report` อยู่แล้วให้ใช้ bare format name (`table`, `html`, `numbered`, `codeblock`) | `deep-validate` → `subskills/report-findings`, `watch-browser` → `subskills/report-status`, `check-config-drift` → `subskills/report-drift` |

- name เต็มยังตาม rule เดิม: `<parent>-<prefix>-<name>` เช่น `download-program-package-manager` → ถ้าแยกตาม action จะเป็น `download-program-setup-*` ฯลฯ
- ใช้ prefix เมื่อมีหลาย lifecycle จริงๆ — ถ้า parent มีแค่ workflow เดียวหรือเป็น knowledge ให้ใช้ `references/` แทน
- prefix เดียวกันกับ top-level skill prefix ใน [templates/index.md](../templates/index.md) — execute pattern เหมือนกัน แค่อยู่ใต้ parent

### Consolidation — Domain Subskills

เมื่อ top-level skills หลายตัวทำงานเดียวกันใน domain เดียวกัน (เช่น `/list-github-pr`, `/list-github-issue` → `list-github`) ให้ย้ายเนื้อหาไป `parent/subskills/<domain>/` โดยใช้ domain name เป็น subskill name — ไม่ต้องมี lifecycle prefix — แล้วตั้ง parent เป็น dispatcher ที่มี `### Subskills` table; ในทางกลับกัน ถ้า subskill เป็น standalone intent ที่ user เรียกเองบ่อย → promote เป็น top-level `<parent>-<domain>` แล้วให้ parent dispatch ด้วยตาราง skill names

- pattern เดียวกับที่ `update-tests` merge `update-e2e-test`/`update-unit-test`/`update-integration-test`/`update-test-and-fix`
- ต้อง bulk-update callers `/old-skill` → `/parent` ทั้ง repo แล้ว verify ไม่มี dangling refs ก่อนลบ dir เดิม

## Subagents

1. รูปแบบ: `subagents/<name>.md` (flat) หรือ `subagents/<name>/AGENT.md` (directory) — ตาม custom subagent spec เดียวกับ `agents/` roots
2. runtime ไม่ register profiles จาก `subagents/` ใน skill package โดยตรง — ต้อง materialize ไปยัง agents root ที่ official รองรับ: `.devin/agents/`, `.agents/agents/`, `~/.config/devin/agents/` หรือ `%APPDATA%\devin\agents\` (ทำผ่าน `/update-devin-global-subagents` หรือ `/update-devin-project-*`)
3. ใช้ `subagents/` เมื่อ skill ต้องการ role เฉพาะที่ไม่มีใน global profiles — ถ้า role มีอยู่แล้ว (เช่น `reviewer`, `qa`, `security-auditor`) → อ้างถึง profile นั้นตรงๆ ผ่าน `agent:` field แทนการสร้างใหม่
4. frontmatter ของ profile: `name`, `description`, `model`, `allowed-tools`, `permissions` ตาม spec ของ `/update-devin-global-subagents`

## Rules

- ห้ามสร้าง `subskills/` ถ้าเนื้อหาเป็นแค่ knowledge ที่ parent อ่าน — ใช้ `references/`
- ห้ามซ้ำ subworkflow เดียวกันทั้งใน `references/` และ `subskills/` — ย้ายแล้วลบของเก่า
- ทุก `subskills/<name>/SKILL.md` ไม่เกิน 250 บรรทัด เหมือน skill ปกติ
- ถ้า skill ถูก merge จาก standalone skills → เนื้อหา workflow ของแต่ละตัวไป `subskills/` ไม่ใช่ `references/`
- ทำ `/update-references` หลังย้ายไฟล์เสมอ

## Examples

- `follow-create-bot` → `subskills/{slack,discord,telegram,line,github,github-app}/SKILL.md` dispatch ด้วย `argument-hint: "<slack|discord|telegram|line|github|github-app>"`
- `download-program` → `subskills/package-manager/SKILL.md` (merged จาก `follow-my-package-manager`) — workflow เลือก package manager ที่ siblings เรียกใช้ร่วมกัน
