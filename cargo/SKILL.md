---
name: cargo
description: "แนวทางการใช้งาน Cargo สำหรับ Rust package management และ build tool"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Cargo สำหรับ Rust package management และ build tool


## Scope

ใช้สำหรับ dependencies (crates) management, building projects, compiling code, publishing packages, และ version management


## Execute

### เริ่มต้นใช้งาน

1. อ่าน `learn/guide/installation.md` สำหรับการติดตั้ง
2. อ่าน `learn/guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
3. อ่าน `learn/guide/key-concept.md` สำหรับแนวคิดหลัก

### การพัฒนา

1. อ่าน `workflows/setup-project.md` สำหรับ setup project
2. อ่าน `workflows/build-project.md` สำหรับการ build
3. อ่าน `workflows/add-dependency.md` สำหรับเพิ่ม dependencies
4. อ่าน `workflows/test-project.md` สำหรับการ test

### การเข้าใจลึกซึ้ง

1. อ่าน `learn/key-concepts/` สำหรับแนวคิดหลัก
2. อ่าน `learn/principles/` สำหรับ best practices
3. อ่าน `learn/guide/how-it-works.md` สำหรับวิธีการทำงาน
4. อ่าน `learn/guide/architecture.md` สำหรับ architecture

### การ Publish

1. อ่าน `workflows/publish-crate.md` สำหรับการ publish
2. อ่าน `learn/principles/semantic-versioning.md` สำหรับ versioning

### การแก้ปัญหา

1. อ่าน `learn/guide/troubleshooting.md` สำหรับปัญหาทั่วไป
2. อ่าน `references/cli.md` สำหรับ CLI commands
3. อ่าน `references/configuration.md` สำหรับ configuration


## Rules

- ใช้ `cargo new` สำหรับ create project
- ใช้ `cargo build` สำหรับ build
- ใช้ `cargo run` สำหรับ run
- ใช้ `cargo test` สำหรับ test
- ใช้ `cargo build --release` สำหรับ release build
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Rust projects ที่ build ได้อย่างมีประสิทธิภาพ
- Dependencies ที่ managed อย่างเหมาะสม
- Tests ที่ comprehensive
- Release builds ที่ optimized
- Code ที่มี organization ดี
- Documentation ที่ครบถ้วน
