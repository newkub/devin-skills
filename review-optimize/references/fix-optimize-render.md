# Fix Guide — Render And DOM Scaling

## Goal

bound DOM nodes และ render work ไม่ให้โตตาม data size — virtualize, bucket, cap

## Scope

ใช้กับ lists/tables/gutters/minimaps ที่ render element ต่อ data item โดยไม่มี cap — และ spread/copy บน arrays ใหญ่ใน hot path

## Execute

### 1. Find Unbounded Renders

> Goal: หาจุดที่ DOM/work โตตาม data

1. grep `<For>`, `.map(`, `v-for`, `each` ใน components ที่แสดง data size ไม่จำกัด
2. เช็ค density views — gutter line numbers, minimap rows, table rows, log viewers
3. หา `Math.max(...arr)`, `[...arr]`, spread args บน arrays ที่โตได้

### 2. Virtualize With Threshold

> Goal: render เฉพาะ viewport + padding, preserve scroll height

1. เลือก threshold (เช่น > 500-800 items → virtualize; น้อยกว่า = render ปกติ — ง่ายกว่า)
2. render visible window + overscan padding, top/bottom spacer elements รักษา scroll height
3. sync กับ scroll position — `scrollTop`, item height, container height → start/end index
4. รักษา interactions ครบ — click handlers, bookmarks/decorations, keyboard nav บน rendered items
5. scroll container + content ต้อง align — ทดสอบ fast scroll, jump-to-line, resize

### 3. Bucket Or Sample Density Views

> Goal: cap rows ที่ fixed max แทนต่อ data item

1. aggregate source items เป็น buckets (เช่น minimap ≤ 400 rows — bucket = ceil(lines/max))
2. representative value ต่อ bucket — max/avg width, merged decorations
3. คง proportional navigation — click → map bucket index กลับเป็น source position
4. เปลี่ยน `Math.max(...arr)` → iterative loop — ป้องกัน call stack overflow + spread copy

### 4. Bound Reactive Work

> Goal: derived compute ไม่ทำซ้ำโดยไม่จำเป็น

1. เช็ค computations ที่เรียก derived signal หลายครั้งต่อ evaluation — cache ใน local `createMemo`/variable
2. ย้าย formatters/regex/sort ออกจาก render body → module scope หรือ memoize
3. effects ที่อ่าน state กว้างเกินจำเป็น → split หรือ narrow dependencies

### 5. Verify

> Goal: DOM count นิ่ง, interactions ครบ

1. ไฟล์/ลิสต์ใหญ่จริง (10k+ items) — DOM nodes ใน component เหลือ O(viewport) ไม่ใช่ O(data)
2. scroll smooth, gutter align, click/bookmark/decorations ทำงานบนทุก row
3. click-to-jump navigation ยังไปตำแหน่งที่ถูกต้อง
4. typecheck + tests ผ่าน

## Rules

- threshold pattern — ไม่ virtualize list เล็ก (เพิ่ม complexity โดยไม่ได้อะไร)
- spacer ต้อง preserve total scroll height เป๊ะ — ผิด = scrollbar กระโดด
- ทุก interaction บน non-rendered items ต้องยังทำงานผ่าน index mapping
- อย่า re-measure DOM ต่อ item — cache heights, ใช้ fixed item height ถ้าได้
- ใช้ /loop-until-complete ถ้า verify ต้อง iterate

## Expected Outcome

- DOM nodes ต่อ component bound ที่ viewport + padding — ไม่โตตาม data
- ไม่มี spread-based overflow บน arrays ใหญ่
- scroll/click/navigation เหมือนเดิมทุกประการ บนขนาดข้อมูลใดก็ได้
