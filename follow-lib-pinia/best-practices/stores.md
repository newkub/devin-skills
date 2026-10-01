# Best Practices: Pinia (Vue 3 State Management)

แนวทางออกแบบ stores, state, actions, persistence และ testing ให้ predictable และ type-safe

## Recommended Patterns

- ใช้ setup function pattern เป็นหลัก `defineStore('id', () => {...})` — Composition API style เขียนง่ายกว่า options store
- แยก store ตาม domain/feature (`useUserStore`, `useCartStore`) — ไม่ใช่ global dump รวมทุกอย่าง
- State ด้วย `ref`/`reactive`, derived ด้วย `computed`, side effects ด้วย actions
- Actions เป็น async function ธรรมดา — handle errors ภายใน, return value เมื่อต้องการ
- Component destructure state ด้วย `storeToRefs(store)` — ห้าม destructure ตรงๆ จะเสีย reactivity
- Batch update ด้วย `store.$patch({...})` หรือ `store.$patch(fn)` — ลด re-trigger subscriptions
- Persist เฉพาะ field จำเป็นด้วย `pinia-plugin-persistedstate` `pick`/`paths` — อย่า persist ทั้ง store โดยไม่คิด

## Do / Don't

| Do | Don't |
|---|---|
| ใช้ `storeToRefs` เมื่อ destructure reactive state | `const {count} = store` — reactive หาย |
| Mutate state ใน actions เท่านั้น | แก้ state จาก component โดยตรง (ยาก debug) |
| Return เฉพาะ state/methods ที่ใช้จริง | expose internal refs ทั้งหมด |
| ใช้ `setActivePinia(createPinia())` ใน test setup | reuse pinia instance ข้าม tests |
| Persist ด้วย `pick` ระบุ fields | persist sensitive data (tokens, PII) ลง localStorage |
| ใช้ `store.$dispose()` cleanup เมื่อ store ไม่ใช้แล้ว | ปล่อย subscriptions ค้างใน memory |

## Common Pitfalls

- Setup store ไม่มี `$reset()` built-in — implement reset action เอง (หรือ Options store ถ้าต้องการ)
- `storeToRefs` เฉพาะ state/getters — actions destructure ได้ปกติเพราะเป็น function
- SSR/Nuxt: state ต้อง serializable — function/class instance ใน state เสีย hydration
- Persist + async hydration mismatch — ตั้ง `persist` strategies ให้รอ client-side
- Plugin ลืม `pinia.use(plugin)` ก่อน `app.use(pinia)` — persist ไม่ทำงานเงียบๆ
- Watch store state ใน component ด้วย `watch(store.field)` — ใช้ getter ref จาก `storeToRefs` หรือ `store.$subscribe` แทน

## Performance Notes

- Store ขนาดใหญ่ = re-render มาก — แยก store ตาม feature ลด cross-dependencies
- Getters เป็น `computed` — cache อัตโนมัติ; อย่าคำนวณซ้ำใน component
- `$subscribe` รับทุก mutation — ใช้ `{detached: true}` หรือ filter ใน callback ถ้า hot path
- Persistence write ทุก state change — throttle/serialize เฉพาะ field จำเป็น
- Lazy-load store: `defineStore` ไม่ instantiate จนกว่าจะถูกเรียก — ปลอดภัยที่จะ define เยอะ

## Ecosystem / Integration

- Nuxt: `@pinia/nuxt` auto-import `defineStore`, `storeToRefs` — ตั้ง `pinia.storesDirs` ถ้า path ต่างจาก default
- Testing: Vitest + `setActivePinia` — mock external services ใน actions
- Persistence: `pinia-plugin-persistedstate` รองรับ `storage`, `serializer`, `pick`
- Devtools: Pinia tab ใน Vue DevTools — debug state timeline ได้
