# CI/CD Setup And Review

## Goal
สร้างหรืออัปเดต CI/CD pipeline ให้สอดคล้องกับ project context และ best practices
## Scope
ใช้เมื่องานต้องการ GitHub Actions หรือ CI/CD pipeline อื่นๆ สำหรับ build, test, lint, release
## Execute
### 1. Analyze Project
> Goal: เข้าใจ project ก่อนตั้งค่า CI/CD
1. อ่าน `package.json`, `Cargo.toml`, `pyproject.toml` หรือ manifest ที่เกี่ยวข้อง
2. อ่าน `AGENTS.md` ถ้ามี
3. ระบุ platform: GitHub, GitLab, Bitbucket, หรืออื่นๆ
4. ระบุ scripts ที่จำเป็น: build, test, lint, typecheck, release
### 2. Select Pipeline
> Goal: เลือก CI/CD pipeline ที่เหมาะสม
1. ถ้าเป็น GitHub → สร้าง `.github/workflows/ci.yml`
2. ถ้าเป็น GitLab → สร้าง `.gitlab-ci.yml`
3. ถ้าไม่แน่ใจ → ทำ `/learn-from-web` หา official best practices
4. ใช้ `/review-delivery` เพื่อ sync config กับ project conventions
### 3. Write Pipeline
> Goal: เขียน pipeline ที่ใช้งานได้
1. สร้างไฟล์ pipeline ตาม template ที่เลือก
2. ระบุ triggers: push, pull_request, release
3. ระบุ jobs: setup, lint, typecheck, test, build
4. ถ้า project เป็น monorepo → ใช้ `bun --filter` หรือ `turbo` ตาม ecosystem
5. ถ้าใช้ `/use-scripts` ช่วย generate pipeline ให้ทำตาม `/use-scripts`
### 4. Add Scripts
> Goal: sync `package.json` scripts กับ CI
1. ตรวจสอบ `scripts` ใน `package.json` ให้มี `lint`, `typecheck`, `test`, `build`
2. ถ้าขาดให้เพิ่มตาม ecosystem
3. ทำ `/follow-tasks` เพื่อตั้งค่า scripts ตามมาตรฐาน
### 5. Validate
> Goal: ตรวจสอบ pipeline ก่อน commit
1. ทำ `/deep-validate` เพื่อตรวจ syntax และ config
2. ทำ `/run-verify-fast` ถ้า local สามารถรันได้
3. ถ้า validate ไม่ผ่าน → ทำ `/resolve-errors` แล้วกลับไป Step 3
### 6. Commit
> Goal: commit CI/CD setup
1. ทำ `/git-commit` เพื่อ commit pipeline และ config
2. ถ้า commit ไม่สำเร็จ → ทำ `/resolve-errors` แล้ว retry
### 7. Report
> Goal: รายงานผล
1. ทำ `/report` พร้อมไฟล์ที่สร้าง
2. ทำ `/suggest-next-action`
## Rules
### 1. Platform First
- ระบุ platform ก่อนเขียน pipeline เสมอ
- ใช้ official docs เป็นแหล่งหลัก
- ไม่ hardcode secrets ใน pipeline
### 2. Minimal Pipeline
- เริ่มจาก lint + test + build ก่อน
- ค่อยๆ เพิ่ม release/deploy ถ้าจำเป็น
- ไม่ over-engineer สำหรับ project เล็ก
### 3. Idempotency
- รัน pipeline setup ซ้ำได้โดยไม่เกิด side effects
- ตรวจสอบก่อน overwrite ไฟล์เดิม
## Expected Outcome
- CI/CD pipeline ถูกสร้าง/อัปเดต
- `package.json` scripts sync กับ pipeline
- Pipeline ผ่าน `/deep-validate`
- Commit สำเร็จ
- รายงานผลลัพธ์ครบถ้วน