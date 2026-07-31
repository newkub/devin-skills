# Vapor Mode

## Overview

Vapor Mode เป็น compilation mode ใหม่สำหรับ Vue Single-File Components (SFC) ที่มีเป้าหมายลด baseline bundle size และปรับปรุง performance Vapor Mode ลบ Virtual DOM ออกโดยสมบูรณ์ และ compile โดยตรงเป็น DOM operations คล้ายกับ SolidJS และ Svelte 5

## Key Features

- **No Virtual DOM**: Compile โดยตรงเป็น DOM operations
- **Reduced Bundle Size**: ลด baseline bundle size 30-50% สำหรับ Vapor-only builds
- **Improved Performance**: Updates เร็วขึ้น 50-97% ใน component-heavy scenarios
- **Less Memory**: ลด memory usage อย่างมีนัยสำคัญ (up to 10x สำหรับ static components)
- **Opt-in**: เลือกใช้ได้ต่อ component ไม่บังคับทั้ง application
- **Same DX**: SFC syntax, composables, Pinia ทำงานเหมือนเดิม

## Performance Benchmarks

จาก benchmarks จริง:

```
                       Classic    Vapor   Δ
Initial render          92 ms      54 ms   −41%
Filter (re-render)      38 ms      11 ms   −71%
Memory (DevTools)       28 MB      19 MB   −32%
JS bundle (gzip)        72 KB      59 KB   −18%
```

สำหรับ large lists (10,000 rows):

| Scenario | Vue 3.6 | Vue 3.6 + Vapor | Reduction |
| --- | --- | --- | --- |
| 10k rows | ~9.9 MB | ~2.9 MB | 3.4× |
| 10k components | ~23.2 MB | ~3.2 MB | 7.3× |
| 10k static components | ~19.2 MB | ~1.9 MB | 10.1× |

## Opt-in to Vapor Mode

ใช้ `vapor` attribute บน `<script setup>`:

```vue
<script setup lang="ts" vapor>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>{{ count }}</div>
</template>
```

สำหรับ Vapor-only apps ใช้ `createVaporApp()`:

```typescript
import { createVaporApp } from 'vue'

const app = createVaporApp(App)
app.mount('#app')
```

## Feature Compatibility

Vapor Mode รองรับ **subset** ของ Vue features:

### Supported Features

- Composition API ด้วย `<script setup>`
- `ref()`, `reactive()`, `computed()`
- `watch()`, `watchEffect()`
- Lifecycle hooks (onMounted, onUpdated, etc.)
- Props และ Emits
- Slots
- Directives (v-if, v-for, v-model, v-show, etc.)
- Teleport (รวม deferred Teleport)
- Transition (partial - ใช้ได้บน leaves)
- Pinia
- Vue Router

### Not Supported Features

- Options API
- Render functions returning VNodes (`h()`)
- JSX (ใน active development)
- `app.config.globalProperties`
- `getCurrentInstance()` returns `null`
- `@vue:xxx` per-element lifecycle events
- Suspense (ใน Vapor-only mode, แต่สามารถ render Vapor components ใน VDOM Suspense)

## Use Cases

Vapor Mode เหมาะสำหรับ:

- Performance-critical components (dashboards, large lists, real-time data)
- Design system components ที่ render บ่อย
- Reducing bundle size สำหรับ production
- Small new apps (Vapor-only mode)
- Components ที่ไม่ต้องการ advanced features

## Best Practices

- ใช้ Vapor Mode สำหรับ components ที่ performance-critical
- Test components อย่างละเอียดก่อนเปลี่ยนเป็น Vapor Mode
- ตรวจสอบว่า features ที่ใช้รองรับใน Vapor Mode
- ใช้ร่วมกับ VDOM components ได้ (mixed mode)
- Library authors ควร pin to classic mode จนกว่า JSX จะ stable

## Migration

1. เริ่มจาก components ที่ simple ก่อน
2. Test อย่างละเอียดหลังเปลี่ยนเป็น Vapor Mode
3. ตรวจสอบ performance improvements
4. ย้าย components ที่ซับซ้อนทีหลัง
5. อัปเดต compiler ด้วย (Vue 3.6+ ต้องใช้ compiler ที่รองรับ)

## Status

- Vue 3.6 beta: Feature-complete แต่ยัง unstable
- Performance parity กับ Solid และ Svelte 5 ใน 3rd party benchmarks
- แนะนำให้ใช้สำหรับ:
  - Partial usage ใน existing apps (perf-sensitive sub-pages)
  - Small new apps (Vapor-only mode)
- Production use เมื่อ stable release

## Vapor vs VDOM Interop

ใช้ `vaporInteropPlugin` สำหรับ mixing Vapor และ VDOM components:

```typescript
import { createApp, vaporInteropPlugin } from 'vue'
import App from './App.vue'

createApp(App)
  .use(vaporInteropPlugin) // enable vapor interop
  .mount('#app')
```

**Limitations:**
- Vapor และ VDOM components สามารถ nested กันได้
- รองรับ standard props, events, และ slots
- ยังมี rough edges เมื่อใช้ VDOM-based component library ใน Vapor Mode
- Vapor slots ไม่สามารถ render ด้วย `slots.default()` ใน VDOM component
- ต้องใช้ `renderSlot` แทน

**Recommendation:**
- มี distinct "regions" ใน app ที่เป็น mode เดียว (Vapor หรือ VDOM)
- หลีกเลี่ยง mixed nesting มากเกินไป
