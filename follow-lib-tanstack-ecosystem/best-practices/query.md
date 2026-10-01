# TanStack Query — Server State Patterns

Best practices สำหรับ Query: query keys, caching, mutations, invalidation และ performance

## Recommended Patterns

### Query Keys เป็น Contract

```ts
// query key factory — centralize ไว้ไฟล์เดียวต่อ domain
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Filters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}
```

- key ต้อง serializable, stable และ unique ต่อ data — ใส่ทุก variable ที่เปลี่ยนผลลัพธ์ (id, filters, page)
- invalidation ด้วย prefix: `queryClient.invalidateQueries({ queryKey: userKeys.all })` ครอบทุก list/detail

### Caching ที่ตั้งใจ

| Option | ความหมาย | แนวทาง |
|---|---|---|
| `staleTime` | data สดนานแค่ไหนก่อนถือว่า stale | ตั้งตามจริง — static data ตั้งสูง, realtime ตั้งต่ำ |
| `gcTime` | cache อยู่นานแค่ไหนหลังไม่มี observer | default 5 นาทีพอในกรณีทั่วไป |
| `refetchOnWindowFocus` | refetch เมื่อกลับมาที่ tab | ปิดเฉพาะ query ที่ไม่จำเป็น — อย่าปิด global |
| `retry` | retry เมื่อ fail | ปรับตาม criticality — mutation ไม่ retry โดย default |

- ตั้ง `staleTime` ต่อ query มากกว่า global — data แต่ละประเภทมี freshness ต่างกัน
- ใช้ `select` เพื่อ derive เฉพาะส่วนที่ component ต้องการ — ลด re-render และแยก concerns

### Mutations + Invalidation

```ts
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
  },
})
```

- invalidate หลัง mutation เสมอ — หรือ `setQueryData` สำหรับ optimistic/direct update
- optimistic updates: `onMutate` snapshot → update cache → `onError` rollback → `onSettled` invalidate
- mutation state (`isPending`, `error`) อยู่ใน hook — อย่า copy ไป state อื่น

### Dependent และ Parallel Queries

- dependent queries ใช้ `enabled: !!id` — อย่า fetch เมื่อ prerequisite ยังไม่พร้อม
- parallel queries ใช้ `useQueries` เมื่อจำนวน dynamic — hooks ปกติเมื่อจำนวนคงที่
- prefetch ใน route loader หรือ `queryClient.prefetchQuery` ตอน hover — ลด waterfall

## Common Pitfalls

- ใส่ non-serializable values ใน query key (Date objects, class instances) → key mismatch, cache miss ถาวร
- ไม่ใส่ params ใน key → stale cache เมื่อ params เปลี่ยน
- `staleTime: 0` ทุกที่ → refetch storm ทุก mount/focus
- invalidate ด้วย key แคบเกิน → list ไม่ update หลัง mutation
- เก็บ server state ใน global store (Zustand/Store) ซ้ำกับ Query → 2 sources of truth
- `select` สร้าง object ใหม่ทุกครั้ง → re-render loop (wrap ด้วย stable reference หรือ structural sharing พึ่งพา default)

## Do / Don't

| Do | Don't |
|---|---|
| query keys เป็น factory ต่อ domain | hardcode key strings กระจายทั่ว codebase |
| ใช้ `select` derive data | map data ใน component render |
| invalidate prefix keys หลัง mutations | สร้าง query ซ้ำด้วย `useEffect` + manual fetch |
| ใช้ `enabled` สำหรับ dependent queries | guard fetch ด้วย if ใน component body |
| optimistic update ด้วย `setQueryData` | refetch ทั้ง list เพื่อ update item เดียวถ้าไม่จำเป็น |
| prefetch ใน loaders/hover handlers | ปล่อย waterfall queries ต่อเนื่อง |

## Performance Notes

- `select` ลด re-render — component subscribe เฉพาะ derived slice
- `staleTime` สูงสำหรับ reference data (categories, config) — ต่ำสำหรับ data ที่เปลี่ยนบ่อย
- pagination ใช้ `placeholderData: keepPreviousData` — UI ไม่กระพริบตอนเปลี่ยนหน้า
- infinite queries ใช้ `useInfiniteQuery` กับ `getNextPageParam` — อย่า implement เองด้วย state
- structural sharing (default on) ทำให้ data ใหม่ที่ deep-equal ไม่ trigger re-render — รักษาไว้
- Devtools: เปิด panel ตอน dev เพื่อดู cache lifecycle — หา query ที่ refetch เกินจำเป็น

## Ecosystem / Integration

- Router: prefetch ใน route loader ด้วย `queryClient.ensureQueryData` — data พร้อมก่อน render
- Form: mutations จาก form submit — use `@tanstack/react-form` validators + Query mutations ร่วมกัน
- SSR/Start: `dehydrate`/`hydrate` สำหรับ server-prefetched queries — เช็ค adapter ของ framework
- อย่าใช้ Query กับ client-only state (UI toggles, draft forms) — นั่นคือหน้าที่ของ `Store` หรือ local state
- Vue/Svelte/Solid: package แยก `@tanstack/vue-query` ฯลฯ — API เกือบเหมือนกัน แต่อ่าน adapter docs ก่อน
