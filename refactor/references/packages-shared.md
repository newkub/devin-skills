# Extract To Packages Shared

> Merged จาก `/refactor-to-packages-shared` — ใช้กับ monorepo ที่มี duplication ข้าม packages/apps — extract เฉพาะ code ที่ใช้จริงใน 2+ consumers และทุกไฟล์ใน shared ต้องมี external reference อย่างน้อย 1 จุด; project ไม่ใช่ monorepo → `/refactor` scope ปกติ, split/merge workspace members → `/refactor-workspace`, dep ภายนอกทำได้อยู่แล้ว → `/use-lib-effective`

## Goal

Extract code ที่ใช้ซ้ำข้าม workspace members (duplicated utils, types, schemas, components, hooks) ไปไว้ที่ `packages/shared` — หนึ่ง fact หนึ่ง source — แล้ว rewire ทุก consumer ให้ import จาก shared package โดย shared package เป็นไปตาม Clean Architecture layers

## Steps

### 1. Inventory Shared Candidates

1. ทำ `/follow-monorepo` เพื่อเข้าใจ workspace layout และ shared package convention ของ project
2. หา duplication ข้าม workspace members — `jscpd`, `sg scan` หรือ manual scan ตาม domain (utils, types, schemas, components, hooks, constants)
3. เก็บ candidates พร้อม consumer count — extract เฉพาะที่มี 2+ consumers จริง ห้าม extract เผื่อ
4. ทำ `/use-lib-effective` — ถ้า dep เดิมหรือ lib ใน catalog ทำได้ อย่าสร้าง shared module ใหม่
5. ถ้า `packages/shared` มีอยู่แล้ว → audit ทุกไฟล์ใน shared ว่ามี external consumer จริง ≥1 จุด (grep import/reference จาก workspace members อื่น) — ไฟล์ที่ไม่มี external reference เลยต้อง move out/report
6. ถ้า `packages/shared` ยังไม่มี → สร้างตาม convention ของ workspace (manifest, tsconfig, build config ตาม member อื่น)

### 2. Plan Extraction

1. ทำ architecture refactor scope (`/follow-architecture` → clean) — จัดกลุ่ม candidates ตาม layer: `domain/` (pure types, constants, domain logic — ไม่มี IO/framework), `features/`+`ports/` (use cases, orchestration), `infra/`+`adapters/` (framework, DB, external APIs)
2. จัดลำดับ leaf-first: pure types/constants → domain utilities → application use cases/ports → infrastructure adapters → UI/framework-bound code เฉพาะที่ share จริง
3. ระบุทุก consumer site ต่อ candidate — import sites, re-export sites, test usage
4. ทำ `/create-plan-in-dot-devin` แล้วขอ confirm ถ้า candidates > 5 หน่วยหรือแตะ critical paths

### 3. Extract To Shared

1. ย้าย implementation ไป `packages/shared/src/<layer>/<domain>/` ตาม Clean Architecture — canonical version เลือกจากตัวที่ complete ที่สุด (merge เฉพาะส่วนที่ต่างกันจริง)
2. Dependency direction ใน shared: `domain` ← `application` ← `infrastructure` ← entry — domain ต้อง pure ห้าม import framework/IO
3. export ผ่าน barrel `index.ts` ต่อ domain และ root barrel — ห้าม deep import ข้าม boundary
4. ถ้า candidates ต่างกันเล็กน้อย → unify ผ่าน parameters/config อย่าคง 2 versions
5. เก็บ license/attribution comments เดิมถ้ามี

### 4. Rewire Consumers

1. แทนที่ local copies ด้วย import จาก `packages/shared` ผ่าน package name/path alias ของ project — ทีละ consumer
2. mechanical replace หลายไฟล์ → `/use-astgrep rewrite` (dry-run + confirm ก่อนเขียนทับเสมอ)
3. audit external consumers ของทุกไฟล์ที่ extract อีกครั้งหลัง rewire แต่ละ batch — ยืนยันว่ามี consumer จริงก่อนลบ local copies
4. ลบ local copies หลัง consumer ทั้งหมด rewire แล้วเท่านั้น — ห้ามลบก่อน verify
5. ทำ `/update-references` หลังทุก batch — barrel exports, tsconfig paths, package deps

### 5. Verify

1. ทำ `/run-verify` — typecheck + lint + test + build ตามที่ workspace รองรับ
2. ทำ `/follow-tool-madge` — shared ต้องไม่พึ่ง consumers และไม่มี cycle ใน layer graph
3. ตรวจ `packages/shared` ไม่ import workspace member อื่น (foundation เท่านั้น) และ domain layer ไม่มี framework/IO imports
4. re-run duplication scan — candidates เดิมต้องเหลือ canonical version เดียว
5. ถ้า verify fail → revert batch นั้นแล้วแก้ สูงสุด 3 รอบ → stop/report

## Rules

- ต้องมี 2+ consumers จริง — ห้าม extract เผื่ออนาคต (`/dont-over-engineer`); coincidental similarity (domain ต่างกัน) → อย่ารวม
- ทุกไฟล์ใน `packages/shared` ต้องมี ≥1 reference จาก workspace member อื่น — internal-only ไม่นับ; audit หลัง inventory และหลัง rewire; ห้ามเก็บไฟล์ "เผื่อใช้ภายหลัง"
- หลัง refactor ต้องเหลือ implementation เดียวใน `packages/shared` (`/follow-single-of-source`) — canonical เลือกจาก version ที่ complete ที่สุด
- shared package ต้องตาม clean architecture: `domain/` pure, `application/` = use cases + ports, `infrastructure/` = adapters; public API ผ่าน barrels เท่านั้น — ห้าม deep import เข้า `packages/shared/src/**`; `packages/shared` ห้าม depend บน workspace member อื่น
- refactor เท่านั้น ห้าม mix feature/fix — behavior และ public API เหมือนเดิม; ไม่มี tests บน candidate → เขียน characterization tests ก่อน (`/update-tests`)
- extract ทีละ domain batch → verify → `/git-commit` checkpoint ก่อน batch ถัดไป; ลบ local copy เฉพาะหลังทุก consumer rewire และ verify ผ่าน

## Expected Outcome

- shared code อยู่ใน `packages/shared` ผ่าน barrel exports เดียว ตาม Clean Architecture layers
- ทุก consumer ใช้ shared version — ไม่มี local copies เหลือ และไม่มี orphan/speculative files
- ไม่มี circular dependencies — `packages/shared` เป็น leaf dependency
- ผ่าน lint/typecheck/test/build — รายงาน before/after duplication count
