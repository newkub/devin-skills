# Migration

## Migrating from React Query v4 to TanStack Query v5

- **Package name** - เปลี่ยนจาก `@tanstack/react-query` (เหมือนกัน)
- **API changes** - ตรวจสอบ breaking changes ใน changelog
- **TypeScript** - อัปเดต types หากจำเป็น

## Migrating from React Router to TanStack Router

- **Route definitions** - convert route definitions ให้เข้ากับ TanStack Router syntax
- **Data loading** - migrate data loading ไปยัง loaders
- **Navigation** - อัปเดต navigation calls

## Migrating from Other Table Libraries

- **Headless migration** - TanStack Table เป็น headless ต้อง implement UI เอง
- **Features parity** - ตรวจสอบว่า features ที่ใช้มีใน TanStack Table หรือไม่
