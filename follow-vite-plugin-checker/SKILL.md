---
name: follow-vite-plugin-checker
description: ตั้งค่าและใช้งาน vite-plugin-checker สำหรับ type checking และ linting ใน Vite
---

## Goal

ตั้งค่า checkers หลายตัว (typescript, eslint, biome, vueTsc, oxlint) ให้ทำงานร่วมกับ Vite แสดงผล errors และ warnings ผ่าน browser overlay และ terminal ใน real-time

## Scope

ใช้สำหรับ Vite projects ที่ต้องการ real-time type checking และ linting ใน dev server

## Execute

### 1. Install Dependencies

ติดตั้ง vite-plugin-checker และ checkers ที่ต้องการ

1. รัน `bun add -D vite-plugin-checker`
2. ติดตั้ง checkers ตามความต้องการ:
   - `bun add -D typescript` สำหรับ typescript checker
   - `bun add -D eslint` สำหรับ eslint checker
   - `bun add -D vue-tsc` สำหรับ Vue projects
   - `bun add -D @biomejs/biome` สำหรับ biome checker
   - `bun add -D stylelint` สำหรับ stylelint checker

### 2. Configure Checkers

ตั้งค่า checkers ใน `vite.config.ts`

1. Import plugin: `import checker from 'vite-plugin-checker'`
2. เพิ่ม checker ใน plugins array
3. กำหนด overlay options: `initialIsOpen`, `position`, `badgeStyle`
4. ตั้งค่า terminal output: `terminal: true`
5. กำหนด enableBuild: `enableBuild: true` สำหรับ build mode

### 3. Setup TypeScript Checker

ตั้งค่า TypeScript type checking

1. เปิดใช้งาน: `typescript: true`
2. หรือกำหนด options: `typescript: { tsconfigPath: './tsconfig.json' }`
3. ใช้ buildMode ถ้าต้องการ: `typescript: { buildMode: true }`

### 4. Setup Biome Checker

ตั้งค่า Biome linter

```typescript
biome: {
  command: 'lint',
  flags: '--write'
}
```

### 5. Setup Vue TSC Checker

ตั้งค่า Vue TypeScript checking สำหรับ Vue 3 projects

1. เปิดใช้งาน: `vueTsc: true`
2. หรือกำหนด options: `vueTsc: { tsconfigPath: './tsconfig.json' }`

### 6. Configure Overlay Display

ตั้งค่าการแสดงผล browser overlay

```typescript
overlay: {
  initialIsOpen: false,
  position: 'tr',
  badgeStyle: 'z-index: 9999;',
  panelStyle: 'z-index: 9999;'
}
```

- ตั้งค่า `initialIsOpen: 'error'` เพื่อเปิดเมื่อมี error เท่านั้น
- เลือกตำแหน่ง: `'tl'`, `'tr'`, `'bl'`, `'br'`

### 7. Integrate With Nuxt

ตั้งค่าสำหรับ Nuxt framework

```typescript
vite: {
  plugins: [
    checker({
      vueTsc: true,
      biome: { command: "lint" },
      oxlint: true,
      typescript: true,
      overlay: { initialIsOpen: false }
    }) as any
  ]
}
```

- ใช้ `as any` เพื่อ avoid type errors ใน Nuxt

### 8. Verify And Test

ตรวจสอบการทำงานของ checkers

1. รัน `bun run dev` เพื่อ start Vite dev server
2. ตรวจสอบ terminal แสดงผล diagnostics
3. ดู browser overlay แสดง errors/warnings
4. แก้ไข code ให้มี type error แล้วตรวจสอบว่า checker จับได้
5. ทดสอบ build mode: `bun run build`

## Rules

### 1. Worker Threads

- Checkers ทำงานใน worker threads ไม่ block dev server
- เลือกเฉพาะ checkers ที่จำเป็น เพื่อลด resource usage
- ปิด checkers ที่ไม่ใช้งานเพื่อประหยัด memory

### 2. Dev Mode Only

- เปิด overlay เฉพาะ development mode
- ตั้งค่า `initialIsOpen: false` เพื่อไม่รบกวนการพัฒนา
- เปิด `terminal: true` เพื่อดู errors ใน terminal

### 3. Build Mode

- ใช้ `enableBuild: true` เพื่อ check ตอน build
- แยก config สำหรับ dev และ build mode ถ้าจำเป็น

### 4. Nuxt Integration

- ใช้ `as any` เมื่อใช้กับ Nuxt เพื่อ avoid type errors
- สร้าง Vue component สำหรับ Nuxt เพื่อให้ overlay ทำงาน

## Expected Outcome

- TypeScript type errors ถูก detect และแสดงใน real-time
- ESLint/Biome linting errors ปรากฏทั้งใน terminal และ browser overlay
- Vue TypeScript checking ทำงานได้ถูกต้องสำหรับ Vue projects
- Browser overlay แสดงผลตามตำแหน่งและ style ที่กำหนด
- Build process ตรวจสอบ errors ก่อน deploy
- Development workflow มีประสิทธิภาพยิ่งขึ้นด้วย immediate feedback
