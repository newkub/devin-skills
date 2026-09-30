| key | value |
|---|---|
| install | `bun add pinia @vue/devtools-api   # @vue/devtools-api เป็น required peer ใน v4` |
| version | 4.0.3 |
| package registry | https://www.npmjs.com/package/pinia |
| repository | https://github.com/vuejs/pinia |
| docs | https://pinia.vuejs.org |

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
