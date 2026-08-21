---
name: nextest
description: "Next-generation test runner for Rust with faster execution, per-test isolation, and CI support"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Nextest สำหรับ test runner ที่เร็วกว่า cargo test


## Scope

ใช้สำหรับ test runner ที่เร็วกว่า cargo test, per-test isolation, CI support ระดับหนึ่ง, retry policies และ test groups


## Execute

- ติดตั้ง Nextest ตาม guide/installation.md
- รัน tests ด้วย Nextest
- ตั้งค่า Nextest ตาม guide/configuration.md
- อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
- อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
- อ่าน `guide/how-it-works.md` สำหรับวิธีการทำงาน
- อ่าน `guide/features.md` สำหรับ features ที่มี
- อ่าน `guide/best-practices.md` สำหรับ best practices
- อ่าน `key-concepts/test-isolation.md` สำหรับ test isolation
- อ่าน `key-concepts/retry-policies.md` สำหรับ retry policies
- อ่าน `key-concepts/test-groups.md` สำหรับ test groups
- อ่าน `key-concepts/recording-replay.md` สำหรับ recording, replay, และ rerun
- อ่าน `key-concepts/setup-scripts.md` สำหรับ setup และ wrapper scripts
- อ่าน `key-concepts/test-priorities.md` สำหรับ test priorities
- อ่าน `key-concepts/archiving.md` สำหรับ archiving และ build reuse
- อ่าน `key-concepts/filtersets.md` สำหรับ filter expression language
- อ่าน `principles/test-organization.md` สำหรับการจัดระเบียบ tests
- อ่าน `principles/ci-integration.md` สำหรับ CI integration
- อ่าน `references/api.md` สำหรับ API documentation
- อ่าน `references/cli.md` สำหรับ CLI commands
- อ่าน `references/configuration.md` สำหรับ configuration options
- อ่าน `references/website.md` สำหรับ official website
- อ่าน `workflows/configure-nextest.md` สำหรับการตั้งค่า
- อ่าน `workflows/run-tests.md` สำหรับการรัน tests


## Rules

- ใช้ Nextest แทน cargo test สำหรับ performance
- ใช้ per-test isolation สำหรับ reliability
- ใช้ retry policies สำหรับ flaky tests
- ใช้ test groups สำหรับ organization
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Test runner ที่เร็วกว่า cargo test
- Per-test isolation สำหรับ reliability
- CI support ระดับหนึ่ง
- Retry policies และ test groups ที่ efficient
- Test organization ที่เป็นระบบ
- CI integration ที่ smooth
