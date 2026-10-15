# Scalar API Docs Best Practices

## Recommended Patterns

- Use the OpenAPI spec as the single source of truth — docs, mock server, and validation all derive from one spec
- Keep `openapi.yaml` in the same repo as the source code — the spec changes with the code through the same PR
- Add `description`, `examples`, and `deprecated` to every operation/schema — Scalar renders these as the main documentation
- Group endpoints with `tags` and add `tags[].description` for a readable sidebar
- Define `servers` for every environment (dev, staging, prod) — the playground sends requests to the selected server
- Use `securitySchemes` to describe real auth (bearer, apiKey, oauth2) — the playground accepts credentials for testing
- Split the spec into multiple files with `$refs`, then run `document bundle` before publishing/CI
- Use `document mock --watch` while the frontend is in development — work continues even before the backend is done

## Common Pitfalls

- Editing generated docs directly — they get overwritten on regenerate; fix the spec only
- `$refs` pointing at local files while publishing the raw spec — consumers cannot open them; bundle first
- A spec without examples — the mock server generates unrealistic random responses
- Hardcoding API keys/secrets into the spec or config — use environment variables instead
- One giant spec file of thousands of lines — hard to review; split with `$refs` from the start
- Forgetting `document validate` before commit — a broken spec passes and the docs pipeline fails later
- A mock server without `--watch` — after editing the spec the mock still serves the old version

## Do / Don't

| Do | Don't |
|----|-------|
| validate + lint the spec in CI on every PR | commit a spec that hasn't passed `document validate` |
| bundle `$refs` before deploying docs | publish a spec that references external files |
| Use a mock server for dev and contract testing | Use the mock instead of testing the real API |
| Keep the scalar config in the repo with review | Keep credentials in a config file |
| Add `proxyUrl` when the playground hits CORS | Disable CORS on the API side so the playground can send requests |

## Config Guidance

- Use `scalar.config.json` or `scalar.config.ts` at the root — set `title`, `theme`, `layout`, `proxyUrl`
- Set `proxyUrl` when the API is on a different origin than the docs — playground requests won't hit CORS
- Use env vars (`SCALAR_PORT`, `SCALAR_API_URL`) for values that differ per environment — never hardcode
- Embed mode (`@scalar/api-reference`) fits docs inside an existing app; CLI/registry fits a standalone docs site
- Hide unrelated clients/languages through config instead of forking the theme

## Performance & CI

- CI pipeline: `document validate` → `document lint` → `document bundle` → build/deploy docs — every step fails fast before deploy
- Run validation only on PRs that touch the spec (path filter) — saves CI time
- Static output deploys to GitHub Pages/Cloudflare Pages — no server needed
- A mock server in CI is for contract tests — start mock → run API tests → kill; never leave the process running
- Large docs site: pre-bundle the spec in CI instead of letting the browser resolve `$refs` at runtime
