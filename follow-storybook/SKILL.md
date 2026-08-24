---
name: follow-storybook
description: ตั้งค่าและใช้ Storybook สำหรับ component development และ documentation
---

## Goal

ตั้งค่าและใช้ Storybook เพื่อพัฒนา UI components แบบ isolation พร้อม documentation และ testing

## Scope

ใช้ `follow-storybook` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Install Storybook
> Goal: Install Storybook

1. รัน `bunx storybook@latest create` ใน project root
2. หรือรัน `bunx storybook@7 create` สำหรับ version 7.x.x
3. ระบุ framework ด้วย `--type` flag ถ้า CLI ไม่ detect
4. รัน `bun run storybook` เพื่อ start development server

### 2. Configure Main File
> Goal: Configure Main File

1. สร้าง `.storybook/main.ts` ใน project root
2. ตั้งค่า `framework` สำหรับ framework-specific settings
3. ตั้งค่า `stories` glob สำหรับ story file locations
4. เพิ่ม `addons` สำหรับ Storybook addons
5. ตั้งค่า `staticDirs` สำหรับ static assets

### 3. Configure Preview File
> Goal: Configure Preview File

1. สร้าง `.storybook/preview.ts` สำหรับ story rendering
2. เพิ่ม global decorators สำหรับ component wrapping
3. ตั้งค่า global parameters สำหรับ stories
4. import global CSS หรือ styles
5. เพิ่ม mocks สำหรับ external dependencies

### 4. Write Stories
> Goal: Write Stories

1. สร้าง `.stories.ts` ไฟล์ตาม component
2. import `Meta` และ `StoryObj` types
3. export default `meta` object พร้อม component reference
4. export story functions สำหรับ component variations
5. ใช้ `args` สำหรับ component props และ state

### 5. Configure Styling
> Goal: Configure Styling

1. ตั้งค่า CSS tooling สำหรับ Storybook environment
2. ตั้งค่า Tailwind, Material UI, หรือ Sass ถ้าใช้
3. ใช้ decorators สำหรับ theme providers
4. ตั้งค่า webpackFinal หรือ viteFinal ถ้าจำเป็น
5. ทดสอบ component rendering ใน Storybook

### 6. Setup Addons
> Goal: Setup Addons

1. install addons ที่จำเป็นเช่น `@storybook/addon-essentials`
2. register addons ใน `main.ts` config
3. ตั้งค่า addon-specific options
4. ใช้ `@storybook/addon-docs` สำหรับ auto-documentation
5. ใช้ `@storybook/addon-a11y` สำหรับ accessibility testing

### 7. Configure Testing
> Goal: Configure Testing

1. setup interaction testing ด้วย `@storybook/addon-interactions`
2. setup visual testing ด้วย Chromatic หรือ similar tools
3. setup accessibility testing ด้วย axe-core
4. configure test runner สำหรับ CI integration
5. รัน tests ใน CI pipeline

## Rules

### 1. Installation

ติดตั้ง Storybook ด้วย CLI เพื่อ auto-configuration

- ใช้ `bunx storybook@latest create` สำหรับ latest version
- ใช้ `--type` flag สำหรับ framework specification
- CLI จะ install dependencies และ setup scripts อัตโนมัติ
- ตรวจสอบ framework detection ถ้า CLI ไม่ detect
- รัน `bun run storybook` หลัง installation

### 2. Configuration Files

ใช้ `.storybook` folder สำหรับ configuration

- ใช้ `main.ts` สำหรับ project behavior configuration
- ใช้ `preview.ts` สำหรับ story rendering configuration
- ใช้ `manager.ts` สำหรับ UI behavior configuration
- ตั้งค่า `stories` glob สำหรับ story file discovery
- ตั้งค่า `framework` สำหรับ framework-specific settings

### 3. Story Structure

เขียน stories ตาม standard pattern

- ใช้ `.stories.ts` extension สำหรับ TypeScript stories
- import `Meta` และ `StoryObj` types จาก framework package
- export default `meta` object พร้อม component reference
- export story functions สำหรับ component variations
- ใช้ `args` สำหรับ component props และ state

### 4. Component Isolation

พัฒนา components แบบ isolation จาก application context

- เขียน stories สำหรับ component variations แต่ละแบบ
- ใช้ mock data สำหรับ simulate different states
- ใช้ decorators สำหรับ wrap components ใน context
- ทดสอบ components นอก main application context
- ให้แน่ใจว่า components work independently

### 5. Styling Configuration

ตั้งค่า CSS tooling สำหรับ Storybook rendering

- ตั้งค่า Tailwind, Material UI, หรือ Sass ถ้าใช้
- ใช้ decorators สำหรับ theme providers
- ตั้งค่า webpackFinal หรือ viteFinal ถ้าจำเป็น
- import global styles ใน `preview.ts`
- ทดสอบ component rendering ใน Storybook

### 6. Addons Usage

ใช้ addons สำหรับ extend Storybook functionality

- install `@storybook/addon-essentials` สำหรับ core addons
- register addons ใน `main.ts` config
- ใช้ `@storybook/addon-docs` สำหรับ auto-documentation
- ใช้ `@storybook/addon-a11y` สำหรับ accessibility testing
- ตั้งค่า addon-specific options ตามความต้องการ

### 7. Testing Integration

ตั้งค่า testing workflows สำหรับ automated tests

- setup interaction testing ด้วย `@storybook/addon-interactions`
- setup visual testing ด้วย Chromatic หรือ similar tools
- setup accessibility testing ด้วย axe-core
- configure test runner สำหรับ CI integration
- รัน tests ใน CI pipeline สำหรับ quality assurance

## Expected Outcome

- Storybook ติดตั้งและตั้งค่าเสร็จสิ้น
- Components พัฒนาแบบ isolation ได้
- Auto-documentation สร้างจาก stories
- Testing workflows ตั้งค่าใน CI
- Addons ติดตั้งและตั้งค่าเสร็จสิ้น
