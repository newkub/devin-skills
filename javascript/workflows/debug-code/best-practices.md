# Best Practices

## 1. ใช้ meaningful log messages

```javascript
// ✅ ถูก
console.log('User created:', { id: user.id, name: user.name });

// ❌ ผิด
console.log(user);
```

## 2. ลบ console.log ก่อน production

```javascript
// ✅ ถูก - ใช้ environment variable
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}

// ❌ ผิด - console.log ใน production
console.log('Debug info');
```

## 3. ใช้ debugger อย่างระมัดระวัง

```javascript
// ✅ ถูก - ใช้เฉพาะ development
if (process.env.NODE_ENV === 'development') {
  debugger;
}

// ❌ ผิด - debugger ใน production
debugger;
```

## 4. ใช้ error tracking services

```javascript
// ✅ ถูก
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: 'your-dsn' });

try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}
```
