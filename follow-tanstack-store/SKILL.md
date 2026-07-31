---
name: follow-tanstack-store
description: ตั้งค่า TanStack Store สำหรับ lightweight reactive state management
---

## Goal

ตั้งค่า TanStack Store สำหรับ lightweight, framework-agnostic reactive state management

## Scope

ใช้สำหรับ TanStack Store (alpha) ใน React, Solid, Vue, Svelte projects ที่ต้องการ simple state management

## Execute

### 1. Setup And Store Creation

1. ติดตั้งด้วย `bun add @tanstack/store`
2. สร้าง store ด้วย `createStore` พร้อม initial state
3. ใช้ `store.state` สำหรับอ่าน current state
4. ใช้ `store.setState()` สำหรับ update state

### 2. Framework Integration

1. ใช้ `useStore` hook สำหรับ React integration
2. ใช้ `useStore` hook สำหรับ Solid integration
3. Store เป็น framework-agnostic - ใช้ได้กับทุก framework
4. ใช้ `subscribe` สำหรับ reactive updates นอก components

### 3. Derived State

1. ใช้ `derive` สำหรับ computed state จาก store
2. Derived state reactive - auto-update เมื่อ source state เปลี่ยน
3. ใช้สำหรับ computed values และ filtered data

## Rules

### 1. Store Best Practices

- ใช้สำหรับ simple state ที่ไม่ต้องการ complex middleware
- ใช้ `derive` สำหรับ computed state
- ใช้ `subscribe` สำหรับ side effects
- ไม่ใช้ store สำหรับ server state (ใช้ TanStack Query)

### 2. When To Use

- ใช้ TanStack Store สำหรับ client UI state
- ใช้ TanStack Query สำหรับ server state
- ใช้ TanStack DB สำหรับ normalized client data
- ใช้ TanStack Form สำหรับ form state

## Expected Outcome

- TanStack Store ติดตั้งพร้อม lightweight state management
- Framework-agnostic store ใช้ได้กับทุก framework
- Derived state reactive และ auto-update
- Integration กับ React และ Solid ผ่าน `useStore` hook
