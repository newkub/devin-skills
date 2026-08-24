---
name: follow-write-devin-skills
description: สร้างหรือปรับปรุง skill package โดยเลือก template และจัดการ directory
---

## Goal

สร้างหรือปรับปรุง skill package ทั้งหมด โดย focus ที่การเลือก template, สร้าง directory structure, และจัดการ references

## Scope

ใช้สำหรับสร้าง skill ใหม่หรือแก้ไข skill ใน `.devin/skills/`, `.windsurf/skills/`, `.agents/skills/`, `~/.config/devin/skills/`, `~/.codeium/<channel>/skills/`, หรือ `%APPDATA%\devin\skills\` โดยครอบคลุม directory, template selection, validation, references และการสร้าง CLI ถ้าจำเป็น โดยไม่ทำลาย references เดิม

## Execute

### 1. Prepare Context

> Goal: ทราบ target AI tool, directory, dependencies, template

1. ทำ `/prepare-skills-context` เพื่อตรวจจับ AI tool, อ่าน `global_rules.md`, related skills, และเลือก template ตาม prefix
2. ทำ `/read-related-skills` เพื่ออ่าน skills ที่เกี่ยวข้อง และทำ `/consider-use-in-another-skills` เพื่อพิจารณาว่า skill นี้สามารถใช้ร่วมหรือขยายจาก skills อื่นได้หรือไม่
3. ถ้า skill มีอยู่แล้ว → อ่านไฟล์เดิมและระบุสิ่งที่ต้องปรับปรุง
4. ทำ `/learn-from-web` จาก Devin CLI docs เมื่อต้องการ verify spec
5. ถ้า context ไม่ชัดหรือ skill ซ้ำ → stop และ `/ask-me`
6. ทุก skill ที่มี dependencies (จำเป็นหรือ optional) ต้องมี `references/` เสมอ → ทำ `/learn-from-web` จาก official docs ของทุก dependency เสมอ เพื่อยืนยัน version ล่าสุด, install command ที่ถูกต้อง, และ compatibility. จากนั้น install พร้อมเขียน references จริงลง `references/` (บังคับ ห้ามข้าม). ถ้า `/learn-from-web` ไม่เขียน references จริง → stop และ report

### 2. Select Template

> Goal: skill มีโครงสร้างเริ่มต้นที่เหมาะสม

1. เลือก template ตาม prefix:
   - `run-*` → execute commands พร้อม prerequisites check, error handling, result reporting
   - `follow-*` → implement best practices ของ tools/libraries/frameworks (ยกเว้น `follow-*-architecture` → architecture template)
   - `check-*` → scan codebase หา issues และ report findings
   - `analyze-*` → วิเคราะห์ codebase ด้วย scripts, tools และหลายมิติ
   - `deep-*` → วิเคราะห์หลายมิติอย่างลึกซึ้ง พร้อม cross-reference
   - `review-*` → วิเคราะห์ quality พร้อม severity ratings และ review score
   - `report-*` → รวบรวมข้อมูล วิเคราะห์ และนำเสนอในรูปแบบที่อ่านง่าย
   - `idea-*` → สร้างไอเดีย วิเคราะห์ gaps และ opportunities พร้อม continuous numbering
   - `lib-*` → library ติดตั้งผ่าน registry ต้องมี `references/api/`, `references/cli.md`, `references/components/`, และ `subskills/`
2. ถ้าไม่ตรง template → ใช้โครงสร้างมาตรฐาน `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`
3. อ่าน template ที่เลือกเพื่อดู sections, rules, file structure pattern และ example template
4. สร้าง directory structure ตาม pattern ใน template ที่เลือก

#### run-* Template

- ตรวจสอบ target, dependencies, tools ก่อนรัน. ถ้าขาด → stop และ report. ทำ `/check-should-update` ถ้า target อาจเป็น stale
- รัน command พร้อม timeout: non-blocking สำหรับ long-running (dev server, watch), blocking สำหรับ short tasks (build, test, lint). จับ output และ error แยกกัน. ถ้า errors → ทำ `/resolve-errors`. dependency issue → ทำ `/run-install` แล้ว retry max 1. config issue → ทำ `/follow-config`. ซ้ำ 3 ครั้ง → stop
- รายงานสั้นกระชับ: success/fail, duration, key metrics. ถ้าสำเร็จ → ทำ `/suggest-next-action`. Safety: อย่ารัน destructive commands โดยไม่ confirm. แจ้ง side effects ก่อนรัน. ใช้ `SafeToAutoRun` เฉพาะ commands ปลอดภัย

#### follow-* Template

- อ่าน `package.json`, `Cargo.toml` ตรวจสอบ version. ถ้าไม่พบ tool → stop และ report. ถ้า optional → ถามผู้ใช้. ทำ `/learn-from-web`, `/check-reference`, `/follow-best-practice`. ใช้ official docs เป็นแหล่งหลัก. ตรวจ version compatibility
- สร้าง/อัปเดท config ด้วย `/follow-config`. ถ้ามี breaking changes → migration steps. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`. รัน typecheck, lint, tests. ถ้ามี errors → ทำ `/resolve-errors`. ถ้าผ่าน → ทำ `/suggest-next-action`
- Minimal changes เสมอ. ไม่ rewrite ทั้งไฟล์ถ้าเปลี่ยนเฉพาะ config. ไม่บังคับ upgrade โดยไม่แจ้งผู้ใช้

