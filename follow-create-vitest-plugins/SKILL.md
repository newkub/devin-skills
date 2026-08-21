---
name: follow-create-vitest-plugins
description: สร้างและใช้งาน Vitest plugins ตาม Plugin API อย่างถูกต้อง (Vitest 3.1.0+)
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ตั้งค่าและใช้งาน Vitest plugins ตาม Plugin API อย่างถูกต้อง (Vitest 3.1.0+)

## Scope

ใช้สำหรับ project ที่ต้องการสร้างและใช้งาน Vitest plugins ตาม Plugin API มาตรฐาน

## Execute

### 1. Understand Plugin API

ศึกษา Plugin API 3.1.0+ และ context ที่ได้รับ

> Goal: เข้าใจ lifecycle และ hooks ของ Vitest plugin

1. ศึกษา Plugin API 3.1.0+ จาก official docs
2. เข้าใจ `configureVitest` hook
3. รู้จัก context: `project`, `vitest`, `injectTestProjects`
4. ศึกษา `experimental_defineCacheKeyGenerator` (4.0.11+)

### 2. Create Plugin

สร้าง plugin ด้วย `configureVitest` method

> Goal: มี Vitest plugin ที่ทำงานได้

1. สร้าง plugin ด้วย `configureVitest` method
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

### 3. Use Context Properties

ใช้ context properties ตามจุดประสงค์

> Goal: ใช้ context อย่างถูกต้อง

1. ใช้ `project` เข้าถึง test project ปัจจุบัน
2. ใช้ `vitest` เข้าถึง global Vitest instance
3. ใช้ `injectTestProjects` เพื่อ inject projects เพิ่มเติม
4. แก้ไข `vitest.config` โดยตรงถ้าจำเป็น

### 4. Implement Cache Key Generator

ใช้ cache key generator ถ้าจำเป็น (Vitest 4.0.11+)

> Goal: caching ทำงานถูกต้องกับ plugin options

1. ใช้ `experimental_defineCacheKeyGenerator` (4.0.11+)
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

### 5. Test Plugin

สร้าง test project เพื่อทดสอบ plugin

> Goal: plugin ทำงานได้ในสถานการณ์จริง

1. สร้าง test project สำหรับทดสอบ plugin
2. Verify plugin ทำงานได้
3. Test config injection
4. ตรวจสอบ cache behavior

## Rules

### 1. Plugin Structure

- ใช้ `configureVitest` สำหรับ plugin configuration
- ตั้งชื่อ `name` ที่ unique
- Plugin ควรมี interface ที่ชัดเจน

### 2. Context Usage

- `project`: Test project ปัจจุบันที่ plugin อยู่
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