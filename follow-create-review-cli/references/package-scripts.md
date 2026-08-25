# Package Scripts Validation

## Tools Review Scripts

ตรวจว่า `tools/review/package.json` มี scripts ครบ:

- `review` — รัน review ใน table format
- `review:json` — รัน review ใน JSON format

ตัวอย่าง:

```json
{
  "scripts": {
    "review": "bun run src/index.ts",
    "review:json": "bun run src/index.ts --format JSON"
  }
}
```

ถ้าขาด script → flag เป็น `Medium` severity

## Root Package Scripts

ตรวจว่า root `package.json` มี filter commands:

- `review` — `bun --filter tools-review review`
- `review:json` — `bun --filter tools-review review:json`

ตัวอย่าง:

```json
{
  "scripts": {
    "review": "bun --filter tools-review review",
    "review:json": "bun --filter tools-review review:json"
  }
}
```

ถ้าขาด root script → flag เป็น `Medium` severity

## Script Consistency

ตรวจว่า scripts สอดคล้องกัน:

- ชื่อ script ใน root ตรงกับใน `tools/review`
- filter command ใช้ workspace name ที่ถูกต้อง (`tools-review`)
- ไม่มี script ที่ชี้ไปยัง path ผิด

ถ้าพบ inconsistency → flag เป็น `Low` severity

## Script Execution

ตรวจว่า scripts รันได้จริง:

- รัน `bun --filter tools-review review` และตรวจ exit code
- รัน `bun --filter tools-review review:json` และตรวจ output format

ถ้า script รันไม่ได้ → flag เป็น `High` severity

## Evidence Format

ทุก finding ต้องมี:

- file path เช่น `tools/review/package.json` หรือ root `package.json`
- line number
- code snippet ที่เป็นปัญหา
