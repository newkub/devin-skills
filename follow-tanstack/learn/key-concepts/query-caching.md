# Query Caching

## Stale-While-Revalidate

TanStack Query ใช้ stale-while-revalidate strategy:
- Data ถูก cache ใน memory
- Data ถือว่า "stale" หลังจาก stale time
- Background refetch เมื่อ data เป็น stale
- ใช้ data ที่ cached ขณะ refetching

## Cache Keys

- **Unique keys** - แต่ละ query ต้องมี key ที่ unique
- **Hierarchical keys** - ใช้ array สำหรับ hierarchical keys
- **Serialization** - keys ถูก serialize สำหรับ cache lookup

## Cache Invalidation

- **Manual** - invalidateQueries
- **Automatic** - invalidate เมื่อ mutations
- **Time-based** - invalidate ตาม stale time
