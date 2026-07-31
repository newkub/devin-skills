# Error Types

## 1. Built-in Errors

```javascript
// SyntaxError - ผิด syntax
try {
  eval('1 + '); // SyntaxError
} catch (error) {
  console.error(error instanceof SyntaxError); // true
}

// ReferenceError - อ้างอิงตัวแปรที่ไม่มี
try {
  console.log(undefinedVariable); // ReferenceError
} catch (error) {
  console.error(error instanceof ReferenceError); // true
}

// TypeError - ผิด type
try {
  null.toString(); // TypeError
} catch (error) {
  console.error(error instanceof TypeError); // true
}

// RangeError - ค่าอยู่นอก range
try {
  new Array(-1); // RangeError
} catch (error) {
  console.error(error instanceof RangeError); // true
}
```

## 2. Custom Errors

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

function validateUser(user) {
  if (!user.name) {
    throw new ValidationError('Name is required', 'name');
  }
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
}
```
