---
name: ship
description: Ship code ผ่าน AGENTS.md + ship-workflow — รองรับ dont-ask-me mode
argument-hint: "[@issue-number-or-title|verify|dont-ask-me]"
allowed-tools:
  - read
  - exec
  - skill
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - update-docs
  - follow-agents-md
  - deep-plan
  - deep-optimize
  - deep-test
  - use-subagents
  - follow-parallel
  - run-verify
  - deep-validate
  - resolve-cicd
  - dont-ask-me
  - follow-your-suggestion
  - loop-until-complete
  - ship-release

---

## Goal

Ship code ผ่าน `AGENTS.md` ของ project + canonical ship workflow ใน `### references/ship-workflow` (branch, validate, staging, CI gate, merge, production, rollback) — รองรับ `dont-ask-me` mode ที่แทนทุก confirmation ด้วย safe default

## Scope

- ใช้กับ project ที่มี `AGENTS.md` (สร้าง/อัปเดตผ่าน `/update-agents-md` ก่อนเสมอ)
- ทุก ship action ทำผ่าน workflow ใน `AGENTS.md` ตาม `/follow-agents-md` + `### references/ship-workflow` — `/ship` ไม่รัน release เอง (release → `/ship-release`)
- งานใหญ่หลายด้าน (multi-workspace, multi-concern) → ใช้ swarm flow ใน Step 5; งานเล็ก/lane เดียว → sequential ตาม workflow
- Local-only ship (ไม่มี staging/production deploy target — เช่น skills repo, dotfiles, config-only changes) → ข้าม Stage/Production ได้: verify + `/git-commit` ตรงๆ แล้ว report
- argument `dont-ask-me` หรือ session ที่ `/dont-ask-me` active → ทำงานตาม Step 6 โดยไม่ถาม user เลย

## Execute

### 1. Deep Plan

> Goal: วางแผนก่อนลงมือ ship

1. ทำ `/deep-plan` เพื่อวางแผน scope ของ ship (changes, issues, target branches) ก่อนเริ่ม workflow

### 2. Update AGENTS.md

> Goal: `AGENTS.md` สดและมี ship workflow ครบ

1. ทำ `/update-agents-md` — สร้าง/อัปเดต `AGENTS.md` ของ project (รวม `/deep-review-then-fix` เป็น canonical fix pass ก่อน ship)

### 3. Follow AGENTS.md

> Goal: ทำงานตาม `AGENTS.md` เท่านั้น

1. ทำ `/follow-agents-md` — execute workflows ที่ `AGENTS.md` กำหนด

### 4. Run Ship Workflow

> Goal: ship ตาม canonical workflow

1. ทำตาม `### references/ship-workflow` ตั้งแต่ `Branch Hygiene` → `Validate` → `Stage` → `Merge` → `Production` → `Wrap Up` — ห้ามข้าม step
2. `/ship` ไม่รัน release เอง — release ต่อด้วย `/ship-release` หลัง ship สำเร็จ

### 5. Swarm Mode (Optional)

> Goal: งานใหญ่ ship เร็วขึ้นด้วย parallel lanes — ไม่ลด validation gates

ถ้า ship scope ใหญ่และแตกเป็น independent lanes ได้ (1 ไฟล์ = 1 lane owner):

1. แตก lanes ตาม `references/swarm-plan.md` และ `references/swarm-lanes.md` — lane types: verify, test, review, docs, deps, fix, ship-ops
2. Preflight ตาม `references/swarm-plan.md#preflight` — git clean, deps, env พร้อม
3. Fan-out ตาม `references/swarm-fan-out.md` — mechanical → `/use-scripts`/`/use-astgrep`, judgment → subagents ผ่าน `/use-subagents`, read-only → parallel tool calls ตาม `/follow-parallel`
4. Merge results และผ่าน ship gates ตาม `references/swarm-merge-and-gate.md` — `/run-verify` + `/deep-validate` + `/run-check` ครบ, user confirm ก่อน merge/release เหมือน sequential

### 6. Dont-Ask-Me Mode

> Goal: ship ครบทุก step โดยไม่ถาม user — merged จาก `/ship-dont-ask-me`

ใช้เมื่อ argument เป็น `dont-ask-me` หรือ session นี้ `/dont-ask-me` active อยู่แล้ว:

