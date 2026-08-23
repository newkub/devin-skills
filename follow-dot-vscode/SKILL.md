---
name: follow-dot-vscode
description: จัดการ .vscode directory ครบถ้วน ทั้ง settings, extensions, tasks, และ launch config
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related: []
---
## Goal

จัดการ `.vscode` directory ให้ครบถ้วนและเป็นระบบ ครอบคลุม workspace settings, recommended extensions, tasks, launch configurations และ file associations

## Scope

ใช้สำหรับสร้าง ปรับปรุง และตรวจสอบ `.vscode` directory ทั้งหมด ไม่ทับซ้อนกับ `/follow-vscode-extensions` (สร้าง VSCode extension) และ `/follow-config` (config consistency)

### Standard Project

```text
.vscode/
├── settings.json       # Workspace settings
├── extensions.json     # Recommended extensions
├── launch.json         # Debug configurations
├── tasks.json          # Task configurations
└── snippets/           # Custom snippets (optional)
```

### Monorepo

```text
.vscode/
├── settings.json       # Root workspace settings
├── extensions.json     # Recommended extensions for all workspaces
├── launch.json         # Debug configs for multiple apps
├── tasks.json          # Tasks for build, dev, test, lint, typecheck
└── snippets/           # Shared snippets (optional)
```

## Execute

### 1. Analyze Existing .vscode

> Goal: อ่านและวิเคราะห์ `.vscode` directory ที่มีอยู่เพื่อเข้าใจสถานะปัจจุบัน
> Goal: รู้ไฟล์ที่มี ไฟล์ที่ขาด และไฟล์ที่ต้องอัปเดต

1. อ่าน `.vscode/` directory ทั้งหมด
2. จัดทำรายการไฟล์ที่มีอยู่และไฟล์ที่ขาด
3. อ่านไฟล์ที่มีอยู่เพื่อตรวจสอบความถูกต้อง
4. ถ้าไม่มี `.vscode/` directory → เริ่มใหม่ทั้งหมด
5. ถ้าอ่านไฟล์ไม่ได้ → stop และ report

### 2. Analyze Project

> Goal: วิเคราะห์ project เพื่อกำหนด settings ที่จำเป็น
> Goal: รู้ project type, tech stack, package manager, และ settings ที่ต้องมี

1. ทำ `/analyze-project` เพื่อดู tech stack และ structure
2. ทำ `/check-monorepo` เพื่อตรวจสอบประเภท project
3. ระบุ package manager (Bun, npm, pnpm, yarn)
4. ระบุ formatter/linter (Biome, ESLint, Prettier)
5. ระบุ type checker (tsc)
6. ระบุ test runner (Vitest, Jest, Playwright)
7. ถ้า project type ไม่ชัด → stop และ report

### 3. Setup Settings.json

> Goal: สร้างหรืออัปเดต `settings.json` ตาม tech stack ของ project
> Goal: Workspace settings ตรง tech stack และเพิ่ม productivity

1. ทำ `/learn-from-web` จาก VSCode settings docs เพื่อยืนยัน settings ที่เกี่ยวข้อง
2. กำหนด formatter settings:
   - `editor.defaultFormatter` → ตาม formatter ที่ใช้ (เช่น `biomejs.biome` สำหรับ Biome)
   - `editor.formatOnSave` → `true`
   - `[language]` overrides ถ้าจำเป็น
3. กำหนด editor associations (`workbench.editorAssociations`):
   - `README.md` → `vscode.markdown.preview.editor`
   - `/spec//*.md` → `vscode.markdown.preview.editor`
   - `/docs//*.md` → `vscode.markdown.preview.editor`
   - `/release//*.md` → `vscode.markdown.preview.editor`
   - `**/CHANGELOG.md` → `vscode.markdown.preview.editor`
   - `**/CONTRIBUTING.md` → `vscode.markdown.preview.editor`
   - `**/SECURITY.md` → `vscode.markdown.preview.editor`
   - ไฟล์ markdown อื่นๆ ไม่ใส่ → เปิดเป็น text editor เพื่อให้แก้ไขได้
4. กำหนด file associations (`files.associations`):
   - `*.jsonc` → `jsonc` (ถ้าใช้ JSONC config files)
   - `biome.jsonc` → `jsonc`
   - ไฟล์อื่นๆ ตาม tech stack
5. กำหนด TypeScript settings (ใช้ `js/ts.*` prefix ไม่ใช่ `typescript.*` ที่ deprecated):
   - `js/ts.tsdk.path` → path ของ TypeScript SDK (ถ้าใช้ workspace version)
   - `js/ts.tsdk.promptToUseWorkspaceVersion` → `true`
   - `js/ts.preferences.importModuleSpecifier` → `non-relative` (ถ้าใช้ path alias)
   - `js/ts.preferences.importModuleSpecifierEnding` → `minimal`
   - `js/ts.updateImportsOnFileMove.enabled` → `always`
