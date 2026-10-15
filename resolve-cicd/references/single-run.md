# Single run

## Single-Run CI/CD Resolve



เรียก skill โดย `/resolve-cicd [run-id|url]` หรือรันด้วย helper script:



```bash

bun "%APPDATA%\devin\skills\resolve-cicd\\scripts\resolve-cicd.ts" \

  [--run-id <id> | --url <url>] \

  [--max-retries 5] \

  [--no-retry]

```



- helper รองรับ GitHub Actions (CI) แบบเต็มรูปแบบ

- CD mode จะส่งต่อให้ `/watch-deploy` ตาม target — release/tag → poll registry endpoint จน live (`npm view`, `gh release view <tag>`)



## Goal



ติดตาม CI/CD pipeline หลังจากถูก trigger ตรวจสอบวาผ่าน, live/healthy, หรือ release สำเร็จ ถ้าไม่ผ่านให้ resolve และ re-run/re-deploy จนกว่าจะผ่าน



## Scope



ใช้หลังจาก:

- push code

- `/run-deploy`, `/deploy-to-*`, `/ship`, `/run-release`

- หรือเมื่อได้รับ `run-id` หรือ `url-or-target` จาก argument



ครอบคลุม:

- CI: GitHub Actions, GitLab CI, Azure DevOps, CircleCI, Jenkins

- CD: Cloudflare Pages, Vercel, Railway, Render, Fly.io, Netlify, custom domain, release/tag



สำหรับ CI platform เฉพาะจะส่งต่อ `/resolve-github-actions-fails`

สำหรับ CD platform เฉพาะจะส่งต่อ `/watch-deploy` (release/tag → poll registry/tag endpoint จน live)



ไม่รวม trigger ครั้งแรก — ต้องถูก trigger โดย `/run-deploy`, `/deploy-to-*`, `/run-release` หรือ push ก่อน



## Execute



### 1. Detect CICD Mode



> Goal: ระบุวาเป้น CI หรือ CD

1. ถ้าได้รับ `run-id` จาก argument → เป้น CI

2. ถ้าได้รับ `url-or-target` จาก argument → เป้น CD

3. ถ้าไม่มี argument → ค้นหาจาก:

   - environment variable `DEPLOY_URL`, `PREVIEW_URL`, `VERCEL_URL`, `CF_PAGES_URL`

   - CI/CD log ล่าสุดทีมี run ID หรือ URL

   - section `references/targets` ใน `watch-deploy/SKILL.md`

   - `references/runs.md` ใน `/resolve-cicd`

4. ถ้ายังไม่ชัด → ทำ `/ask-me`



### 2. CI: Detect CI Platform



> Goal: ระบุ CI platform

1. หา CI config files (`.github/workflows/*`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `.circleci/config.yml`, `Jenkinsfile`)

2. เรียงตามลำดับ: GitHub Actions → GitLab CI → Azure DevOps → CircleCI → Jenkins

3. ถ้าไม่พบ config → ทำ `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase` หรือ `/ask-me`



### 3. CI: Verify CLI And Identify Run



> Goal: เตรียม CLI และ run ID

1. ตรวจ CLI: `gh`, `glab`, `az`, `circleci`, `jenkins-cli`

2. ถ้า `run-id` มาจาก argument → ใช้ค่านั้น

3. ถ้าไม่มี → หา run ล่าสุด:

   - GitHub Actions: `gh run list --limit 5`

   - GitLab CI: `glab pipeline list --limit 5`

   - Azure DevOps: `az pipelines runs list --top 5`

   - CircleCI: `circleci pipeline list`

   - Jenkins: latest build API

4. ถ้าไม่มี active run → report และ stop



### 4. CI: Watch Pipeline



> Goal: ติดตาม CI จนสิ้นสุด

1. ถ้า GitHub Actions → ทำ `/resolve-github-actions-fails [run-id]` แล้ว return ผล

2. GitLab CI: `glab pipeline trace <pipeline-id>`

3. Azure DevOps: `az pipelines runs show --id <run-id>` poll ทุก 10 วิ

4. CircleCI: poll API

5. Jenkins: poll build status

6. ถ้า pass → ไป Report

7. ถ้า fail, cancel, timeout → ไป Resolve




> Continues: CD watch, resolve/retry, rules and expected outcome in [single-run-cd-resolve.md](single-run-cd-resolve.md)
