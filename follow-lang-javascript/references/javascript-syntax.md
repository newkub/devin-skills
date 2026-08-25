# JavaScript Modern Syntax

ES2024+ modern syntax features สำหรับเขียน JavaScript ที่กระชับและปลอดภัย

## Variable Declarations

- ใช้ `const` เป็น default, `let` เฉพาะเมื่อต้อง reassign, ไม่ใช้ `var`
- ใช้ destructuring สำหรับ objects และ arrays
- ใช้ spread/rest operators สำหรับ data manipulation
- ใช้ shorthand properties และ methods

## Functions

- ใช้ arrow functions สำหรับ callbacks และ short functions
- ใช้ default parameters สำหรับ functions
- ใช้ named functions สำหรับ debugging และ stack traces

## Strings

- ใช้ template literals สำหรับ string interpolation

## Optional Values

- ใช้ optional chaining (`?.`) สำหรับ nested property access
- ใช้ nullish coalescing (`??`) สำหรับ default values

## ES2024 Features

- ใช้ `Promise.withResolvers()` สำหรับ async patterns แทน manual Promise construction
- ใช้ `Object.groupBy()` และ `Map.groupBy()` สำหรับ grouping แทน external libraries

## ES2023 Immutable Array Methods

- ใช้ `toSorted()` สำหรับ immutable sort
- ใช้ `toReversed()` สำหรับ immutable reverse
- ใช้ `toSpliced()` สำหรับ immutable splice
- ใช้ `with()` สำหรับ immutable element replacement
- ใช้ `findLast()` และ `findLastIndex()` สำหรับ reverse search
