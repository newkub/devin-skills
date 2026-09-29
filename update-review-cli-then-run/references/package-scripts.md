# Package Scripts Validation

## Tools Review Scripts

ตรวจว่า `tools/review-codebase/package.json` มี scripts ครบ:

- `review-codebase` — รัน review ใน table format
- `review-codebase:json` — รัน review ใน JSON format

ตัวอย่าง:

```json
{
  "scripts": {
    "review-codebase": "bun run src/index.ts",
    "review-codebase:json": "bun run src/index.ts --format JSON"
  }
}
```

ถ้าขาด script → flag เป็น `Medium` severity

## Root Package Scripts

ตรวจว่า root `package.json` มี filter commands:

- `review-codebase` — `bun --filter tools-review-codebase review-codebase`
- `review-codebase:json` — `bun --filter tools-review-codebase review-codebase:json`

ตัวอย่าง:

```json
{
  "scripts": {
    "review-codebase": "bun --filter tools-review-codebase review-codebase",
    "review-codebase:json": "bun --filter tools-review-codebase review-codebase:json"
  }
}
```

ถ้าขาด root script → flag เป็น `Medium` severity

## Script Consistency

ตรวจว่า scripts สอดคล้องกัน:

- ชื่อ script ใน root ตรงกับใน `tools/review-codebase` (`review-codebase`, `review-codebase:json`)
- filter command ใช้ workspace name ที่ถูกต้อง (`tools-review-codebase`)
- ไม่มี script ที่ชี้ไปยัง path ผิด

ถ้าพบ inconsistency → flag เป็น `Low` severity

## Script Execution

ตรวจว่า scripts รันได้จริง:

- รัน `bun --filter tools-review-codebase review-codebase` และตรวจ exit code
- รัน `bun --filter tools-review-codebase review-codebase:json` และตรวจ output format

ถ้า script รันไม่ได้ → flag เป็น `High` severity

## Evidence Format

ทุก finding ต้องมี:

- file path เช่น `tools/review-codebase/package.json` หรือ root `package.json`
- line number
- code snippet ที่เป็นปัญหา
