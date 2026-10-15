# Bun HTTP Server APIs

| API | Description |
|-----|-------------|
| `Bun.serve()` | HTTP/HTTPS server with routing, WebSocket, TLS, cookies, error handling, and metrics; HTTP/2 support added in Bun 1.4 |
| `Bun.websocket()` | Server-side WebSocket handler (`open`/`message`/`close`/`drain`) attached via `Bun.serve({ websocket })` |
| `Bun.serve().stop()` | Gracefully stop the server (in-flight requests finish) |
