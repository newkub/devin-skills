# Long Files Thresholds And Split Strategies

## Thresholds

- Default threshold: 250 lines
- Warning threshold: 200-250 lines
- Critical threshold: >400 lines
- ไม่นับ test files, generated files, barrel files (`index.ts`)

## Detection Tools

- `/check-long-files` สำหรับ scan ไฟล์ที่ยาวกว่า threshold
- `Get-ChildItem -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx` สำหรับ file discovery
- `Measure-Object -Line` สำหรับนับจำนวนบรรทัด

## Split Strategies

### By Domain

- แยกไฟล์ที่มี symbols จากหลาย domain ออกเป็นไฟล์ย่อยตาม domain
- ตัวอย่าง: `user-service.ts` → `user-service.ts` + `user-repository.ts` + `user-validator.ts`

### By Responsibility

- แยกไฟล์ที่มีหลาย responsibilities ออกตาม concern
- ตัวอย่าง: `auth.ts` → `auth-handler.ts` + `auth-middleware.ts` + `auth-types.ts`

### By Layer

- แยกไฟล์ที่ mix layers ออกตาม layer
- ตัวอย่าง: `api.ts` → `api-routes.ts` + `api-handler.ts` + `api-schema.ts`

### By Type

- แยกไฟล์ที่ mix types (types, utils, constants) ออกเป็นไฟล์ย่อย
- ตัวอย่าง: `utils.ts` → `string-utils.ts` + `date-utils.ts` + `validation-utils.ts`

## Effort Estimation

- Low: ไฟล์เดียว split เป็น 2-3 ไฟล์, <30 min
- Medium: 2-5 ไฟล์ split, 30-120 min
- High: >5 ไฟล์ split หรือไฟล์ที่มี consumers เยอะ, >120 min

## Exclusions

- ไม่นับ barrel files (`index.ts`) ที่มีเฉพาะ re-exports
- ไม่นับ generated files (`*.generated.*`)
- ไม่นับ test files (`*.test.*`, `*.spec.*`)
- ไม่นับ config files (`*.config.*`)
