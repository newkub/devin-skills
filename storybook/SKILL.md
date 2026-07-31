---
name: storybook
description: "Build, test, and document UI components in isolation with Storybook v10.4+"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้ Storybook สำหรับ develop, test, และ document UI components ใน isolated environment ด้วย CSF3, Autodocs, และ testing ecosystem


## Scope

ใช้สำหรับ component development, testing, และ documentation ด้วย Storybook v10.4+ สำหรับ React, Vue, Angular, Svelte, Web Components, และ React Native


## Execute

### 1. Installation

ติดตั้ง Storybook ด้วย `bun create storybook@latest` หรืออ่าน `guide/installation.md`

### 2. Quick Start

อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน

### 3. Key Concepts

อ่าน `key-concepts/` สำหรับ CSF3, Manager/Preview architecture, และ addon system

### 4. Configuration

อ่าน `guide/configuration.md` สำหรับการตั้งค่า main.ts, preview.ts, และ manager.ts

### 5. Principles

อ่าน `principles/` สำหรับ development, testing, และ documentation principles

### 6. Workflows

ใช้ workflows สำหรับ common tasks:
- `workflows/setup-storybook.md` - Installation และ configuration
- `workflows/write-stories.md` - Writing stories ด้วย CSF3
- `workflows/test-components.md` - Testing ด้วย play function และ addons
- `workflows/deploy-storybook.md` - Build และ deployment

### 7. References

อ่าน `references/` สำหรับ CLI, configuration, และ API reference


## Rules

### Installation

- ใช้ `bun create storybook@latest` สำหรับ v8.3+ (recommended)
- ใช้ `npx storybook@latest init` สำหรับเวอร์ชันก่อน 8.3
- เลือก framework ที่เหมาะสม: React, Vue, Angular, Svelte, Web Components, React Native
- ใช้ Vite builder (@storybook/*-vite) เมื่อเป็นไปได้สำหรับ performance ที่ดีกว่า
- ตรวจสอบ project requirements: Node.js 20+, bun 10+, bun 9+, Yarn 4+
- ตรวจสอบ framework requirements: Angular 18+, React Native 0.72+, Svelte 5+, Vue 3+, Vite 5+

### Story Writing (CSF3)

- เขียน stories สำหรับทุก components ด้วย Component Story Format 3 (CSF3)
- ใช้ `Meta` และ `StoryObj` types จาก `@storybook/react` หรือ framework-specific packages
- ใช้ `tags: ['autodocs']` สำหรับ automatic documentation generation
- ใช้ UpperCamelCase สำหรับ story exports (e.g., `Primary`, `Secondary`)
- ใช้ `args` สำหรับ dynamic arguments และ component props
- ใช้ `argTypes` สำหรับ control types และ input validation
- วาง story files ไว้ข้างๆ component files: `Component.stories.ts` หรือ `Component.stories.tsx`

### Configuration Structure

- `.storybook/main.ts` - Main configuration (stories, addons, framework, builder)
- `.storybook/preview.ts` - Story rendering, decorators, parameters, global types
- `.storybook/manager.ts` - UI behavior, theme, sidebar configuration
- ใช้ `framework` option สำหรับ framework-specific settings
- ใช้ `addons` array สำหรับ load addons (Essentials bundle recommended)

### Testing

- ใช้ `play` function สำหรับ interaction testing ด้วย `@storybook/testing-library`
- ใช้ Vitest addon สำหรับ component testing (Vite projects)
- ใช้ Storybook Test runner สำหรับ testing (Webpack projects)
- ใช้ Accessibility addon สำหรับ a11y testing ด้วย axe-core
- ใช้ Visual testing ด้วย Chromatic สำหรับ snapshot testing
- Reuse stories สำหรับ testing ใน Jest, Vitest, Playwright, หรือ Cypress

### Addons

- ใช้ Essentials Bundle (@storybook/addon-essentials) สำหรับ Controls, Actions, Docs, Backgrounds
- ติดตั้ง addons ผ่าน `npx storybook add <addon-name>`
- ใช้ addon API สำหรับ custom addons (addDecorator, addParameters, addArgTypes)
- Configure addons ใน `.storybook/main.ts` หรือ `.storybook/preview.ts`

### Organization

- จัดระเบียบ stories ตาม component structure และ folder hierarchy
- ใช้ decorators สำหรับ wrapper components (theme providers, layouts)
- ใช้ parameters สำหรับ static metadata (layout, backgrounds, viewport)
- ใช้ proper naming conventions ตาม CSF3 standard
- ใช้ `title` ใน Meta สำหรับ organize stories ใน sidebar

### Documentation

- ใช้ Autodocs สำหรับ automatic documentation generation
- เขียน MDX สำหรับ custom documentation pages
- ใช้ Doc Blocks สำหรับ structured documentation components
- Configure docs options ใน `.storybook/main.ts` (defaultName, docsMode)
- Publish Storybook สำหรับ team collaboration และ design system


## Expected Outcome

- Components ที่ well-documented ด้วย Autodocs และ MDX
- Development ใน isolated environment ด้วย Manager API และ Preview API architecture
- Testing ที่ comprehensive ด้วย interaction, accessibility, และ visual tests
- Stories ที่ well-organized ตาม CSF3 standard และ framework best practices
