# Structure Analysis

Checks (pass / warning / fail):

- Naming style: `kebab-case` ตาม convention project / บางไฟล์ไม่ตรง / จำนวนมากไม่ตรง
- Name reflects responsibility: ชื่อสะท้อนหน้าที่ / กำกวม (`utils`, `helpers`, `common`, `misc`) / ไม่สะท้อนเลย (`data`, `temp`, `stuff`)
- Consistency: สม่ำเสมอทั้ง project / 1-2 ไฟล์ / inconsistent ทั้ง project
- Prefix/suffix: `*-service.ts`, `*-handler.ts`, `*-types.ts` สม่ำเสมอ / ไม่สม่ำเสมอ / ไม่ใช้หรือผิดประเภท
- Type indicators: `*.test.ts`, `*.spec.ts`, `*.config.ts` ครบ / บางไฟล์ขาด / ไม่มีเลย

##### Folder Grouping

Checks (pass / warning / fail):

- Domain cohesion: domain เดียวกันทั้ง folder / 1-2 ไฟล์ต่าง domain / ปนหลาย domain
- File count: ≤20 / 21-40 / >40 (bloat) — ไม่นับ test/generated
- Mixed concerns: ไม่มี logic+test+config+generated ปน / 1-2 ไฟล์ / ปนหลายประเภท
- Nesting depth: 3-5 / 6 หรือ 2 / >6 หรือ 1 (flat เกิน)
- Import boundaries: ไม่มีข้าม domain/layer / 1-2 / จำนวนมาก
- Folder naming: สะท้อน domain + kebab-case / กำกวม / ไม่สะท้อน

##### Barrel Exports And Alias

Checks (pass / warning / fail):

- Barrel quality: re-exports ล้วน / `export *` จาก module ใหญ่ / logic หรือ side effects
- Export strategy: named exports + ซ่อน internal / `export default` จาก barrel / `export *` ไม่เลือก
- Type-only exports: แยก `export type` / ไม่แยกแต่ใช้ได้ / ไม่มีทั้งที่ควรมี
- Barrel coverage: ทุก multi-file module มี barrel / บาง module ขาด / ไม่มีทั้ง project
- Alias config: `tsconfig.json`+`vite.config.ts`+`package.json` สอดคล้อง / บาง config ขาด / ไม่มี config
- Alias naming: convention สม่ำเสมอ (`#` TS, `@/` frameworks) / ไม่สม่ำเสมอ / ไม่มี convention

##### Structure Health Score

- 5 metrics: file naming, folder grouping, barrel exports, import complexity, nesting depth — น้ำหนักเท่ากัน (20%)
- pass = 1, warning = 0.5, fail = 0; score = (total/5) × 100%; Grade A(90+) B(80+) C(70+) D(60+) F(<60)
- Score < 70 → แนะนำ `refactor` structure scope หรือ `relocation`; score < 50 → หยุดและ report

Structure Health Metrics table columns: Metric, Count, Threshold, Status

Relocation Plan table columns: File, Old Path, New Path, Reason, Priority — priority จาก domain cohesion impact + import complexity reduction (high impact + low effort = 1)

Dry-run preview แสดง before/after tree พร้อม files ที่ต้อง update imports:

```
Before:
src/
├── utils/
│   ├── auth.ts
│   └── user-helpers.ts

After:
src/
├── auth/
│   └── auth-service.ts
├── user/
│   └── user-helpers.ts
```

Steps:

1. ตรวจ file naming และ folder grouping ตาม checks ข้างบน (tools: `/scan-codebase`, `sg outline --items imports`, `Get-ChildItem -Recurse -File`; ข้าม `node_modules/`, `.git/`, `dist/`, `build/`, `coverage/`, `temp/`, generated)
2. ตรวจ barrel exports และ alias complexity ตาม checks ข้างบน
3. ทำ `/check-files long-files` ระบุไฟล์ที่ต้อง split ก่อน/หลัง relocation
4. ประเมิน flat vs nested ตาม `/flatten-directory` และ `/review-architecture`
5. คำนวณ structure health score + สร้าง relocation plan พร้อม dry-run preview old → new path
6. ตรวจ dependency-direction-safe move ordering

#### 9. Baseline Metrics And Prioritization
