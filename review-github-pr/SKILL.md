---
name: review-github-pr
description: Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes
argument-hint: "[pr-number]"
related:
  - list-github
  - merge
  - resolve-errors
  - report
  - suggest-next-action
  - run-review
  - deep-thinking
  - deep-analyze
  - deep-validate

---

## Goal

Review pull request ทั้งหมดก่อน merge โดยตรวจสอบ diff, commits, PR metadata, CI และ code changes

## Scope

ใช้สำหรับ review pull request ก่อน merge — ทำงานบน PR จาก GitHub หรือ local branch diff — ไม่แก้ไข code โดยไม่ได้รับอนุญาต — เป็น single-file package เกณฑ์ review ทั้งหมด inline ในไฟล์นี้ (no `references/`)

## Execute

ทุกรอบเริ่มด้วย deep pre-pass — ทำ `/deep-thinking` → `/deep-analyze` → `/deep-validate` ก่อน fetch/review ใดๆ (convention: `update-devin-global-skills` `## Conventions → Templates` row `review-*`)

### 1. Fetch PR Context

> Goal: ดึง PR context ครบถ้วน

1. มี PR number → ทำ `gh pr view <pr>` และ `gh pr diff <pr>`; ไม่มี → ทำ `git diff <base>..<head>` และ `git log --oneline <base>..<head>`
2. บันทึกข้อมูล: title, description, author, base branch, commits, files changed, additions/deletions, labels, checks
3. กำหนด domain ของ PR: frontend, backend, infrastructure, docs, config, test, library
4. ใช้ GitHub → ทำ `gh pr checks <pr>` ดู CI status

### 2. Review PR Metadata

> Goal: ตรวจ PR metadata ก่อน review code

1. Title ตาม conventional commits (`<type>: <subject>`)
2. Description มี context, linked issue และสรุป changes
3. Base branch ถูกต้อง
4. ขนาด PR: small (<10 files), medium (<30 files), large (>30 files) → แนะนำ split ถ้าใหญ่เกิน
5. ตรวจ merge conflicts, draft status, required reviews
6. Commit messages ตาม convention ไม่มี WIP หรือ fixup
- Severity: Critical = base branch ผิด, PR เป็น draft แต่ต้อง merge, มี conflict; High = title ไม่ตาม convention, ไม่มี description, PR ใหญ่ไม่ split; Medium = ไม่มี linked issue, WIP commits; Low = commit message ผิดเล็กน้อย, ไม่มี labels

### 3. Review Code Changes

> Goal: ตรวจ code changes ของ PR

1. ทำ `/run-verify` รัน lint, typecheck, scan — fail → report ก่อนแล้วค่อยต่อ
2. ทำ `/deep-review` บน changed files — พร้อม security-sensitive changes, test coverage และ quality, docs/changelog/versioning/git hygiene
3. ตาม domain ของ PR → ทำ `/deep-review` ใน domain ที่ diff แตะ (frontend, backend, api, auth)
- Severity: Critical = build fail, security risk, breaking change โดยไม่มี migration; High = ขาด tests, lint fail, auth change ไม่ถูก review; Medium = ขาด docs/changelog, coverage ลดเล็กน้อย; Low = formatting, cosmetic

### 4. Validate Findings

> Goal: ยืนยัน findings ก่อนรายงาน

1. ทำ `/deep-validate` ข้ามหลายมิติ และ validate ราย issue ทีละข้อ
2. เรียงลำดับ Critical → High → Medium → Low
3. ระบุ false positive → ทิ้ง ไม่นำเสนอ

### 5. Governance

> Goal: PR governance ถูกบังคับ — detect ด้วย `gh pr view --json` (reviewers, labels, mergeable, checks), `gh api repos/{owner}/{repo}/branches/{branch}/protection`, `gh pr checks`, `gh pr view --comments` และไฟล์ `CODEOWNERS`

