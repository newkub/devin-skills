---
title: Security
description: best practices สำหรับ security ใน SolidJS
---

## XSS Prevention

SolidJS ป้องกัน XSS โดย default:

```jsx
// ✅ Safe - ถูก escape อัตโนมัติ
<div>{userInput}</div>

// ❌ Dangerous - ใช้ innerHTML อย่างระวัง
<div innerHTML={userInput}></div>
```

## Sanitization

ใช้ DOMPurify สำหรับ sanitization:

```bash
bun add dompurify
```

```jsx
import DOMPurify from "dompurify";

const clean = DOMPurify.sanitize(userInput);
<div innerHTML={clean}></div>
```

## Authentication

### JWT Tokens

```jsx
const [token, setToken] = createSignal(localStorage.getItem("token"));

function login(credentials) {
  return fetch("/api/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }).then((res) => res.json())
    .then((data) => {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    });
}
```

### Context for Auth

```jsx
const AuthContext = createContext();

function AuthProvider(props) {
  const [user, setUser] = createSignal(null);
  
  return (
    <AuthContext.Provider value={[user, setUser]}>
      {props.children}
    </AuthContext.Provider>
  );
}
```

## Authorization

### Route Protection

```jsx
<Show when={user()}>
  <ProtectedRoute />
</Show>

<Show when={!user()}>
  <Login />
</Show>
```

### Role-Based Access

```jsx
function AdminPanel() {
  const [user] = useAuth();
  
  return (
    <Show when={user()?.role === "admin"}>
      <AdminContent />
    </Show>
  );
}
```

## API Security

### HTTPS Always

ใช้ HTTPS สำหรับทุก API calls:

```jsx
fetch("https://api.example.com/data");
```

### CORS

ตั้งค่า CORS บน server:

```javascript
// server config
app.use(cors({
  origin: "https://yourdomain.com",
  credentials: true,
}));
```

## Environment Variables

ใช้ environment variables สำหรับ secrets:

```env
VITE_API_KEY=your-secret-key
```

```jsx
const apiKey = import.meta.env.VITE_API_KEY;
```

## Content Security Policy

ตั้งค่า CSP headers:

```javascript
// server config
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'"
  );
  next();
});
```

## ถัดไป

ดู [Testing](./testing.md) เพื่อเรียนรู้เรื่อง testing
