# Use Case — Persist Threads and Resume a Stream Mid-Answer

> The conversation disappears on reload, and a dropped socket loses the rest of the answer. Persistence is one server middleware plus one client option; durability is one adapter and a `GET`. Source: https://tanstack.com/ai/latest/docs/persistence/overview and https://tanstack.com/ai/latest/docs/resumable-streams/overview (accessed 2026-10-20)

## 1. Implement the two-function store contract

```ts
// src/server/persistence.ts
import { defineAIPersistence, defineMessageStore } from "@tanstack/ai-persistence";
import { sql } from "./db";

export const persistence = defineAIPersistence({
  stores: {
    messages: defineMessageStore({
      loadThread: (threadId) =>
        sql`select messages from threads where id = ${threadId}`.then(
          (rows) => rows[0]?.messages ?? [],
        ),
      saveThread: async (threadId, messages) => {
        await sql`insert into threads (id, messages)
          values (${threadId}, ${sql.json(messages)})
          on conflict (id) do update set messages = excluded.messages`;
      },
    }),
  },
});
```

The store is your tables, your columns, your schema. `memoryPersistence()` exists for local dev only — it loses everything on restart, so it cannot back a deploy.

## 2. Wrap `chat()` with the persistence middleware

```ts
// src/routes/api/chat.ts
import {
  chat,
  chatParamsFromRequest,
  memoryStream,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import { withPersistence } from "@tanstack/ai-persistence";
import { persistence } from "@/server/persistence";
import { countUsage, saveUserMessage } from "@/server/db";

export async function POST(request: Request) {
  const params = await chatParamsFromRequest(request);
  const durability = memoryStream(request);

  // null on a fresh request, non-null on a reconnect.
  if (durability.resumeFrom() === null) {
    await saveUserMessage(params.threadId, params.messages);
    await countUsage(params.runId);
  }

  const stream = chat({
    adapter: openaiText("gpt-5.5"),
    messages: params.messages,
    threadId: params.threadId,
    runId: params.runId,
    ...(params.resume ? { resume: params.resume } : {}),
    middleware: [withPersistence(persistence)],
  });

  return toServerSentEventsResponse(stream, {
    durability: { adapter: durability },
  });
}
```

`withPersistence` writes the transcript, run status, and pending approvals into the store. The `durability` adapter records every chunk to an ordered log before delivery and tags it with an offset.

## 3. Add one `GET` that does two jobs

```ts
// same route file
import {
  memoryStream,
  resumeServerSentEventsResponse,
} from "@tanstack/ai";
import { reconstructChat } from "@tanstack/ai-persistence";

export function GET(request: Request): Response | Promise<Response> {
  const durability = memoryStream(request);

  // A run is still in flight: replay its log, no model call.
  if (durability.resumeFrom() !== null) {
    return resumeServerSentEventsResponse({ adapter: durability });
  }

  // Otherwise hand back the stored thread plus a cursor to a live run.
  return reconstructChat(persistence, request, {
    authorize: async (threadId, req) => ownsThread(req, threadId),
  });
}
```

The `authorize` callback is not optional in practice: without it anyone who guesses a thread id can read the whole transcript. `reconstructChat` returns the stored messages and tells the client whether a run is still generating so it can tail it.

## 4. Pick who owns the history on the client

```tsx
// server-owned history: multi-user, multi-device
import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";

export function Chat({ threadId }: { threadId: string }) {
  const { messages, sendMessage, isLoading } = useChat({
    threadId,
    connection: fetchServerSentEvents("/api/chat"),
    persistence: true,
    history: { pageSize: 40 },
  });

  return <button onClick={() => void sendMessage("hi")}>{messages.length}</button>;
}
```

```tsx
// browser-owned history: no server store needed
import { localStoragePersistence } from "@tanstack/ai-react";

const chat = useChat({
  threadId,
  connection: fetchServerSentEvents("/api/chat"),
  persistence: localStoragePersistence(),
});
```

With `persistence: true` the client needs the `GET` from step 3. With `localStoragePersistence()`, `sessionStoragePersistence()`, or `indexedDBPersistence()` the reload is already covered and no `GET` is required. `history.pageSize` pages a long thread on hydrate instead of loading all of it.

## 5. Match the setup to the requirement

- Survive a reload, nothing more → storage adapter on the client only
- Same conversation on another device or after a server restart → steps 1, 2, 3 with `persistence: true`
- Reload mid-answer that picks the reply back up → steps 1, 2, 3
- Dropped socket with the page still open → the durability adapter alone
- Pause for a human approval and resume days later → persistence with an `interrupts` store

`memoryStream()` is single-process; production needs `durableStream(request, options)` from `@tanstack/ai-durable-stream` or another adapter implementing the same four-method contract.

## 6. Verify

1. Ask a question, let it finish, reload — the full transcript is back with the same ids
2. Reload while the answer is still streaming — the reply continues in place instead of restarting
3. Open the same thread in a second tab — both tabs show the same run
4. Drop the network for a second mid-stream — the client reconnects from the last offset and no duplicate answer appears
5. Delete the `authorize` callback and request another user's `threadId` — the response must not return that transcript
6. Kill the server process and restart — with `memoryStream()` the in-flight replay is gone; with the durable adapter it still resumes
7. Query usage rows after a reconnect — the count is one, not two

## Pitfalls

- Running the step-2 side effects before checking `resumeFrom()` — a reconnect fires them twice.
- Using `memoryStream()` in production — it only works inside one process.
- Shipping `reconstructChat` without `authorize` — thread-id guessing is a full transcript leak.
- Using `memoryPersistence()` outside development — everything is lost on restart.
- Setting `persistence: true` without adding the `GET` — the client asks for the thread and gets a 405.
- Assuming the persistence layer resumes the socket — persistence restores history, durability resumes the stream; they are separate layers.
- Expecting the replayed `GET` to keep generating if the producing host dies — the `POST` owns the run unless a takeover driver is configured.
- Trusting that `useChat` will pick a `threadId` for you — pass a stable one, or every reload creates a new thread.

## Related

- `references/apis.md`
- `best-practices/tanstack-ai.md`
- `usecases/streaming-chat.md`
- `usecases/typed-decisions.md`
