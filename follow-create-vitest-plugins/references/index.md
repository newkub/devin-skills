# Reference Index

รายการ reference files สำหรับ skill `follow-create-vitest-plugins` ครอบคลุม Vitest Plugin API (3.1.0+) และ Test Project API (3.0.0+)

## Files

| File | ความรับผิดชอบ |
| --- | --- |
| `plugin-api.md` | Vitest Plugin API reference - `configureVitest` hook, context properties (`project`, `vitest`, `injectTestProjects`, `experimental_defineCacheKeyGenerator`), config mutations |
| `test-project.md` | Test Project API reference - `injectTestProjects` usage, config glob, filepath, inline config, unique name requirement, filter behavior, `TestProject` properties |

## Usage

- ใช้ `plugin-api.md` เมื่อต้องสร้าง plugin หรือใช้ `configureVitest` hook
- ใช้ `test-project.md` เมื่อต้อง inject test projects หรือเข้าถึง `TestProject` properties
- ทั้งสองไฟล์ใช้ร่วมกันเมื่อ plugin ต้อง inject projects เพิ่ม

## Sources

- [Plugin API | Vitest](https://vitest.dev/api/advanced/plugin)
- [Test Project | Vitest](https://vitest.dev/api/advanced/test-project)
- [Vitest Instance | Vitest](https://vitest.dev/api/advanced/vitest)
