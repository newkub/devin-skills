---
name: use-bun-shell
description: ใช้ Bun shell สำหรับ execute commands ด้วย bun -e
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

ใช้ Bun shell runtime สำหรับ execute commands และ shell operations ด้วย `bun -e` แทนการใช้ shell โดยตรง

## Scope

Use `use-bun-shell` for the specific tasks and workflows it covers

## Execute

### 1. Prepare Bun Shell Environment
> Goal: Prepare Bun Shell Environment

1. ทำ `/follow-bun` เพื่อ setup Bun environment
2. ตรวจสอบว่า Bun ติดตั้งและพร้อมใช้งาน
3. ตั้งค่า environment variables ที่จำเป็นสำหรับ Bun

### 2. Execute Commands With Bun
> Goal: Execute Commands With Bun

1. ใช้ `bun -e "console.log('command')"` สำหรับ simple commands
2. ใช้ `bun -e "await $`command`"` สำหรับ shell commands ที่ซับซ้อน
3. ใช้ `bun run` สำหรับ execute scripts จาก package.json
4. ใช้ `bun -e` สำหรับ JavaScript/TypeScript code execution

### 3. Handle File Operations
> Goal: Handle File Operations

1. ใช้ `Bun.file()` สำหรับ file reading/writing
2. ใช้ `Bun.write()` สำหรับ file operations
3. ใช้ `await $`ls -la`` สำหรับ directory operations
4. ใช้ `Bun.glob()` สำหรับ file pattern matching

### 4. Process Management
> Goal: Process Management

1. ใช้ `Bun.spawn()` สำหรับ background processes
2. ใช้ `Bun.$` สำหรับ shell command execution
3. จัดการ stdout/stderr ด้วย Bun APIs
4. ตรวจสอบ process exit codes และ errors

## Rules

### 1. Bun Command Execution

ใช้ `bun -e` สำหรับ:

- Simple JavaScript/TypeScript execution
- Quick shell commands ที่ต้องการ TypeScript support
- File operations ที่ต้องการ async/await
- JSON processing และ data transformation

ตัวอย่าง:
```bash
bun -e "console.log(JSON.stringify({test: true}, null, 2))"
bun -e "await Bun.write('output.txt', 'Hello World')"
```

### 2. Shell Integration

ใช้ `Bun.$` สำหรับ:

- Complex shell commands
- Pipeline operations
- Environment variable handling
- Process chaining

ตัวอย่าง:
```bash
bun -e "const result = await $`ls -la | grep '.json'`; console.log(result.stdout)"
```

### 3. File Operations

ใช้ Bun file APIs สำหรับ:

- Reading files: `await Bun.file(path).text()`
- Writing files: `await Bun.write(path, content)`
- File existence: `await Bun.file(path).exists()`
- Directory operations: `await $`mkdir -p path``

### 4. Error Handling

จัดการ errors ด้วย:

- Try-catch blocks สำหรับ async operations
- Process exit code checking
- Stderr capture และ logging
- Graceful error recovery

### 5. Avoid File Creation

พยายามรันคำสั่งโดยไม่สร้างไฟล์ชั่วคราว:

- ใช้ `bun -e` หรือ `Bun.$` สำหรับคำสั่งทันที
- ไม่สร้างไฟล์ `.ts` หรือ `.js` เพื่อรัน command ชั่วคราว
- ถ้า command มี side effects ให้ dry run ด้วย `print` หรือทดสอบค่าก่อน
- ถ้าจำเป็นต้องเขียนไฟล์ ให้ตรวจสอบ path ด้วย `Bun.file(path).exists()` ก่อน

### 6. Performance Optimization

ใช้ Bun features:

- Native TypeScript support
- Fast startup time
- Built-in utilities (crypto, hash, etc.)
- Concurrent execution capabilities

## Expected Outcome

- Shell operations ทำงานผ่าน Bun runtime
- Faster execution สำหรับ JavaScript/TypeScript tasks
- Better TypeScript integration สำหรับ shell scripts
- Consistent development environment ข้าม platforms
