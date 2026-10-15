# Bun Streams & Buffer APIs

| API | Description |
|-----|-------------|
| `Bun.readableStreamToBlob()` / `.toArrayBuffer()` / `.toJSON()` / `.text()` / `.bytes()` | Convert a `ReadableStream` to common targets |
| `Bun.ArrayBufferSink` | `WritableStream` sink that accumulates into an `ArrayBuffer` |
| `Bun.allocUnsafe()` | Allocate an `ArrayBuffer` without zeroing (faster) |
| `Bun.concatArrayBuffers()` | Concatenate multiple `ArrayBuffer`s |
