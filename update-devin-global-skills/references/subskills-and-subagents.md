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