1. CODEOWNERS/reviewers — file มีอยู่และครอบคลุม paths สำคัญ (`src/`, `infra/`, `migrations/`, auth code); owner review ครบก่อน merge; ไม่ self-merge (ยกเว้น solo-maintainer policy); new commits dismiss stale approvals ตาม policy
2. Branch protection — required checks ผ่าน, required reviews ครบตามจำนวน policy, unresolved threads block merge, branch up-to-date กับ target, signed commits และ linear history ตาม convention, admin bypass ต้องถูก audit
3. PR hygiene — draft PR ไม่ถูก merge พลาด, `WIP:`/`DO NOT MERGE` ถูก flag, linked issues (`Closes #123`), labels (type/area/priority), assignee, milestone, PR template ถูกกรอกครบ
4. Size/scope — >500 lines changed หรือ >20 files → oversized แนะนำ split; single concern (ไม่ mixed refactor+feature+fix); commits 1-20 และ atomic (bisect-friendly); ไม่มี scope creep
5. Merge strategy — squash สำหรับ feature PRs, merge commit สำหรับ releases, rebase สำหรับ linear history; commit message ตาม convention; ลบ source branch หลัง merge; ห้าม push ตรง `main`/`master`
6. Bots/automation — auto-merge เฉพาะหลัง checks ผ่าน; security/license/coverage bot รันครบ; bot tokens เป็น least-privilege; bots ข้าม human review ใน sensitive paths ไม่ได้
7. Compliance/audit — merge log (ใคร merge, เมื่อไร, checks ไหนผ่าน); revert path ชัดเจน (`git revert -m 1`); rollback plan สำหรับ PR ใหญ่/เสี่ยง; ไม่ใช่ rubber-stamp approval; post-merge smoke test หรือ monitoring
8. External PRs — CLA/DCO ถ้าบังคับ; fork PRs เข้าถึง secrets ใน CI ไม่ได้; ได้ maintainer review เสมอ; first-time contributor PRs ถูก held; `CONTRIBUTING.md` มีอยู่และลิงก์จาก PR template
- Severity: merge โดยไม่มี required review หรือ bypass checks = Critical; ไม่มี CODEOWNERS บน sensitive paths = High; oversized PR = Medium; ไม่มี labels = Low

### 6. Check Gate (Blocking)

> Goal: ทุก gate ผ่านก่อน approve/recommend merge — ห้ามข้าม

1. CI checks ผ่านทั้งหมด: `gh pr checks <n>` — ห้ามมี `fail`/`pending` เหลือ; pending → `gh pr checks <n> --watch` หรือ `/resolve-cicd` จนเขียว
2. ทำ `/deep-validate` บน merge result (frontmatter, types, contract) — fail → ห้าม recommend merge
3. ทำ `/deep-review` ตาม scope ของ PR (domain ที่ diff แตะ) — blocker findings → fix ก่อน ห้าม merge
4. เฉพาะเมื่อ 3 ข้อผ่านครบ → verdict `ready-to-merge`; ไม่งั้น `blocked` พร้อมระบุ gate ที่ค้าง

### 7. Score And Report

> Goal: คำนวณ score/grade ตามเกณฑ์ แล้วทำ `/report-review` และ `/suggest-next-action` (github pr)

1. Severity weights — Critical 0, High 25, Medium 50, Low 75, Info 100; review score = weighted average ของ findings ทั้งหมด
2. Grade: A ≥90 (excellent), B ≥80 (good), C ≥70 (pass), D ≥60 (needs improvement), F <60 (fail)
3. Threshold: score <70 → แนะนำแก้ PR ก่อน merge; ≥70 → ready to merge ตาม recommendations
4. Metrics ประกอบ: Review Coverage Ratio, False Positive Rate, Evidence Strength (findings ที่มี path/line/commit), Actionability Score, Severity Distribution, MTTR (Critical=1d High=3d Medium=7d Low=14d), Before/After Trend, Risk Exposure Index (Critical/High ใน security/auth/API/breaking/CI), Scope Boundary Adherence, Report Quality
5. Metrics เฉพาะ PR: size (changed lines + files), Review Coverage (reviewed files / changed files × 100), CI Pass Rate (passed checks / total checks × 100), Conflict Rate

### 8. Report And Recommend

> Goal: สร้างรายงานและแนะนำ actions สำหรับ PR

1. ทำ `/report-review` (ตารางในแชท ไม่สร้างไฟล์); ผล review ส่งขึ้น PR comment ผ่าน `gh pr review` เมื่อจำเป็น
2. ตาราง PR Checklist: Title, Description, Size, Conflicts, Conventional Commits, Tests, CI
3. ตาราง Findings: Category, Severity, Location, Recommendation
4. ระบุ merge readiness: ready / needs changes / needs discussion
5. ทำ `/suggest-next-action`
- Verdict severity: Critical = merge blocked (CI fail หรือ security risk), High = ต้องแก้ก่อน merge, Medium = ต้อง discussion, Low = cosmetic/nit

