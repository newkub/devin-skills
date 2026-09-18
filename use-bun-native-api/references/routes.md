# Bun API Reference Route Map

- Website: <https://bun.com>
- API Reference: <https://bun.com/reference> (generated from source — verified 2026-09-18)
- Guides docs: <https://bun.com/docs> (full route map lives in `follow-lang-bun/references/routes.md`)

## API Namespaces (/reference/bun/*)

- /reference/bun/$ — shell template
- /reference/bun/serve — `Bun.serve`
- /reference/bun/file — `Bun.file`, `Bun.write`
- /reference/bun/spawn, /reference/bun/spawnSync — child processes
- /reference/bun/build — `Bun.build`
- /reference/bun/sql — `Bun.sql` (SQLite/Postgres/MySQL)
- /reference/bun/s3 — `Bun.s3`
- /reference/bun/redis — `Bun.redis`
- /reference/bun/Image — `Bun.Image` (v1.4)
- /reference/bun/WebView — `Bun.WebView` (v1.4, experimental)
- /reference/bun/markdown — `Bun.markdown` (v1.4)
- /reference/bun/cron — `Bun.cron` (v1.4)
- /reference/bun/Terminal — `Bun.Terminal` (v1.4)
- /reference/bun/hash, /reference/bun/CryptoHasher, /reference/bun/password
- /reference/bun/gzipSync, /reference/bun/deflateSync, /reference/bun/Archive
- /reference/bun/ArrayBufferSink, /reference/bun/readableStreamTo*
- /reference/bun/env, /reference/bun/sleep, /reference/bun/gc, /reference/bun/version
- /reference/bun/Glob, /reference/bun/semver, /reference/bun/color
- /reference/bun/secrets, /reference/bun/CSRF
- /reference/bun/ffi (`bun:ffi`), /reference/bun/jsc (`bun:jsc`)
- /reference/bun/plugin, /reference/bun/Transpiler
- /reference/bun/test (`bun:test`), /reference/bun/sqlite (`bun:sqlite`), /reference/bun/worker_threads

## Node.js Compat (/reference/node/*)

- `/reference/node/fs`, `/reference/node/path`, `/reference/node/http`, `/reference/node/crypto` ฯลฯ — Node.js 26.3.0 compat layer

## Docs Pages Per Category

- HTTP server: /docs/runtime/http/{server,routing,cookies,tls,error-handling,metrics}
- Shell/process: /docs/runtime/{shell,child-process,webview,cron}
- File/data: /docs/runtime/{file-io,streams,binary-data,archive,sql,sqlite,s3,redis}
- Networking: /docs/runtime/{fetch→networking/fetch,http/websockets,networking/{tcp,udp,dns}}
- Utilities: /docs/runtime/{toml,yaml,markdown,json5,xml,jsonl,html-rewriter,image,hashing,glob,semver,color,utils,secrets,csrf,console}
- Interop: /docs/runtime/{node-api,ffi,c-compiler,transpiler,workers,module-graph}
- Standards: /docs/runtime/{globals,bun-apis,web-apis,nodejs-compat}
