# Output Format — tables in website.md / api.md / cli.md

Every file starts with a heading + a generated-by note (never edit by hand — re-run instead). Every table is deduped and sorted with `localeCompare(..,'en')` over columns left→right, so the output is deterministic.

## website.md

The `## Routes` section from `crw map <url> --format json`:

| Column | Meaning |
|---|---|
| URL | the full URL the map found |
| Path | pathname relative to base (e.g. `/docs/intro`) |
| Segments | path split by ` / `, or `(root)` for `/` |
| Depth | number of segments (`/` = 0) |

## api.md

### `## Dependencies`

From `package.json` (dependencies/devDependencies/peerDependencies) and every `Cargo.toml` ([dependencies]/[dev-dependencies])

| Column | Meaning |
|---|---|
| Package | dependency name |
| Version | version string (Cargo's clap table extracts the `version` value; an inline table with no version → `(inline)`) |
| Source | manifest file + section, e.g. `package.json (devDependencies)` |
| Language | `node/ts` or `rust` |

### `## Exported Symbols`

ast-grep patterns in `api.ts` (`TS_SYMBOL_PATTERNS`, `RUST_SYMBOL_PATTERNS`):

| Column | Meaning |
|---|---|
| Symbol | name captured from the metavar `$N` |
| Kind | function/class/interface/type/const, or fn/struct/enum/trait |
| File | path relative to `--root` in POSIX form (includes `.d.ts`) |
| Line | 1-based |

### `## Endpoints`

- ts/tsx: patterns `$R.$M($P, $$$)` and `$R.$M($P)` — filtered on two levels: method ∈ get/post/put/delete/patch/head/options and path starting `/`
- rust: pattern `#[<method>($P)]` per method (axum-style attrs)

| Column | Meaning |
|---|---|
| Method | HTTP method uppercase |
| Path | route path (unquoted), e.g. `/users/:id` |
| File / Line | source location |

## cli.md

### `## Commands`

- ts: `$A.command($N)` + `$A.command($N, $$$)` (commander/claude/yargs-like)
- rust: a struct ending in `Args|Opts|Options|Command|Cmd` → command name = strip the suffix then kebab (Kind keeps the original struct name); `$A.subcommand($$$)` → a `(subcommand)` builder row

| Column | Meaning |
|---|---|
| Command | command name (kebab) |
| Kind | `command` / `clap group (ServeArgs)` / `clap builder` |
| File / Line | source location |

### `## Flags`

- ts: `$A.option($N)` and `$A.option($N, $$$)` → Flag = the first token of the option string (e.g. `--port`)
- rust: `#[arg($$$)]` → read the field name from the next line that isn't an attr/comment → `--<kebab-field>`; Definition = the whole attr line

| Column | Meaning |
|---|---|
| Flag | flag name |
| Definition | the truncated source context line (≤120 chars) |
| File / Line | source location |

## Extending

To add a language: edit `LANGS` in `langs.ts`, then add patterns in `api.ts`/`cli.ts` following the existing structure — probe patterns against a fixture first (`/use-astgrep`)
