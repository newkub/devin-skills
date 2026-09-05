# Analyzer Structure And Behavior

อธิบายการตรวจ analyzer structure และ deterministic behavior ใน `src/domain/analyzers/`

## CategoryResult Return Type

ทุก analyzer ต้อง return `CategoryResult` ที่มี:

| Field | Type | คำอธิบาย |
|---|---|---|
| `status` | `string` | `"pass"` หรือ `"fail"` |
| `score` | `number` | 0-100 |
| `findings` | `CategoryFinding[]` | รายการปัญหาที่พบ |

ถ้า analyzer ไม่ return `CategoryResult` → flag เป็น `High`

## ReviewWorkflow Map

ทุก analyzer ต้องมี `reviewWorkflow` map ที่ map finding type ไปยัง `/deep-review` reference:

```typescript
const reviewWorkflow: Record<string, string> = {
  "missing-eslint": "deep-review-codebase/lint-rules",
  "no-tests": "deep-review-codebase/test-coverage",
};
```

`reviewWorkflow` ช่วยให้ user รู้ว่าจะ review อะไรต่อหลังเจอ finding
ถ้า analyzer ไม่มี `reviewWorkflow` → flag เป็น `Medium`

## Deterministic Behavior

ตรวจว่า analyzers deterministic:

- ใช้ `gitGrep` และ `gitGrepCount` จาก `src/adapters/git-grep.ts` แทน shell grep ตรงๆ
- ใช้ `walk` จาก `src/adapters/file-utils.ts` แทน `fs.readdir` แบบไม่ deterministic
- ผลลัพธ์ต้องเหมือนเดิมเมื่อรันซ้ำด้วย commit เดียวกัน
- ห้ามใช้ `Date.now()`, `Math.random()`, หรือ network calls

ถ้า analyzer ไม่ deterministic → flag เป็น `Medium`

## Findings With File And Line

ทุก finding ใน `findings` array ต้องระบุ:

| Field | Type | คำอธิบาย |
|---|---|---|
| `file` | `string` | file path ที่พบปัญหา |
| `line` | `number` | บรรทัดที่พบปัญหา |
| `message` | `string` | คำอธิบายปัญหา |
| `severity` | `string` | severity ของ finding |

ถ้า finding ไม่ระบุ `file` หรือ `line` → flag เป็น `Medium`

## Analyzer Files

ตรวจ analyzer files ครบ 5 ตัว:

| File | Category | ตรวจอะไร |
|---|---|---|
| `user-facing.ts` | User-facing | UI components, UX patterns |
| `security.ts` | Security | secrets, auth, input validation |
| `backend-data.ts` | Backend & Data | API, database, data flow |
| `infrastructure.ts` | Infrastructure | CI/CD, config, deployment |
| `code-arch.ts` | Code & Architecture | structure, dependencies, patterns |

ถ้า analyzer file ขาด → flag เป็น `High`
