# Best Practices

## TanStack Query

- **Use unique query keys** - ใช้ query keys ที่ unique และ descriptive
- **Avoid over-fetching** - fetch เฉพาะ data ที่จำเป็น
- **Handle errors gracefully** - ใช้ error boundaries และ retry logic
- **Use isLoading vs isFetching** - isLoading สำหรับ initial load, isFetching สำหรับ background refetch

## TanStack Table

- **Keep columns definition separate** - แยก columns definition ไว้ในไฟล์แยก
- **Use memoization** - memoize columns และ data เพื่อป้องกัน re-renders
- **Server-side operations for large data** - ใช้ server-side sorting/filtering สำหรับ large datasets
- **Virtualization** - ใช้ row virtualization สำหรับ tables ที่มี rows มาก

## TanStack Router

- **Co-locate routes** - วาง route components ใกล้กับ route definitions
- **Type-safe search params** - ใช้ search params ที่ type-safe
- **Lazy load routes** - ใช้ lazy loading สำหรับ routes ที่ไม่จำเป็นต้อง load ทันที
