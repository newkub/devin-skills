# How It Works

## Workflow ของ shadcn-solid

shadcn-solid ใช้ copy-paste workflow เช่นเดียวกับ shadcn/ui

```
┌─────────────────────────────────────────────────────────────┐
│                 shadcn-solid Workflow                       │
└─────────────────────────────────────────────────────────────┘

1. Browse Components
   └─> เข้า shadcn-solid.com
   └─> เลือก component ที่ต้องการ

2. Copy Component Code
   └─> กด "Copy" บน component page
   └─> ได้ component code พร้อม dependencies

3. Paste to Project
   └─> สร้างไฟล์ component ใน project
   └─> Paste code ที่ copy มา

4. Install Dependencies
   └─> รัน `bun add <dependencies>`
   └─> Dependencies จะถูกติดตั้งอัตโนมัติ

5. Customize
   └─> แก้ไข component ตามต้องการ
   └─> ปรับ Tailwind classes
   └─> เพิ่ม/ลบ features

6. Use Component
   └─> Import และใช้ใน application
   └─> Full control ผ่าน props
```

## Component Structure

แต่ละ component ใน shadcn-solid มีโครงสร้าง:

```
component/
├── component.tsx        # Main component logic
└── index.ts            # Re-exports
```

## Integration Flow

```
┌──────────────┐
│shadcn-solid  │
│    .com      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Copy Code  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Paste to   │
│  Project    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Install     │
│  Deps        │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Customize  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Use in App │
└─────────────┘
```

## Dependencies Management

shadcn-solid components ขึ้นอยู่กับ:

| Dependency | วัตถุประสงค์ |
|------------|---------------|
| `solid-js` | Core framework |
| `@kobalte/core` | Accessible primitives |
| `tailwind-merge` | Merge Tailwind classes |
| `class-variance-authority` | Variant management |
| `clsx` | Conditional classes |
