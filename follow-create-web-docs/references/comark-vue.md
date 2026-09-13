# Comark Vue

> verified 2026-09-13 — https://comark.dev/rendering/vue

## Install

```bash
bun add @comark/vue
```

## Basic Usage

`<Markdown>` เป็น async component — ต้อง wrap ด้วย `<Suspense>` เสมอ:

```vue
<script setup lang="ts">
import { Markdown } from '@comark/vue'
import readme from '../../README.md?raw'
</script>

<template>
  <Suspense>
    <Markdown :value="readme" />
  </Suspense>
</template>
```

## Props ที่ใช้บ่อย

| Prop | Type | ใช้ |
|------|------|-----|
| `value` | `string \| MarkdownDocument` | markdown source |
| `options` | `ParserOptions` | `{ autoUnwrap: true, autoClose: true }` |
| `plugins` | `ComarkPlugin[]` | shiki, math, mermaid |
| `components` | `Record<string, Component>` | custom Vue components |

## Shiki Highlight

```ts
import shiki from '@comark/vue/plugins/shiki'
import githubLight from '@shikijs/themes/github-light'
import githubDark from '@shikijs/themes/github-dark'

const plugins = [shiki({ themes: { light: githubLight, dark: githubDark } })]
```

theme toggle → สลับ `.dark` class ที่ root; shiki dual themes render ทั้งคู่ผ่าน CSS vars

## Shared Component

ใช้ `defineMarkdownComponent({ plugins, components })` สร้าง `<AppMarkdown>` เดียวใช้ทั้ง README pane และ docs pane — ไม่ config ซ้ำ

## Notes

- `import ... ?raw` bundle markdown ตอน build — ไม่มี runtime fetch
- ถ้าอยากตัด parser ออกจาก client bundle ใช้ `<MarkdownDocument>` + parse ฝั่ง build
