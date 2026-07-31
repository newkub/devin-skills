# Architecture

## Purpose

อธิบาย architecture และ design patterns ภายใน Pinia

## Scope

- System Architecture
- Store Pattern
- Reactivity Flow
- Plugin Architecture

## System Architecture

Pinia สร้างบน Vue 3 Reactivity system เป็น lightweight layer ที่เพิ่ม store management

```
+--------------------------------------------------+
|                   Vue Application                  |
|                                                    |
|  +----------+  +----------+  +----------+         |
|  |Component |  |Component |  |Component |         |
|  |  A       |  |  B       |  |  C       |         |
|  +----+-----+  +----+-----+  +----+-----+         |
|       |              |              |               |
|       +--------------+--------------+               |
|                      |                              |
|              +-------v-------+                      |
|              |   Pinia Store |                      |
|              |  (reactive)   |                      |
|              +---------------+                      |
|                      |                              |
|              +-------v-------+                      |
|              |  Vue Reactivity                     |
|              |  (proxy/track/trigger)              |
|              +---------------+                      |
+--------------------------------------------------+
```

| Layer | คำอธิบาย |
|-------|----------|
| **Components** | อ่าน/เขียน state ผ่าน store |
| **Pinia Store** | จัดการ state, getters, actions |
| **Vue Reactivity** | Proxy-based tracking + trigger |

## Store Pattern

### Singleton per App

```
+------------------+     +------------------+
|  useStore()      |     |  useStore()      |
|  Component A     |     |  Component B     |
+--------+---------+     +--------+---------+
         |                         |
         +------------+------------+
                      |
              +-------v-------+
              |  Same Store   |
              |  Instance     |
              +---------------+
```

| ลักษณะ | คำอธิบาย |
|---------|----------|
| **Singleton** | `useStore()` คืน instance เดียวกันเสมอ |
| **Lazy init** | Store สร้างเมื่อเรียกครั้งแรกเท่านั้น |
| **Per-app** | แต่ละ Vue app มี Pinia instance แยก |

### Options vs Setup Store

```
Options Store                    Setup Store
+-----------------+              +-----------------+
| state: () => {} |              | ref()           |
| getters: {}     |              | computed()      |
| actions: {}     |              | function()      |
+-----------------+              +-----------------+
        |                                |
        +----------------+---------------+
                         |
                +--------v--------+
                |   Same Store    |
                |   Instance      |
                +-----------------+
```

| Aspect | Options Store | Setup Store |
|--------|--------------|-------------|
| **Syntax** | Object literal | Function body |
| **State** | `state: () => ({...})` | `ref()` |
| **Getters** | `getters: {...}` | `computed()` |
| **Actions** | `actions: {...}` | Plain `function` |
| **$reset** | Supported | Not supported |
| **Composables** | ไม่ได้ | ใช้ได้ (useRouter, etc.) |

## Reactivity Flow

```
1. defineStore()
       |
       v
2. useStore() --first--> state() --> reactive() --> Proxy
       |                                              |
       v                                              v
3. Component reads store.count        Vue tracks dependency
       |                                              |
       v                                              v
4. store.count++                      Proxy setter triggers
       |                                              |
       v                                              v
5. Subscribers notified             Components re-render
```

| ขั้นตอน | Mechanism |
|---------|-----------|
| **Track** | Vue record ทุก reactive property ที่อ่าน |
| **Trigger** | เมื่อ property เปลี่ยน → notify dependents |
| **Re-render** | Component ที่มี dependency จะ re-render |
| **Subscribe** | `$subscribe` callback ถูกเรียก |

## Plugin Architecture

```
createPinia()
    |
    v
pinia.use(plugin1) --> pinia.use(plugin2) --> pinia.use(plugin3)
    |                                              |
    v                                              v
[Store Created] --> plugin1(ctx) --> plugin2(ctx) --> plugin3(ctx)
```

| Plugin Phase | คำอธิบาย |
|--------------|----------|
| **Registration** | `pinia.use(fn)` เพิ่ม plugin เข้า queue |
| **Execution** | Plugin ทำงานเมื่อ store ถูกสร้างครั้งแรก |
| **Context** | Plugin ได้รับ `{ store, app, pinia, options }` |
| **Return** | Plugin return object → merge เข้า store |

## Summary

| Pattern | ประโยชน์ |
|---------|----------|
| **Singleton** | State consistent ทั่วทั้ง app |
| **Reactive Proxy** | Auto track + trigger ไม่ต้องเขียน boilerplate |
| **Options/Setup** | เลือก style ตามความเหมาะสม |
| **Plugin Pipeline** | Extensible, ไม่แก้ core |
| **Lazy Init** | Store สร้างเมื่อต้องการเท่านั้น |
