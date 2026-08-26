---
name: follow-runtime-bun
description: ใช้ Bun runtime สำหรับ run, install, test, build, config
related:
  - follow-lang-bun
  - use-bun-native-api
  - use-bun-shell
  - use-bun-scripts
  - follow-create-bun-cli
  - follow-tool-bunup
---

## Goal

ใช้งาน Bun runtime สำหรับ run scripts, install packages, run tests, bundle apps, และ configure runtime ได้ถูกต้องและมีประสิทธิภาพ

## Scope

ใช้เมื่อต้องการใช้ Bun เป็น runtime หรือ toolkit หลักในโปรเจกต์ JavaScript/TypeScript
ครอบคลุมติดตั้ง, run, install, test, build, bunfig.toml, environment variables, watch mode, debugging และ Node.js compatibility
ไม่ครอบคลุม Bun native APIs ใน code (ดู `follow-lang-bun` และ `use-bun-native-api`)

## Execute

### 1. Verify Bun Runtime

> Goal: ยืนยันว่า Bun runtime พร้อมใช้งาน

1. รัน `bun --version` เพื่อตรวจสอบ version ปัจจุบัน
2. รัน `bun --revision` เพื่อดู build commit ถ้าจำเป็น
3. ถ้าต้องการ upgrade ให้ใช้ `bun upgrade` `bun upgrade --canary` หรือ `bun upgrade --stable`
4. ถ้าไม่มี Bun ให้ติดตั้งตาม `references/install.md`
5. อ่าน `package.json` เพื่อดู scripts, dependencies, workspaces, package manager

### 2. Install And Configure

> Goal: ติดตั้งและตั้งค่า Bun runtime

1. ใช้ `bun init` สร้าง project ใหม่ หรือ `bun create <template>` สร้าง project จาก template
2. ใช้ `bun install` ติดตั้ง dependencies (แทน `npm install` หรือ `npm i`)
3. ใช้ `bun add <pkg>` สำหรับ dependencies `bun add -d <pkg>` สำหรับ dev dependencies `bun add --optional <pkg>` สำหรับ optional dependencies และ `bun add --peer <pkg>` สำหรับ peer dependencies
4. ใช้ `bun add -g <cli>` สำหรับ global CLI (ยกเว้น project ใช้ npm เป็นหลัก)
5. ใช้ `bun remove <pkg>` สำหรับ remove dependencies
6. ใช้ `bun update` สำหรับ update dependencies ตาม semver range
7. ใช้ `bun pm` สำหรับ package manager commands เช่น `bun pm cache rm`
8. สร้างหรืออัปเดต `bunfig.toml` ตามค่าที่เหมาะสม ดู `references/bunfig.md`
9. ตรวจสอบ `bun.lockb` หรือ lockfile format ที่ใช้

### 3. Run Scripts And Files

> Goal: ใช้ `bun run`, `bun` และ `bunx` รันโค้ดและ execute packages

1. ใช้ `bun run <script>` สำหรับ package scripts ใน `package.json`
2. ใช้ `bun <file.ts|tsx|js|jsx>` สำหรับรันไฟล์โดยตรง
3. ใช้ `bunx <pkg>` หรือ `bun x <pkg>` สำหรับ execute packages โดยไม่ต้องติดตั้ง (แทน `npx`)
4. ใช้ `bun run --parallel` สำหรับ run scripts ขนานกัน
5. ใช้ `bun --watch <file>` หรือ `bun run --watch <script>` สำหรับ watch mode
6. ตรวจสอบ TypeScript, JSX, ESM, CommonJS compatibility ตาม file extension และ `package.json`

### 4. Test And Build

> Goal: ใช้งาน test runner และ bundler

1. ใช้ `bun test` สำหรับรัน tests (Jest-compatible)
2. ใช้ `bun test --watch` สำหรับ watch mode
3. ใช้ `bun test --coverage` สำหรับรายงาน coverage ถ้าจำเป็น
4. ใช้ `bun build ./index.tsx` สำหรับ bundle สำหรับ browser หรือ server
5. ใช้ `bun build ./cli.ts --compile --outfile <name>` สำหรับ single-file executable ถ้าต้องการ ship binary

### 5. Debug And Optimize

> Goal: ตรวจสอบและ optimize การใช้งาน

1. ใช้ `bun --inspect` หรือ `bun run --inspect` สำหรับ debugging
2. ใช้ `bun repl` สำหรับทดสอบ snippets
3. ตรวจสอบ environment variables (`NODE_ENV`, `BUN_ENV`)
4. เปรียบเทียบ performance และ memory กับ Node.js เมื่อจำเป็น

### 6. Verify

> Goal: ยืนยันว่า Bun runtime ทำงานได้จริง

1. รัน `bun --version`, `bun run` และ `bun test` ยืนยันว่าไม่มี error
2. ทำ `/validate` เพื่อตรวจ skill package
3. ถ้ามี error ให้ทำ `/resolve-errors` และ recheck (max 3 รอบ)
4. ทำ `/suggest-next-action` เพื่อแนะนำ step ถัดไป

## Rules

- `bun install` แทน `npm install` หรือ `npm i` และ `bun add -g` สำหรับ global CLI (ยกเว้น project ใช้ npm เป็นหลัก)
- ใช้ `bunfig.toml` สำหรับ config ที่เกี่ยวข้องกับ runtime ดู `references/bunfig.md`
- ดู references ทั้งหมดเริ่มจาก `references/index.md`
- ใช้ Web-standard APIs เมื่อเป็นไปได้ สำหรับ Bun native APIs ใน code ดู `follow-lang-bun` และ `use-bun-native-api`
- ตรวจ Node.js compatibility ก่อน migrate โดยอ้างอิง bun.com docs ดู `references/routes.md`
- ดู bun.com docs เป็นแหล่งหลัก ดู `references/routes.md` สำหรับ route map
- ไม่บังคับ upgrade Bun โดยไม่แจ้งผู้ใช้

## Expected Outcome

- Bun runtime ติดตั้งและพร้อมใช้งาน
- `package.json` scripts ใช้ `bun run` ได้
- dependencies ติดตั้งด้วย `bun install` ถูกต้อง
- tests ผ่านด้วย `bun test` และ build ผ่านด้วย `bun build`
- `bunfig.toml` ตั้งค่าถูกต้อง
- skill ผ่าน `/validate` ไม่เกิน 250 บรรทัด ไม่มี TODO/MOCK/placeholder
- references ครบถ้วน ไม่มี broken links
