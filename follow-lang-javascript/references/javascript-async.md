# JavaScript Async Patterns

async patterns และ error handling สำหรับ JavaScript ที่ถูกต้องและ efficient

## Async/Await

- ใช้ `async/await` แทน callback hell และ `.then()` chains
- ใช้ top-level await ใน ES modules
- หลีกเลี่ยง callback functions ใน modern code

## Error Handling

- ใช้ `try/catch/finally` สำหรับ error handling
- ใช้ `throw` สำหรับ custom errors พร้อม `Error` objects
- ใช้ `Error` objects พร้อม stack traces และ context
- Log errors ด้วย context ที่เพียงพอ
- ใช้ error boundaries ใน frameworks
- ไม่ใช้ `catch` โดยไม่มี error parameter (optional catch binding)

## Promise Combinators

- ใช้ `Promise.all()` สำหรับ parallel async ที่ทุกตัวต้องสำเร็จ
- ใช้ `Promise.allSettled()` สำหรับ parallel async ที่รอผลลัพธ์ทั้งหมด
- ใช้ `Promise.race()` สำหรับ timeout patterns

## Module Loading

- ใช้ dynamic `import()` สำหรับ lazy loading modules และ code splitting