6. กำหนด search exclude (`search.exclude`):
   - `node_modules`, `dist`, `.output`, `.turbo`
   - `.supabase`, `target` (Rust)
   - อื่นๆ ตาม build output ของ tech stack
7. กำหนด files exclude (`files.exclude`):
   - `/.git`: `true`, `/.DS_Store`: `true`
   - `dist`: `true`, `.turbo`: `true`
8. ตรวจสอบ existing configs (`biome.jsonc`, `tsconfig.json`) ว่าไม่ขัดแย้งกัน
9. ถ้ามี settings ที่ขัดแย้งกับ existing configs → แก้ให้สอดคล้อง
10. ถ้าเป็น monorepo → เพิ่ม `conventionalCommits.scopes` ตาม workspaces

### 4. Setup Extensions.json

> Goal: สร้างหรืออัปเดต `extensions.json` พร้อม recommended extensions
> Goal: Extensions ครบตาม tech stack ช่วยเพิ่ม productivity

1. ระบุ extensions ตาม tech stack:
   - Formatter/Linter: `biomejs.biome` (Biome) หรือ `dbaeumer.vscode-eslint` (ESLint)
   - Framework: extensions ตาม framework (SolidJS, Vue, React, etc.)
   - CSS: `antfu.unocss` (UnoCSS) หรือ `bradlc.vscode-tailwindcss` (Tailwind)
   - Desktop: `tauri-apps.tauri-vscode` (Tauri) ถ้าใช้
   - Rust: `rust-lang.rust-analyzer` ถ้ามี Rust code
   - Test: extensions สำหรับ test runner
   - Markdown: `shd101wyy.markdown-preview-enhanced` ถ้าต้องการ enhanced preview
   - Database: Drizzle extension ถ้าใช้ (เช่น `bradlc.vscode-tailwindcss` สำหรับ Tailwind ไม่ใช่ Drizzle)
2. แยก extensions เป็น `recommendations` และ `unwantedRecommendations`
3. ถ้าเป็น monorepo → รวม extensions ทั้งหมดที่จำเป็นสำหรับทุก workspace
4. ตรวจสอบว่า extension IDs ถูกต้องจาก VSCode Marketplace

### 5. Setup Launch.json

> Goal: สร้างหรืออัปเดต `launch.json` สำหรับ debug configurations
> Goal: Debug configs ครบสำหรับแต่ละ app ใน project

1. สร้าง debug config สำหรับ browser app (SolidJS/Vue/React):
   - URL: `http://localhost:3000` (หรือ port ตาม app)
   - `webRoot`: path ของ app source
2. สร้าง debug config สำหรับ desktop app (Tauri) ถ้ามี:
   - `type`: `node` (ใช้ `runtimeExecutable` เป็น `bun` หรือ `cargo`)
   - หลีกเลี่ยง `lldb`/`cppvsdbg` เพราะต้องติดตั้ง extension เพิ่มเติม
3. สร้าง debug config สำหรับ Node.js/Bun scripts ถ้ามี
4. สำหรับ monorepo → สร้าง compound config ที่รันหลาย apps พร้อมกัน
5. ถ้าไม่มี debug scenario → skip step นี้

### 6. Setup Tasks.json

> Goal: สร้างหรืออัปเดต `tasks.json` สำหรับ task configurations
> Goal: Tasks ครบสำหรับ build, dev, test, lint, typecheck

1. สร้าง task สำหรับ `dev` (รัน dev server)
2. สร้าง task สำหรับ `build` (production build)
3. สร้าง task สำหรับ `test` (รัน tests)
4. สร้าง task สำหรับ `lint` (รัน linter)
5. สร้าง task สำหรับ `typecheck` (รัน type checker)
6. สำหรับ monorepo → ใช้ package manager workspace commands (เช่น `bun run <script>` ที่ root)
7. กำหนด `group` เป็น `build` สำหรับ build task
8. กำหนด `isDefault` สำหรับ task ที่ใช้บ่อย
9. ถ้า project ไม่มี scripts → skip step นี้

### 7. Validate And Update References

> Goal: ตรวจสอบความถูกต้องและอัปเดต references
> Goal: ทุกไฟล์ถูกต้อง ไม่มี broken references

1. ตรวจสอบ JSON syntax ของทุกไฟล์ใน `.vscode/`
2. ตรวจสอบว่า settings ไม่ขัดแยงกับ `biome.jsonc`, `tsconfig.json`, และ `turbo.json`
3. ตรวจสอบว่า extension IDs ถูกต้อง
4. ตรวจสอบว่า task commands ตรงกับ scripts ใน `package.json`
5. ทำ `/update-reference` หากมี file operations
6. อัปเดต `AGENTS.md` ถ้ามีการเพิ่ม `.vscode/` directory ใหม่
7. ถ้า validation ไม่ผ่าน → แก้และ re-validate (max 3 → stop/report)