#### follow-*-architecture Template

- อ่าน manifest ระบุ framework และ `follow-*` skills ที่เกี่ยวข้อง. ถ้าไม่พบ framework → stop. `related` ต้องมี `follow-*` skills ของ tech stack รวม `/follow-vite` และ `/follow-vitest` เสมอ
- Module structure: `src/modules/<feature>/` พร้อม `components/`, `hooks/`, `schemas/`, `utils/`, `types/`, `index.ts`. แต่ละ module มี `index.ts` เป็น public API. เก็บ internal code private. ไม่มี circular dependencies
- กำหนด routing conventions, server functions/API patterns, rendering modes (SSR, CSR, SSG), state management, component organization. กำหนด routing rules, module boundary rules, import/export rules (`/follow-import-export`), monorepo rules, configuration rules
- ทำ `/restructure`, `/refactor-packages` ถ้าจำเป็น. รัน typecheck, lint. ทำ `/suggest-next-action`. Generality: ไม่ผูกกับชื่อ project. ใช้ `@<scope>/shared`. รองรับ standalone และ monorepo. อย่า share route tree ข้าม package boundary. share components, hooks, schemas, utils แทน

#### check-* Template

- ระบุ target และ criteria. ถ้าเป็น monorepo → ตรวจทุก workspaces หรือระบุ workspace. ถ้า target ไม่มี → stop. ทำ `/scan-codebase`. ใช้ grep, ast-grep, jscpd, knip ตาม criteria. ถ้าซับซ้อน → ทำ `/use-scripts`
- จัดประเภท: Critical, Warning, Info. ระบุ root cause. กรอง false positives. จัดลำดับตาม impact. ระบุ file และ line number ชัดเจน. Report เป็นตาราง: file, line, issue, severity, recommendation. ถ้ามี critical → แนะนำ `/resolve-errors`. ถ้าไม่พบ → "no issues found". ทุก finding ต้องมี recommendation
- Completeness: ตรวจครบทุก workspaces. ไม่ข้าม files ที่ gitignored. รวม dependencies ถ้าเกี่ยวข้อง

#### analyze-* Template

- ทำ `/scan-codebase`, อ่าน manifests, configs, key files. ถ้าซับซ้อน → ทำ `/use-scripts`. ถ้าข้อมูลไม่พอ → ทำ `/deep-analyze`. วิเคราะห์ structure, dependencies, patterns. ระบุ strengths, weaknesses, gaps. หา root causes. จัดกลุ่ม findings ตาม category
- ทำ `/report-table`. จัดลำดับ findings ตาม impact. ระบุ evidence. ทำ `/suggest-next-action`. ทุก finding ต้องมี evidence. ถ้าเป็น assumption → ระบุชัดเจน. ใช้ ast-grep สำหรับ structural analysis. ใช้ review CLI สำหรับ project review
- ครอบคลุมทุก workspaces. ไม่ข้าม dependencies และ configs. รวม external references ถ้าเกี่ยวข้อง

#### deep-* Template

