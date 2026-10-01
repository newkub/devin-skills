# Bunup Best Practices

แนวทาง bundle TypeScript libraries ด้วย Bunup — entry/format selection, dts, externals และ quality gates

## Recommended Patterns

### Entry And Format Selection

- ปล่อยให้ auto-detect ทำงาน (`index.ts`, `src/index.ts`, `cli.ts`) — ระบุ `entry` ใน `bunup.config.ts` เฉพาะเมื่อ structure ไม่ standard
- Build `esm` เดียวสำหรับ modern tooling; เพิ่ม `cjs` เฉพาะเมื่อมี consumers ที่ต้อง `require()` จริง — dual format เพิ่ม output/maintenance
- ใช้ `--exports` ให้ Bunup generate `package.json` `exports` map อัตโนมัติ — ห้ามเขียน exports มือแล้วให้ drift จาก output จริง
- Multi-entry libraries: ระบุ entry array ชัดเจนและเปิด `splitting` เพื่อ share chunks ระหว่าง entries — output เล็กกว่า inline ซ้ำทุกไฟล์

### Type Declarations

- เปิด `dts` เสมอสำหรับ public libraries — types คือ API surface หลักของ TS consumers
- เก็บ `declaration`/`declarationMap` consistency กับ `tsconfig.json` — dts build fail มักมาจาก tsconfig ที่ resolve ไม่ครบ (paths, project references)
- ถ้า dts build ช้าให้เช็คว่า types ของ deps ถูก bundle เข้ามา — external deps ไม่ควรถูก roll types เข้า output

### Externals Discipline

- Dependencies ใน `package.json` `dependencies`/`peerDependencies` ต้องเป็น external ไม่ถูก bundle — bundle เฉพาะ code ของตัวเอง
- `peerDependencies` สำหรับ framework libs (react, vue) — consumer เป็นเจ้าของ version
- เช็ค bundle หลัง build ว่าไม่มี dep code แทรก — `bunup` report output size; ถ้าใหญ่ผิดปกติให้หา dep ที่หลุดเข้ามา

### Quality Gates

- รัน `publint` และ `attw --pack` หลัง build ใน CI — จับ exports map/type resolution ผิดก่อน publish
- ใช้ `clean: true` (หรือ `--clean`) เพื่อล้าง `dist/` ก่อน build — stale files จาก build เก่าเป็น silent bug เมื่อ publish
- ใช้ `minify` สำหรับ production build เท่านั้น — dev builds ต้อง readable สำหรับ debug

## Common Pitfalls

| Pitfall | อาการ | วิธีหลีกเลี่ยง |
|---|---|---|
| Bundle runtime deps เข้า output | package บวม, version conflicts กับ consumer | เก็บ deps ใน `dependencies`/`peerDependencies` ให้ external |
| เขียน `exports` มือ | map ไม่ตรง output จริง → import fail | ใช้ `--exports` ให้ generate จาก build |
| `--watch` ใน CI | job ค้างไม่จบ | watch ใช้เฉพาะ local dev เท่านั้น |
| dts fail เงียบๆ | publish ไปไม่มี types | fail build เมื่อ dts ไม่สำเร็จ + `attw` ใน CI |
| Auto-detect entry พลาด | bundle ผิด entry หรือหาไม่เจอ | ระบุ `entry` explicit เมื่อ structure แปลก |
| CJS+ESM interop | `default` export แปลกใน CJS | ทดสอบ require() จริงหรือใช้ `attw` จับ interop issues |
| ไม่ clean dist | publish ไฟล์เก่าปน | `clean: true` ใน config เสมอ |

## Do / Don't

| Do | Don't |
|---|---|
| `bunup` build ใน CI แล้ว `attw --pack` ต่อ | publish โดยไม่เช็ค types resolution |
| ตั้ง `sourcemap: true` สำหรับ library | minify โดยไม่มี sourcemap (debug ไม่ได้) |
| เก็บ `bunup.config.ts` minimal — conventions ครอบ | config ยาวที่ duplicate defaults |
| publish เฉพาะ `dist/` ผ่าน `files` field | publish ทั้ง repo รวม src/tests |
| ใช้ Bun native bundler speed — build ใน CI เร็ว | เพิ่ม bundler ซ้อน (rollup บน bunup output) โดยไม่จำเป็น |

## Performance And CI Notes

- Bunup ใช้ Bun native bundler — build เร็วมาก; bottleneck มักอยู่ที่ dts generation ไม่ใช่ JS output
- ถ้า dts ช้า: ลด type surface (infer น้อยลง, explicit return types บน public APIs) หรือแยก types build เป็น parallel step
- CI: `bun install --frozen-lockfile` → `bunup` → `publint` + `attw` → optional `npm publish --dry-run`
- `--watch` mode เหมาะกับ local library dev คู่กับ `bun link` — อย่าใช้ใน CI
- Build cache แทบไม่จำเป็นเพราะ Bun เร็ว — แต่ cache `node_modules` ยังช่วย CI มาก
- Splitting ช่วยเฉพาะ multi-entry; single-entry lib ไม่ต้องเปิดเพราะไม่มี shared chunk ให้แยก

## Config Guidance

`bunup.config.ts` ที่สมดุล:

```ts
import { defineConfig } from 'bunup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,
  minify: false,
  sourcemap: true
})
```

`package.json` ที่เกี่ยวข้อง:

```json
{
  "files": ["dist"],
  "scripts": {
    "build": "bunup",
    "build:watch": "bunup --watch",
    "prepublishOnly": "bun run build && publint && attw --pack ."
  }
}
```

- เก็บ `target` ให้ตรง consumer จริง (`node` vs `browser`) — output ต่างกันที่ shims/globals
- ถ้า build ทั้ง lib + CLI: แยก entry `src/cli.ts` และตั้ง `bin` field ให้ชี้ output ที่ถูก
