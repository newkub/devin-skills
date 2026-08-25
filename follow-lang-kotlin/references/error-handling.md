## Error Handling

ใช้ `Either<L, R>` เพื่อจัดการกับผลลัพธ์ที่อาจเป็น `Failure` (L) หรือ `Success` (R)

```kotlin
// src/core/error/Failure.kt
sealed class Failure(val message: String)

class ServerFailure(message: String) : Failure(message)
class CacheFailure(message: String) : Failure(message)
```
