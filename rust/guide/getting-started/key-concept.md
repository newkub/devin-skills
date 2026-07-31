# Key Concept

## What is Rust?

Rust เป็น systems programming language ที่พัฒนาโดย Mozilla เน้นหลัก 3 อย่าง:
- **Safety**: Memory safety ผ่าน ownership system
- **Concurrency**: Fearless parallelism ผ่าน ownership model
- **Performance**: Zero-cost abstractions

## Core Features

- **Ownership**: ระบบจัดการ memory โดยไม่ต้องมี garbage collector
- **Borrowing**: การอ้างอิงข้อมูลที่ปลอดภัยผ่าน borrow checker
- **Lifetimes**: ระบบตรวจสอบความถูกต้องของ references
- **Traits**: Interface-like system สำหรับ polymorphism
- **Pattern Matching**: การจับคู่ patterns พร้อม exhaustiveness checking
- **Algebraic Data Types**: Enums ที่มี data ได้ (like sum types)
- **Error Handling**: `Result<T, E>` และ `Option<T>` สำหรับ explicit error handling
- **Modules**: ระบบจัดการ code organization ที่ยืดหยุ่น

## When to Use

- Systems programming (OS, drivers, embedded systems)
- WebAssembly development
- CLI tools และ command-line applications
- Network services และ high-performance servers
- Game development
- Blockchain และ cryptocurrency projects
- โปรเจกต์ที่ต้องการ memory safety และ zero-cost abstractions

## Rust vs Other Languages

| Feature | Rust | C/C++ | Go | Java |
|---------|------|-------|-----|------|
| Memory Safety | Compile-time | Manual | GC | GC |
| Speed | Very Fast | Very Fast | Fast | Moderate |
| Concurrency | Safe | Unsafe | Safe | Safe |
| Learning Curve | Steep | Steep | Easy | Moderate |
| Compile Time | Slow | Moderate | Fast | Fast |
| Package Manager | Cargo | Manual/vcpkg | Go modules | Maven |