# Bun Web-Standard APIs

Bun implements these Web standards natively — prefer them over `Bun.*` when portability (Node, browsers, edge runtimes) matters; all are drop-in, no polyfills.

| API | Description |
|-----|-------------|
| `fetch()` | Web-standard HTTP client (`Request`/`Response`/`Headers`) |
| `WebSocket` | Client WebSocket constructor |
| `ReadableStream` / `WritableStream` / `TransformStream` | Streams API |
| `Blob` / `File` | Blob and File constructors |
| `FormData` / `URLSearchParams` | Form and query-string encoding |
| `URL` / `URLPattern` | URL parsing and route matching |
| `TextEncoder` / `TextDecoder` | UTF-8 and other encoding conversion |
| `AbortController` / `AbortSignal` | Cancellation semantics (timeout via `AbortSignal.timeout()`) |
| `structuredClone()` | Deep clone of structured data |
| `EventTarget` / `CustomEvent` | Event dispatch model |
| `crypto.getRandomValues()` / `crypto.subtle` | WebCrypto — random values, sign/verify, digest |
| `CompressionStream` / `DecompressionStream` | gzip/deflate streaming compression |
| `Worker` | Web Workers |
| `performance.now()` / `PerformanceObserver` | Performance measurement |
| `navigator` | User-agent/platform info (subset) |
