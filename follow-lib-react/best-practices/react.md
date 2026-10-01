# React — Best Practices

Component, hooks และ rendering discipline สำหรับ React สมัยใหม่

## Recommended Patterns

- Composition over prop drilling — children/render props/context ตามความลึกของ tree
- Hooks rules: call ที่ top level เท่านั้น, deps array ครบ (`react-hooks` eslint), ไม่ conditional
- Derived state = compute ใน render — ไม่ใช่ `useState` + `useEffect` sync
- `useEffect` = sync กับ external systems เท่านั้น — data fetching ให้ framework/query lib; ห้าม effect chains
- Keys ต้อง stable + unique — ห้ามใช้ index เมื่อ list reorder/filter ได้
- Memoization ตอน measured bottleneck เท่านั้น — `useMemo`/`useCallback` ทุกจุด = worse

## Common Pitfalls

- State mutation: `array.push`, `obj.x =` ไม่ trigger render — setState ด้วย new reference เสมอ
- `useEffect` missing deps = stale closure bugs — exhaustive-deps warning อย่า ignore
- Race conditions ใน fetch effects — abort/`ignore` flag; หรือใช้ React Query/SWR
- Prop drilling ลึก → context; แต่ context value object ใหม่ทุก render = re-render ทุก consumer → memo value
- Effects สำหรับ event handling ผิด — events คือ handler ไม่ใช่ effect

## Perf Notes

- `React.memo` เฉพาะ components ที่ props shallow-equal ได้จริง
- List rendering: virtualization (`react-window`/`tanstack-virtual`) เมื่อ >1000 rows
- Code splitting: `React.lazy` + `Suspense` ที่ route boundaries
- Server Components (RSC): data heavy components render บน server — client JS ลดลง

## Do / Don't

| Do | Don't |
|----|-------|
| compute derived state ใน render | `useState` + effect sync state |
| stable keys | array index keys บน dynamic lists |
| context เมื่อ depth >2-3 | prop drilling 5 ชั้น |
| effect สำหรับ external sync เท่านั้น | effects สำหรับ event/data-fetch logic |