### 9. Deep PR Review (เมื่อต้องตอบ comments และ resolve ก่อน merge)

> Goal: review แบบละเอียด — reply comments, resolve conversations, ถาม user ก่อน merge

1. อ่านทุก comment ที่ยังไม่ resolved แล้วตอบตาม context: เห็นด้วย → แก้ code + comment พร้อม commit SHA; ต้องอธิบาย → reply ด้วย evidence; false positive → clarify — ใช้ `gh pr review <pr-number> --comment` และ `gh api repos/{owner}/{repo}/pulls/comments/{id}/replies` เมื่อจำเป็น
2. ถ้าต้องแก้ → implement ตาม severity → ทำ `/run-check` และ `/run-test` หลังแก้ → ทำ `/git-push` (never force); commits บน PR branch รก → ทำ `/refactor-commit` ก่อน push/merge
3. สรุป findings + resolved comments → ทำ `/open-web` เปิด PR ให้ user ดู → ถามว่าจะ merge ไหม → yes → ทำ `/merge-github-pr` หรือ `gh pr merge`; no → รายงาน next actions
- Rules ของขั้นนี้: ห้าม merge เองถ้า user ไม่ได้สั่ง; ทุก conversation ต้อง resolve ก่อน merge; CI ต้องผ่าน; reply ด้วย evidence เสมอ

### Workflows

> Goal: dispatch report formatting ไปยัง workflow เมื่อต้องการ review comments พร้อม submit

| Topic | Workflow |
|-------|----------|
| `comments`, `report-comments` — inline comment drafts + summary verdict | `workflows/report-comments/SKILL.md` |

## Subagents

> Goal: งาน review ที่ spawn ทำขนานได้ — profile สั้นอยู่ใน section นี้; spawn ผ่าน `/use-subagents` ด้วย profile ข้างล่างนี้

### pr-reviewer — review PR slice เดียว (per-domain/per-file-group) แล้วคืน findings พร้อม severity

- **Inputs**: `pr-diff-scope` (file list หรือ diff range ที่รับผิดชอบ เช่น `src/api/**`, commits `a..b`, หรือ domain เช่น `security`); `conventions` (project conventions เช่น `AGENTS.md`, style guide, PR checklist); `pr-context` (optional: PR number, base/head branch, title, description)
- **Tools**: model `sonnet` — `read`, `grep`, `find_file_by_name`; `exec` เฉพาะ read-only (`gh pr diff`, `gh pr view`, `git diff`, `git log`); ห้าม `edit`/`write` บน source (เป็น read-only reviewer)
- **Execute**:
  - อ่าน diff เฉพาะ scope (`gh pr diff <pr>` หรือ `git diff`) — ไม่อ่าน files นอก scope
  - อ่าน surrounding code ของแต่ละ hunk เพื่อเข้าใจ context ก่อนตัดสิน
  - ตรวจตาม domain checklist ที่ได้รับ เช่น security → injection/auth/secrets, tests → coverage/assertions
  - จัด severity ให้ทุก finding ด้วย evidence จริงจาก diff ห้ามเดา
  - สรุป verdict ของ slice: `approve` / `comment` / `request-changes`
- **Output**: ตาราง findings `| No. | File | Line | Severity | Finding | Recommendation |`; `severity` = `critical`/`high`/`medium`/`low`/`info`; ปิดท้ายด้วย slice verdict และจำนวน findings ต่อ severity; ถ้าไม่มี findings → คืน `approve` พร้อมเหตุผลสั้น
- **Constraints**: review เท่านั้น ห้ามแก้ source หรือ push commits; focus เฉพาะ scope ที่ได้รับ ห้าม review ทั้ง PR หรือ files นอก slice; ทุก finding ต้องมี `file path` + `line` หรือ `commit reference`; ไม่ duplicate findings ที่อยู่นอก scope (slice อื่นมี agent ของตัวเอง); ถ้า diff ใน scope ไม่มี changes → คืน `approve` ทันทีพร้อมระบุว่า scope ว่าง

