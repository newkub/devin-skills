---
name: follow-create-vitest-plugin
description: สร้างและใช้งาน Vitest plugins ตาม Plugin API อย่างถูกต้อง (Vitest 5)
argument-hint: "[scope]"
related:
  - follow-create-sdk
  - review-dependencies
  - follow-tool-vitest
  - follow-create-plugins
  - ship
  - run-test
---
## Goal

ตั้งค่าและใช้งาน Vitest plugins ตาม Plugin API อย่างถูกต้อง (Vitest 5, API ตั้งแต่ 3.1.0+)

## Scope

ใช้สำหรับ project ที่ต้องการสร้างและใช้งาน Vitest plugins ตาม Plugin API มาตรฐาน

- Latest: `vitest@5.0.1` (verified 2026-09-16) — ต้องการ Vite >= 6.4.0 และ Node.js >= 22.12.0

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/review-dependencies` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-dependencies` เพื่อ review tech stack, dependencies, และ library design (create vitest plugins)
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create vitest plugins)

### 2. Understand Plugin API

> Goal: ศึกษา Plugin API 3.1.0+ และ context ที่ได้รับ

1. ศึกษา Plugin API 3.1.0+ จาก [references/plugin-api.md](references/plugin-api.md)
2. เข้าใจ `configureVitest` hook
3. รู้จัก context: `project`, `vitest`, `injectTestProjects`
4. ศึกษา `defineCacheKeyGenerator` (stable ตั้งแต่ 5.0.0, เดิม `experimental_defineCacheKeyGenerator` ใน 4.x)

### 3. Create Plugin

> Goal: สร้าง plugin ด้วย `configureVitest` method

1. สร้าง plugin ด้วย `configureVitest` method — ดูตัวอย่างใน [references/plugin-api.md](references/plugin-api.md)
2. รับ context parameter
3. Implement plugin logic ที่ต้องการ
4. กำหนด `name` ที่ unique

```ts
export function myPlugin(options: PluginOptions) {
  return {
    name: 'my-vitest-plugin',
    transform(code) {
      // transform logic
    },
    configureVitest({ project, vitest, injectTestProjects, defineCacheKeyGenerator }) {
      // plugin configuration
      vitest.config.coverage.enabled = false
    }
  }
}
```

### 4. Use Context Properties

> Goal: ใช้ context properties ตามจุดประสงค์

1. ใช้ `project` เข้าถึง test project ปัจจุบัน — ดู [references/test-project.md](references/test-project.md)
2. ใช้ `vitest` เข้าถึง global Vitest instance
3. ใช้ `injectTestProjects` เพื่อ inject projects เพิ่มเติม — ดู [references/test-project.md](references/test-project.md)
4. แก้ไข `vitest.config` โดยตรงถ้าจำเป็น

### 5. Implement Cache Key Generator

> Goal: ใช้ cache key generator ถ้าจำเป็น (Vitest 5.0.0+)

1. ใช้ `defineCacheKeyGenerator` (stable ใน 5.0.0, เดิม `experimental_defineCacheKeyGenerator` ใน 4.0.11+) — ดู [references/plugin-api.md](references/plugin-api.md)
2. Return unique string จาก plugin options
3. Handle `false` เพื่อ disable caching
4. ใช้เมื่อเปิด `test.fsModuleCache` (top-level config ตั้งแต่ 5.0, เดิม `experimental.fsModuleCache`)
5. ใช้ `api.vitest.ignoreFsModuleCache: true` บน plugin object ถ้า plugin ไม่ควรกระทบ cache

```ts
configureVitest({ defineCacheKeyGenerator }) {
  defineCacheKeyGenerator(() => {
    // return unique string จาก options
    return options.replacePropertyKey + options.replacePropertyValue
  })
}
```

### 6. Test Plugin

> Goal: สร้าง test project เพื่อทดสอบ plugin

1. สร้าง test project สำหรับทดสอบ plugin
2. Verify plugin ทำงานได้
3. Test config injection
4. ตรวจสอบ cache behavior

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Plugin Structure

- ใช้ `configureVitest` สำหรับ plugin configuration — ดู [references/plugin-api.md](references/plugin-api.md)
- ตั้งชื่อ `name` ที่ unique
- Plugin ควรมี interface ที่ชัดเจน

### 2. Context Usage

- `project`: Test project ปัจจุบันที่ plugin อยู่ — ดู [references/test-project.md](references/test-project.md)
- `vitest`: Global Vitest instance - mutate `vitest.config` ได้
- `injectTestProjects`: Function สำหรับ inject projects เพิ่ม
- Config ถูก resolved แล้ว - บาง properties อาจมี type ต่างจาก user config

### 3. injectTestProjects

```ts
const newProjects = await injectTestProjects({
  extends: project.vite.config.configFile,
  test: {
    name: 'my-custom-project',
    alias: {
      customAlias: resolve('./custom-path.js'),
    },
  },
})
```

- รับ config glob, filepath หรือ inline config
- Return array ของ resolved test projects
- ต้องมี unique name (ไม่ซ้ำกับ existing projects)
- Filter อาจมีผล - อัปเดท `vitest.config.project` ถ้าจำเป็น

### 4. Cache Key Generator (5.0.0+)

- Return string สำหรับ cache key hashing
- Return `false` เพื่อ disable file system caching
- ใช้เมื่อ plugin registered ด้วย different options
- ทำงานเมื่อเปิด `test.fsModuleCache` (ย้ายจาก `experimental` ใน Vitest 5)
- ตั้ง `api.vitest.ignoreFsModuleCache: true` เพื่อ opt-out (ยัง define generator ได้)

### 5. Config Mutations

- แก้ไข `vitest.config` โดยตรงได้
- Reporters ยังไม่ถูกสร้าง - แก้ไข config แทน
- `setupFile` ไม่ resolved อีกครั้ง - resolve เองถ้า add new files
- บาง properties มี type ต่างจาก user config (resolved แล้ว)

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-tool-vitest ถ้าจำเป็น
- ใช้ /follow-create-vite-plugin ถ้าจำเป็น (create vitest plugins)
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /follow-create-plugins ถ้าจำเป็น


## Expected Outcome

- Vitest plugin ที่ใช้ Plugin API 3.1.0+ อย่างถูกต้อง
- Proper use of configureVitest context
- Correct project injection (ถ้าจำเป็น)
- Working cache key generator (ถ้าจำเป็น)
- Well-tested plugin functionality

## Guide

- [Plugin API | Vitest](https://vitest.dev/api/advanced/plugin)
- [Test Project | Vitest](https://vitest.dev/api/advanced/test-project)
- [Vitest Instance | Vitest](https://vitest.dev/api/advanced/vitest)
