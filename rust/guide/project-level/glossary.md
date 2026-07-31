---
title: Rust Glossary
description: คำศัพท์และคำจำกัดความของ Rust
---

## Glossary

### Ownership

ระบบที่จัดการ memory โดยกำหนดว่าแต่ละค่ามี "owner" เพียงคนเดียว เมื่อ owner ออกจาก scope ค่าจะถูก deallocate อัตโนมัติ

### Borrowing

กลไกที่อนุญาตให้ใช้ค่าโดยไม่เปลี่ยน ownership โดยมี rules ที่ strict เพื่อป้องกัน data races

### Lifetime

annotation ที่ระบุว่า reference ใช้งานได้นานเท่าไร ใช้เพื่อ guarantee ว่า references ยัง valid

### Trait

collection ของ methods ที่ types สามารถ implement ได้ คล้ายกับ interfaces ในภาษาอื่น

### Generic

code ที่ทำงานกับหลาย types ช่วยให้เขียน code ที่ reusable และ type-safe

### Macro

code generation ที่ทำงานที่ compile time ช่วยลด code duplication และสร้าง abstractions

### Crate

unit ของ compilation ใน Rust สามารถเป็น library หรือ binary

### Module

namespace สำหรับจัดระเบียบ code ภายใน crate

### Package

collection ของ crates ที่ถูก define ใน `Cargo.toml`

### Workspace

collection ของ packages ที่ share dependencies และ build directory

### Pattern Matching

feature ที่ใช้ destructuring และ match values กับ patterns

### Option

type ที่ represent ค่าที่อาจมีหรือไม่มี (null-safe alternative)

### Result

type ที่ represent operations ที่อาจ fail ด้วย error

### Panic

unrecoverable error ที่ทำให้ program terminate

### Unwrap

method ที่ extract value จาก Option หรือ Result และ panic ถ้าไม่มีค่า

### Iterator

pattern สำหรับ processing sequences ของ values

### Closure

anonymous function ที่สามารถ capture variables จาก environment

### Smart Pointer

type ที่ provide additional functionality เหนือจาก regular references เช่น `Box<T>`, `Rc<T>`, `Arc<T>`

### Send

trait ที่ indicate types สามารถ transfer ข้าม threads ได้อย่างปลอดภัย

### Sync

trait ที่ indicate types สามารถ share ข้าง threads ได้อย่างปลอดภัย

### Unsafe

block หรือ function ที่ disable บาง safety checks ใช้เมื่อจำเป็นและมีความรู้

### Zero-cost Abstraction

feature ที่ไม่มี runtime cost เมื่อ compiled

### Monomorphization

process ที่ generate specific code สำหรับแต่ละ type ที่ใช้กับ generics

### Borrow Checker

compiler component ที่ enforce borrowing rules ที่ compile time

### Slice

view ลงใน sequence ของ data โดยไม่เป็นเจ้าของ

### Vec

dynamic array ที่ growable และ shrinkable

### HashMap

key-value store ที่ implement hash table

### Arc

Atomic Reference Counted smart pointer สำหรับ shared ownership ข้าง threads

### Mutex

mutual exclusion primitive สำหรับ shared state ข้าง threads

### Channel

mechanism สำหรับ message passing ระหว่าง threads

### Async/Await

syntax สำหรับ asynchronous programming

### Future

value ที่อาจ available ในอนาคต ใช้ใน async programming

### Runtime

environment ที่ execute async code เช่น Tokio

### FFI

Foreign Function Interface สำหรับ call functions จากภาษาอื่น

### WASM

WebAssembly - binary instruction format สำหรับ web

### Cargo

package manager และ build system ของ Rust

### rustc

Rust compiler

### rust-analyzer

IDE support สำหรับ Rust

### Clippy

linter สำหรับ Rust best practices

### rustfmt

code formatter สำหรับ Rust
