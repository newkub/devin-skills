# Config And Gitignore Drift Checks

## Config Drift Checks

### TypeScript Config

- ตรวจสอบ `tsconfig.json` เทียบกับ dependencies และ project structure
- ตรวจสอบ: `paths` (aliases), `target`, `module`, `strict`, `jsx`
- ระบุ settings ที่ล้าหลังหรือไม่สอดคล้องกับ dependencies

### Build Config

- ตรวจสอบ `vite.config.ts`, `webpack.config.js` หรือ build config อื่นๆ
- ตรวจสอบ: `resolve.alias`, plugins, build options
- ระบุ settings ที่ไม่สอดคล้องกับ project structure

### Lint Config

- ตรวจสอบ `biome.jsonc`, `.eslintrc`, หรือ lint config อื่นๆ
- ตรวจสอบ: rules, ignore patterns, formatter settings
- ระบุ rules ที่ล้าหลังหรือไม่ครอบคลุม

### Package Manager Config

- ตรวจสอบ `package.json` scripts เทียบกับ actual tools
- ตรวจสอบ: `scripts`, `exports`, `types`, `main`
- ระบุ scripts ที่ล้าหลังหรือไม่ตรง actual commands

## Gitignore Drift Checks

### Stack Coverage

- ตรวจสอบ `.gitignore` ครอบคลุม dependencies, build outputs, IDE, secrets, OS files
- ระบุ missing entries ตาม stack ที่ใช้
- ตรวจสอบ workspace-specific `.gitignore` ใน monorepo

### Artifact Coverage

- ตรวจสอบว่า build artifacts ที่ generate โดย tools ที่ใช้ถูก ignore
- ระบุ artifacts ที่ไม่ถูก ignore แต่ควร ignore

### Secret Coverage

- ตรวจสอบว่า `.env`, `.env.*` (ยกเว้น `.env.example`) ถูก ignore
- ระบุ secret files ที่ไม่ถูก ignore

## Drift Severity

- Critical: secrets ไม่ถูก ignore, config ทำให้ build พัง
- High: config ไม่สอดคล้องกับ dependencies, missing critical gitignore entries
- Medium: config ล้าหลังเล็กน้อย, minor gitignore gaps
- Low: cosmetic config drift

## Recommended Update Skills

- `update-gitignore` สำหรับ `.gitignore`
- `update-dot-devin` สำหรับ `.devin` structure
- `/review-delivery` สำหรับ config consistency
