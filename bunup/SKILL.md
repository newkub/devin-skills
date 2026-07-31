---
name: bunup
description: "แนวทางการใช้งาน Bunup สำหรับ bundle TypeScript libraries ด้วย Bun's native bundler - เร็ว ง่าย..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้ Bunup bundle TypeScript libraries ด้วย Bun's native bundler ที่รวดเร็วและ auto-detect entry points


## Scope

ใช้สำหรับ bundle TypeScript libraries ด้วย Bun's native bundler


## Execute

- ติดตั้ง Bunup ด้วย `bun add -D bunup`
- อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup
- อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
- อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
- อ่าน `guide/how-it-works.md` สำหรับวิธีการทำงาน
- อ่าน `key-concepts/rolldown.md` สำหรับ Rolldown bundler
- อ่าน `key-concepts/entry-point-detection.md` สำหรับ auto-detection
- อ่าน `key-concepts/bundle-formats.md` สำหรับ bundle formats
- อ่าน `key-concepts/type-declarations.md` สำหรับ TypeScript declarations
- อ่าน `guide/configuration.md` สำหรับการตั้งค่า
- อ่าน `references/configuration.md` สำหรับ configuration reference
- อ่าน `principles/zero-config.md` สำหรับ zero-config principle
- อ่าน `guide/features.md` สำหรับ features ที่มี
- อ่าน `guide/patterns.md` สำหรับ patterns ทั่วไป
- อ่าน `workflows/bundle-library.md` สำหรับ bundle workflow
- อ่าน `guide/best-practices.md` สำหรับ best practices
- อ่าน `principles/bun-native.md` สำหรับ Bun integration
- อ่าน `guide/performance.md` สำหรับ performance optimization
- อ่าน `guide/integration.md` สำหรับการ integrate กับ tools
- อ่าน `guide/architecture.md` สำหรับ system architecture
- อ่าน `guide/structure.md` สำหรับ project structure
- อ่าน `guide/troubleshooting.md` สำหรับปัญหาทั่วไป
- อ่าน `references/api.md` สำหรับ API reference


## Rules

- ใช้ `bun add -D bunup` สำหรับ dev dependencies
- ใช้ `bunx bunup` สำหรับ run commands
- ใช้ backticks สำหรับ `bunup`, commands, file paths
- ใช้ code blocks สำหรับ configuration examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture
- ใช้ `bunup.config.ts` สำหรับ configuration
- ใช้ zero-config เมื่อเป็นไปได้
- ใช้ auto-detect entry points เสมอ
- ใช้ Bun's native bundler สำหรับ performance
- หลีกเลี่ยง unnecessary configurations
- ใช้ caching สำหรับ repeated builds


## Expected Outcome

- Bundle ที่รวดเร็วและ efficient
- Configuration ที่ minimal และ zero-config
- TypeScript declarations ที่ auto-generated
- Integration ที่ smooth กับ Bun runtime
