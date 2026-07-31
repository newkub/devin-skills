---
name: follow-tsgo
description: ตั้งค่าและใช้งาน TypeScript-Go (tsgo) compiler สำหรับ performance ที่ดีกว่า tsc 10x
---

## Goal

ตั้งค่าและใช้งาน `tsgo` (TypeScript-Go) compiler ซึ่งเป็น native Go port ของ TypeScript compiler ที่จะมาแทน `tsc` ใน TypeScript 7

## Execute

### 1. Install TSGo

1. ติดตั้ง `@typescript/native-preview` package
2. ติดตั้ง `typescript` package เพื่อใช้ tsconfig
3. ตรวจสอบ version ด้วย `bunx tsgo -v`
4. ตรวจสอบ CLI options ด้วย `bunx tsgo --help`

### 2. Setup Configuration

1. สร้าง `tsconfig.json` ด้วย `bunx tsc --init`
2. ตั้งค่า compiler options ตาม project requirements
3. ใช้ `target: esnext` และ `module: NodeNext` สำหรับ modern projects
4. เปิดใช้ `strict: true` สำหรับ type safety
5. ตั้งค่า `skipLibCheck: true` เพื่อเพิ่ม performance

### 3. Integration with Build Tools

1. เพิ่ม `tsgo` scripts ลงใน `package.json`
2. แทนที่ `tsc` commands ด้วย `tsgo` commands
3. ตั้งค่า watch mode ด้วย `tsgo --watch`
4. ตั้งค่า build mode ด้วย `tsgo --build`
5. อัพเดท CI/CD pipelines ให้ใช้ `tsgo`

### 4. VS Code Integration

1. ติดตั้ง VS Code extension สำหรับ tsgo
2. ตั้งค่า `typescript.tsdk` ใน `.vscode/settings.json`
3. เปิดใช้งาน LSP features (completions, hover, diagnostics)
4. ตั้งค่า auto-import และ navigation features
5. ตรวจสอบว่า language service ทำงานได้

### 5. Performance Optimization

1. ใช้ incremental compilation ด้วย `--incremental`
2. ตั้งค่า `tsBuildInfoFile` สำหรับ cache
3. ใช้ project references สำหรับ large codebases
4. เปิดใช้ parallel type checking
5. ตรวจสอบ memory usage และ optimization

### 6. Migration from TSC

1. เปรียบเทียบ output ระหว่าง `tsc` และ `tsgo`
2. ตรวจสอบว่า diagnostics เหมือนกัน
3. ทดสอบ build artifacts ทั้งหมด
4. ตรวจสอบ declaration files (.d.ts)
5. ตรวจสอบ source maps และ build info

### 7. Troubleshooting

1. ตรวจสอบ compatibility กับ TypeScript 6.0
2. ตรวจสอบ JavaScript/JSDoc support limitations
3. ตรวจสอบ module resolution issues
4. ตรวจสอบ path mapping และ aliases
5. รายงาน bugs ไปที่ microsoft/typescript-go

## Rules

### 1. Installation and Setup

ติดตั้งและตั้งค่า tsgo อย่างถูกต้อง:

- ใช้ `@typescript/native-preview` สำหรับ preview version
- ติดตั้ง `typescript` package ควบคู่สำหรับ tsconfig
- ตรวจสอบ version ก่อนใช้งาน
- ใช้ `bunx tsgo` แทน `bunx tsc`
- ตั้งค่า environment variables ถ้าจำเป็น

### 2. Configuration Best Practices

ตั้งค่า tsconfig.json ตาม best practices:

- ใช้ `target: esnext` สำหรับ modern JavaScript
- ใช้ `module: NodeNext` สำหรับ Node.js projects
- เปิดใช้ `strict: true` สำหรับ type safety
- ตั้งค่า `skipLibCheck: true` เพื่อเพิ่ม performance
- ใช้ `composite: true` สำหรับ project references

### 3. Build Tool Integration

ผสาน tsgo เข้ากับ build tools:

- เพิ่ม scripts ลงใน `package.json`
- ใช้ `tsgo --watch` สำหรับ development
- ใช้ `tsgo --build` สำหรับ production builds
- อัพเดท CI/CD pipelines
- ตั้งค่า cache strategies

### 4. Performance Optimization

ปรับปรุง performance ของ tsgo:

- ใช้ incremental compilation
- ตั้งค่า `tsBuildInfoFile` สำหรับ cache
- ใช้ project references สำหรับ large codebases
- เปิดใช้ parallel type checking
- ตรวจสอบ memory usage

### 5. Language Service Features

ใช้งาน LSP features อย่างเต็มที่:

- ติดตั้ง VS Code extension
- ตั้งค่า `typescript.tsdk` อย่างถูกต้อง
- ใช้ completions และ auto-import
- ใช้ hover และ quick info
- ใช้ navigation features (go-to-definition, references)

### 6. Compatibility and Limitations

ตรวจสอบ compatibility และ limitations:

- tsgo เป็น preview version ของ TypeScript 7
- มี intentional differences จาก TypeScript 6.0
- JavaScript/JSDoc support มี limitations
- บาง features อาจยังไม่รองรับ
- ตรวจสอบ release notes สำหรับ updates

### 7. Migration Strategy

วางแผน migration จาก tsc ไป tsgo:

- เปรียบเทียบ output ก่อน migration
- ทดสอบใน environment แยกก่อน
- ตรวจสอบ diagnostics และ errors
- ทดสอบ build artifacts ทั้งหมด
- มี rollback plan พร้อม

## Expected Outcome

- tsgo ติดตั้งและตั้งค่าอย่างถูกต้อง
- tsconfig.json ตั้งค่าตาม best practices
- Build tools ผสานกับ tsgo
- VS Code integration ทำงานได้
- Performance ดีกว่า tsc ประมาณ 10x
- Migration จาก tsc สำเร็จ
- Development workflow ราบรื่น
