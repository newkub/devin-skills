# Troubleshooting

## Common Issues

### Type Errors

- **Implicit Any** - ใช้ `noImplicitAny: true` ใน tsconfig
- **Type Not Found** - ตรวจสอบ type definitions และ @types
- **Circular Dependencies** - แยก types ออกเป็นไฟล์แยก

### Compilation Errors

- **Module Not Found** - ตรวจสอบ module resolution ใน tsconfig
- **Declaration Files** - สร้าง .d.ts สำหรับ libraries ที่ไม่มี types
- **Path Aliases** - ตั้งค่า path aliases ใน tsconfig

### Performance Issues

- **Slow Compilation** - ใช้ `incremental: true` และ `tsBuildInfoFile`
- **Memory Issues** - ลดจำนวน files ใน compilation
- **Watch Mode** - ใช้ watch mode สำหรับ development

### IDE Issues

- **IntelliSense Not Working** - ตรวจสอบ TypeScript version ใน IDE
- **Language Service** - restart TypeScript language service
- **Workspace Trust** - trust workspace ใน VS Code
