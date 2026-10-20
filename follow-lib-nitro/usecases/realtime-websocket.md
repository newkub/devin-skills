# Use Case — Realtime WebSocket (Chat & Rooms)

> Bidirectional realtime with CrossWS: presence, pub/sub topics, and per-room namespaces. Source: https://nitro.build/docs/websocket (accessed 2026-10-20)

## Enable WebSocket

```ts [nitro.config.ts]
import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  features: {
    websocket: true,
  },
});
```

## Handler = a route file

A WebSocket handler is exported from a normal route file and follows file-based routing. `routes/rooms/[room].ts` handles the socket at `/rooms/:room`.

```ts [routes/chat.ts]
import { defineWebSocketHandler } from "nitro";

export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe("chat");
    peer.publish("chat", { system: `${peer} joined the chat` });
    peer.send({ system: "Welcome to the chat!" });
  },
  message(peer, message) {
    peer.publish("chat", { user: peer.toString(), text: message.text() });
    peer.send({ user: "You", text: message.text() }); // echo to sender
  },
  close(peer) {
    peer.publish("chat", { system: `${peer} left the chat` });
  },
});
```

> `peer.publish(topic, data)` reaches every subscriber **except** the publishing peer; use `peer.send()` to also answer the sender.

## Authenticate on upgrade

Reject the handshake before a connection exists and attach per-peer context:

```ts [routes/chat.ts]
import { defineWebSocketHandler } from "nitro";

export default defineWebSocketHandler({
  upgrade(request) {
    const token = new URL(request.url).searchParams.get("token");
    if (!isValidToken(token)) {
      throw new Response("Unauthorized", { status: 401 });
    }
    return { context: { userId: getUserId(token) } };
  },
  open(peer) {
    console.log("User connected:", peer.context.userId);
  },
});
```

## Rooms via namespaces

The default namespace is the request pathname, so a dynamic route isolates rooms automatically — `/rooms/game` peers can't see `/rooms/lobby`. To group by a query param instead, return `namespace` from `upgrade`:

```ts
upgrade(request) {
  const channel = new URL(request.url).searchParams.get("channel") || "general";
  return { namespace: `chat:${channel}` };
}
```

## Peer API (verified)

| Member | Purpose |
|---|---|
| `peer.id` / `peer.namespace` / `peer.context` | identity + upgrade context |
| `peer.send(data)` | message this peer (string/object/bytes) |
| `peer.subscribe(topic)` / `unsubscribe(topic)` | join/leave a topic |
| `peer.publish(topic, data)` | broadcast to a topic (excluding sender) |
| `peer.close(code?, reason?)` / `terminate()` | graceful / hard disconnect |
| `message.text()` / `.json<T>()` / `.uint8Array()` | read inbound frame |

Client side uses the browser `WebSocket` API (`new WebSocket("ws://host/chat")`).

## Pitfalls

- Forgetting `features.websocket: true` → the upgrade never handled.
- Broadcasting with `peer.publish` and expecting the sender to receive it → it does not; add `peer.send`.
- Relying on a single instance's peer list across many serverless instances → publish only reaches peers in the same instance/namespace; cross-instance fan-out needs the platform adapter or an external pub/sub.
- Doing auth inside `open` instead of `upgrade` → the connection is already established before you reject it.
- One-way notifications → use SSE (`sse-streaming.md`) instead of a full WebSocket.
