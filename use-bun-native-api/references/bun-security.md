# Bun Security APIs

| API | Description |
|-----|-------------|
| `Bun.CSRF.generate()` / `Bun.CSRF.verify()` | CSRF token generation and verification |
| `Bun.CSRF.unsafe` | Low-level CSRF operations (double-submit style) |
| `Bun.secrets` | Encrypted secrets store (keypair + seal/unseal) — verify current API via `/deep-research` |
| `HTMLRewriter` | Streaming HTML transformation (Cloudflare Workers-compatible) |
