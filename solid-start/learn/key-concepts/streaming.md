# Streaming

## แนวคิดหลัก

Streaming ใน SolidStart ช่วยให้สามารถ stream HTML และ data ไปยัง client แบบ progressive ซึ่งปรับปรุง Time to First Byte (TTFB) และ user experience โดยรวม

## Streaming Types

### 1. HTML Streaming

Stream HTML จาก server:

```typescript
// routes/index.tsx
export default function Home() {
  return (
    <main>
      <Header />
      <Suspense fallback={<Loading />}>
        <Content />
      </Suspense>
      <Footer />
    </main>
  );
}
```

**Flow:**
```
Server → Stream Header → Stream Content → Stream Footer → Client
```

### 2. Data Streaming

Stream data จาก API:

```typescript
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      for (const item of data) {
        controller.enqueue(JSON.stringify(item) + "\n");
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/json" }
  });
}
```

### 3. Component Streaming

Stream components ด้วย Suspense:

```typescript
export default function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <HeavyComponent />
      </Suspense>
      <Footer />
    </div>
  );
}
```

## Suspense and Streaming

### Basic Suspense

ใช้ Suspense สำหรับ streaming:

```typescript
import { Suspense } from "solid-js";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncComponent />
    </Suspense>
  );
}
```

### Nested Suspense

ใช้ multiple Suspense boundaries:

```typescript
export default function Page() {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <Suspense fallback={<ContentSkeleton />}>
        <Content />
      </Suspense>
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
}
```

### Progressive Loading

Load content แบบ progressive:

```typescript
export default function BlogPost() {
  return (
    <article>
      <h1>Post Title</h1>
      <Suspense fallback={<p>Loading content...</p>}>
        <PostContent />
      </Suspense>
      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments />
      </Suspense>
    </article>
  );
}
```

## Server-Side Streaming

### Stream Response

Stream response จาก server:

```typescript
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const chunks = ["Hello", " ", "World", "!"];
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" }
  });
}
```

### Stream JSON

Stream JSON data:

```typescript
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const data = await fetchLargeDataset();
      for (const item of data) {
        controller.enqueue(encoder.encode(JSON.stringify(item) + "\n"));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson" }
  });
}
```

## Client-Side Streaming

### Consume Stream

Consume stream บน client:

```typescript
export default function DataStream() {
  const [data, setData] = createSignal<string[]>([]);

  onMount(async () => {
    const response = await fetch("/api/stream");
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const text = decoder.decode(value);
      setData(prev => [...prev, text]);
    }
  });

  return (
    <ul>
      <For each={data()}>
        {(item) => <li>{item}</li>}
      </For>
    </ul>
  );
}
```

### Stream with Resource

ใช้ createResource สำหรับ streaming:

```typescript
export default function DataStream() {
  const [stream] = createResource(async () => {
    const response = await fetch("/api/stream");
    return response.body;
  });

  return (
    <Suspense fallback={<Loading />}>
      <Show when={stream()}>
        {(body) => <StreamConsumer body={body()} />}
      </Show>
    </Suspense>
  );
}
```

## Streaming Patterns

### Chunked Transfer

ใช้ chunked transfer encoding:

```typescript
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const chunks = await generateChunks();
      for (const chunk of chunks) {
        controller.enqueue(chunk);
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Transfer-Encoding": "chunked" }
  });
}
```

### Server-Sent Events (SSE)

ใช้ SSE สำหรับ real-time updates:

```typescript
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send events
      sendEvent({ type: "message", data: "Hello" });
      
      // Keep connection open
      setInterval(() => {
        sendEvent({ type: "ping" });
      }, 30000);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
```

### Progressive Image Loading

Stream images:

```typescript
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const image = await fetchImage();
      const chunks = splitIntoChunks(image, 1024);
      
      for (const chunk of chunks) {
        controller.enqueue(chunk);
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "image/jpeg" }
  });
}
```

## Performance Benefits

| Benefit | คำอธิบาย |
|---------|-----------|
| **Faster TTFB** | ส่ง HTML แรกทันที |
| **Progressive Rendering** | Render ทีละส่วน |
| **Better UX** | User เห็น content เร็วขึ้น |
| **Lower LCP** | Largest Contentful Paint ดีขึ้น |
| **Reduced Blocking** | ไม่ block main thread |

## Streaming Configuration

### Enable Streaming

Streaming เปิดโดย default ใน SolidStart:

```typescript
// app.config.ts
export default defineConfig({
  ssr: true,
  streaming: true, // Enable streaming
});
```

### Disable Streaming

ปิด streaming สำหรับ specific routes:

```typescript
export const routeConfig = {
  streaming: false,
};
```

## Error Handling in Streaming

### Stream Errors

Handle errors ใน streams:

```typescript
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (const item of data) {
          controller.enqueue(item);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });

  return new Response(stream);
}
```

### Client Error Handling

Handle stream errors บน client:

```typescript
onMount(async () => {
  try {
    const response = await fetch("/api/stream");
    const reader = response.body?.getReader();

    while (true) {
      const { done, value, error } = await reader!.read();
      if (error) throw error;
      if (done) break;

      // Process value
    }
  } catch (error) {
    console.error("Stream error:", error);
  }
});
```

## Best Practices

| Practice | คำอธิบาย |
|----------|-----------|
| **Use Suspense** | ใช้ Suspense สำหรับ streaming |
| **Chunk wisely** | Chunk ขนาดเหมาะสม |
| **Handle errors** | Handle stream errors |
| **Monitor performance** | Monitor streaming performance |
| **Test thoroughly** | Test streaming behavior |

## Common Use Cases

### Large Data Sets

Stream large data sets:

```typescript
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const query = database.query("SELECT * FROM large_table");
      
      for await (const row of query) {
        controller.enqueue(JSON.stringify(row) + "\n");
      }
      
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson" }
  });
}
```

### Real-Time Updates

Stream real-time updates:

```typescript
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      const eventSource = new EventSource("/api/events");
      eventSource.onmessage = (event) => {
        controller.enqueue(encoder.encode(`data: ${event.data}\n\n`));
      };
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" }
  });
}
```

### File Downloads

Stream file downloads:

```typescript
export async function GET() {
  const file = await getFile();
  const stream = file.stream();

  return new Response(stream, {
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `attachment; filename="${file.name}"`
    }
  });
}
```
