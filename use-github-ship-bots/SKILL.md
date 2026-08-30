---
name: use-github-ship-bots
description: สร้าง ship bot project จาก plan/issue จนถึง deploy ผ่าน PR
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
  - report-session-status
---

![use-github-ship-bots logo](bot-logo.png)

## Goal

Ship bot project ตาม plan หรือ GitHub issue โดยสร้าง project, implement handlers, tests, CI/CD, deploy, และสร้าง PR

## How to use

1. เรียก skill ด้วย `/use-github-ship-bots <issue-number>` หรือ `/use-github-ship-bots <plan-file>`
   - ตัวอย่าง issue: `/use-github-ship-bots 42`
   - ตัวอย่าง plan file: `/use-github-ship-bots .devin/plan/feed-bot.md`
2. ถ้าเป็น issue → ใช้ `/implement-plan-from-github-issue` หรือ `gh issue view <number>` เพื่ออ่านรายละเอียด
3. ถ้าเป็น plan file → อ่านไฟล์ plan จาก path ที่ระบุ
4. ระบุ bot type, platform, features, acceptance criteria
5. ทำตามขั้นตอนใน Execute จนสร้าง PR พร้อม deploy และ evidence

## Submodule

Skill นี้แพ็ก bot reference code ไว้เป็น git submodule:

```
use-github-ship-bots/
├── SKILL.md
├── bot-logo.png
└── github-ship-bots/    # git submodule -> github.com/newkub/github-ship-bots
```

- อ่าน reference จาก `github-ship-bots/`
- ถ้าต้องการ deploy ใหม่ ให้ clone submodule แล้วทำงานภายใน `github-ship-bots/`
- อัปเดต submodule commit หลัง ship bot เวอร์ชันใหม่

## Scope

- รับ plan จาก issue, file, หรือ argument
- สร้าง bot project ตาม stack ที่เลือก
- Implement handlers, business logic, tests
- รัน verify, CI/CD, deploy
- สร้าง PR พร้อม evidence
- อัปเดต issue status

## Execute

### 1. Read Plan

> Goal: เข้าใจ bot ที่ต้อง ship

1. รับ `<issue-or-plan>` จาก argument
2. ถ้าเป็น issue → ใช้ `/implement-plan-from-github-issue` หรือ `gh issue view <number>`
3. ถ้าเป็น file → อ่าน `.devin/plan/<file>.md`
4. ระบุ bot type, platform, features, acceptance criteria
5. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Bot Stack

> Goal: เลือก stack ที่เหมาะสม

1. GitHub bot สำหรับ approve/reject buttons → ใช้ `/follow-create-github-bots` ด้วย Probot หรือ GitHub Apps
2. Web dashboard bot → ใช้ `/follow-create-web`
3. CLI bot → ใช้ `/follow-create-bun-cli`
4. บันทึก stack เหตุผล, dependencies

### 3. Create Project

> Goal: สร้าง project structure

1. สร้าง directory `{bot-name}/` หรือ repo ใหม่
2. ใช้ `/follow-create-github-bots` สร้าง skeleton
3. สร้าง branch `bot/<name>` ถ้าอยู่ใน existing repo
4. ตั้งค่า `.env.example`, `tsconfig.json`, `package.json`

### 4. Implement Core Features

> Goal: implement bot ตาม plan

1. สร้าง `src/handlers/` สำหรับ events ที่ plan ระบุ
2. สร้าง `src/domain/` สำหรับ business logic
3. เพิ่ม approve/reject buttons หรือ slash commands ถ้ามี
4. เชื่อมต่อกับ `github-ship-bots` submodule ถ้าเป็น GitHub ship bot
5. รัน `/run-lint` และ `/run-typecheck` ระหว่าง implement

### 5. Add Tests

> Goal: ทดสอบ bot โดยไม่ต้องรัน GitHub จริง

1. สร้าง `test/handlers/` ด้วย fixtures
2. Mock Octokit API calls
3. รัน `bun test`
4. ตรวจ idempotency และ error handling

### 6. Verify

> Goal: ยืนยันว่า bot พร้อม ship

1. ทำ `/run-verify`
2. ตรวจ secrets และ env ตัวอย่าง
3. ตรวจ `README.md` มีวิธี install, config, deploy

### 7. Commit And Push

> Goal: ส่ง code ขึ้น remote

1. ทำ `/git-commit`
2. ทำ `/git-push`
3. บันทึก commit hash

### 8. Create PR

> Goal: สร้าง PR พร้อม evidence

1. ใช้ `/use-create-pr` ถ้ามี UI/evidence
2. หรือใช้ `/create-github-pr` สร้าง PR มาตรฐาน
3. ใส่ `Closes #<issue>` ใน PR body
4. แนบ screenshots, test results, staging preview

### 9. Monitor And Deploy

> Goal: merge และ deploy bot

1. ใช้ `/watch-cicd-and-resolve` ติดตาม CI/CD
2. ถ้า pass → merge PR
3. ถ้ามี deploy → ใช้ `/deploy-to-cloudflare` หรือ `/deploy-to-vercel`
4. ตรวจสอบ bot ทำงานบน production

### 10. Update Issue

> Goal: อัปเดต plan/issue

1. อัปเดต checkboxes ใน issue
2. ระบุ deployed URL, version
3. ทำ `/report-session-status`

## Rules

### 1. Plan First

- ไม่เริ่ม implement ถ้า plan ไม่ชัด
- ใช้ `/create-plan-as-github-issue` ถ้าต้องการ plan ใหม่
- ใช้ `/implement-plan-from-github-issue` ถ้าเริ่ม implement จาก issue

### 2. Bot Conventions

- แยก webhook wiring ออกจาก business logic
- ใช้ `try/catch` รอบทุก handler
- ไม่ hardcode secrets
- ทุก feature ต้องมี test

### 3. Evidence

- แต่ละ PR ที่มี UI ต้องมี annotated screenshots
- ใช้ `/use-create-pr` สำหรับ PR ที่มี test cases ยาว
- staging preview link ต้องแยกจาก image

### 4. No Placeholders

- ไม่ใช้ mockup/placeholder ใน PR
- ถ้า feature ยังไม่เสร็จ → ระบุเป็น TODO ใน code พร้อม note
- ไม่ deploy ถ้า verify ไม่ผ่าน

## Expected Outcome

- Bot project ถูกสร้างตาม plan
- Handlers, tests, CI/CD ครบถ้วน
- PR ถูกสร้างพร้อม evidence
- Bot deploy และทำงานบน production
- Issue ถูกอัปเดต progress
