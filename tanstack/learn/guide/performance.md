# Performance

## TanStack Query Performance

- **Stale Time** - ตั้ง stale time ที่เหมาะสมเพื่อลด network requests
- **Cache Time** - ตั้ง cache time ที่เหมาะสม
- **Select Functions** - ใช้ select เพื่อ transform data และลด re-renders
- **Query Invalidation** - invalidate เฉพาะ queries ที่จำเป็น

## TanStack Table Performance

- **Row Virtualization** - ใช้ row virtualization สำหรับ large tables
- **Memoization** - memoize columns และ data
- **Controlled State** - ใช้ controlled state สำหรับ better performance
- **Debounce** - debounce user inputs สำหรับ filtering/sorting

## TanStack Router Performance

- **Code Splitting** - ใช้ lazy loading สำหรับ routes
- **Preloading** - preload routes ก่อน navigation
- **Data Caching** - cache route data เพื่อลด fetches
