# Use Case — Discover Libraries and Read Docs From the Terminal

> Resolve which TanStack library and docs page apply to a task without leaving the shell or trusting a stale blog post. Source: https://tanstack.com/cli/latest/docs/cli-reference (accessed 2026-10-20)

## 1. List the libraries by group

```bash
bunx @tanstack/cli libraries
bunx @tanstack/cli libraries --group state --json
```

`--group` accepts `state`, `headlessUI`, `performance`, and `tooling`. Use the plain listing when a human is choosing, and `--json` when a script needs to map a task to a library id.

## 2. Search the docs for the concept

```bash
bunx @tanstack/cli search-docs "server functions" --library start
bunx @tanstack/cli search-docs loaders --library router --framework react --json
```

`--library` narrows to one package, `--framework` narrows to one adapter, and `--limit` caps the number of results (default 10, max 50). Search first when the exact page path is unknown.

## 3. Fetch the page

```bash
bunx @tanstack/cli doc router framework/react/guide/data-loading
bunx @tanstack/cli doc query framework/react/overview --docs-version v5 --json
```

The path is `<framework>/<area>/<page>` under the library. `--docs-version` defaults to `latest`; pass a version tag when the project is pinned to an older major.

## 4. Check ecosystem recommendations

```bash
bunx @tanstack/cli ecosystem --category database
bunx @tanstack/cli ecosystem --library router --json
```

`ecosystem` lists partner recommendations by category or by TanStack library. Treat them as candidates to evaluate, not as required dependencies — each one still has to pass your own comparison.

## 5. Feed the result into the task

1. Read the fetched page before writing code; the `latest` docs track the current major
2. Cross-check the API names against the installed version in `package.json`
3. Use `--json` output in scripts so the page path and content are addressable
4. Cite the page URL in the change description when the implementation follows a documented pattern

## Verify

- The library id from `libraries` matches the package actually installed
- The `doc` page renders the API you plan to call, not a removed one
- `--docs-version` matches the installed major when the project is pinned
- Any ecosystem pick was evaluated, not accepted by default

## Pitfalls

- Searching with a bare keyword and reading the first hit — pass `--library` so the result belongs to the package in use.
- Reading `latest` docs while the project is pinned to an older major; the API may already be renamed.
- Treating `ecosystem` output as a dependency decision; it is a recommendation list.
- Hardcoding a docs path in automation; paths move between versions, so resolve them with `search-docs` first.
- Running the CLI through an old global install; use `bunx @tanstack/cli` so the catalog and docs match the current release.

## Related

- `references/cli.md`
- `references/apis.md`
- `best-practices/tanstack-cli.md`
- `usecases/scaffold-with-add-ons.md`