- ระบุ target, dimensions (architecture, performance, security, maintainability), criteria. ถ้า target ไม่ชัด → ทำ `/ask-me`. ทำ `/deep-research`, `/learn-from-web`, `/check-reference`. ถ้าข้อมูลไม่พอ → ระบุความไม่แน่นอน
- ทำ `/deep-analyze` สำหรับแต่ละ dimension. จับ findings พร้อม evidence (file, line, code, metric). ระบุ root cause. ถ้า analysis ยาว → ทำ `/follow-context-rot`. หา findings ที่ซ้ำซ้อนระหว่าง dimensions. หา root causes ที่ส่งผลต่อหลาย dimensions. จัดกลุ่ม. ระบุ dependencies ระหว่าง issues
- ทำ `/report-table`. จัดลำดับตาม impact และ effort. ระบุ immediate และ long-term actions. ทำ `/suggest-next-action`. วิเคราะห์ให้ลึก. ถ้าไม่แน่ใจ → ค้นคว้าเพิ่ม. ระบุ assumptions. ทุก finding ต้องมี evidence. ถ้าเป็น opinion → ระบุ. ครบทุก dimensions. ถ้า dimension ไม่มี findings → ระบุ "no issues". ไม่ข้าม dimensions

#### review-* Template

- ระบุ review target. อ่าน configs, dependencies. ทำ `/scan-codebase`. ถ้า web project → เพิ่ม `/run-dev`. ทำ `/deep-analyze`. ทำ `/update-create-review-cli` (เรียก `/update-rules` ภายใน). รัน `bunx ast-grep scan --inspect summary`. รัน `bun --filter tools-review review:json`. จับ findings พร้อม evidence
- ทำ `/run-review` เพื่อดึง review report พร้อม metrics. ทำ `/deep-validate`. cross-check evidence (file, line, code). กรอง false positives. ถ้าซ้อนทับ → อ้างอิงแทน. ถ้านอก scope → info เท่านั้น. Severity: Critical, High, Medium, Low, Info. review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100). จัดลำดับตาม severity
- แนะนำ fix หรือ skill. จัดกลุ่ม: immediate, short-term, long-term. ระบุ estimated effort. ทำ `/report-review`, `/report-table`. ทำ `/implement-all` เพื่อตรวจ implementation completeness. ถ้าพบ incomplete → เพิ่มเป็น findings. รายงานทั้ง strengths และ weaknesses. ห้ามใช้ bold markers. ใช้ backticks สำหรับ emphasis. รายงานเป็นตารางด้วย `/report-table`

#### report-* Template

- ทำ `/scan-codebase`, อ่าน configs, manifests, key files. ถ้าซับซ้อน → ทำ `/use-scripts`. ถ้า external → ทำ `/learn-from-web`. จัดกลุ่มตาม category. คำนวณ metrics. หา patterns, trends, anomalies. ระบุ highlights และ concerns
- ทำ `/report-table`, `/report-file-structure` ถ้าเกี่ยวกับ files. ใช้ headings, lists, tables. สรุป key findings ด้านบน. นำเสนอ report. ถ้า interactive → ทำ `/report-in-html` หรือ `/visualize-in-web`
- ระบุ next actions. ทำ `/suggest-next-action`. ไม่ dump ข้อมูลทั้งหมด. ข้อมูลถูกต้องทันสมัย. ระบุ source. ถ้าอาจเก่า → ระบุวันที่. ทุก report ต้องมี next actions. ถ้าพบ issues → แนะนำ skill ที่เหมาะสม

#### idea-* Template

- ทำ `/deep-analyze`. ทำ `/bench-competitors` ถ้าต้องเปรียบเทียบ. อ่าน feedback, issues, requests. ระบุ constraints (timeline, budget, team size). วิเคราะห์ gaps (missing features, UX issues, bottlenecks). ระบุ opportunities (trends, pain points, advantages). จัดกลุ่ม. จัดลำดับตาม impact และ feasibility
- สร้างไอเดียพร้อม continuous numbering (ไม่ต่อจากเดิมถ้ามีอยู่แล้ว). ระบุ scope (quick win, short-term, long-term), impact, effort. ทำ `/report-table`. คอลัมน์: number, idea, category, impact, effort, scope. จัดลำดับตาม impact/effort ratio
- ทบทวนกับ stakeholders. รวม/แยกไอเดีย. ระบุ dependencies และ prerequisites. ทำ `/suggest-next-action`. ทุกไอเดียต้อง actionable. ถ้าซับซ้อน → แบ่งเป็น sub-ideas. ไม่ reset numbering ระหว่าง runs. เก็บไอเดียเดิมไว้ ไม่ลบ. ทุกไอเดียต้องมีพื้นฐานจาก analysis. ระบุ gap หรือ opportunity ที่ตอบ. ไม่เสนอไอเดียซับซ้อนเกินจำเป็น. ถ้าต้อง refactor ใหญ่ → ระบุเป็น long-term. ทำ `/dont-over-engineer`

