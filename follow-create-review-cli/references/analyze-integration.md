# Analyze Integration Rules

## Workspace Imports

ตรวจว่า `tools/review-codebase` imports analyzers จาก `tools-analyze` ผ่าน workspace:

- ใช้ workspace protocol เช่น `"tools-analyze": "workspace:*"`
- import จาก `tools-analyze` ไม่ใช่ copy code มาใหม่
- ตรวจใน `package.json` ของ `tools/review-codebase`

ถ้าไม่มี workspace import → flag เป็น `High` severity

## No Duplicated Logic

ตรวจว่าไม่มี duplicated analyzer logic ใน `tools/review-codebase/src/`:

- ห้าม copy analyzer functions จาก `tools-analyze`
- ห้าม re-implement logic ที่มีใน `tools-analyze` แล้ว
- ตรวจใน `src/domain/analyzers/` และ `src/adapters/`

ถ้าพบ duplicated logic → flag เป็น `Medium` severity

## Dependency Check

ตรวจว่า `tools-analyze` เป็น dependency ของ `tools/review-codebase`:

- อ่าน `tools/review-codebase/package.json`
- ตรวจ `dependencies` มี `tools-analyze`
- ตรวจ version ใช้ `workspace:*` protocol

ถ้าขาด dependency → flag เป็น `High` severity

## Import Path Validation

ตรวจว่า import paths ถูกต้อง:

- import จาก `tools-analyze` ใช้ barrel export หรือ direct path
- ไม่มี broken imports หรือ missing modules
- ตรวจด้วย `bun run` หรือ typecheck

ถ้าพบ broken imports → flag เป็น `High` severity

## Evidence Format

ทุก finding ต้องมี:

- file path เช่น `tools/review-codebase/package.json`
- line number
- code snippet ที่เป็นปัญหา
