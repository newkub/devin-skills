# Review Integration

อธิบายการตรวจ integration ระหว่าง `tools/analyze` และ `tools/review-codebase`

## Import From Tools-Analyze

ตรวจว่า `tools/review-codebase` import จาก `tools-analyze` ผ่าน workspace:

```typescript
import { runAllAnalyzers, createAnalyzePorts } from "tools-analyze";
```

ถ้า `tools/review-codebase` ไม่ import จาก `tools-analyze` → flag เป็น `High`

## No Duplicated Logic

ตรวจว่า `tools/review-codebase` ไม่มี duplicated analyzer logic:

- ห้ามมี analyzer implementation ซ้ำกับ `tools/analyze`
- ห้ามมี `gitGrep`, `walk` implementation ซ้ำ
- `tools/review-codebase` ควรเรียก `runAllAnalyzers` แล้วใช้ผลลัพธ์

ตรวจโดย:

1. grep หา `gitGrep`, `gitGrepCount` ใน `tools/review-codebase/src/`
2. grep หา `walk`, `readText` ใน `tools/review-codebase/src/`
3. grep หา `CategoryResult`, `CategoryFinding` ใน `tools/review-codebase/src/`

ถ้าพบ duplicated logic → flag เป็น `Medium`

## Dependency Check

ตรวจ `tools/review-codebase/package.json` ว่ามี `tools-analyze` เป็น dependency:

```json
{
  "dependencies": {
    "tools-analyze": "workspace:*"
  }
}
```

ถ้าไม่มี `tools-analyze` ใน dependencies → flag เป็น `High`

## Integration Flow

ตรวจว่า integration flow ถูกต้อง:

1. `tools/review-codebase` เรียก `runAllAnalyzers` จาก `tools-analyze`
2. `tools/review-codebase` ใช้ `AnalyzeReport` ผลลัพธ์เพื่อ generate review
3. `tools/review-codebase` ไม่แก้ไขหรือ override analyzer results

ถ้า flow ไม่ถูกต้อง → flag เป็น `Medium`

ดู `references/exports.md` สำหรับ workspace API exports ที่ `tools/review-codebase` import
