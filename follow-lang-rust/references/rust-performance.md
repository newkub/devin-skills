# Rust Performance Reference

แนวทางการปรับปรุง performance ใน Rust ด้วย zero-cost abstractions

ปรับปรุง performance ด้วย zero-cost abstractions

- ใช้ `criterion` สำหรับ benchmarking ใน `benches/`
- ใช้ `cargo flamegraph` สำหรับ profiling
- หลีกเลี่ยง allocations ใน hot paths
- ใช้ `&str` แทน `String` เมื่อไม่ต้องการ ownership
- ใช้ `Cow<T>` สำหรับ conditional ownership
- ใช้ `SmallVec` สำหรับ small collections
- ตั้งค่า `[profile.release]` ด้วย `lto = true` และ `codegen-units = 1`
