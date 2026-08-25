# Component Structure And Design Checks

## Component Structure

- file organization: single responsibility, component size, complexity, naming (PascalCase)
- component file patterns และ component organization ตาม framework (Vue, React, Solid, Svelte)
- component API design: clear interface, predictable behavior, stable public API

## Prop Design

- prop naming: consistent convention, descriptive names
- prop types: typed props, no `any`, proper type annotations
- prop defaults: sensible defaults, no surprising default values
- prop validation: runtime validation สำหรับ required props, custom validators
- prop count: เกิน 4 ต้อง group เป็น options object
- required vs optional: ระบุชัดเจน, optional ต้องมี default
- prop immutability: ห้าม mutate props โดยตรง

## Event Emission

- event naming: kebab-case for Vue, camelCase for React
- event payload typing: typed payload, no untyped emit
- event documentation: document emitted events ใน component docs
- custom event vs native event: ใช้ให้ถูก context
- event emission on correct lifecycle: emit หลัง state ready

## Component Composition

- slot usage: default slot, named slots, scoped slots
- component composition patterns: HOC, render functions, component injection
- composition ที่ลด coupling และเพิ่ม reusability

## Reactivity

- computed/memo patterns: ใช้สำหรับ expensive calculations
- watch effects: watch source stability, immediate flag, deep watch เฉพาะจำเป็น
- unnecessary re-renders: หา re-render ที่หลีกเลี่ยงได้
- reactivity dependencies: tracking ถูกต้อง, no reactivity leak
- effect scope: scope management, cleanup on unmount

## Component Reusability

- reusability across pages: component ใช้ซ้มได้โดยไม่ต้อง fork
- configurability: props ครอบคลุม use cases
- extensibility: extension points (slots, render props)
- coupling: low coupling กับ parent และ global state
- shared component patterns: shared library, design system compliance

## Component Testing

- unit test coverage: critical logic มี test
- component testing strategy: testing library, component harness
- snapshot testing: ใช้เฉพาะ stable components
- interaction testing: user interaction flows
- accessibility testing in components: axe-core, jest-axe

## Component Isolation

- isolation from parent: ไม่ depend บน parent internal state
- isolation from global state: ใช้ props/events แทน global state โดยตรง
- isolation from side effects: pure component patterns
- side effect isolation: side effects แยกจาก render logic

## Severity Reference

- Critical: broken component, prop mutation ที่ก่อให้เกิด error, broken slot, reactivity bug ที่ก่อให้เกิด error, memory leak from missing cleanup, reactivity leak, SSR incompatibility
- High: missing prop validation, poor composition, too many props without grouping, inconsistent event naming, missing event documentation, unnecessary re-render, missing memo on expensive component, untestable component, missing test coverage, high coupling, missing component isolation
- Medium: inconsistent naming, too many props, minor reactivity issue, missing component documentation
- Low: cosmetic, minor naming, documentation gap
