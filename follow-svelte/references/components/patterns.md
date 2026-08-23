---
name: svelte-components-reference
description: Svelte 5 component patterns reference
---

## Goal

อ้างอิง patterns สำหรับ Svelte 5 components

## Scope

ใช้เมื่องานพัฒนา components หรือ snippets

## Patterns

- `.svelte` พร้อม `lang="ts"`
- `$props()` สำหรับ typed props
- snippets แทน slots
- `onclick` แทน `on:click`
- `mount(Component, props)` แทน `new Component()`

## Snippets

- `{#snippet name()}` — สร้าง snippet
- `{@render children()}` — render snippet content

## Rules

- ใช้ snippets แทน slots ของ Svelte 4
- declarations ใน markup ได้ (Svelte 5.56+)

## Expected Outcome

- เขียน components ถูกต้องตาม Svelte 5
