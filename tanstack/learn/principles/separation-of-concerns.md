# Separation of Concerns

## Data Layer vs UI Layer

แยก data fetching logic จาก UI components:
- **Hooks** - data fetching logic อยู่ใน custom hooks
- **Components** - UI components ใช้ hooks เพื่อดึง data
- **Queries** - query definitions อยู่ในไฟล์แยก

## Table Logic vs UI Logic

แยก table logic จาก UI:
- **Columns** - column definitions อยู่ในไฟล์แยก
- **Table Component** - table component ใช้ columns
- **UI Components** - cell renderers ใช้ UI library

## Route Logic vs Component Logic

แยก route logic จาก components:
- **Loaders** - data loading logic อยู่ใน loaders
- **Actions** - form submission logic อยู่ใน actions
- **Components** - components ใช้ data จาก loaders