### pr-checklist-reviewer — ตรวจ PR ตาม dimensions โดยใช้เกณฑ์ในไฟล์นี้เป็น criteria (report-only)

- **Inputs**: `scope` (path/directory เป้าหมาย review); `dimensions` (optional: subset ของ checklist dimensions — default ทั้งหมด); `findings-file` (optional: baseline output เพื่อ cross-check)
- **Tools**: model `sonnet` — `read`, `exec`, `grep`, `glob`, `find_file_by_name`; ห้าม `edit`/`write` (read-only reviewer)
- **Execute**:
  - อ่านเกณฑ์ของแต่ละ `dimensions` จาก section ที่ map ไว้ในข้อถัดไป แล้วตรวจจริง (read/grep/glob) — ทุก finding ต้องมี `file:line` + evidence
  - dimension → parent section: `fetch-pr-context`→`### 1`, `pr-metadata`→`### 2`, `code-changes`→`### 3`, `validate-findings`→`### 4`, `governance`→`### 5`, `scoring`→`### 7`, `report-and-recommend`→`### 8`, `deep-pr-review`→`### 9`, `checklist`→`## Rules → Full-Dimension Checklist`
  - Classify severity: `Critical` / `High` / `Medium` / `Low` / `Info`
  - False positive → ทิ้ง; นอก scope → `info` เท่านั้น
- **Output**: ตาราง `| No. | Dimension | Severity | File | Finding | Suggestion |`; เรียง `Critical`→`Info`; ปิดท้ายด้วย score ต่อ dimension + overall; รายงานทั้ง strengths และ weaknesses
- **Constraints**: read-only — ห้ามแก้ไขไฟล์ใดๆ (fix เป็นหน้าที่ของ `## Fix` ใน parent); ห้ามเดา — ไม่มี evidence ไม่มี finding; รับผิดชอบเฉพาะ `dimensions` ที่ได้รับ ไม่ข้ามไปมิติอื่น

## Rules

- Review เท่านั้น ไม่แก้ source โดยไม่ได้รับอนุญาต
- ห้าม verdict `ready-to-merge` ถ้า Step 6 (Check Gate) ไม่ผ่านครบ — CI + `/deep-validate` + `/deep-review` เป็น blocking gates
- Focus บน changed files ไม่ต้อง review ทั้ง codebase
- ถ้า PR ใหญ่ → แนะนำ split ก่อน review ละเอียด
- Title และ commits ต้องตาม conventional commits
- ทุก finding ต้องมี file path, line number หรือ commit reference
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis (github pr)
- ห้าม merge เองถ้า user ไม่ได้สั่ง (deep PR review)

- ใช้ /open-github ถ้าจำเป็น
- ใช้ /list-github-pr ถ้าจำเป็น
- ใช้ /merge-github-pr ถ้าจำเป็น
- ใช้ /resolve-github-actions-fails ถ้าจำเป็น
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น

- ถ้า pass → ทำ `/merge-github-pr` ถ้า fail → แจ้ง author แก้ตาม findings

### Full-Dimension Checklist (ตรวจทุกมิติก่อนสรุป)

- Metadata — title/description ตรงกับ changes, linked issues; ขนาด/scope reviewable; labels, reviewers, draft status เหมาะสม; CI checks + required reviews ครบ
- Code Changes — diff review: logic, edge cases, regressions; ไม่มี unrelated changes หรือ debug leftovers; tests เพิ่ม/อัปเดตตาม changes; docs/changelog ถ้า user-facing
- Risk And Compatibility — breaking changes ถูก flag พร้อม migration path; security implications และ secrets ใน diff; performance impact; dependency changes ถูก review
- Process — review comments ถูก address ครบ, ไม่มี unresolved threads; commit history สะอาดตาม convention; merge strategy เหมาะสม (squash/rebase/merge); branch up-to-date, conflicts resolved
- ให้คะแนนแต่ละข้อ: pass = 1, warning = 0.5, fail = 0 → grade A (90+), B (80+), C (70+), D (60+), F (<60)

## Fix

> ทำตาม `deep-review/SKILL.md` เมื่อ user confirm ให้แก้ findings

## Expected Outcome

- PR metadata review: title, description, size, commits, conflicts
- Findings จาก code, security, test, delivery, domain reviews
- Merge readiness verdict พร้อมเหตุผล
- Recommended actions ถัดไป