1. ทำ `/dont-ask-me` เปิด session mode — ทุก `/ask-me`, `ask_user_question`, `/pick-bestest` และ confirmation gate ใน flow นี้ถูกแทนด้วย `/follow-your-suggestion` + safe default จนจบ session
2. ทำ Steps 1-5 ครบทุก step ตามลำดับ — ห้ามข้าม; ทำงาน incremental verify ทีละจุด
3. ทุกจุดที่ workflow ระบุ "user confirm" → ตัดสินใจเองผ่าน `/follow-your-suggestion` ด้วย safe default ที่สอดคล้อง `AGENTS.md` และ conventions — บันทึกทุก decision ใน report
4. ข้อขัดแย้ง/trade-off → เลือกทางเลือกที่ risk ต่ำสุดและ reversible; breaking change → หยุดก่อน merge, report แล้วรอ user
5. release ที่ต้องยืนยัน → `/run-release --dry-run` รายงานผล แล้วเลือก safe default (ไม่มี default ที่ปลอดภัย → ข้าม release และ report)
6. production deploy เสี่ยงสูงและไม่มี safe default → หยุดที่ staging ที่ผ่านแล้ว report สถานะ
7. วนด้วย `/loop-until-complete` สำหรับ validation, staging retry, CI resolution — ถึง max retries → หยุดและ report สิ่งที่ค้าง

### Subskills

> Goal: dispatch งาน post-ship verification แยกจาก ship flow

| Argument | Subskill |
|----------|----------|
| `verify`, `verify-release` | `subskills/verify-release/SKILL.md` — ยืนยัน tag/registry/release/deploy ขึ้นจริงหลัง ship |

1. ถ้า argument เป็น `verify` → อ่าน `subskills/verify-release/SKILL.md` แล้วทำตาม flow — ไม่รัน ship workflow ซ้ำ
2. ถ้าไม่ระบุ → ทำ Steps 1-4 ตามปกติ แล้วแนะนำ `verify` เป็น next action หลัง ship สำเร็จ

## Rules

### 1. AGENTS.md First

- ห้ามข้าม `/update-agents-md` — `AGENTS.md` ต้อง fresh ก่อน ship เสมอ
- ห้าม hardcode ship steps นอก `### references/ship-workflow` — workflow อยู่ใน section นั้น + `AGENTS.md` เท่านั้น

### 2. User Confirmation

- merge, production deploy, release → ต้องมี user confirm เสมอ (ตาม workflow) — ยกเว้น `dont-ask-me` mode ที่แทนด้วย `/follow-your-suggestion` + safe default
- swarm mode ห้ามข้าม gates — parallel ใช้กับความเร็วเท่านั้น ไม่ใช่ shortcut
- `dont-ask-me` mode: ห้ามใช้ `ask_user_question`, ห้ามเรียก `/ask-me`, `/ask-again`, `/pick-bestest`; action ที่ย้อนกลับไม่ได้ → safe default หรือหยุด+report

- ใช้ /resolve-cicd ถ้าจำเป็น
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-build ถ้าจำเป็น
- ใช้ /run-test-all ถ้าจำเป็น

## Merged Details

### verify-release

##### Goal

ยืนยันหลัง `/ship` ว่า release artifacts ขึ้นจริง — tag บน remote, version บน registry, release notes published — ไม่ใช่ code verification (อันนั้น `/run-verify`)

##### Scope

- ใช้เมื่อ `/ship` dispatch มาที่ `verify`/`verify-release` หรือเรียกหลัง ship เสร็จ
- ครอบคลุม: git tag บน remote, GitHub release, package registry version, deploy target live
- Read-only: ตรวจสอบ — ไม่ re-ship

##### Execute

###### 1. Verify Tag And Release

> Goal: tag และ release notes อยู่บน remote

1. `git fetch --tags` แล้วตรวจ tag ที่คาดอยู่บน `origin`
2. ใช้ `/list-git-tags` เทียบ tag ล่าสุดกับ version ใน manifest
3. ใช้ `/list-github-release` หรือ `gh release view <tag>` — release notes published ไม่ใช่ draft

###### 2. Verify Registry Artifacts

> Goal: package ขึ้น registry จริง

1. npm/bun: `bun pm view <pkg> version` หรือ `npm view <pkg> version` เทียบ manifest
2. crates: `cargo search <crate>` เทียบ version
3. Docker: ตรวจ tag บน registry ที่ใช้
4. ข้าม registries ที่ project ไม่ได้ publish — ระบุว่าข้าม

