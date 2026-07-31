# Try-Catch-Finally

## Basic Usage

```javascript
try {
  // code ที่อาจเกิด error
  const data = JSON.parse(jsonString);
} catch (error) {
  // จัดการ error
  console.error('Failed to parse JSON:', error.message);
} finally {
  // ทำเสมอ ไม่ว่าจะ error หรือไม่
  console.log('Parsing attempt completed');
}
```

## Nested Try-Catch

```javascript
try {
  try {
    const data = fetchData();
    processData(data);
  } catch (error) {
    if (error instanceof NetworkError) {
      retryFetch();
    } else {
      throw error; // re-throw
    }
  }
} catch (error) {
  logError(error);
}
```
