---
name: use-github-ship-bots
description: สร้าง ship bot project จาก plan/issue จนถึง deploy ผ่าน PR
argument-hint: "<issue-or-plan>"
allowed-tools:
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
  - follow-create-github-bots
  - implement-plan-from-github-issue
  - create-plan-as-github-issue
  - create-github-pr
  - use-create-pr
  - run-verify
  - watch-cicd-and-resolve
  - setup-cicd
  - deploy-to-cloudflare
  - deploy-to-vercel
  - open-github-repo
  - report-progress
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

## Execute

### 1. Read Plan

1. รับ `<issue-or-plan>` จาก argument
   - issue: `/use-github-ship-bots 42`
   - plan file: `/use-github-ship-bots .devin/plan/feed-bot.md`
2. ถ้าเป้น issue → ใช้ `/implement-plan-from-github-issue` หรือ `gh issue view <number>`
3. ถ้าเป้น file → อ่าน `.devin/plan/<file>.md`
4. ระบุ bot type, platform, features, acceptance criteria
5. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Bot Stack

1. GitHub bot (approve/reject buttons) → `/follow-create-github-bots`
2. Web dashboard bot → `/follow-create-web`
3. CLI bot → `/follow-create-bun-cli`
4. บันทึก stack, เหตุผล, dependencies

### 3. Create Project

1. สร้าง directory `{bot-name}/` หรือ repo ใหม่
2. ใช้ `/follow-create-github-bots` สร้าง skeleton
3. สร้าง branch `bot/<name>` ถ้าอยู่ใน existing repo
4. ตั้งค่า `.env.example`, `tsconfig.json`, `package.json`

### 4. Implement Core Features

1. สร้าง `src/handlers/` สำหรับ events ที plan ระบุ
2. สร้าง `src/domain/` สำหรับ business logic
3. เพิ่ม approve/reject buttons หรือ slash commands ถ้ามี
4. เชื่อมต่อกับ `D:\newkub\github-ship-bots` ถ้าเป้น GitHub ship bot
5. รัน `/run-lint` และ `/run-typecheck` ระหว่าง implement

### 5. Add Tests

1. สร้าง `test/handlers/` ด้วย fixtures
2. Mock Octokit API calls
3. รัน `bun test`
4. ตรวจ idempotency และ error handling

### 6. Verify

1. ทำ `/run-verify`
2. ตรวจ secrets และ env ตัวอย่าง
3. ตรวจ `README.md` มีวิธี install, config, deploy

### 7. Commit And Push

1. ทำ `/git-commit`
2. ทำ `/git-push`
3. บันทึก commit hash

### 8. Create PR

1. ใช้ `/use-create-pr` ถ้ามี UI/evidence
2. หรือใช้ `/create-github-pr`
3. ใส่ `Closes #<issue>` ใน PR body
4. แนบ screenshots, test results, staging preview

### 9. Monitor And Deploy

1. ใช้ `/watch-cicd-and-resolve` ติดตาม CI/CD
2. ถ้า pass → merge PR
3. ถ้ามี deploy → ใช้ `/deploy-to-cloudflare` หรือ `/deploy-to-vercel`
4. ตรวจสอบ bot ทำงานบน production

### 10. Update Issue

1. อัปเดต checkboxes ใน issue
2. ระบุ deployed URL, version
3. ทำ `/report-progress`

## Rules

- ไม่เริ่ม implement ถ้า plan ไม่ชัด
- ใช้ `/create-plan-as-github-issue` ถ้าต้องการ plan ใหม่
- ใช้ `/implement-plan-from-github-issue` ถ้าเริ่ม implement จาก issue
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