###### 3. Verify Deploy Target

> Goal: production รัน version ใหม่

1. ถ้า ship รวม deploy → ทำตาม `follow-deploy/subskills/verify-deploy/SKILL.md`
2. ถ้าเป็น local-only ship (skills repo, dotfiles) → ตรวจแค่ commit อยู่บน remote: `git log origin/main --oneline -1`

###### 4. Report

> Goal: สรุป release status

1. ใช้ `/report` คอลัมน์: `No.`, `Artifact`, `Expected`, `Actual`, `Status`
2. Verdict: `released` / `partial` / `not-released` พร้อม artifact ที่ขาด

##### Rules

- ระบุ evidence ต่อ artifact — tag name, registry version, release URL
- partial release → ระบุ artifact ไหนขาดและคาดว่า pending CI หรือ fail จริง
- ห้าม re-ship หรือ retry ใน subskill นี้ — รายงานแล้วให้ caller ตัดสิน

##### Expected Outcome

- ตาราง artifacts: expected vs actual พร้อม verdict
- รายการ artifacts ที่ขาดถ้า partial

### references/ship-workflow

#### Ship Workflow

Canonical ship workflow ของ `/ship` — feature branch → validate → staging → merge → production พร้อม rollback path (ย้ายจาก `update-agents-md` `### 8. Ship`)

##### Branch Hygiene

1. ตรวจ `git status` — uncommitted changes → commit ด้วย `/git-commit` หรือ `git stash`
2. `git switch main` + `git pull` — main ล่าสุด
3. switch/สร้าง feature branch ด้วย `/create-git-branch` — ห้ามทำงานต่อบน main
4. ถ้า step ก่อนหน้าทำบน main → commit ย้ายไป feature branch

##### Validate

1. ถ้า scope ใหญ่หลาย workspace → `/ship` swarm mode; diff เล็ก (typo/docs/config) → ข้าม step 2-9 ไป step 10 ได้
2. ทำ `/deep-review-then-fix` — review + fix issues ก่อน ship (canonical fix path)
3. ทำ `/check-bottlenecks` — optimize ทุก layer ที่เกี่ยวข้อง
4. ทำ `/deep-optimize` — subagent review ทุก dimension หา optimization opportunities ก่อน ship
5. ทำ `/deep-review` + `/update-version-to-latest` ตาม scope
6. ทำ `/follow-monorepo` ถ้า monorepo
7. ทำ `/run-verify` + `/run-test-all` + `/deep-test` — deep testing ครบ domain ที่ตรง context (api, cli, contract, coverage, e2e, integration, mutation, visual)
8. ถ้ามี TODO/MOCK/placeholder → `/implement-to-production`; structural issues → `/refactor`
9. ทำ `/update-project` sync project files/docs; `/deep-validate` เป็น final gate
10. ถ้า fail → `/resolve-errors` retry สูงสุด 3 รอบ แล้ว `/loop-until-complete`

##### Stage

1. `git pull --rebase origin main` — feature branch sync กับ main
2. ทำ `/git-commit-and-push` push changes ที่ผ่าน validation
3. deploy staging ด้วย `/run-deploy` ตาม AGENTS.md/package.json — บันทึก deploy URL, commit hash
4. ทำ `/watch-deploy` + smoke tests (critical flows, API health); e2e ผ่าน `/run-test` ถ้ามี
5. ถ้า staging fail → fix code กลับ Validate — retry สูงสุด 3 รอบ; ผ่าน = `ready-for-production`

##### Merge

1. repo ที่มี remote + PR workflow → `/create-github-pr` + `/review-github-pr`
2. ถ้า `/deep-review` ยังไม่ได้ทำ → ทำก่อน merge อย่างน้อย 1 รอบ
3. CI gate — `/resolve-cicd` (watch + resolve PR checks) หรือ `gh pr checks <n> --watch`; ห้าม merge ตอน check fail/pending
4. CI ผ่าน → `/open-diff pr <n>` เปิด diff UI ให้ user review + กด `Merge ▼`; AI ห้าม merge เองโดยไม่มี user confirm (`/merge-github-pr` เมื่อ user ยืนยัน)

##### Production

1. user confirm ก่อน deploy production — แสดง commit hash, changes, staging result; breaking change → `/ask-me`
2. บันทึก version ก่อน deploy (rollback target)
3. deploy production ด้วย `/run-deploy`; `/watch-deploy` + health checks + smoke tests
4. health check fail → rollback: `git revert <merge-commit>` + redeploy version ก่อนหน้า — ห้าม force-push
5. ทำ `/resolve-cicd` บน production branch; กลับ `git switch main` + sync local/remote

