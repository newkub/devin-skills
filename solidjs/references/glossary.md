---
title: Glossary
description: Terms and definitions สำหรับ SolidJS
---

## Core Concepts

### Signal

Reactive state primitive ที่ใช้ getter/setter pattern

### Effect

Side effect ที่ทำงานเมื่อ dependencies เปลี่ยน

### Memo

Derived reactive value ที่ cache ไว้

### Store

Reactive state สำหรับ complex objects ด้วย nested reactivity

### Context

Mechanism สำหรับ sharing state ระหว่าง components

### Resource

Async data fetching พร้อม loading states และ error handling

### Suspense

Loading boundary สำหรับ async operations

## Reactivity

### Fine-grained Reactivity

Reactivity system ที่ update DOM โดยตรง ไม่ใช้ virtual DOM

### Dependency Tracking

Automatic tracking ของ dependencies ใน effects และ memos

### Reactive Primitives

Basic building blocks ของ reactivity system

## Components

### Component

Function ที่ returns JSX

### Props

Properties ที่ส่งเข้า component

### Slots

Content projection ใน components

### Lifecycle

Component lifecycle hooks (onMount, onCleanup)

## Performance

### Virtual DOM

DOM abstraction ที่ SolidJS ไม่ใช้

### Compile-time Optimization

Optimizations ที่เกิดขึ้นที่ compile time

### Tree Shaking

Dead code elimination สำหรับ bundle size

## Development

### JSX

Syntax extension สำหรับ writing UI

### TypeScript

Type system สำหรับ SolidJS

### Vite

Build tool สำหรับ SolidJS development