#### lib-* Template

- ตรวจ manifest (`package.json`, `Cargo.toml`). ระบุ registry และ version. ตรวจ ecosystem (bun, node, pnpm, yarn, cargo, pip). ทำ `/learn-from-web` จาก official docs ของ library เสมอ เพื่อยืนยัน install command ล่าสุด, version ที่ stable, และ peer dependencies. ใช้คำสั่ง install ที่เหมาะกับ package manager (`bun add`, `npm install`, `cargo add`, `pip install`). บันทึก version. ติดตั้ง peer dependencies
- เขียน/แก้ไข config. ระบุ entry point และ initial setup. ใช้ examples จาก `references/components/` หรือ `examples/`. ทำ `/validate` หรือ `/run-check`. รัน tests/examples. ทำ `/git-commit` ถ้ามีการเปลี่ยนแปลง
- Required: `references/api/`, `references/cli.md`, `references/components/` ถ้า library มีส่วนนั้น. ถ้าไม่มี CLI → ละ `references/cli.md` ได้ แต่ระบุเหตุผลใน `## Scope`. ถ้า library มีหลาย use cases → สร้าง `subskills/<lib>/<subskill>/SKILL.md`. parent ต้อง `related` ทุก subskill. ระบุคำสั่ง install จริง. ระบุ config files และ snippets จริง. ใช้ backticks สำหรับ code และ command เสมอ

### 3. Write SKILL.md

> Goal: `SKILL.md` ถูกต้องตาม Devin CLI spec

1. เขียน YAML frontmatter:
   - `name` (required): ตรง directory name, lowercase คั่นด้วย `-`
   - `description` (required): กระชับ ≤100 ตัวอักษร
   - `argument-hint` (optional): ระบุเฉพาะเมื่อ skill รับ arguments (เช่น `[file] [options]`)
   - `model` (optional): `sonnet`, `swe`, `opus`, `codex`
   - `subagent: true` (optional): รันเป็น subagent (experimental)
   - `agent: <profile>` (optional): custom subagent profile. ถ้าตั้งทั้ง `agent` และ `subagent` → `agent` มี precedence
   - `allowed-tools` (recommended): จำกัดเฉพาะ tools ที่จำเป็น
   - `permissions` (optional): `allow`, `deny`, `ask` ตามความเสี่ยง
   - `triggers` (optional): default `['user', 'model']`
2. เขียน prompt body ตามลำดับ: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
3. `## Execute` แบ่งเป็น steps ไม่เกิน 10 โดยใช้ `### N. Step Name`, description, `> Goal:`, และ numbered list
4. ใช้ `## Key Concepts`, `## Principles`, `## Guide`, หรือ `## Examples` เมื่อต้องการเน้นรูปแบบหรือตัวอย่าง
5. ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`. ห้ามใช้ `**` bold markers
6. ถ้า skill ขึ้นต้นด้วย `check-` → กำหนด `allowed-tools` ให้รองรับ `exec`, `grep`, `glob`, `find_file_by_name` และวางแผนใช้ `/use-scripts` สำหรับ scan ซับซ้อน

### 4. Add Directory Contents

> Goal: skill directory รองรับไฟล์ย่อยโดยไม่ทำให้ `SKILL.md` ยาวเกินไป

1. ถ้าต้องการ external references → สร้าง `references/` และเขียน references ให้ครบถ้วน. ถ้า skill มี dependencies (จำเป็นหรือ optional) → ต้องมี `references/` เสมอ และทุก dependency ต้องมี reference file ของตัวเอง (บังคับ ห้ามข้าม)
2. ถ้าต้องการ helper scripts → สร้าง `scripts/` ตาม `/use-scripts`
3. ถ้าต้องการ expanded documentation → สร้าง `guide/` หรือ `examples/`
4. ถ้าต้องการ Devin subskills → สร้าง `subskills/<domain>/<subskill>/SKILL.md` โดยตั้ง `name` เป็น `<domain>-<subskill>` แล้วให้ parent skill `<domain>-subskills/SKILL.md` อ้างถึง
5. ถ้าต้องการ project rules → ทำ `/update-dot-devin` เพื่อสร้าง `.devin/rules/`
6. ตรวจสอบว่าไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด

### 5. Create CLI (if needed)

> Goal: skill ที่ระบุ CLI มี entry point และรันผ่าน `bun run dev`

1. ถ้า `## Execute` ระบุว่าต้องใช้ CLI หรือทำงานผ่าน terminal → สร้าง CLI. ใช้ `/follow-create-bun-cli` หรือ `/follow-create-cli` เลือก framework. ใช้ `/use-scripts` สำหรับ helper scripts
2. วาง entry point ที่ `src/presentation/cli.ts`. รันทดสอบด้วย `bun run dev` หรือ `bun run src/presentation/cli.ts -- --help`. เก็บ generated files ให้ไม่เกิน 250 บรรทัดต่อไฟล์

