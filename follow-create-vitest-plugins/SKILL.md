---
name: follow-create-vitest-plugins
description: สร้างและใช้งาน Vitest plugins ตาม Plugin API อย่างถูกต้อง (Vitest 3.1.0+)
related:
  - follow-create-sdk
  - follow-my-tech-stack
  - review-techstack
  - follow-tool-vitest
  - ship
---
## Goal

ตั้งค่าและใช้งาน Vitest plugins ตาม Plugin API อย่างถูกต้อง (Vitest 3.1.0+)

## Scope

ใช้สำหรับ project ที่ต้องการสร้างและใช้งาน Vitest plugins ตาม Plugin API มาตรฐาน

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Understand Plugin API

> Goal: ศึกษา Plugin API 3.1.0+ และ context ที่ได้รับ

1. ศึกษา Plugin API 3.1.0+ จาก [references/plugin-api.md](references/plugin-api.md)
2. เข้าใจ `configureVitest` hook
3. รู้จัก context: `project`, `vitest`, `injectTestProjects`
4. ศึกษา `experimental_defineCacheKeyGenerator` (4.0.11+)

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
    configureVitest({ project, vitest, injectTestProjects, experimental_defineCacheKeyGenerator }) {
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

> Goal: ใช้ cache key generator ถ้าจำเป็น (Vitest 4.0.11+)

1. ใช้ `experimental_defineCacheKeyGenerator` (4.0.11+) — ดู [references/plugin-api.md](references/plugin-api.md)
2. Return unique string จาก plugin options
3. Handle `false` เพื่อ disable caching
4. ใช้เมื่อมี `experimental.fsModuleCache`

```ts
configureVitest({ experimental_defineCacheKeyGenerator }) {
  experimental_defineCacheKeyGenerator(() => {
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

### 4. Cache Key Generator (4.0.11+)

- Return string สำหรับ cache key hashing
- Return `false` เพื่อ disable file system caching
- ใช้เมื่อ plugin registered ด้วย different options
- ทำงานเมื่อมี `experimental.fsModuleCache`

### 5. Config Mutations

- แก้ไข `vitest.config` โดยตรงได้
- Reporters ยังไม่ถูกสร้าง - แก้ไข config แทน
- `setupFile` ไม่ resolved อีกครั้ง - resolve เองถ้า add new files
- บาง properties มี type ต่างจาก user config (resolved แล้ว)

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