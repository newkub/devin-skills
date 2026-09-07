---
name: use-github-ship-bots
description: สร้าง ship bot project จาก plan/issue จนถึง deploy ผ่าน PR
argument-hint: "<issue-or-plan>"
allowed-tools:
---
  - read
  - write
  - edit
  - exec
  - skill
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - follow-create-bot
  - implement-github-issue-by-me
  - create-plan-in-dot-devin
  - create-github-pr
  - run-verify
  - resolve-cicd
  - setup-cicd
  - deploy-to-cloudflare
  - deploy-to-vercel
  - open-github
  - report-progress
  - use-gh-cli
---

![use-github-ship-bots logo](bot-logo.png)

## Goal

Ship bot project ตาม plan หรือ GitHub issue โดยสร้าง project, implement handlers, tests, CI/CD, deploy, และสร้าง PR

## Reference Code

- อ่าน reference จาก `D:\newkub\github-ship-bots`
- ถ้าต้องการ deploy ใหม่ ให้ทำงานภายใน `D:\newkub\github-ship-bots`
- อัปเดต repo หลัง ship bot เวอร์ชันใหม่

## Scope

- รับ plan จาก issue, file, หรือ argument
- สร้าง bot project ตาม stack ทีเลือก
- Implement handlers, business logic, tests
- รัน verify, CI/CD, deploy
- สร้าง PR พร้อม evidence
- อัปเดต issue status

- ดูเพิ่มเติม: /setup-cicd, /open-github

## Execute

### 1. Read Plan

> Goal: อ่าน Plan
1. รับ `<issue-or-plan>` จาก argument
   - issue: `/use-github-ship-bots 42`
   - plan file: `/use-github-ship-bots .devin/plan/<workspace>/feed-bot.md`
2. ถ้าเป้น issue → ใช้ `/implement-github-issue-by-me` หรือ `gh issue view <number>`
3. ถ้าเป้น file → อ่าน `.devin/plan/<workspace>/<file>.md`
4. ระบุ bot type, platform, features, acceptance criteria
5. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Bot Stack

> Goal: เลือก Bot Stack
1. GitHub bot (approve/reject buttons) → `/follow-create-bot`
2. Web dashboard bot → `/follow-create-web`
3. CLI bot → `/follow-create-bun-cli`
4. บันทึก stack, เหตุผล, dependencies

### 3. Create Project

> Goal: สร้าง Project
1. สร้าง directory `{bot-name}/` หรือ repo ใหม่
2. ใช้ `/follow-create-bot` สร้าง skeleton
3. สร้าง branch `bot/<name>` ถ้าอยู่ใน existing repo
4. ตั้งค่า `.env.example`, `tsconfig.json`, `package.json`

### 4. Implement Core Features

> Goal: implement Core Features
1. สร้าง `src/handlers/` สำหรับ events ที plan ระบุ
2. สร้าง `src/domain/` สำหรับ business logic
3. เพิ่ม approve/reject buttons หรือ slash commands ถ้ามี
4. เชื่อมต่อกับ `D:\newkub\github-ship-bots` ถ้าเป้น GitHub ship bot
5. รัน `/run-lint` และ `/run-typecheck` ระหว่าง implement

### 5. Add Tests

> Goal: เพิ่ม Tests
1. สร้าง `test/handlers/` ด้วย fixtures
2. Mock Octokit API calls
3. รัน `bun test`
4. ตรวจ idempotency และ error handling

### 6. Verify

> Goal: ตรวจสอบ Verify
1. ทำ `/run-verify`
2. ตรวจ secrets และ env ตัวอย่าง
3. ตรวจ `README.md` มีวิธี install, config, deploy

### 7. Commit And Push

> Goal: Commit And Push
1. ทำ `/git-commit`
2. ทำ `/git-push`
3. บันทึก commit hash

### 8. Create PR

> Goal: สร้าง PR
1. ใช้ `/create-github-pr`
2. ใส่ `Closes #<issue>` ใน PR body
3. แนบ screenshots, test results, staging preview

### 9. Monitor And Deploy

> Goal: ติดตาม And Deploy
1. ใช้ `/resolve-cicd` ติดตาม CI/CD
2. ถ้า pass → merge PR
3. ถ้ามี deploy → ใช้ `/deploy-to-cloudflare` หรือ `/deploy-to-vercel`
4. ตรวจสอบ bot ทำงานบน production

### 10. Update Issue

> Goal: อัปเดต Issue
1. อัปเดต checkboxes ใน issue
2. ระบุ deployed URL, version
3. ทำ `/report-progress`

## Rules

- ไม่เริ่ม implement ถ้า plan ไม่ชัด
- ใช้ `/create-plan-in-dot-devin` ถ้าต้องการ plan ใหม่
- ใช้ `/implement-github-issue-by-me` ถ้าเริ่ม implement จาก issue
- แยก webhook wiring ออกจาก business logic
- ใช้ `try/catch` รอบทุก handler
- ไม่ hardcode secrets
- ทุก feature ต้องมี test
- แต่ละ PR ทีมี UI ต้องมี annotated screenshots
- ไม่ใช้ mockup/placeholder ใน PR
- ไม่ deploy ถ้า verify ไม่ผ่าน

## Expected Outcome

- Bot project ถูกสร้างตาม plan
- Handlers, tests, CI/CD ครบถ้วน
- PR ถูกสร้างพร้อม evidence
- Bot deploy และทำงานบน production
- Issue ถูกอัปเดต progress
