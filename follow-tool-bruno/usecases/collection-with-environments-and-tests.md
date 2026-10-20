# Use Case — Collection with Environments and Tests

> Keep request definitions, environment values and assertions in the repo as plain files, reviewable in a diff. Source: https://docs.usebruno.com/bru-language/overview (accessed 2026-10-20)

## 1. A request file

```bru
meta {
  name: List users
  type: http
  seq: 1
}

get {
  url: {{baseUrl}}/users?limit=20
  body: none
  auth: bearer
}

auth:bearer {
  token: {{token}}
}

tests {
  test("status is 200", function () {
    expect(res.getStatus()).to.equal(200)
  })

  test("returns an array", function () {
    expect(res.getBody()).to.be.an("array")
  })

  test("remember the first id for the next request", function () {
    bru.setVar("firstUserId", res.getBody()[0].id)
  })
}
```

`seq` orders the collection run; `bru.setVar` shares values with later requests in the same run.

## 2. Environments

```bru
vars {
  baseUrl: http://localhost:3000
  token:
}

vars:secret [
  token
]
```

```bru
vars {
  baseUrl: https://api.example.com
}
```

Secret variables are not written into the collection file — they come from the app or the CLI.

## 3. Chain a login into subsequent calls

```bru
post {
  url: {{baseUrl}}/auth/login
  body: json
}

body:json {
  { "email": "{{email}}", "password": "{{password}}" }
}

script:post-response {
  bru.setVar("token", res.getBody().token)
}
```

## 4. Run from the CLI

```bash
bru run ./collection --env local
bru run ./collection --env ci --env-var token="$TOKEN"
```

## Pitfalls

- Committing a real token into a `vars` block → secrets in git history; mark it `vars:secret` and inject via `--env-var`.
- Relying on request order without `seq` → flaky runs; the runner follows `seq`, not the file name.
- Asserting on the body before checking the status → a 500 that returns JSON "passes" the shape test.
- `{{baseUrl}}` with a trailing slash plus a path starting with `/` → `//users`; keep one convention.

## Related

- `references/cli.md`
- `best-practices/bruno-collections.md`
- `usecases/run-collection-in-ci.md`
