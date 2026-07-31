# Common Pitfalls

## 1. ลืม await

```javascript
// ❌ ผิด
async function operation() {
  const result = fetchData(); // ไม่ await
  console.log(result); // Promise
}

// ✅ ถูก
async function operation() {
  const result = await fetchData();
  console.log(result);
}
```

## 2. ใช้ await ใน loop โดยไม่จำเป็น

```javascript
// ❌ ผิด - sequential
async function processItems(items) {
  for (const item of items) {
    await processItem(item);
  }
}

// ✅ ถูก - parallel
async function processItems(items) {
  await Promise.all(items.map(item => processItem(item)));
}
```

## 3. ไม่ handle errors ใน promises

```javascript
// ❌ ผิด
fetchData().then(data => console.log(data));

// ✅ ถูก
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```
