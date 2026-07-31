# Key Concept

## What is Kotlin?

Kotlin เป็น modern programming language ที่พัฒนาโดย JetBrains เน้นหลัก 3 อย่าง:
- **Conciseness**: โค้ดกระชับ ลด boilerplate
- **Safety**: Null safety และ type safety ที่ compile-time
- **Interoperability**: ทำงานบน JVM, JS, และ Native

## Core Features

- **Null Safety**: ป้องกัน NullPointerException ตั้งแต่ compile-time
- **Coroutines**: Asynchronous programming ที่ง่ายและ efficient
- **Data Classes**: สร้าง DTO/POJO ด้วยโค้ดเพียงบรรทัดเดียว
- **Extension Functions**: เพิ่ม function ให้ class ที่มีอยู่แล้ว
- **Sealed Classes**: Restricted hierarchies สำหรับ exhaustive when
- **Smart Casts**: ลด type casting ที่ไม่จำเป็น
- **Default Arguments**: function parameters ที่มี default values
- **Coroutines & Flow**: Reactive streams สำหรับ async operations
- **Object Declarations**: Singleton pattern ในบรรทัดเดียว
- **Delegation**: Composition over inheritance

## When to Use

| Platform | Use Case |
|----------|----------|
| Android | Mobile app development (official language) |
| Backend | Server-side with Ktor, Spring Boot |
| Multiplatform | Shared code ข้าม iOS/Android/Web |
| Desktop | Compose Desktop, TornadoFX, JavaFX |
| Web | Kotlin/JS for frontend |
| Native | Native binaries without JVM |

## Kotlin vs Other Languages

| Feature | Kotlin | Java | Scala |
|---------|--------|------|-------|
| Null Safety | Built-in | Optional | Option type |
| Coroutines | Native | External (RxJava) | External (FS2) |
| Syntax | Concise | Verbose | Complex |
| Compile Time | Fast | Fast | Slow |
| Learning Curve | Easy | Easy | Steep |
| Type Inference | Strong | Weak | Strong |
| Extension Functions | Yes | No | Via implicits |