# Rendering Performance Checks

## Goal

ตรวจสอบ unnecessary re-renders, virtualization, code splitting, bundle optimization, และ render bottlenecks

## Checks

### Unnecessary Re-Renders

1. ใช้ memoization ที่จำเป็นไหม (React.memo, useMemo, useCallback)
2. มี re-renders ที่ไม่จำเป็นไหม (parent re-render → child re-render)
3. มี inline objects/arrays ใน props ไหม (สร้างใหม่ทุก render)
4. มี inline functions ใน props ไหม (สร้างใหม่ทุก render)
5. ใช้ React DevTools profiler ตรวจสอบไหม

### Virtualization

1. long lists ใช้ virtualization ไหม (react-window, react-virtual, vue-virtual-scroller)
2. large datasets ใช้ windowing ไหม
3. มี lists ที่ render 1000+ items โดยไม่ virtualize ไหม
4. มี pagination สำหรับ large datasets ไหม
5. มี infinite scroll ที่ optimized ไหม

### Code Splitting

1. ใช้ lazy loading สำหรับ routes ไหม (React.lazy, Vue async components)
2. ใช้ dynamic import สำหรับ heavy components ไหม
3. ใช้ route-based splitting ไหม
4. มี components ที่ควร lazy load แต่ไม่ได้ ไหม
5. มี Suspense หรือ fallback สำหรับ lazy components ไหม

### Bundle Optimization

1. มี tree shaking ที่ทำงานไหม
2. มี dead code elimination ไหม
3. มี bundle analysis ไหม (bundle-analyzer, webpack-bundle-analyzer)
4. มี duplicate dependencies ใน bundle ไหม
5. bundle size อยู่ในเกณฑ์ไหม (JS < 200KB, CSS < 50KB)

### Render Bottlenecks

1. มี expensive computations ใน render phase ไหม
2. มี layout thrashing ไหม (read then write DOM)
3. มี forced reflow ไหม
4. มี heavy operations บน main thread ไหม
5. มี synchronous layout ที่ควรเป็น async ไหม

## Severity

- Critical: re-render storm บน hot path, no virtualization บน 1000+ items, no code splitting บน large app, expensive computation บน every render
- High: missing memoization, missing lazy loading, expensive computation บน render, no bundle analysis, large bundle
- Medium: minor re-renders, missing pagination, minor bundle bloat, missing tree shaking
- Low: minor optimization, documentation gap, cosmetic performance issue
