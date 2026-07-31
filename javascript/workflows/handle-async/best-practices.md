# Best Practices

## 1. ใช้ async/await แทน .then()

```javascript
// ✅ ถูก
async function loadData() {
  const data = await fetchData();
  return processData(data);
}

// ❌ ผิด
function loadData() {
  return fetchData()
    .then(data => processData(data));
}
```

## 2. ใช้ try-catch สำหรับ error handling

```javascript
// ✅ ถูก
async function operation() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ❌ ผิด
async function operation() {
  const result = await riskyOperation();
  return result;
}
```

## 3. ใช้ Promise.all() สำหรับ parallel operations

```javascript
// ✅ ถูก
async function loadAll() {
  const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts()
  ]);
  return { users, posts };
}

// ❌ ผิด
async function loadAll() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  return { users, posts };
}
```

## 4. ใช้ Promise.allSettled() เมื่อต้องการ results ทั้งหมด

```javascript
// ✅ ถูก
const results = await Promise.allSettled([
  fetchUser(),
  fetchPosts()
]);

// ❌ ผิด - จะ stop เมื่อมี error
const results = await Promise.all([
  fetchUser(),
  fetchPosts()
]);
```
