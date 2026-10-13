# Bun Streams & Buffer APIs

Use Bun streams APIs for stream operations

- `Bun.readableStreamTo*()` - Convert ReadableStream (toBlob, toArrayBuffer, toJSON, etc.)
- `Bun.ArrayBufferSink` - Accumulate data into ArrayBuffer
- `Bun.allocUnsafe()` - Allocate ArrayBuffer without zeroing (faster)
- `Bun.concatArrayBuffers()` - Concatenate multiple ArrayBuffers
