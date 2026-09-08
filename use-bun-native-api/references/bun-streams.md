# Bun Streams & Buffer APIs

ใช้ Bun streams APIs สำหรับ stream operations

- `Bun.readableStreamTo*()` - Convert ReadableStream (toBlob, toArrayBuffer, toJSON, etc.)
- `Bun.ArrayBufferSink` - Accumulate data into ArrayBuffer
- `Bun.allocUnsafe()` - Allocate ArrayBuffer without zeroing (faster)
- `Bun.concatArrayBuffers()` - Concatenate multiple ArrayBuffers
