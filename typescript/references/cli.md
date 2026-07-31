# TypeScript CLI Commands

## Overview

TypeScript compiler (tsc) ให้ CLI commands สำหรับ compile, watch, และ manage TypeScript projects

## Common Commands

| Command | Description | Example |
|---------|-------------|---------|
| `tsc` | Compile project ตาม tsconfig.json | `tsc` |
| `tsc file.ts` | Compile file ที่ระบุโดยไม่ใช้ tsconfig | `tsc app.ts util.ts` |
| `tsc --init` | สร้าง tsconfig.json ใหม่ | `tsc --init` |
| `tsc -p path` | Compile project จาก path ที่ระบุ | `tsc -p ./path/to/tsconfig.json` |
| `tsc -b` | Build composite project | `tsc -b` |
| `tsc --watch` | Watch input files และ compile เมื่อมีการเปลี่ยนแปลง | `tsc --watch` |
| `tsc --noEmit` | Type check โดยไม่ emit files | `tsc --noEmit` |

## Command Line Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--help, -h` | แสดง help message | `tsc --help` |
| `--version, -v` | แสดง version ของ compiler | `tsc --version` |
| `--watch, -w` | Watch input files | `tsc --watch` |
| `--all` | แสดง compiler options ทั้งหมด | `tsc --help --all` |
| `--init` | สร้าง tsconfig.json | `tsc --init` |
| `--project, -p` | ระบุ path ของ config file | `tsc -p ./tsconfig.json` |
| `--showConfig` | แสดง configuration ที่ใช้ | `tsc --showConfig` |
| `--ignoreConfig` | ไม่ใช้ tsconfig ที่พบ | `tsc --ignoreConfig` |
| `--build, -b` | Build projects และ dependencies | `tsc -b` |

## Common Compiler Options

| Option | Description | Example |
|--------|-------------|---------|
| `--pretty` | เปิดใช้ color และ formatting ใน output | `tsc --pretty` |
| `--declaration, -d` | สร้าง .d.ts files | `tsc --declaration` |
| `--declarationMap` | สร้าง sourcemaps สำหรับ .d.ts files | `tsc --declarationMap` |
| `--emitDeclarationOnly` | Emit เฉพาะ .d.ts files | `tsc --emitDeclarationOnly` |
| `--sourceMap` | สร้าง source map files | `tsc --sourceMap` |
| `--noEmit` | ไม่ emit files | `tsc --noEmit` |
| `--target, -t` | ระบุ JavaScript version | `tsc --target esnext` |
| `--module, -m` | ระบุ module code generation | `tsc --module esnext` |
| `--lib` | ระบุ library declaration files | `tsc --lib es2020,dom` |
| `--allowJs` | อนุญาตให้ JavaScript files อยู่ใน project | `tsc --allowJs` |
| `--checkJs` | Enable error reporting ใน JS files | `tsc --checkJs` |
| `--jsx` | ระบุ JSX code generation | `tsc --jsx react-jsx` |
| `--outDir` | ระบุ output folder | `tsc --outDir dist` |
| `--removeComments` | ไม่ emit comments | `tsc --removeComments` |
| `--strict` | Enable strict type-checking ทั้งหมด | `tsc --strict` |
| `--types` | ระบุ type package names | `tsc --types node` |
| `--esModuleInterop` | Enable synthetic default imports | `tsc --esModuleInterop` |

## Usage Examples

### Basic Compilation
```bash
# Compile project
tsc

# Compile specific files
tsc app.ts util.ts

# Compile with specific config
tsc -p ./tsconfig.json
```

### Watch Mode
```bash
# Watch for changes
tsc --watch

# Watch with specific config
tsc -p ./tsconfig.json --watch
```

### Type Checking Only
```bash
# Type check without emitting
tsc --noEmit

# Type check with strict mode
tsc --noEmit --strict
```

### Project Initialization
```bash
# Create tsconfig.json
tsc --init

# Create with specific options
tsc --init --target esnext --module esnext
```

## Additional Resources

- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [TypeScript CLI Documentation](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
