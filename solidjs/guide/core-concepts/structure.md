---
title: Structure
description: โครงสร้าง project ที่แนะนำ
---

## Basic Structure

```
src/
├── components/
│   ├── Button.jsx
│   ├── Card.jsx
│   └── index.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   └── index.jsx
├── hooks/
│   ├── useCounter.js
│   └── useFetch.js
├── stores/
│   └── userStore.js
├── utils/
│   └── helpers.js
├── App.jsx
└── index.jsx
```

## Component Organization

### Feature-Based

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.jsx
│   └── dashboard/
│       ├── components/
│       ├── hooks/
│       └── index.jsx
```

### Type-Based

```
src/
├── components/
│   ├── ui/
│   └── layout/
├── hooks/
├── stores/
└── services/
```

## File Naming

- Components: `PascalCase.jsx`
- Hooks: `useCamelCase.js`
- Stores: `camelCase.js`
- Utils: `camelCase.js`

## Index Files

ใช้ `index.jsx` สำหรับ exports:

```jsx
// components/Button/index.jsx
export { default } from "./Button.jsx";
export { default as ButtonGroup } from "./ButtonGroup.jsx";
```

## Asset Organization

```
public/
├── images/
├── fonts/
└── icons/

src/
└── assets/
    ├── images/
    └── styles/
```

## ถัดไป

ดู [Best Practices](./best-practices.md) เพื่อเรียนรู้ best practices
