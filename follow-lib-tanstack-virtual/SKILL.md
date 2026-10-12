---
name: follow-lib-tanstack-virtual
description: ใช้ TanStack Virtual ครบวงจร — lists, window scroll, grids, dynamic sizes, infinite scroll, table rows
argument-hint: "[framework] [mode]"
related:
  - follow-lib-tanstack-ecosystem
  - run-test
  - run-typecheck
  - resolve-errors
---

## Goal

ใช้ TanStack Virtual (v3) ครบ — virtualize element lists: scroll container, window virtualizer, grids, dynamic measurement, infinite scroll, table row virtualization

## Scope

ใช้เมื่อ render items จำนวนมาก (100+) — lists, table rows, grids, chat feeds; lists สั้นไม่จำเป็น (overhead > benefit)

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add @tanstack/react-virtual   # มี solid/vue/svelte variants
```

### 2. List Virtualizer

```tsx
const parentRef = useRef<HTMLDivElement>(null)
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 40,    // px ประมาณ
  overscan: 5,               // render เผื่อนอก viewport
})

return (
  <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
    <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
      {virtualizer.getVirtualItems().map((v) => (
        <div key={v.key} data-index={v.index} ref={virtualizer.measureElement}
          style={{ position: 'absolute', top: 0, transform: `translateY(${v.start}px)` }}>
          {items[v.index]}
        </div>
      ))}
    </div>
  </div>
)
```

### 3. Modes

> Goal: เลือก virtualizer ตรง layout

1. **Fixed container** — `useVirtualizer` + scroll element (ข้างบน)
2. **Window scroll** — `useWindowVirtualizer` เมื่อ scroll ที่ window/document
3. **Grid 2 มิติ** — row + column virtualizer คู่กัน (หรือ `lanes` สำหรับ masonry)
4. **Dynamic heights** — `measureElement` ref + `data-index` (ข้างบน) — เหมาะ chat feeds/cards
5. **Sticky headers** — ตรวจ `vItem.lane`/sticky patterns ใน docs

### 4. Patterns

> Goal: composition กับ libs อื่น

1. **Infinite scroll**: tail virtual item + `useInfiniteQuery` (`follow-query`) — `fetchNextPage` เมื่อ index ใกล้จบ:

   ```ts
   const lastItem = virtualItems[virtualItems.length - 1]
   useEffect(() => {
     if (lastItem?.index >= items.length - 1 && hasNextPage) fetchNextPage()
   }, [lastItem?.index])
   ```

2. **Table rows**: virtualize tbody ของ `follow-table` — spacer rows + `translateY`
3. **Keyboard nav**: `virtualizer.scrollToIndex(i)` สำหรับ active-item scroll-into-view
4. **Padding/gap**: `paddingStart`/`gap` options — ไม่ใส่ margin บน items

### 5. Verify

1. `/run-typecheck` + `/run-test`
2. DevTools: DOM nodes เท่า viewport+overscan, scroll recycle ถูก
3. 10k+ items smooth, dynamic heights ไม่ jump
4. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- Scroll container ต้อง fixed height + `overflow: auto`
- `estimateSize` ใกล้จริง — ผิดมาก scrollbar กระโดดตอน measure
- `vItem.key` เป็น React key — ห้ามใช้ `vItem.index` เมื่อ items reorder
- Items ห้ามมี margin — ใช้ `gap` option หรือ padding ภายใน
- `measureElement` ต้องมี `data-index` คู่กัน

## Expected Outcome

- Large lists render เร็ว DOM ถูกจำกัด
- Window/grid/dynamic/infinite modes ใช้ถูกจุด
- Integration กับ Query/Table ทำงาน
