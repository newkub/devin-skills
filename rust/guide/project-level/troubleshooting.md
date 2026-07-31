# Troubleshooting

## Common Issues

### Compilation Errors

- **Borrow Checker** - ตรวจสอบ ownership และ lifetimes
- **Type Inference** - ใช้ type annotations เมื่อ compiler ไม่สามารถ infer
- **Trait Bounds** - ตรวจสอบ trait bounds และ generic constraints

### Cargo Issues

- **Dependency Conflicts** - ใช้ `cargo update` หรือ lock versions
- **Build Cache** - ลบ cache ด้วย `cargo clean`
- **Cross-compilation** - ตั้งค่า target สำหรับ cross-compilation

### Runtime Errors

- **Panic** - ใช้ `Result` และ `Option` แทน panic
- **Null Pointer** - Rust ไม่ม null pointers แต่ตรวจสอบ unsafe code
- **Memory Leaks** - ใช้ tools เช่น valgrind สำหรับ detect memory leaks

### IDE Issues

- **Rust Analyzer** - ตรวจสอบว่า rust-analyzer ถูกติดตั้ง
- **Language Server** - restart language server เมื่อมีปัญหา
- **IntelliSense** - ตรวจสอบ project ถูก open ใน IDE