##### Wrap Up

1. ทำ `/report-progress`, `/report`
2. ทำ `/report-scan-todo` — pending items ไป `TODO.md`
3. ถ้าต้อง release → ทำ `/ship-release` แยก — `/ship` ไม่รัน release เอง
4. ถ้ามี stash → `git stash pop`; ปิด issue/task ที่เกี่ยวข้อง
5. ทำ `/suggest-next-action`

### references/swarm-fan-out

#### Fan-Out

##### Goal

ส่ง lanes ทั้งหมดทำงานพร้อมกันด้วย parallel execution สูงสุด — subagents, scripts และ parallel tool calls

##### Execution Modes

| Mode | เหมาะกับ | วิธี |
|------|---------|-----|
| `subagent` | lane ที่ต้อง judgment, multi-step, แก้ไฟล์ | `run_subagent` หรือ `/update-devin-global-subagents` |
| `script` | mechanical, deterministic, scan จำนวนมาก | `/use-scripts`, `/use-astgrep`, `/search-by-astgrep` |
| `parallel-calls` | read-only checks, commands อิสระ | tool calls หลายอันในข้อความเดียวตาม `/follow-parallel` |

##### Subagent Fan-Out

1. spawn ทุก lane ที่เป็น `subagent` mode พร้อมกัน — ไม่รอ lane แรกจบก่อน spawn lane ถัดไป
2. ให้แต่ละ lane: workspace path, file ownership, deliverable, acceptance criteria
3. background lanes → เก็บ lane id ไว้ poll ผลภายหลัง

##### Script Fan-Out

- รวม mechanical checks เป็น script เดียวเมื่อทำได้ (เช่น lint+format+audit)
- ใช้ `/use-astgrep` สำหรับ codemod/scan ทีต้อง AST precision
- script ที่รันนาน → background แล้ว poll

##### Parallel Tool Calls

- `read`, `grep`, `exec` read-only ที่อิสระกัน → batch ในข้อความเดียว
- ห้าม parallel สำหรับ commands ที่ dependent กัน หรือแตะ state เดียวกัน (git, files)

##### Limits

- ไม่ spawn subagents เกินจำนวน lanes ที่ independent จริง
- ถ้า lanes > 10 → แบ่งเป็น phases: foundation lanes ก่อน แล้ว dependent lanes
- ทุก spawn ต้องบันทึก lane → agent id mapping ไว้สำหรับ collect

### references/swarm-lanes

#### Lane Types

##### Standard Lanes

| Lane | งาน | Mode | หมายเหตุ |
|------|-----|------|---------|
| `verify` | build, lint, typecheck, format | parallel-calls | รันพร้อมกันได้หลัง code นิ่ง |
| `test` | unit, integration, e2e | subagent | แยกตาม test type ได้ |
| `review` | code review, security, perf | subagent | หลาย review ขนานกันได้ |
| `docs` | README, USAGE, changelog | subagent | แตะเฉพาะ docs ไฟล์ |
| `deps` | outdated, audit, licenses | script | mechanical scan |
| `fix` | แก้ findings ต่อ module | subagent | แยกตาม file ownership |
| `ship-ops` | commit, PR, release notes | sequential | ทำหลังทุก lane ผ่าน |

##### Ownership Rules

- 1 ไฟล์ = 1 lane เท่านั้น
- shared files (เช่น `package.json`, `index.ts` barrel) → กำหนด owner lane เดียว
- lane ที่อ่านอย่างเดียว (review, audit) แตะไฟล์ซ้ำกันได้ — ห้าม write เท่านั้น

##### Example Decomposition

```
lanes:
  - name: fix-frontend
    files: apps/web/src/**
    mode: subagent
  - name: fix-api
    files: apps/api/src/**
    mode: subagent
  - name: scan-deps
    files: package.json, lockfile
    mode: script
  - name: docs
    files: "*.md", docs/**
    mode: subagent
  - name: verify
    files: (read-only)
    mode: parallel-calls   # หลัง fix lanes จบ
```

##### Anti-Patterns

