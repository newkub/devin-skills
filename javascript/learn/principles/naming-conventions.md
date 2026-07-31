# Naming Conventions

## Overview

Naming conventions ที่ดีช่วยให้ code อ่านง่าย เข้าใจง่าย และ maintain ได้ดีขึ้น

## General Rules

1. **ใช้ภาษาอังกฤษเสมอ** - หลีกเลี่ยงภาษาอื่น
2. **ใช้ชื่อที่สื่อความหมาย** - บอกว่าทำอะไร
3. **หลีกเลี่ยง abbreviations** - ใช้คำเต็มเสมอ
4. **สม่ำเสมอ** - ใช้ convention เดียวกันทั้ง project

## Variable Naming

### camelCase สำหรับ variables และ functions

```javascript
// ✅ ถูก
const userName = 'John';
const isLoggedIn = true;
const getUserData = () => { };

// ❌ ผิด
const user_name = 'John';
const isloggedin = true;
const get_user_data = () => { };
```

### ใช้ prefixes สำหรับ boolean

```javascript
// ✅ ถูก
const isVisible = true;
const hasPermission = false;
const canEdit = true;
const shouldUpdate = false;
const isLoaded = true;

// ❌ ผิด
const visible = true;
const permission = false;
const edit = true;
```

### ใช้ plural สำหรับ arrays

```javascript
// ✅ ถูก
const users = ['John', 'Jane'];
const items = [1, 2, 3];
const errors = [];

// ❌ ผิด
const userList = ['John', 'Jane'];
const itemArray = [1, 2, 3];
```

## Function Naming

### ใช้ verbs สำหรับ functions

```javascript
// ✅ ถูก
function getUser() { }
function createUser() { }
function updateUser() { }
function deleteUser() { }
function validateEmail() { }
function calculateTotal() { }

// ❌ ผิด
function user() { }
function userCreate() { }
function emailValidation() { }
```

### ใช้ prefixes สำหรับ return types

```javascript
// ✅ ถูก
function getUserName() { } // returns value
function findUserById() { } // returns value or null
function hasUser() { } // returns boolean
function isUserValid() { } // returns boolean
function createUser() { } // creates and returns
function setUser() { } // sets value

// ❌ ผิด
function userName() { }
function userById() { }
function userValid() { }
```

### ใช้ handle สำหรับ event handlers

```javascript
// ✅ ถูก
function handleClick() { }
function handleSubmit() { }
function handleInputChange() { }
function handleKeyDown() { }

// ❌ ผิด
function click() { }
function submit() { }
function inputChange() { }
```

## Class Naming

### PascalCase สำหรับ classes

```javascript
// ✅ ถูก
class UserService { }
class UserRepository { }
class UserController { }
class UserValidator { }

// ❌ ผิด
class userService { }
class user_service { }
class USER_SERVICE { }
```

### ใช้ nouns สำหรับ class names

```javascript
// ✅ ถูก
class User { }
class Product { }
class Order { }
class ShoppingCart { }

// ❌ ผิด
class GetUser { }
class CreateProduct { }
class ProcessOrder { }
```

## Constant Naming

### UPPER_SNAKE_CASE สำหรับ constants

```javascript
// ✅ ถูก
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;
const HTTP_STATUS_CODES = {
  OK: 200,
  NOT_FOUND: 404
};

// ❌ ผิด
const maxRetries = 3;
const apiBaseUrl = 'https://api.example.com';
const default_timeout = 5000;
```

## Object Property Naming

### camelCase สำหรับ properties

```javascript
// ✅ ถูก
const user = {
  firstName: 'John',
  lastName: 'Doe',
  emailAddress: 'john@example.com'
};

// ❌ ผิด
const user = {
  first_name: 'John',
  last_name: 'Doe',
  email_address: 'john@example.com'
};
```

### ใช้ computed property names สำหรับ dynamic keys

```javascript
// ✅ ถูก
const key = 'name';
const obj = {
  [key]: 'John'
};

// ❌ ผิด
const obj = {};
obj[key] = 'John';
```

## File Naming

### kebab-case สำหรับ file names

```javascript
// ✅ ถูก
user-service.js
user-controller.js
api-client.js
error-handler.js

// ❌ ผิด
userService.js
user_controller.js
APIClient.js
errorHandler.js
```

