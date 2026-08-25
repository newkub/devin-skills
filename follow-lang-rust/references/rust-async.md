# Rust Async Patterns Reference

แนวทางการใช้ async patterns ใน Rust ที่ถูกต้องและ safe

ใช้ async patterns ที่ถูกต้องและ safe

- ใช้ `tokio` เป็น default async runtime
- ใช้ structured concurrency ด้วย `tokio::task::JoinSet`
- จัดการ cancellation ด้วย `CancellationToken`
- ใช้ `Send + Sync` bounds สำหรับ shared state
- หลีกเลี่ยง `block_on` ใน async context
- ใช้ `tokio::select!` สำหรับ concurrent operations
- ใช้ `Arc<T>` สำหรับ shared ownership ข้าม tasks
