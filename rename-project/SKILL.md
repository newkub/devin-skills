---
name: rename-project
description: Rename project ทั่วทุกจุด ทั้ง local, GitHub, Cloudflare, secrets, env, และ code
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - deploy-to-cloudflare
  - git-commit
---

## Goal

Rename project จากชื่อเก่าเป้นชื่อใหม่อย่างสมบูรณ์ ครอบคลุม local directory, code references, git remote, GitHub repo, Cloudflare resources, secrets, environment variables, และ docs

## Scope

- Local: directory name, file names, package metadata, config, source code strings
- Git: remote URL, branch tracking, commit messages ล่าสุด (ถ้าจำเป็น)
- GitHub: repository name, workflows, secrets, Pages/Workers settings
- Cloudflare: Worker name, D1 database name, Pages project name, KV namespaces, secrets, env vars
- Verification: search old name, run typecheck/build/test, deploy, open live URL

## Execute

### 1. Prepare

> Goal: เก็บข้อมูลก่อนลงมือ

1. สอบถามหรือระบุ `old-name` และ `new-name` ให้ชัดเจน
2. สำรวจ references ทั้งหมดด้วย search:
   ```bash
   rg -i "old-name" --hidden
   ```
3. ระบุ cloud resources ทีเกี่ยวข้อง:
   - Cloudflare Worker name
   - D1 database name และ database_id
   - Pages project name
   - GitHub repo name
   - env variables / secrets ทีมีชื่อ project
4. ตรวจสอบ auth:
   - `gh auth status` สำหรับ GitHub
   - `wrangler whoami` สำหรับ Cloudflare
5. ถ้า auth ไม่พร้อม → ใช้ `/follow-secret-manager` หรือ `/open-web-for-config-secret` ก่อน

### 2. Dry Run (Optional but Recommended)

> Goal: ลดความเสี่ยงก่อน rename จริง

1. สร้าง list ของไฟล์ทีต้องแก้ โดยไม่เปลี่ยนแปลงจริง
2. สำหรับ cloud resources ใช้ `--dry-run` เช่น `wrangler deploy --dry-run`
3. ถ้าพบ references เยอะมาก → ทำทีละ batch

### 3. Rename Local

> Goal: เปลี่ยนชื่อทั่วทุกจุดใน code

1. ปิด IDE/terminal ทีใช้ project แล้ว rename directory:
   ```bash
   mv old-name new-name
   ```
2. ถ้า Windows ไม่สามารถ rename ได้เนื่องจาก process lock → หา process แล้วปิด หรือรอแล้วลองใหม
3. อัปเดต `package.json` fields:
   - `name`
   - `description`
   - `repository.url`
   - `homepage`
   - `bugs.url`
4. อัปเดต config files:
   - `wrangler.toml`: `name`, `database_name`, route, account_id (ถ้าเปลี่ยน account)
   - `capacitor.config.ts`: app name, package, scheme
   - `index.html`: `<title>`
   - `public/manifest.webmanifest`: `name`, `short_name`
   - Android: `strings.xml`, `AndroidManifest.xml`, `build.gradle`
   - Play Store: `title.txt`, `full_description.txt`, `feature_graphic.svg`
5. อัปเดต docs:
   - `README.md`
   - `AGENTS.md`
   - `RELEASING.md`
   - `PRIVACY_POLICY.md`
   - `public/privacy-policy.html`
6. อัปเดต source code:
   - `src/lib/cloudflare.ts`
   - `src/lib/github.ts`
   - `worker/api/status.ts`
   - constants, titles, URLs
7. Search อีกครั้งเพื่อตรวจว่าไม่มี old name เหลือ

### 4. Update Git

> Goal: sync local git กับ new name

1. เปลี่ยน remote URL:
   ```bash
   git remote set-url origin git@github.com:<owner>/<new-name>.git
   # หรือ https
   ```
2. ตรวจ remote:
   ```bash
   git remote -v
   ```
3. Commit การเปลี่ยนแปลง

### 5. Rename GitHub Repository

> Goal: เปลี่ยนชื่อ repo บน GitHub

1. ใช้ `gh` CLI:
   ```bash
   gh repo rename <new-name> --repo <owner>/<old-name>
   ```
   หรือไปที่ dashboard: `https://github.com/<owner>/<old-name>/settings`
2. ตรวจ URL:
   ```bash
   gh repo view <owner>/<new-name>
   ```
3. อัปเดต workflows, README links, docs อีกครั้ง

### 6. Rename Cloudflare Resources

> Goal: เปลี่ยนชื่อ Worker, D1, Pages ให้ตรง

1. **Worker**: เปลี่ยน `name` ใน `wrangler.toml` แล้ว deploy ใหม
   ```bash
   wrangler deploy
   ```
2. **D1**: ถ้าต้องการ rename database ให้ใช้ Cloudflare dashboard หรือ API
   ```bash
   # หรืออัปเดต database_name ใน wrangler.toml โดยไม่ต้องเปลี่ยน database_id
   ```
3. **Pages project เก่า**: ลบด้วย
   ```bash
   wrangler pages project delete <old-name> --yes
   ```
4. **Secrets / env vars**:
   - ลบเก่าใน `wrangler secret` หรือ GitHub/GitLab secrets
   - สร้างใหม่ในระบบทีต้องการ (ใช้ `/follow-secret-manager`)
5. อัปเดต `.github/workflows/deploy.yml` ชี้ไปยัง secrets ใหม่

### 7. Verify

> Goal: ตรวจสอบว่า rename สมบูรณ์

1. Search old name อีกครั้ง:
   ```bash
   rg -i "old-name" --hidden
   ```
2. ยกเว้น historical docs, plan files, changelog → อาจเก็บไว้โดยระบุ
3. รัน:
   ```bash
   bun typecheck
   bun run test
   bun run build
   ```
4. Deploy แล้วเปิด live URL
5. ทดสอบ endpoints, tabs, settings

### 8. Commit And Push

> Goal: sync ทุกอย่างขึ้น remote

1. `git add -A`
2. `git commit -m "chore: rename project to <new-name>"`
3. `git push -u origin main`

### 9. Report

> Goal: สรุปผลให้ user

1. รายงาน local path, GitHub repo, Cloudflare Worker URL, D1 name
2. ระบุสิ่งที cleanup ไปแล้ว
3. ระบุขั้นตอนถัดไป (เช่น ทดสอบบนมือถือ, ตั้ง custom domain)

## Rules

- ต้องได้รับ `new-name` ชัดเจนก่อนเริ่ม
- ทำ dry-run ก่อน rename cloud resources ที่เป็น destructive
- ไม่ลบ cloud resource โดยไม่ได้ confirmation
- ใช้ `/follow-secret-manager` สำหรับ secrets ก่อน deploy
- build/test/typecheck ผ่านก่อน push
- ตรวจ old name ซ้ำอย่างน้อย 2 รอบ
- ไม่ commit ก่อนตรวจสอบครบทุกจุด

## Expected Outcome

- Project ถูก rename ทั่วทุกจุด
- GitHub repo, Cloudflare Worker, D1, Pages ใช้ชื่อใหม่
- ไม่มี old name หลงเหลือใน user-facing code
- Deploy สำเร็จและ URL ใช้งานได
- Git sync เรียบร้อย
