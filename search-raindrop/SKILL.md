---
name: search-raindrop
description: Search Raindrop.io bookmarks via raindrop CLI v0.1.1 with filters and jq parsing
argument-hint: "[query]"
related:
  - list-recent-bookmark-raindrop
  - list-raindrop-favorite
  - deep-review-codebase
  - download-program
  - use-scripts

---

## Goal

Search and retrieve bookmarks from Raindrop.io quickly and accurately using the raindrop CLI (`jvm/raindrop-cli` v0.1.1)

## Scope

Use with the `raindrop` CLI only — covers authentication, `search`, `list` filters, output formats and result parsing — verified against CLI v0.1.1

## Execute

### 1. Ensure CLI Is Ready

> Goal: CLI is ready and authenticated before searching

1. Run `raindrop --version` — if missing → run `/download-program` to install
2. Run `raindrop auth status` — confirm authenticated
3. If not yet authenticated → `raindrop auth login` (OAuth flow) or `raindrop auth token <token>` for a test token — pass `RAINDROP_ACCESS_TOKEN` via env/stdin, never type it directly in a command
4. If auth is broken → fix per the error message before searching (there is no `doctor` command in v0.1.1)

### 2. Search Bookmarks

> Goal: run a search against Raindrop.io

1. Run `raindrop search "<query>"` for full-text search — by default shows the first page
2. Use `--collection <id>` (`-c`) to limit the collection — default `"0"` = all
3. Use `--all` (`-a`) to fetch every page of results — there is no `--limit`/`--page` in v0.1.1
4. Use `--json` for JSON output for scripting — use `jq` to extract fields
5. Use `--verbose` to debug the query

### 3. Use Filters

> Goal: apply filters the CLI actually supports

1. `search` flags: `--tag <tag>` (`-t`), `--type link|article|image|video|document|audio` (`-T`), `--after`/`--before YYYY-MM-DD`, `--collection`, `--all`
2. `list [<collection>]` flags: `--favorites` (`-f`), `--broken`, `--type`, `--tag`, `--search <query>`, `--sort` (default `-created`), `--all` (default first 50)
3. favorites → `raindrop list --favorites --json --all` (see `/list-raindrop-favorite`) — there is no `important:true` operator
4. broken links → `raindrop list --broken`
5. combine: `raindrop search "api" --tag typescript --type article --collection 0 --all`

### 4. Format And Parse Results

> Goal: present results in a usable form

1. default output is a table — use `--json` for machine-readable output (there is no `--human` flag)
2. extract with `jq`:
   - title: `| jq -r '.[].title'` (or `.items[].title` per the actual JSON shape — check with `jq 'keys'` first)
   - url: `| jq -r '.[].link'`
   - tags: `| jq -r '.[].tags[]?'`
   - id: `| jq -r '.[]._id'`
3. Save results to a file: `raindrop search "<query>" --json --all > results.json`
4. Count results: `raindrop search "<query>" --json --all | jq 'length'`
5. Open a bookmark in the browser: `raindrop open <id>`; copy URL: `raindrop copy <id>`; details: `raindrop get <id>`

### 5. Handle Empty Or Error Results

> Goal: verify results and troubleshoot

1. If results are empty → check the query, collection id, and auth validity
2. Verify collection ids with `raindrop collections list`
3. View available tags with `raindrop tags list`
4. If an API error occurs → read stderr and retry per the rate limit
5. Backup export: `raindrop export --format csv --all`

## Rules

### Query Syntax

- Always use double quotes around a query containing spaces
- Filters are CLI flags (`--tag`, `--type`, `--after`, `--before`) — not `key:value` operators in the query
- `--collection 0` = search everything (default)

### Output

- `--json` for scripting/`jq`; the default table for immediate reading
- `--all` to fetch every page — list defaults to only the first 50 items
- Use `jq -r` for raw string output without quotes

### Safety

- `search`/`list`/`get` are read-only — `--force`/`--no-input` apply to mutating commands (`add`, `update`, `delete`, `import`)
- Never expose `RAINDROP_ACCESS_TOKEN` in command history

### High Impact Content

- Keep only commands/flags verified against v0.1.1 — never guess syntax
- Every example must use a real, runnable query

- Use /list-recent-bookmark-raindrop if needed
- Use /list-raindrop-favorite if needed
- Use /use-scripts if needed
- Use /deep-review-codebase if needed


## Expected Outcome

- raindrop CLI v0.1.1 authenticated and ready to search
- Search results match the query and the filters the CLI actually supports
- Output can be formatted as JSON and parsed with `jq` for further use
