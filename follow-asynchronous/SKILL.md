---
name: follow-asynchronous
description: Use async patterns in JavaScript/TypeScript correctly
argument-hint: "[scope]"
related:
  - ask-me

---

## Goal

Use asynchronous operations in JavaScript/TypeScript correctly — readable and maintainable code

## Scope

For JS/TS code that handles async/await, Promises, callbacks, the event loop, and concurrency

## Execute

### 1. Identify Async Pattern

> Goal: Identify the nature of the work

1. Determine whether tasks are sequential, parallel, or racing
2. Check dependencies between tasks
3. Decide whether cancel/retry/timeout is required
4. If unclear, use `ask-me`

### 2. Choose The Right Primitive

> Goal: Pick the API that fits the job

1. `async/await` for ordinary sequential flow
2. `Promise.all` when running in parallel and every task must succeed
3. `Promise.allSettled` when you need every result even if some fail
4. `Promise.race` for a timeout or first-responder
5. `AbortController` for cancellation

### 3. Implement Error Handling

> Goal: Handle errors in async flow

1. Use `try/catch` around `await` or `.catch()` on a Promise
2. Create a custom error class when extra context is needed
3. Use `Promise.allSettled` and filter rejected results for partial failures
4. Avoid throwing inside `.forEach` or callbacks that never await

### 4. Optimize Concurrency

> Goal: Control the number of concurrent operations

1. Use `p-limit` or `AsyncPool` to cap concurrency
2. Use queues for backpressure
3. Watch out for connection pools / rate limits
4. Use `Promise.all` only where truly necessary

### 5. Test Async Code

> Goal: Write tests for async flow

1. Use `async/await` in tests
2. Mock timers when testing timeout/debounce
3. Assert rejections with `rejects.toThrow()`
4. Run `run-test` to verify

## Rules

### 1. Avoid Callback Hell

- Use `async/await` instead of nested callbacks
- If callbacks are required, use named functions or a Promise wrapper
- Avoid deep `.then().then().catch()` chains

### 2. Always Handle Rejections

- Every Promise needs a `.catch()` or `try/catch`
- Never leave unhandled promise rejections
- Log errors at the right place

### 3. Be Explicit About Concurrency

- State whether operations run sequentially or in parallel
- Use `Promise.all` carefully to avoid excessive I/O
- Document why each pattern was chosen

## Expected Outcome

- Async code is readable and maintainable
- No callback hell or unhandled rejections
- Concurrency is controlled
- Passes tests and typecheck
