# Bruno Best Practices

Guidelines for keeping Bruno collections (`.bru` / OpenCollection) Git-native, secure, and stable in CI

## Recommended Patterns

### Collection Hygiene

- Commit the collection into the same repo as the API code — every API change shows its request/test diff in the same PR
- Organize folders by domain/resource, not by environment — environments already live in `environments/`
- Pick one format per collection: `opencollection` (YAML, new default) or `bru` (classic) — mixing makes diff/review hard
- Write tests (`assert`/`test` blocks) right in the request file — a collection without assertions cannot serve as a CI smoke test
- Use `bru import openapi` as a starting point, then curate — do not re-import over hand-edited collections because it overwrites

### Environments And Secrets

- Use `environments/*.bru` for non-secret config only (baseUrl, timeouts, public ids)
- For secrets (API keys, tokens) use `vars:secret` or a gitignored dotenv `.env` — Bruno masks secret vars in UI/logs
- In CI: inject via `--env-var KEY=$SECRET` or `--secrets-env-file` pulling from Vault/AWS/Azure/GCP — never commit secret files
- Name envs meaningfully, e.g. `staging`, `prod-readonly` — reduces the chance of hitting the wrong env

### Test Execution

- Use `--bail` in CI to fail fast when early requests break — saves time and the log is easier to read than one failure at a time
- Use `--tags`/`--exclude-tags` to split smoke vs full regression — smoke runs on every PR, full runs nightly
- Use `--tests-only` when the collection mixes in exploratory requests without assertions
- Data-driven: `--csv-file-path`/`--json-file-path` for iterations — keep fixture files in `data/` beside the collection
- Use `--iteration-count` + `--delay` for soak/rate-limit needs — do not spam the API unnecessarily

## Common Pitfalls

| Pitfall | Symptom | Avoidance |
|---|---|---|
| Secrets in `.bru` env files | credential leak in git history | use secret vars / external secrets / env injection |
| Leaving `--sandbox developer` on | scripts get full Node APIs/fs access | keep the default `safe` sandbox; switch only when truly needed |
| `--parallel` against a rate-limited API | flaky CI, 429 responses | run sequential or limit concurrency + `--delay` |
| Reporter artifacts contain secrets | tokens leak into junit/html | use `--reporter-skip-headers`/`--reporter-skip-body` flags |
| Mixed `bru` + `opencollection` files | CLI confusion, hard reviews | convert to one format via export/import |
| Pointing `--env prod` without checking | mutating requests hit production | gate prod runs with manual approval / a separate workflow |
| Collection outside the repo | tests drift from code version | always keep the collection in the same repo |

## Do / Don't

| Do | Don't |
|---|---|
| `bru run --env staging --bail --reporter-junit results.xml` in CI | run collections without a reporter — debugging failures is hard |
| tag requests (`@smoke`, `@critical`) | run the whole collection every time you only need a subset |
| pin `bru-version` in the CI action | use the latest CLI whose behavior changes between runs |
| gate the production env with approval | let a PR workflow hit the prod env directly |
| keep expected fixtures in the repo | hardcode response values in test scripts |

## Performance And CI Notes

- `usebruno/bruno-cli-action` is composite — write `run --env staging` without a leading `bru`, and it injects `--reporter-junit` automatically
- The action exposes outputs `exit-code`, `passed`, `failed` — feed PR comments / status checks directly without parsing XML
- Cache the `bru` binary via the `bru-version` input instead of `npm i -g` on every run
- `--parallel` cuts wall-clock time but increases flakiness under rate limits — use only when the API supports it
- Publish the junit report via test-reporter actions to show failures on the PR without opening logs
- Keep CI collections lean — run the slow full collection as a scheduled workflow separate from the PR gate

## Config Guidance

Recommended `bruno.json`:

```json
{
  "version": "1",
  "name": "my-api",
  "type": "collection",
  "ignore": ["node_modules", ".git"],
  "size": 10
}
```

- Set `ignore` to cover generated/temp dirs — Bruno will not parse unrelated files
- Recommended structure:

```text
collection/
├── bruno.json
├── environments/
│   ├── local.bru
│   ├── staging.bru
│   └── prod.bru          # secrets as vars:secret refs only
├── data/                  # csv/json fixtures
├── smoke/                 # tagged requests
└── <domain>/
    └── *.bru
```

- Document the env setup in the collection `README` — contributors then know which secrets to set
