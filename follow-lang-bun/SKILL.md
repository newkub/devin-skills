---
name: follow-lang-bun
description: พัฒนาโปรเจกต์ด้วย Bun native APIs และ Web-standard APIs อย่างเต็มประสิทธิภาพ
---

## Goal

ใช้สำหรับพัฒนาโปรเจกต์ด้วย Bun native APIs ให้เต็มประสิทธิภาพ โดยใช้ทั้ง Bun-specific APIs และ Web-standard APIs ที่ Bun รองรับ

## Scope

ใช้สำหรับพัฒนาโปรเจกต์ด้วย Bun runtime ทั้ง HTTP server, file I/O, networking, database, และ utilities

## Execute

### 1. Analyze Requirements

> Goal: Analyze Requirements

วิเคราะห์ความต้องการและเลือก APIs ที่เหมาะสม

1. ตรวจสอบว่าต้องการ Bun native APIs หรือ Web APIs
2. ประเมิน performance requirements และ use case
3. เลือก APIs ที่เหมาะสมกับงาน (HTTP server, file I/O, networking, database, etc.)

### 2. Implement Bun APIs

> Goal: Implement Bun APIs

ดำเนินการพัฒนาตาม Bun APIs best practices

1. ใช้ `Bun.serve()` สำหรับ HTTP server แทน Node.js http module
2. ใช้ `$` shell template literal สำหรับ shell commands
3. ใช้ `Bun.file()` และ `Bun.write()` สำหรับ file operations
4. ใช้ `Bun.spawn()` หรือ `Bun.spawnSync()` สำหรับ child processes
5. ใช้ Web-standard APIs เมื่อเป็นไปได้ (fetch, ReadableStream, etc.)

### 3. Verify And Optimize

> Goal: Verify And Optimize

ตรวจสอบและ optimize การใช้งาน Bun APIs

1. ยืนยันว่าใช้ Bun APIs อย่างถูกต้องตาม documentation
2. ตรวจสอบ error handling และ edge cases
3. เปรียบเทียบ performance กับ alternative approaches

## Rules

ดูรายละเอียด API แต่ละ category ใน `references/` เริ่มจาก `references/index.md` สำหรับภาพรวม

- HTTP Server: `references/bun-http-server.md`
- Shell & Process: `references/bun-shell-process.md`
- File I/O: `references/bun-file-io.md`
- Networking: `references/bun-networking.md`
- Bundler & Build: `references/bun-bundler.md`
- Database: `references/bun-database.md`
- Hashing & Crypto: `references/bun-hashing-crypto.md`
- Utilities: `references/bun-utilities.md`
- Compression: `references/bun-compression.md`
- Streams & Buffer: `references/bun-streams.md`
- Data Parsing: `references/bun-data-parsing.md`
- Security: `references/bun-security.md`
- FFI & Low-level: `references/bun-ffi.md`
- Other Bun APIs: `references/bun-other.md`
- Web-standard APIs: `references/bun-web-apis.md`

## Expected Outcome

- ใช้ Bun native APIs อย่างถูกต้องตาม best practices
- ใช้ Web-standard APIs เมื่อเป็นไปได้
- Performance ดีกว่า Node.js alternatives
- Code อ่านง่ายและ maintainable