# Lib Mcp Sdk CLI

SDK เองไม่มี CLI — tool ที่เกี่ยวข้องคือ `@modelcontextprotocol/inspector` สำหรับ test/debug servers

## Install

```sh
# ไม่ต้องติดตั้ง — รันผ่าน bunx/npx ได้เลย
bunx @modelcontextprotocol/inspector <command>
```

## Commands

| Command | Description | Options |
|---|---|---|
| `bunx @modelcontextprotocol/inspector bun run server.ts` | เปิด Inspector UI ชี้ไปที่ server entry (stdio) | - |
| `bunx @modelcontextprotocol/inspector npx <pkg>` | Inspect npm-distributed server | - |
| `bunx @modelcontextprotocol/inspector` + connect URL | เชื่อม remote Streamable HTTP server | - |

## Examples

```sh
bunx @modelcontextprotocol/inspector bun run src/server.ts
# เปิด browser UI — list tools, call tool, read resource, inspect messages
```

- Inspector คือวิธีมาตรฐาน smoke-test MCP server ก่อน register กับ clients — ดู [routes](routes.md)
