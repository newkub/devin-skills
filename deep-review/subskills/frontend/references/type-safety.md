# Type Safety Checks

## Goal

ตรวจสอบ `any` usage, type completeness, type inference, generic usage, และ type compatibility

## Checks

### Any Usage

1. มี explicit `any` ไหม — ระบุ location และ reason
2. มี implicit `any` ไหม (missing type annotations)
3. มี type assertions ที่ bypass safety ไหม (`as any`, `as unknown as`)
4. มี `@ts-ignore` หรือ `@ts-expect-error` ไหม
5. มี `noImplicitAny` เปิดอยู่ไหม

### Type Completeness

1. props มี types ครบไหม
2. state มี types ครบไหม
3. events มี types ครบไหม (React.MouseEvent, Vue event types)
4. refs มี types ครบไหม
5. context มี types ครบไหม

### Type Inference

1. มี explicit types ที่ไม่จำเป็นไหม (inference ทำได้)
2. มี missing types ที่จำเป็นไหม (inference ไม่ได้)
3. ใช้ `satisfies` operator ไหม (TypeScript 4.9+)
4. ใช้ `const` assertions ไหม
5. ใช้ `as const` ที่เหมาะสมไหม

### Generic Usage

1. มี generic components ไหม (generic props, generic slots)
2. มี generic hooks/composables ไหม
3. generic constraints ชัดเจนไหม (`extends`, `keyof`)
4. ใช้ conditional types ที่เหมาะสมไหม
5. ใช้ mapped types ที่เหมาะสมไหม

### Type Compatibility

1. ใช้ union types ที่เหมาะสมไหม
2. ใช้ intersection types ที่เหมาะสมไหม
3. ใช้ discriminated unions สำหรับ variant props ไหม
4. มี type conflicts ไหม
5. ใช้ utility types ที่เหมาะสมไหม (Pick, Omit, Partial, Required)

## Severity

- Critical: `any` บน critical path, no types บน public API, type assertions ที่ bypass safety, `@ts-ignore` บน critical code
- High: implicit `any` กระจาย, missing prop types, missing event types, no generic constraints, missing discriminated unions
- Medium: unnecessary explicit types, minor type gaps, missing `satisfies`, inconsistent utility type usage
- Low: minor type naming, documentation gap, cosmetic type improvement
