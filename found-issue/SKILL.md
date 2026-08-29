---
name: found-issue
description: Map ปัญหา/อาการทั่วไปไปยัง skill หรือ workflow ทีถูกต้อง
related:
  - suggest-next-action
  - resolve-errors
  - search-skills
  - follow-skills
  - follow-skills-map
  - ask-me
---

## Goal

ช่วยหา skill หรือ workflow ทีถูกต้องเมื่อพบปัญหา/อาการ/ข้อผิดพลาด โดยไม่ต้องเดาสุ่ม

## Scope

ใช้เมื่อ user หรือ context ระบุอาการ (symptom) แต่ยังไม่รู้ว่าควรเรียก skill ใด
ไม่รวมการแก้ไขโค้ด/ไฟล์โดยตรง ให้ส่งต่อไปยัง skill เป้าหมาย

## Execute

### 1. Identify Symptom

> Goal: เข้าใจ issue ทีพบ

1. ถ้า user ระบุ `/found-issue <symptom>` → ค้นหาในตาราง Issue → Solution
2. ถ้าไม่ระบุ symptom → สรุปจาก context หรือถาม user สั้นๆ
3. ถ้าหา match ไม่เจอ → ไปขั้น Fallback

### 2. Route to Skill

> Goal: ส่งต่อไปยัง skill ทีเหมาะสม

1. ค้นหา row ในตารางทีใกล้เคียงกับ symptom ทีสุด
2. ถ้ามีหลาย match → ถาม user เลือก หรือเรียงตาม impact (ความเสี่ยง > ความถี่)
3. เรียก skill ทีได้จากตาราง โดยทำตาม `## Execute` ของ skill นั้น
4. ถ้า skill เป้าหมาย fail → ทำ `/resolve-errors`

### 3. Report

> Goal: สรุปผลการ map

1. ใช้ `/report-table` สรุป: symptom, matched skill, reason, next action
2. ทำ `/suggest-next-action`

## Issue To Solution Map

| ถ้า (Issue) | ทำอย่างไร (Solution) |
|---|---|
| disk เต็ม / ใกล้เต็ม | `/cleanup-files-in-computer` หรือ `/uninstall-program-in-computer` หรือ `/follow-tool-mise` (`mise cleanup`) |
| memory leak / ใช้ RAM สูง | `/run-profiler` หรือ `/check-bottlenecks`; ถ้าต้องการให้ CI ตรวจ → `/setup-ci-cd` + `/run-verify` |
| CPU สูง / ช้าผิดปกติ | `/check-bottlenecks`, `/run-bench`, `/run-profiler` |
| build fail | `/run-build`, `/watch-build`, `/resolve-errors` |
| lint fail | `/run-lint`, `/watch-lint`, `/resolve-errors` |
| typecheck fail | `/run-typecheck`, `/resolve-errors` |
| test fail / flaky | `/run-test`, `/watch-test`, `/run-test-all`, `/resolve-errors` |
| CI/CD pipeline fail | `/watch-ci-cd`, `/watch-github-actions`, `/list-github-action-fail`, `/setup-ci-cd` |
| deploy fail | `/watch-deploy`, `/list-deployment-fails`, `/run-deploy`, `/deploy-to-cloudflare`, `/deploy-to-vercel` |
| secrets leak / สงสัย hardcoded secret | `/check-secrets-leak`, `/follow-secret-manager`, `/open-github-secrets` |
| unused dependencies | `/check-unused-deps`, `/follow-tool-knip` |
| dead code / unused files | `/check-dead-code`, `/check-unused-files` |
| circular dependencies | `/check-circular-dependencies` |
| long files (>250 บรรทัด) | `/check-long-files`, `/refactor` |
| code duplication | `/check-code-structure`, `/follow-tool-jscpd` |
| broken references / skill refs ขาด | `/check-broken-skills-references`, `/update-references` |
| TODO/MOCK/placeholder เหลือ | `/report-scan-todo`, `/implement-mock` |
| dependencies outdated | `/update-dependencies-latest`, `/update-version-latest`, `/follow-tool-taze` |
| ไฟล์/branch/worktree รก | `/run-cleanup`, `/cleanup-files-in-project`, `/cleanup-git-branch`, `/cleanup-worktree` |
| git conflict | `/resolve-merge-conflicts`, `/git-debug` |
| workspace หลายอันไม่ตรงกัน | `/alignment`, `/sync-drive-d-submodules` |
| ไม่รู้ว่าควรใช้ skill ใด | `/search-skills`, `/suggest-next-action`, `/ask-me` |

## Rules

### 1. Match First

- ค้นหาในตารางก่อนเสมอ
- ถ้าหลาย row match ให้เรียงตาม impact ก่อน

### 2. Fallback

- ถ้าไม่ match → ทำ `/search-skills` หรือ `/ask-me`
- ไม่เดาสุ่ม skill

### 3. No Direct Fix

- `found-issue` ไม่แก้ไข code หรือ config เอง
- ส่งต่อไปยัง skill เป้าหมายและทำตาม `## Execute` ของ skill นั้น

## Expected Outcome

- ระบุ skill หรือ workflow ที่เหมาะสมกับปัญหาที่พบ
- รายงาน symptom → skill → next action ครบถ้วน
- ถ้าไม่มี match ให้มี fallback ชัดเจน