- spawn subagent สำหรับ `bunx eslint .` — ใช้ script
- lane ที่ deliverable คือ "ดูแล้วคิดว่า" — ไม่วัดผลได้
- verify lane รันขนานกับ fix lane — verify ต้องรอ code นิ่ง

### references/swarm-merge-and-gate

#### Merge And Gate

##### Collect Results

1. รวบรวม output ทุก lane: status (pass/fail/skip), files changed, findings
2. ตรวจ file overlap — ถ้า 2 lanes เขียนไฟล์เดียวกัน → conflict ต้อง resolve ก่อน merge
3. lane ที่ fail → re-run เฉพาะ lane นั้น ไม่ restart swarm

##### Conflict Resolution

- ไฟล์ชนกัน → apply lane ตาม priority ใน plan (fix > docs > verify)
- merge ด้วย manual edit หรือ `git` — ห้าม overwrite ทับงาน lane อื่น
- ถ้า conflict ซับซ้อน → `/ask-me` หรือ fallback sequential

##### Ship Gate

หลังทุก lane ผ่านและ merge เรียบร้อย ต้องผ่าน gates เดียวกับ `/ship`:

1. `/run-verify` + `/deep-validate` + `/run-check` ผ่านครบ
2. commit ตาม project conventions
3. สร้าง PR + review ตาม `/ship` workflow
4. user confirmation ก่อน merge และก่อน release/deploy
5. deploy และ post-deploy checks ตาม `/ship`

ห้ามลด gate เพราะ swarm เร็ว — parallel คือความเร็ว ไม่ใช่การข้ามขั้นตอน

##### Failure Fallback

- swarm fail ซ้ำ 2 ครั้ง → fallback ไป `/ship` sequential
- partial success → ship เฉพาะ lanes ที่ผ่านได้เฉพาะเมื่อ lanes นั้น independent จากที่ fail จริง
- ทุก fallback ต้อง report สาเหตุและ lanes ที่ค้าง

### references/swarm-plan

#### Swarm Plan

##### Goal

แตก ship work เป็น lanes ที่ทำขนานกันได้โดยไม่ชนกัน — กฎหลักคือ **lane = file ownership** ไม่ให้ 2 lanes แก้ไฟล์เดียวกัน

##### Decomposition Steps

1. ระบุงานทั้งหมดที่ `/ship` ต้องทำจาก `AGENTS.md` และ scope ปัจจุบัน
2. map แต่ละงานไปยัง files/directories ที่แตะ — ใช้ `/search-by-astgrep` หา symbols และ call sites
3. จัดกลุ่มเป็น lanes โดย file ownership ไม่ซ้ำกัน
4. ถ้า 2 งานแตะไฟล์เดียวกัน → รวมเป็น lane เดียวหรือทำ sequential phase
5. กำหนด deliverable และ acceptance criteria ต่อ lane

##### Dependency Graph

- lane ที่ต้องการ output ของ lane อื่น → sequential phase ไม่ใช่ parallel
- ตัวอย่าง: `fix-code` lane ต้องจบก่อน `verify` lane — แต่ `docs` lane ทำขนาน `verify` ได้

##### Preflight

ก่อน fan-out ตรวจด้วย script เดียว (ตาม `/use-scripts`):

```powershell
#### git clean, deps พร้อม, env vars ครบ, build tools ใช้ได้
git status --porcelain
bun install --frozen-lockfile  # หรือตาม ecosystem
```

- git ต้อง clean หรือ staged เท่านั้น — ห้ามมี uncommitted half-work
- deps ต้อง install แล้ว — subagent ไม่ควร `install` เอง
- env vars ที่ lanes ต้องใช้ต้องพร้อม

##### Lane Template

```
lane: <name>
files: <glob หรือ dirs ที่เป็นเจ้าของ>
deliverable: <ผลลัพธ์ที่วัดได้>
acceptance: <เงื่อนไขผ่าน>
mode: subagent | script | parallel-calls
```

### references/swarm-website

#### Ship By Agents Swarm Official Resources

##### Website

- https://devin.ai

##### Documentation

- https://docs.devin.ai

##### Repository

- N/A

##### Package Registry

- N/A

##### Description

Ship งานด้วย swarm — fan-out lanes แบบ async parallel แล้ว verify ครบทุกด้านก่อนส่งมอบ

## Expected Outcome

- `AGENTS.md` สดและครบ — ship workflow execute ผ่าน `/follow-agents-md`
- code ผ่าน verify ทั้ง local และ staging, production healthy พร้อม rollback path
