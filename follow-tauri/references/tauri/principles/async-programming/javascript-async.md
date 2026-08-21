# JavaScript Async

## 1. Async/Await

```typescript
async function fetchData(): Promise<string> {
  const response = await fetch('https://api.example.com')
  const data = await response.json()
  return data
}
```

## 2. Promise Chaining

```typescript
fetch('https://api.example.com')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
```

## 3. Parallel Operations

```typescript
async function fetchMultiple() {
  const [a, b, c] = await Promise.all([
    fetchDataA(),
    fetchDataB(),
    fetchDataC()
  ])
  return [a, b, c]
}
```

## 4. Race Conditions

```typescript
async function raceOperations() {
  const result = await Promise.race([
    fetchWithTimeout(),
    fetchWithFallback()
  ])
  return result
}
```