### 6. Create Web (if needed)

> Goal: skill ที่ระบุ web มี `web/` directory พร้อมรัน

1. ถ้า `## Execute` ระบุว่าต้องแสดงผล web หรือ browser → สร้าง `web/`. ใช้ `/follow-web-design` เพื่อออกแบบ UI/UX. ใช้ `/visualize-in-web` สร้างไฟล์ HTML entry ใน `web/`
2. รันทดสอบด้วย `bunx serve web/` หรือ `/open-web`. เก็บ generated files ให้ไม่เกิน 250 บรรทัดต่อไฟล์

### 7. Validate Skill

> Goal: skill package ผ่านเกณฑ์ทั้งหมด

1. ทำตาม `/validate` เพื่อตรวจความถูกต้อง
2. ทำตาม `/validate` เพื่อตรวจ: ไม่เกิน 250 บรรทัด, sections ครบ, `related` ไม่มี missing/unused, ไม่มี TODO/MOCK/placeholder
3. ทำ `/check-circular-dependencies` ถ้ามีการแก้ `related`
4. ถ้ามี `.devin/rules/` → ทำ `/review-rules` เพื่อตรวจคุณภาพ rules
5. ถ้าพบ issue → แก้และ revalidate (max 3 → stop/report)

### 8. Update References

> Goal: skill package พร้อมใช้งาน references ครบถ้วน

1. ทำ `/update-reference` เพื่ออัปเดต references ที่เกี่ยวข้อง
2. ทำ `/suggest-next-action` เพื่อแนะนำ skills ถัดไป
3. ถ้า reference update ล้มเหลว → retry (max 3 → stop/report)

## Rules

### 1. Template Selection

- ใช้ skill type template ตาม prefix เป็น canonical structure. `follow-*-architecture` ใช้ architecture template ไม่ใช่ follow
- ถ้าไม่ตรง template → ใช้โครงสร้างมาตรฐาน `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome`
- ถ้า skill เบี่ยงเบนจาก template → ระบุเหตุผลใน `## Scope`

### 2. Package Structure

- `SKILL.md` เป็น entry point หลัก ไม่เกิน 250 บรรทัด. สามารถมี `references/`, `scripts/`, `subskills/`, `guide/`, `examples/`, `web/`, `.devin/rules/` ตามความจำเป็น
- ถ้ามี CLI ต้องมี `src/presentation/cli.ts` เป็น entry point. directory name ต้องตรงกับ `name` ใน frontmatter. ไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด
- ถ้า `references/` มี nested directories → ใช้ `/follow-flat-files`. ถ้า flat ทั้ง skill package → ใช้ `/follow-flat-folders`

### 3. Safety

- ทำ dry run ก่อน destructive หรือ high-risk actions. ถ้ามี overwrite ไฟล์เดิม → user confirmation ก่อน. ไม่ทำลาย references หรือ existing skills
- `permissions` ระบุ `deny` สำหรับ system paths ที่เสี่ยง. `ask` สำหรับ write ที่สำคัญ. ไม่ใส่ secrets, credentials หรือ hardcoded paths ที่ sensitive ใน prompt

### 4. Check And Validate Skills

- ถ้า skill ขึ้นต้นด้วย `check-` → พยายามใช้ tools หรือ `/use-scripts` ใน `## Execute`. `allowed-tools` ต้องรวม `exec`, `grep`, `glob`, `find_file_by_name`
- หลีกเลี่ยงการให้ตรวจด้วยตาเปล่า. ใช้ commands, scripts, หรือ linters. ผลลัพธ์ต้อง reproducible และอ้างอิงไฟล์/บรรทัด

### 5. CLI Support

