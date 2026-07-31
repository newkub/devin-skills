---
title: Rust Overview
description: ภาพรวมของภาษา Rust และความสามารถหลัก
---

## Overview

Rust เป็นภาษาโปรแกรมมิ่งที่ออกแบบมาเพื่อ performance, reliability และ productivity โดยเฉพาะสำหรับ systems programming

## คุณสมบัติหลัก

### Memory Safety

- **Ownership System** - รับประกัน memory safety โดยไม่ต้องใช้ garbage collector
- **Borrow Checker** - ตรวจสอบ memory access ที่ compile time
- **No Null Pointers** - ใช้ `Option<T>` แทน null values
- **No Data Races** - ป้องกัน data races ใน concurrent programming

### Performance

- **Zero-cost Abstractions** - features ขั้นสูงไม่มีค่าใช้จ่าย runtime
- **No Garbage Collector** - ไม่มี pauses จาก garbage collection
- **Predictable Performance** - memory allocation ที่ deterministic
- **Small Binary Size** - ผลลัพธ์ที่ compact และ efficient

### Concurrency

- **Fearless Concurrency** - เขียน concurrent code อย่างปลอดภัย
- **Message Passing** - ใช้ channels สำหรับ communication
- **Shared State** - ใช้ mutex และ atomic types อย่างปลอดภัย
- **Async/Await** - รองรับ asynchronous programming

### Tooling

- **Cargo** - package manager และ build system ที่ทรงพลัง
- **rust-analyzer** - IDE support ที่ดีเยี่ยม
- **Clippy** - linter สำหรับ best practices
- **Rustfmt** - code formatter อัตโนมัติ

## Use Cases

- **Systems Programming** - OS kernels, device drivers
- **WebAssembly** - web applications ที่ high-performance
- **CLI Tools** - command-line applications
- **Network Services** - servers และ microservices
- **Embedded Systems** - microcontrollers และ IoT
- **Game Development** - game engines และ game logic
- **Blockchain** - smart contracts และ cryptocurrency

## Philosophy

Rust ออกแบบมาตามหลักการ:

1. **Safety First** - memory safety เป็น first-class concern
2. **Performance** - ไม่ยอมแลกด้วย performance
3. **Concurrency** - ทำ concurrent programming ให้ง่ายและปลอดภัย
4. **Productivity** - tooling และ ecosystem ที่ดี
