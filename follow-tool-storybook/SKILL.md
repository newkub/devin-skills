---
name: follow-tool-storybook
description: ตั้งค่าและใช้ Storybook สำหรับ component development และ documentation
related:
  - follow-tool-vite
  - follow-create-vite-plugins
  - follow-tool-vitest
  - follow-test
  - follow-tool-playwright
  - follow-tool-biome
---

## Goal

ตั้งค่าและใช้ Storybook เพื่อพัฒนา UI components แบบ isolation พร้อม documentation, testing และ addons

## Scope

ใช้สำหรับ frontend projects ที่ต้องการ component library, visual documentation และ interaction testing

## Execute

### 1. Installation

> Goal: ติดตั้ง Storybook ด้วย CLI

1. รัน `bunx storybook@latest create` ใน project root
2. เลือก framework ถ้า CLI ไม่ detect ด้วย `--type`
3. ตรวจสอบ dependencies ทีติดตั้งอัตโนมัติ
4. ดูคำสั่ง CLI ใน [references/storybook-cli.md](references/storybook-cli.md)

### 2. Configuration

> Goal: สร้าง `.storybook` config files

1. สร้าง `.storybook/main.ts` พร้อม `framework`, `stories` glob, `addons`
2. สร้าง `.storybook/preview.ts` สำหรับ global parameters, decorators, styles
3. สร้าง `.storybook/manager.ts` ถ้าต้องการปรับ UI behavior
4. ตั้งค่า `staticDirs` สำหรับ static assets
5. ดูรายละเอียด config ใน [references/storybook-configuration.md](references/storybook-configuration.md)

### 3. Write Stories

> Goal: เขียน stories ตาม component variations

1. สร้างไฟล์ `.stories.ts` ตาม component
2. import `Meta` และ `StoryObj` จาก framework package
3. export default `meta` object พร้อม `component`
4. export named stories ด้วย `args` สำหรับ props/state
5. ใช้ decorators สำหรับ theme providers, data providers

### 4. Setup Addons

> Goal: ติดตั้งและตั้งค่า Storybook addons

1. ติดตั้ง `@storybook/addon-essentials`
2. register addons ใน `.storybook/main.ts`
3. เพิ่ม `@storybook/addon-docs` สำหรับ auto-docs
4. เพิ่ม `@storybook/addon-a11y` สำหรับ accessibility testing
5. เพิ่ม `@storybook/addon-interactions` สำหรับ interaction testing

### 5. Testing Integration

> Goal: ตั้งค่า testing สำหรับ components

1. ทำ `/follow-tool-vitest` เพื่อเตรียม unit testing environment
2. ใช้ `@storybook/addon-interactions` สำหรับ interaction tests
3. setup visual regression ด้วย Chromatic หรือ similar tools
4. รัน `bun run test-storybook` ใน CI
5. ทำ `/follow-test` เพื่อขยาย test coverage

### 6. Build and Deploy

> Goal: build static Storybook และ deploy

1. รัน `bunx storybook build` เพื่อสร้าง static site
2. ตรวจสอบ output ใน `storybook-static/`
3. ตั้งค่า GitHub Actions สำหรับ build และ deploy
4. deploy ไปยัง static host ที project ใช้

## Rules

### 1. Installation

- ใช้ `bunx storybook@latest create` สำหรับ latest version
- ใช้ `--type` ถ้า auto-detect ล้มเหลว
- ใช้ official framework packages

### 2. Configuration

- ใช้ `.storybook/main.ts` สำหรับ config
- ใช้ `.storybook/preview.ts` สำหรับ global rendering
- ตั้งค่า `stories` glob ให้ครอบคลุม

### 3. Stories

- ใช้ `.stories.ts` สำหรับ TypeScript
- ใช้ `args` สำหรับ component props
- เขียน stories สำหรับทุกสถานะสำคัญ

### 4. Testing

- ทดสอบ interactions ใน Storybook
- ใช้ visual regression testing
- รัน tests ใน CI

### 5. Documentation

- ใช้ auto-docs สร้างเอกสารจาก stories
- ใช้ decorators สำหรับ context providers
- รักษา components แบบ isolation

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Storybook ติดตั้งและ start ได้
- Components มี stories ครบถ้วน
- Addons ติดตั้งและทำงาน
- Tests ผ่านใน CI
- Static docs build และ deploy ได้
