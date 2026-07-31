# Troubleshooting

## Common Issues

## TanStack Query

### Query Not Refetching

- ตรวจสอบ `staleTime` และ `refetchOnWindowFocus`
- ใช้ `invalidateQueries` เพื่อ force refetch

### Infinite Loop

- ตรวจสอบ `enabled` option
- ตรวจสอบ dependencies ใน `queryKey`

### Memory Leaks

- ใช้ `remove` เพื่อลบ queries ที่ไม่ใช้แล้ว
- ใช้ `gcTime` เพื่อกำหนด cache lifetime

## TanStack Table

### Performance Issues

- ใช้ row virtualization
- Memoize columns และ data
- ใช้ server-side operations สำหรับ large data

### Re-renders

- ตรวจสอบ dependencies ใน `useReactTable`
- Memoize cell renderers

## TanStack Router

### Type Errors

- ตรวจสอบ TypeScript types
- ใช้ `inferRoute` สำหรับ type inference

### Navigation Not Working

- ตรวจสอบ route definitions
- ตรวจสอบ `link` components
