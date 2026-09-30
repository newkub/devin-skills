---
name: native-sdk-core-concepts
description: Explain Native SDK app model, markup, TypeScript cores, and state flow
related: []
allowed-tools:
  - read
  - webfetch
  - ask_user_question
triggers:
  - user
---

## Goal

อธิบายแนวคิดหลักของ Native SDK ให้เข้าใจ app model, markup, state, native UI

## Scope

ครอบคลุม app model, `app.json`/`app.zon` manifest, view markup, TypeScript cores, state & data flow, theming, native surfaces

## Execute

### 1. Explain App Model

อธิบายส่วนประกอบ
> Goal: เข้าใจโครงสร้าง app

1. `src/core.ts` มี `Model`, `Msg`, `update` — plain TypeScript compiled เป็น native code
2. `src/app.native` เป็น UI ทั้งหมด — declarative markup ผูก state และ dispatch messages
3. `app.json` เป็น manifest: id, name, version, icons, platforms, permissions, security
4. ไม่มี JS runtime ใน binary

### 2. Explain State Flow

อธิบายการเปลี่ยน state
> Goal: เข้าใจ data flow

1. Events สร้าง messages
2. `update(model, msg)` คืน `Model` ใหม่
3. View rerender จาก model ใหม่
4. ทำให้ state predictable และ debug ง่าย

### 3. Explain Native UI And Theming

อธิบาย UI กับธีม
> Goal: เข้าใจ native rendering

1. Widgets ทั้งหมด render ด้วย engine ของ Native SDK ไม่มี WebView
2. Theming ใช้ tokens เช่น `background`, `surface`, `primary`
3. OS scroll physics, context menus, tray, dialogs เป็น native
4. รองรับ HiDPI และ platform-specific surfaces

### 4. Link To Deeper Docs

ชี้ทางเอกสารลึก
> Goal: ให้ user ไปต่อได้

1. ถ้าถาม TypeScript cores → แนะนำ `https://native-sdk.dev/docs/typescript`
2. ถ้าถาม state → แนะนำ `https://native-sdk.dev/docs/state`
3. ถ้าถาม native UI → แนะนำ `https://native-sdk.dev/docs/native-ui`
4. ถ้าถาม components → แนะนำ `https://native-sdk.dev/docs/components`

## Rules

### 1. Accuracy

- ยึดเนื้อหาจาก `https://native-sdk.dev` เป็นหลัก
- ไม่สร้าง API หรือ command ที่ไม่มีในหน้าทางการ

### 2. Scope

- ไม่ลงลึก build, package, automation
- ถ้า user ต้องการลองใช้ → ส่งต่อให้ `native-sdk-getting-started`

## Expected Outcome

- user เข้าใจ app model, state flow, native UI, theming
- ได้ links ไปยัง docs สำหรับเนื้อหาลึก