- ถ้า skill ต้องการ CLI → เรียก `/follow-create-bun-cli` หรือ `/follow-create-cli` ก่อน validation. ใช้ `src/presentation/cli.ts` เป็น entry point. ตรวจสอบว่า `bun run dev` และ `bun run build` ทำงานได้. รักษา package structure ที่ไม่เกิน 250 บรรทัด

### 6. Web Support

- ถ้า skill ต้องการ web → เรียก `/follow-web-design` ก่อนสร้าง `web/`. ใช้ `/visualize-in-web` เพื่อสร้าง HTML entry. ตรวจสอบว่า `bunx serve web/` หรือ `/open-web` ทำงานได้. รักษา package structure ที่ไม่เกิน 250 บรรทัด

### 7. Subagent And Model

- ใช้ `subagent: true` สำหรับงาน focused, self-contained. ใช้ `agent: <profile>` เมื่อต้องการ profile เฉพาะ. ถ้าตั้งทั้ง `agent` และ `subagent` → `agent` มี precedence. skill ที่รันเป็น subagent จะไม่ spawn nested subagents

### 8. Dependencies

- ทุก skill ที่มี dependencies (จำเป็นหรือ optional) ต้องมี `references/` เสมอ. ทุก dependency ต้องมี reference file ของตัวเองใน `references/` ที่เขียนจริงโดย `/learn-from-web` (บังคับ ห้ามข้าม ห้ามมีแค่ placeholder)
- ทุกการติดตั้ง dependencies ต้องทำ `/learn-from-web` จาก official docs เสมอ ก่อน install และต้องเขียน references จริง. ยืนยัน: install command ล่าสุด, version ที่ stable (ตีพิมพ์ ≥7 วัน), peer dependencies, และ compatibility กับ ecosystem ปัจจุบัน
- หลีกเลี่ยง floating ranges (`latest`, `*`, unbounded `>=`) ที่ auto-resolve เป็น brand-new releases. บันทึก version ที่ติดตั้งจริง. ถ้ามี breaking changes → ระบุ migration steps. ถ้า optional → ถามผู้ใช้ก่อน install
- ถ้า `/learn-from-web` ถูกเรียกเพื่อ dependency แต่ไม่เขียน reference file จริง → ถือว่า task ล้มเหลว ให้ stop และ report

## Expected Outcome

- Skill package ทั้งหมดถูกต้องตามมาตรฐาน. `SKILL.md` valid ตาม Devin CLI spec. frontmatter ครบถ้วนและถูกต้อง. prompt body มี `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
- Template ที่เลือกตรงกับ prefix ของ skill. Directory contents ครบถ้วนและไม่เกิน 250 บรรทัดต่อไฟล์
- ถ้าต้องการ CLI จะมี `src/presentation/cli.ts` ที่ทดสอบผ่านแล้ว. ถ้าต้องการ web จะมี `web/` directory ที่ทดสอบผ่านแล้ว
- ถ้าต้องการ project rules จะมี `.devin/rules/` ที่ตรวจสอบผ่านแล้ว. `related` ถูกต้อง ไม่มี missing/unused. references อัปเดตครบถ้วน
- ทุก skill ที่มี dependencies ต้องมี `references/` ที่เขียนจริงโดย `/learn-from-web` ครบทุก dependency ไม่มี placeholder

## Examples

```markdown
---
name: review
description: Review staged changes for issues
allowed-tools: [read, grep, glob, exec]
permissions: { allow: [Exec(git diff), Exec(git log)] }
triggers: [user]
---

## Goal
Review the current git diff and provide feedback

## Scope
ใช้ก่อน commit เพื่อตรวจสอบความถูกต้อง

## Execute
### 1. Get Diff
> Goal: รู้สิ่งที่เปลี่ยนแปลง
1. รัน `git diff --staged` หรือ `git diff` ถ้ายังไม่ได้ stage. บันทึก files ที่เปลี่ยน

### 2. Review Changes
> Goal: หาปัญหาที่อาจเกิดขึ้น
1. ตรวจ logic errors, security issues, style inconsistencies. สรุป findings พร้อม line references

## Rules
### 1. Review Focus
- ตรวจ correctness, security, performance, style. ให้ specific line references. ไม่แก้ source โดยไม่ได้รับอนุญาต

## Expected Outcome
- สรุป findings พร้อม specific line references. แนะนำ improvements ที่ actionable
```