### ใช้ descriptive names

```javascript
// ✅ ถูก
user-authentication-service.js
payment-processor.js
data-validation-utils.js

// ❌ ผิด
service.js
processor.js
utils.js
```

## Component Naming (React/Vue)

### PascalCase สำหรับ components

```javascript
// ✅ ถูก
const UserProfile = () => { };
const Button = () => { };
const Modal = () => { };

// ❌ ผิด
const userProfile = () => { };
const button = () => { };
const modal = () => { };
```

### ใช้ descriptive names

```javascript
// ✅ ถูก
<UserProfile />
<SubmitButton />
<ErrorModal />

// ❌ ผิด
<User />
<Button />
<Modal />
```

## Private Members

### ใช้ underscore prefix สำหรับ private members

```javascript
// ✅ ถูก
class UserService {
  constructor() {
    this._apiClient = new ApiClient();
    this._cache = new Map();
  }

  _validateUser(user) {
    // private method
  }
}

// ❌ ผิด
class UserService {
  constructor() {
    this.apiClient = new ApiClient();
    this.cache = new Map();
  }

  validateUser(user) {
    // ไม่ชัดเจนว่าเป็น private
  }
}
```

## API Naming

### RESTful API naming

```javascript
// ✅ ถูก
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id

// ❌ ผิด
GET /getUsers
GET /getUserById
POST /createUser
PUT /updateUser
DELETE /deleteUser
```

### Query parameter naming

```javascript
// ✅ ถูก
GET /users?page=1&limit=10&sort=name
GET /products?category=electronics&price_min=100

// ❌ ผิด
GET /users?p=1&l=10&s=name
GET /products?cat=electronics&min_price=100
```

## Database Naming

### snake_case สำหรับ database columns

```sql
-- ✅ ถูก
CREATE TABLE users (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email_address VARCHAR(100),
  created_at TIMESTAMP
);

-- ❌ ผิด
CREATE TABLE users (
  id INT PRIMARY KEY,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  emailAddress VARCHAR(100),
  createdAt TIMESTAMP
);
```

## Best Practices

### 1. ใช้ชื่อที่สื่อความหมาย

```javascript
// ✅ ถูก
const calculateTotalPrice = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ❌ ผิด
const calc = (x) => {
  return x.reduce((a, b) => a + b.price, 0);
};
```

### 2. หลีกเลี่ยง abbreviations

```javascript
// ✅ ถูก
const userAuthentication = () => { };
const httpResponse = () => { };
const configuration = () => { };

// ❌ ผิด
const userAuth = () => { };
const httpResp = () => { };
const config = () => { };
```

### 3. ใช้ context ที่เหมาะสม

```javascript
// ✅ ถูก
const userAge = 25;
const productPrice = 100;
const orderTotal = 500;

// ❌ ผิด
const age = 25;
const price = 100;
const total = 500;
```

### 4. หลีกเลี่ยง magic numbers

```javascript
// ✅ ถูก
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

for (let i = 0; i < MAX_RETRIES; i++) {
  await withTimeout(fetch(url), TIMEOUT_MS);
}

// ❌ ผิด
for (let i = 0; i < 3; i++) {
  await withTimeout(fetch(url), 5000);
}
```

## Common Pitfalls

### 1. ใช้ชื่อที่สั้นเกินไป

```javascript
// ❌ ผิด
const a = 1;
const b = 2;
const c = a + b;

// ✅ ถูก
const firstNumber = 1;
const secondNumber = 2;
const sum = firstNumber + secondNumber;
```

### 2. ใช้ชื่อที่ยาวเกินไป

```javascript
// ❌ ผิด
const getUserDataFromDatabaseByUserIdAndReturnAsJsonObject = (userId) => { };

// ✅ ถูก
const getUserById = (userId) => { };
```

### 3. ใช้ reserved words

```javascript
// ❌ ผิด
const class = 'User';
const function = () => { };
const return = true;

// ✅ ถูก
const className = 'User';
const myFunction = () => { };
const shouldReturn = true;
```

## References

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript#naming-conventions)
- [StandardJS Style Guide](https://standardjs.com/)
