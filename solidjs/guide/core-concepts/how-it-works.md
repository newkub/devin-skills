---
title: How It Works
description: การทำงานภายในของ SolidJS
---

## Compilation Pipeline

JSX ใน SolidJS ผ่านขั้นตอน compilation:

```
JSX Source
    │
    ├──► babel-preset-solid
    │       │
    │       ├──► Template Extraction ──► DOM Template
    │       │                           │
    │       │                           └──► Runtime
    │       │
    │       └──► Reactive Binding ──► Reactive Update
    │                                   │
    │                                   └──► Runtime
```

## Template Extraction

Static HTML ถูก extract เป็น reusable templates:

```jsx
// Source
<div>
  <h1>Hello</h1>
  <p>{name()}</p>
</div>

// Compiled
const _tmpl$ = _$template(`<div><h1>Hello</h1><p></p></div>`);
```

## Reactive Binding

Dynamic expressions ถูกแปลงเป็น reactive calls:

```jsx
// Source
<p>{name()}</p>

// Compiled
_$insert(_el$, name);
```

## Runtime Execution

เมื่อ component ทำงาน:

1. Component function ทำงานครั้งเดียว
2. Signals ถูกสร้าง
3. Effects ถูก register
4. Reactive subscriptions ถูกสร้าง

## Update Flow

เมื่อ state เปลี่ยน:

```
setCount
  │
  ▼
Signal Updated
  │
  ▼
Notify Observers
  │
  ▼
Re-run Effects
  │
  ▼
Update DOM
```

## Dependency Graph

SolidJS สร้าง dependency graph อัตโนมัติสำหรับ fine-grained reactivity

**ดูรายละเอียดใน:** [Reactivity](../../key-concepts/reactivity/index.md)

## ถัดไป

ดู [Configuration](./configuration.md) เพื่อตั้งค่า project
