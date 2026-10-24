# Use Case — Wire Frontend, Backend, And Docker Services

Replacing hard-coded ports with named routes that any process can look up at runtime

## Start each service with a name

```bash
portless web pnpm --dir apps/web dev      # https://web.localhost
portless api pnpm --dir apps/api start    # https://api.localhost
```

Subdomain naming works too when one app owns several roles:

```bash
portless api.myapp pnpm start             # https://api.myapp.localhost
```

## Route to something portless did not start

Databases, queues, and containers already own a port — point a name at it once:

```bash
portless alias my-postgres 5432
portless alias redis 6379
portless alias mailhog 8025
```

Aliases persist across sessions. If the name is already taken by another process, `--force` takes it over — that terminates the current owner, so only use it deliberately.

## Consume the names

Never write `localhost:3000` anywhere. Resolve at runtime:

```bash
# shell / CI
BACKEND_URL=$(portless get api)

# .env generation
DATABASE_URL="postgres://app:app@$(portless get my-postgres)/app"

# frontend dev server
VITE_API_URL=https://api.localhost pnpm dev
```

Inside the app, read the injected `PORTLESS_URL` for its own public origin, and `PORT` for its bind port. Child Node processes get `NODE_EXTRA_CA_CERTS` already pointing at the portless CA, so HTTPS calls between services validate without extra setup.

## Typical layout

| No. | Service | Started by | Name | URL |
|---|---|---|---|---|
| 1 | web | `portless` | `web` | `https://web.localhost` |
| 2 | api | `portless` | `api` | `https://api.localhost` |
| 3 | postgres | Docker | `my-postgres` | `https://my-postgres.localhost` |
| 4 | redis | Docker | `redis` | `https://redis.localhost` |
| 5 | docs | `portless` | `docs` | `https://docs.localhost` |

## Gotchas

- An alias is a fixed pointer — if the container changes port, `portless alias --remove my-postgres` and re-create it.
- CORS must allow the `https://<name>.localhost` origin, not `http://localhost:<port>`.
- A 502 from the proxy means the route exists but the app is not answering; check the body for the hint and the app log for the crash.

## Verify

```bash
portless list
curl -fsS "$(portless get api)/health"
```

Source: https://portless.sh/ (accessed 2026-10-24)
