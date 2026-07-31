---
name: playwright
description: "แนวทางการใช้งาน Playwright - End-to-end testing สำหรับ web applications"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Playwright สำหรับ end-to-end testing ของ web applications


## Scope

ใช้สำหรับ E2E testing สำหรับ web applications, multi-browser testing, auto-waiting และ reliability, network interception, และ mobile testing


## Execute

- ติดตั้ง Playwright
- ติดตั้ง browsers
- รัน tests
- รันใน UI mode
- อ่าน `learn/guide/installation.md` สำหรับการติดตั้งและ setup
- อ่าน `learn/guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
- อ่าน `learn/guide/configuration.md` สำหรับการตั้งค่า
- อ่าน `learn/guide/network-interception.md` สำหรับ network interception
- อ่าน `learn/guide/api-testing.md` สำหรับ API testing
- อ่าน `learn/guide/codegen.md` สำหรับ code generation
- อ่าน `learn/guide/device-emulation.md` สำหรับ device emulation
- อ่าน `learn/guide/trace-viewer.md` สำหรับ trace viewer
- อ่าน `learn/guide/ui-mode.md` สำหรับ UI mode
- อ่าน `learn/key-concepts/assertions.md` สำหรับ assertions
- อ่าน `learn/key-concepts/locators.md` สำหรับ locators
- อ่าน `learn/key-concepts/network-interception.md` สำหรับ network interception concepts
- อ่าน `learn/key-concepts/browser-context.md` สำหรับ browser context
- อ่าน `learn/key-concepts/actionability.md` สำหรับ actionability
- อ่าน `learn/key-concepts/frames.md` สำหรับ frames
- อ่าน `learn/principles/debugging.md` สำหรับ debugging
- อ่าน `learn/principles/test-organization.md` สำหรับการจัดระเบียบ tests
- อ่าน `learn/principles/best-practices.md` สำหรับ best practices
- อ่าน `references/api.md` สำหรับ API documentation
- อ่าน `references/cli.md` สำหรับ CLI commands
- อ่าน `references/configuration.md` สำหรับ configuration options
- อ่าน `references/website.md` สำหรับ official website
- อ่าน `workflows/setup-playwright.md` สำหรับการ setup
- อ่าน `workflows/run-tests.md` สำหรับการรัน tests


## Rules

- ใช้ `bunx create-playwright` สำหรับ installation
- ใช้ `bunx playwright install --with-deps` สำหรับ browsers
- ใช้ `bunx playwright test` สำหรับ run tests
- ใช้ `bunx playwright test --ui` สำหรับ UI mode
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- E2E tests ที่ reliable
- Multi-browser testing ที่ comprehensive
- Auto-waiting ที่ smart
- Network interception ที่ powerful
- Test organization ที่เป็นระบบ
- Debugging ที่มีประสิทธิภาพ
