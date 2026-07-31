# Common Pitfalls

## 1. ลืม catch ใน promises

```javascript
// ❌ ผิด - ไม่มี catch
fetch('/api/data')
  .then(response => response.json());

// ✅ ถูก
fetch('/api/data')
  .then(response => response.json())
  .catch(error => console.error(error));
```

## 2. กลืน error โดยไม่จำเป็น

```javascript
// ❌ ผิด - กลืน error โดยไม่ log
try {
  await riskyOperation();
} catch (error) {
  // ไม่ทำอะไร
}

// ✅ ถูก
try {
  await riskyOperation();
} catch (error) {
  console.error(error);
  // หรือ re-throw
  throw error;
}
```

## 3. ใช้ try-catch ในที่ที่ไม่จำเป็น

```javascript
// ❌ ผิด - ไม่จำเป็นต้อง try-catch
try {
  const sum = a + b;
} catch (error) {
  console.error(error);
}

// ✅ ถูก
const sum = a + b;
```
