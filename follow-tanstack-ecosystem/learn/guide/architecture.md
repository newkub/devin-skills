# Architecture

## TanStack Query Architecture

- **Query Cache** - Cache data ใน memory ด้วย stale-while-revalidate strategy
- **Query Observer** - Subscribe ไปยัง cache และ notify เมื่อมีการเปลี่ยนแปลง
- **Query Client** - Central hub สำหรับจัดการ queries ทั้งหมด

## TanStack Table Architecture

- **Core Model** - จัดการ core table logic (sorting, filtering, pagination)
- **Feature Models** - แยก features ออกเป็น models แยกกัน (sorting, filtering, etc.)
- **State Management** - ใช้ React state สำหรับ table state
- **Render Pipeline** - Render rows และ cells ผ่าน render pipeline

## TanStack Router Architecture

- **Route Tree** - Tree structure ของ routes
- **Route Matching** - Match URL กับ route tree
- **Data Loading** - Load data แบบ parallel หรือ sequential
- **Navigation** - Handle navigation และ history
