# Error Handling - Bun

## Overview

Bun รองรับ error handling patterns ที่คล้ายกับ Node.js แต่มี optimizations และ features เพิ่มเติม

## Try-Catch

```typescript
try {
  const data = await Bun.file("data.json").json()
  console.log(data)
} catch (error) {
  console.error("Failed to read file:", error)
}
```

## Async Error Handling

### Promise Rejection

```typescript
fetch("https://api.example.com")
  .then(response => response.json())
  .catch(error => console.error("Fetch failed:", error))
```

### Async/Await

```typescript
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Fetch failed:", error)
    throw error
  }
}
```

## Global Error Handlers

```typescript
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error)
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection:", reason)
})
```

## HTTP Error Handling

```typescript
Bun.serve({
  port: 3000,
  async fetch(request) {
    try {
      const url = new URL(request.url)
      if (url.pathname === "/api") {
        const data = await fetchData()
        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" }
        })
      }
      return new Response("Not Found", { status: 404 })
    } catch (error) {
      return new Response("Internal Server Error", { status: 500 })
    }
  }
})
```

## Best Practices

- Always handle errors - ใช้ try-catch สำหรับ async operations
- Log errors - บันทึก errors สำหรับ debugging
- Provide meaningful error messages - อธิบายสิ่งที่ผิดพลาด
- Use TypeScript - ช่วย catch errors ที่ compile time
- Handle edge cases - network failures, file not found, ฯลฯ
