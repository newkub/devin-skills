# Features

## Core Features

| Feature | Description |
|---------|-------------|
| Reactive Data Binding | Two-way binding อัตโนมัติ |
| Computed Properties | Cached values ที่ update อัตโนมัติ |
| Watchers | Side effects เมื่อข้อมูลเปลี่ยน |
| Components | Reusable UI building blocks |
| Directives | v-if, v-for, v-show, v-bind, v-on |

## Vue 3 New Features

| Feature | Description |
|---------|-------------|
| Composition API | Logic composition ที่ยืดหยุ่น |
| Teleport | Render content ไปที่อื่นใน DOM |
| Fragments | Multiple root elements |
| Suspense | Async component loading |
| KeepAlive | Cached component instances |

## Vue 3.5+ New Features

| Feature | Description |
|---------|-------------|
| Reactive Props Destructuring | Built-in reactive destructuring (no toRefs needed) |
| useTemplateRef() | Template ref management with dynamic bindings |
| useId() | SSR-safe ID generation |
| onWatcherCleanup() | Cleanup callbacks in watchers |
| onEffectCleanup() | Cleanup in effects |
| Lazy Hydration | Control when async components hydrate |
| data-allow-mismatch | Suppress hydration mismatch warnings |
| useHost()/useShadowRoot() | Custom element APIs |
| Deferred Teleport | Teleport with defer prop |
| watch numeric deep option | Control watch depth with number |
| Reactivity optimizations | -56% memory, 10x faster arrays |

## Vue 3.6 Beta Features

| Feature | Description |
|---------|-------------|
| Vapor Mode | No Virtual DOM, direct DOM compilation |
| createVaporApp() | Vapor-only app instances |
| vaporInteropPlugin | Mix Vapor and VDOM components |
| Reduced bundle size | 30-50% smaller baseline bundles |
| Performance parity | Matches Solid and Svelte 5 benchmarks |

## Component Features

| Feature | Description |
|---------|-------------|
| Props | Pass data to components |
| Emits | Send events to parent |
| Slots | Content projection |
| Provide/Inject | Deep component communication |
| Expose | Public component API |

## Reactivity Features

| Feature | Description |
|---------|-------------|
| ref() | Reactive reference |
| reactive() | Reactive object |
| computed() | Computed value |
| watch() | Watch for changes |
| watchEffect() | Immediate watcher |
| deferredComputed() | Deferred computation (3.5+) |
| watchSyncEffect() | Synchronous effects (3.5+) |

## Build Features

| Feature | Description |
|---------|-------------|
| Vite Integration | Fast HMR และ build |
| TypeScript Support | Full TS integration |
| CSS Scoped | Component-scoped styles |
| Asset Handling | Images, fonts, etc. |
| Tree Shaking | Optimize bundle size |