## Rules

### 1. No Overlap With Specialized Workflows

- ใช้ `/follow-vscode-extensions` สำหรับสร้าง VSCode extension (ไม่ใช่ config)
- ใช้ `/follow-config` สำหรับ config consistency ทั่วไป
- `follow-dot-vscode` จัดการไฟล์ใน `.vscode/` directory เท่านั้น

### 2. Settings Priority

- Workspace settings (`.vscode/settings.json`) มี priority สูงกว่า user settings
- ใส่เฉพาะ settings ที่ project-specific — ไม่ใส่ personal preferences
- ถ้า setting เป็น personal preference (เช่น theme, font size) → ไม่ใส่ใน workspace
- ใช้ `[language]` overrides สำหรับ language-specific settings

### 3. Editor Associations

- `workbench.editorAssociations` ควบคุม default editor สำหรับ file patterns
- ใช้ glob patterns ที่ specific ไม่กว้างเกินไป — `**/*.md` จะบังคับ preview ทุก markdown ทำให้แก้ไขยาก
- แนะนำ: เฉพาะ `README.md`, `/docs//*.md`, `/spec//*.md`, `/release//*.md`, `**/CHANGELOG.md`
- ไฟล์ markdown อื่นๆ ควรเปิดเป็น text editor เพื่อให้แก้ไขได้
- ใช้ `default` เป็นค่าเริ่มต้น ถ้าไม่ต้องการ custom editor

### 4. Monorepo Guidelines

- `settings.json` ที่ root ใช้สำหรับทุก workspace
- `extensions.json` รวม extensions ทั้งหมดที่จำเป็น
- `launch.json` สร้าง config แยกสำหรับแต่ละ app
- `tasks.json` ใช้ root package.json scripts ที่เรียก workspace commands
- ถ้า workspace ต้องการ settings เฉพาะ → สร้าง `.vscode/settings.json` ใน workspace นั้น

### 5. Tech Stack Alignment

- ตรวจสอบว่า `editor.defaultFormatter` ตรงกับ formatter ใน `biome.jsonc` หรือ lint config
- ตรวจสอบว่า `js/ts.tsdk.path` ถูกต้อง (ไม่ใช่ `typescript.tsdk` ที่ deprecated)
- ตรวจสอบว่า `files.associations` ครอบคลุมไฟล์ config ทั้งหมด
- ตรวจสอบว่า `search.exclude` ครอบคลุม build output ของทุก tool
- ไม่ใส่ settings สำหรับ tools ที่ project ไม่ใช้

### 6. High Impact Content

- ใส่เฉพาะ settings ที่ impact จริง — ไม่ใส่ noise
- ทุก setting ต้องตอบได้ว่า "ถ้าไม่มีแล้ว productivity ลดไหม" — ถ้าไม่ลด → ไม่ใส่
- ไม่ใส่ settings ที่เป็น default อยู่แล้ว
- ไม่ใส่ settings ที่เป็น personal preference
- ตรวจสอบว่าทุก extension ใน `extensions.json` ยัง maintained และ compatible

### 7. Safety And Determinism

- ผลลัพธ์ต้อง deterministic — tech stack เดียวกัน → settings เหมือนกันทุกครั้ง
- ห้าม hardcode absolute paths ใน settings หรือ tasks
- ใช้ variables เช่น `${workspaceFolder}`, `${command:...}` แทน absolute paths
- ถ้าไฟล์ที่มีอยู่ถูกต้องแล้ว → ไม่สร้างใหม่ แต่อัปเดตเฉพาะส่วนที่ขาด
- ถ้ามี user settings ที่ขัดแย้ง → workspace settings จะ override โดยอัตโนมัติ

## Expected Outcome

- `.vscode/` directory มีไฟล์ครบ: `settings.json`, `extensions.json`, `launch.json`, `tasks.json`
- `settings.json` ตรง tech stack: formatter, TypeScript, search exclude, file associations
- `workbench.editorAssociations` กำหนด markdown preview สำหรับ README, docs, spec, release, CHANGELOG
- `extensions.json` แนะนำ extensions ครบตาม tech stack
- `launch.json` มี debug configs สำหรับแต่ละ app (ถ้ามี)
- `tasks.json` มี tasks สำหรับ build, dev, test, lint, typecheck
- ทุกไฟล์ผ่าน JSON syntax validation
- Settings ไม่ขัดแย้งกับ `biome.jsonc`, `tsconfig.json`, `turbo.json`
- `AGENTS.md` อัปเดตถ้ามีไฟล์ใหม่
