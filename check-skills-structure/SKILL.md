---
name: check-skills-structure
description: ตรวจโครงสร้าง skill packages (frontmatter, references, workflows, subagents, src, MCP, website) ด้วย CLI เดียว output เป็น bullet list
argument-hint: "[root] [--skill <name>] [--json] [--findings] [--detail]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
related:
  - check-my-global-cli
  - update-devin-global-skills
  - review-devin-global-harness
  - deep-validate
  - report
  - use-scripts

---

## Goal

ตรวจสอบโครงสร้างของ skill packages ใน `%APPDATA%\devin\skills\` — frontmatter fields, `references/`, `workflows/`, `subagents/`, `best-practices/`, `src/`, `scripts/`, MCP, website — ด้วย CLI command เดียวที่ output เป็น bullet list + findings

## Scope

ใช้สำหรับ inventory/audit โครงสร้าง skills ทั้ง repo หรือ skill เดียว — read-only check, reproducible ผ่าน `scripts/check-skills-structure.ts` (Bun, zero deps)

- Boundary: lint conventions ละเอียด (related contract, section order, naming) → `/review-devin-global-harness`; validate frontmatter ต่อ skill → `/deep-validate`; skill นี้ = structural inventory table แบบเร็ว

## Execute

### 1. Run Check

> Goal: ได้ bullet list structure ของทุก skill

```bash
bun "check-skills-structure/scripts/check-skills-structure.ts"                    # ทั้ง repo (default root = %APPDATA%/devin/skills)
bun "check-skills-structure/scripts/check-skills-structure.ts" --skill refactor   # skill เดียว
bun "check-skills-structure/scripts/check-skills-structure.ts" --findings          # เฉพาะ warnings
bun "check-skills-structure/scripts/check-skills-structure.ts" --json              # machine-readable
bun "check-skills-structure/scripts/check-skills-structure.ts" --detail            # แสดงชื่อจริงทุก entry ต่อ skill
bun "check-skills-structure/scripts/check-skills-structure.ts" <custom-root>       # repo อื่น
```

นอกจาก bullet counts แล้ว ใช้ `--skill <name>` หรือ `--detail` เพื่อดู **รายชื่อจริง** ต่อ skill — `related`, `references`, `workflows`, `subagents`, `best-practices`, `scripts`, `frontmatter-missing`

### 2. Interpret Output

> Goal: อ่านผลแต่ละ field — 1 bullet ต่อ 1 skill (`- <skill> — Field: value, ...`)

| Field | ความหมาย |
|--------|----------|
| `Skill` | ชื่อ directory ของ skill (ชื่อ bullet) |
| `Frontmatter` | frontmatter keys ที่มี x/10 (`name`, `description`, `argument-hint`, `allowed-tools`, `related`, `model`, `triggers`, `permissions`, `subagent`, `agent`) |
| `Name` | `ok` = frontmatter name ตรง dir, `!=` = mismatch, `missing` |
| `Related` | จำนวน entries ใน `related:` |
| `References`/`Workflows`/`Subagents`/`BestPractices` | จำนวน `references/*.md`, `workflows/*/SKILL.md`, `subagents`, `best-practices/*.md` |
| `Source`/`Scripts` | มี `src/` dir หรือไม่, จำนวนไฟล์ใน `scripts/` |
| `MCP` | SKILL.md อ้าง MCP/`mcp_config` หรือ `src/` เป็น MCP package |
| `Website` | มี `references/website.md`, SKILL.md อ้าง website/viewer/vite หรือ `src/` เป็น web app |
| `Lines` | จำนวนบรรทัด SKILL.md |

### 3. Triage Findings

> Goal: จัดการ warnings ที่พบ

1. `[WARN]` per skill: `no SKILL.md`, `name!=dir`, `no description`, `desc >100 chars`, `no frontmatter`, `>250 lines`
2. severity: Critical = `no SKILL.md`/`no frontmatter`; High = `name!=dir`; Warning = `no description`/`desc >100 chars`/`>250 lines`
3. findings ที่ต้องแก้ → `/update-devin-global-skills`; deep lint → `/review-devin-global-harness`; validate ต่อ skill → `/deep-validate`

## Rules

### 1. Read-Only

- CLI ไม่แตะไฟล์ใดๆ — อ่าน structure เท่านั้น

### 2. Reproducible

- ผลต้องมาจาก script ไม่ใช่ตาเปล่า — อ้าง row/WARN ใน report ได้เสมอ

### 3. Single Command

- หนึ่ง entry point เท่านั้น — options ผ่าน flags ไม่มี subcommands

- ใช้ /check-my-global-cli ถ้าจำเป็น
- ใช้ /use-scripts ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- bullet list structure ของทุก skill (หรือ skill เดียว) ผ่าน command เดียว
- findings พร้อม severity และ next-action skill ที่ถูกต้อง
