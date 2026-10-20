# Use Case — Run the API Collection as a CI Gate

> Turn the same collection developers use locally into a smoke/contract gate against a deployed environment. Source: https://docs.usebruno.com/testing/run-collection-in-cli (accessed 2026-10-20)

## 1. Job shape

```yaml
- name: API smoke
  run: |
    bun add -g @usebruno/cli
    bru run ./bruno/collection \
      --env ci \
      --env-var baseUrl="$BASE_URL" \
      --env-var email="$SMOKE_EMAIL" \
      --env-var password="$SMOKE_PASSWORD" \
      --reporter-junit ./reports/bruno.xml
  env:
    BASE_URL: ${{ secrets.SMOKE_BASE_URL }}
    SMOKE_EMAIL: ${{ secrets.SMOKE_EMAIL }}
    SMOKE_PASSWORD: ${{ secrets.SMOKE_PASSWORD }}
```

`--env-var` overrides a single variable without editing the environment file — the collection stays portable across environments.

## 2. Exit code and reports

```bash
bru run ./bruno/collection --env ci --reporter-junit ./reports/bruno.xml --reporter-json ./reports/bruno.json
```

A failed assertion returns a non-zero exit code, which is what fails the job. The JUnit file makes failures visible in the PR checks UI.

## 3. Run one folder

```bash
bru run ./bruno/collection/auth --env ci
bru run ./bruno/collection/smoke --env ci --bail
```

Split folders by concern (auth, smoke, regression) and run only what the pipeline stage needs. `--bail` stops at the first failure for fast feedback.

## 4. Gate against the environment you just deployed

```yaml
- run: bun run deploy
- run: bru run ./bruno/collection/smoke --env ci --env-var baseUrl="${{ steps.deploy.outputs.url }}"
```

Run the smoke folder after every deploy — it is the cheapest proof that the release is actually serving.

## Pitfalls

- Running the full regression collection after every deploy → minutes of CI for low signal; use the smoke folder and schedule the rest.
- No `--env-var` for credentials → the environment file must contain them, which means secrets in git.
- Assuming localhost defaults → in CI the URL must come from a variable, or every request fails with ECONNREFUSED.
- Ignoring the report → a green job with skipped tests looks like coverage that does not exist; check the counts.

## Related

- `references/cli.md`
- `best-practices/bruno-collections.md`
- `usecases/collection-with-environments-and-tests.md`
