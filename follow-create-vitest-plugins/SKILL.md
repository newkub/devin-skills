---
name: follow-create-vitest-plugins
description: ตั้งค่าและใช้งาน Vitest plugins ตาม Plugin API อย่างถูกต้อง (Vitest 3.1.0+)
allowed-tools:
- read
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

ใช้สำหรับ project ที่ต้องการสร้างและใช้งาน Vitest plugins

## Prompt

ใช้ workflow นี้เมื่อต้องการสร้างและใช้งาน Vitest plugins ตาม Plugin API มาตรฐาน

## Execute

1. Understand Plugin API Structure

- ศึกษา Plugin API 3.1.0+ จาก https://vitest.dev/api/advanced/plugin
- เข้าใจ `configureVitest` hook
- รู้จัก Context ที่ได้รับ (project, vitest, injectTestProjects)
- ศึกษา `experimental_defineCacheKeyGenerator` (4.0.11+)

2. Create Plugin with configureVitest

- สร้าง plugin ด้วย `configureVitest` method
- รับ context parameter
- Implement plugin logic ที่ต้องการ
- กำหนด name ที่ unique

3. Use Context Properties

- ใช้ `project` เข้าถึง test project ปัจจุบัน
- ใช้ `vitest` เข้าถึง global Vitest instance
- ใช้ `injectTestProjects` เพื่อ inject projects เพิ่มเติม
- แก้ไข `vitest.config` โดยตรงถ้าจำเป็น

4. Implement Cache Key Generator (ถ้าจำเป็น)

- ใช้ `experimental_defineCacheKeyGenerator` (4.0.11+)
- Return unique string จาก plugin options
- Handle `false` เพื่อ disable caching
- ใช้เมื่อมี `experimental.fsModuleCache`

5. Test Plugin

- สร้าง test project สำหรับทดสอบ plugin
- Verify plugin ทำงานได้
- Test config injection
- ตรวจสอบ cache behavior

## Rules

1. Plugin Structure

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

2. Context Usage

- `project`: Test project ปัจจุบันที่ plugin อยู่
- `vitest`: Global Vitest instance - mutate `vitest.config` ได้
- `injectTestProjects`: Function สำหรับ inject projects เพิ่ม
- Config ถูก resolved แล้ว - บาง properties อาจมี type ต่างจาก user config

3. injectTestProjects

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
- Filter อาจมีผล - อัพเดท `vitest.config.project` ถ้าจำเป็น

4. Cache Key Generator (4.0.11+)

```ts
configureVitest({ experimental_defineCacheKeyGenerator }) {
  experimental_defineCacheKeyGenerator(() => {
    // return unique string จาก options
    return options.replacePropertyKey + options.replacePropertyValue
  })
}
```

- Return string สำหรับ cache key hashing
- Return `false` เพื่อ disable file system caching
- ใช้เมื่อ plugin registered ด้วย different options
- ทำงานเมื่อมี `experimental.fsModuleCache`

5. Config Mutations

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

## References

- [Plugin API | Vitest](https://vitest.dev/api/advanced/plugin)
- [Test Project | Vitest](https://vitest.dev/api/advanced/test-project)
- [Vitest Instance | Vitest](https://vitest.dev/api/advanced/vitest)
