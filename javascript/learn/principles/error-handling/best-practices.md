# Best Practices

## 1. ใช้ try-catch สำหรับ operations ที่อาจ fail

```javascript
// ✅ ถูก
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Invalid JSON:', error);
    return null;
  }
}

// ❌ ผิด - ไม่ handle error
function parseJSON(jsonString) {
  return JSON.parse(jsonString);
}
```

## 2. Throw meaningful errors

```javascript
// ✅ ถูก
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// ❌ ผิด - error ไม่ชัดเจน
function divide(a, b) {
  if (b === 0) {
    throw new Error('Error');
  }
  return a / b;
}
```

## 3. Log errors อย่างเหมาะสม

```javascript
// ✅ ถูก
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  // ส่ง error ไปยัง monitoring service
  sendToMonitoring(error);
}
```

## 4. ใช้ custom errors สำหรับ business logic

```javascript
// ✅ ถูก
class InsufficientFundsError extends Error {
  constructor(amount, balance) {
    super(`Insufficient funds: ${amount} > ${balance}`);
    this.name = 'InsufficientFundsError';
    this.amount = amount;
    this.balance = balance;
  }
}

function withdraw(amount, balance) {
  if (amount > balance) {
    throw new InsufficientFundsError(amount, balance);
  }
  return balance - amount;
}
```

## 5. Handle errors ใน async functions

```javascript
// ✅ ถูก
async function fetchData() {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    return null; // หรือ throw error ต่อ
  }
}

// ❌ ผิด - ไม่ handle error
async function fetchData() {
  const response = await fetch(url);
  return await response.json();
}
```
