# JavaScript Modern Syntax

ES2025+ modern syntax features สำหรับเขียน JavaScript ที่กระชับและปลอดภัย

## Version Info

- Current standard: ES2025 (16th edition, June 2025)
- Source: https://262.ecma-international.org/16.0/

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

## ES2025 Features

- ใช้ `Iterator` global พร้อม helpers (`map`, `filter`, `take`, `drop`, `reduce`)
- ใช้ `Set` methods: `union()`, `intersection()`, `difference()`, `symmetricDifference()`, `isSubsetOf()`, `isSupersetOf()`, `isDisjointFrom()`
- ใช้ `Promise.try()` สำหรับ wrapping sync/async code ใน Promise
- ใช้ `RegExp.escape()` สำหรับ escape string ก่อนใช้ใน regex
- ใช้ import attributes สำหรับ JSON modules: `import data from './data.json' with { type: 'json' }`
- ใช้ inline modifier flags ใน regular expressions: `/(?i)pattern/`
