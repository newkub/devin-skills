# Lib Pinia API & Dependencies

## Install

```sh
bun add pinia @vue/devtools-api   # @vue/devtools-api เป็น required peer ใน v4
bun add -D @pinia/nuxt            # Nuxt 3/4 เท่านั้น
bun add pinia-plugin-persistedstate  # persistence (optional)
```

## Version

- Latest: `4.0.3` (verified 2026-09-13) — v4 เป็น ESM-only
- [Package Registry](https://www.npmjs.com/package/pinia)
- [Repository](https://github.com/vuejs/pinia)

## Dependencies

- Peer: `vue@^3.5.11`, `typescript@>=5.6.0`, `@vue/devtools-api@^8.1.5` (ต้องติดตั้งเองใน v4)

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `createPinia()` | สร้าง Pinia instance → `app.use(pinia)` | - | config ผ่าน `pinia.use(plugin)` |
| `defineStore(id, options)` | Options Store | - | `state`, `getters`, `actions` |
| `defineStore(id, setupFn, opts?)` | Setup Store (แนะนำ) | - | third arg: `actions`, `hydrate`, `persist` |
| `storeToRefs(store)` | destructure state โดยไม่เสีย reactivity | - | - |
| `setActivePinia(pinia)` | set active pinia สำหรับ tests/SSR | - | ใช้ใน `beforeEach` |
| `store.$patch(obj\|fn)` | batch state update | - | - |
| `store.$reset()` | reset state (Options store only) | - | - |
| `store.$subscribe(fn, opts?)` | subscribe state changes | - | `detached`, `patch: {deep}` |
| `store.$onAction(fn)` | subscribe action calls | - | - |
| `store.$dispose()` | dispose store + cleanup | - | - |
| `pinia.use(plugin)` | register plugin (`PiniaPluginContext`) | - | - |

## Source

- Official docs: https://pinia.vuejs.org
- API reference: https://pinia.vuejs.org/api/
- รายละเอียดเพิ่ม: [pinia-api.md](pinia-api.md) | [pinia-config.md](pinia-config.md)
