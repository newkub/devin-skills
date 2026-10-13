# License Management — Choosing and Declaring a License Correctly

## Recommended Patterns

### Choosing a License

- `MIT` is the default for general open source — permissive, easy to understand, usable commercially
- `Apache-2.0` when you need a clear patent grant — suited to corporate/enterprise contributions
- `GPL-3.0-only`/`AGPL` when you want copyleft — derivatives must be open source too
- `BSD-3-Clause`, `ISC` are permissive alternatives; `Unlicense` for public domain
- private/unpublished project → do not create `LICENSE`; use `UNLICENSED` + `"private": true` in the manifest

### Canonical License Text

- Fetch from the GitHub Licenses API: `gh api licenses/{key} --jq .body` (e.g. `mit`, `apache-2.0`) — the text always matches canonical
- Or copy from `https://choosealicense.com/licenses/{key}/`
- Create the `LICENSE` file at the root (no extension) — GitHub/registry detect it automatically
- Edit the copyright line: `Copyright (c) <year> <holder>` — the publish year, holder = the owner/org name

### Manifest Declaration

- `package.json` → `"license": "MIT"` (SPDX expression string only); dual: `"(MIT OR Apache-2.0)"`
- `pyproject.toml` → PEP 639: `license = "MIT"` + `license-files = ["LICENSE*"]` — no legacy table
- `Cargo.toml` → `license = "MIT"` or `license-file = "LICENSE"` for non-SPDX
- The manifest value must match the `LICENSE` file — a mismatch makes audit tools warn

### Monorepo / Multi-package

- Same license for the whole repo → `LICENSE` at the root + each package manifest uses the same SPDX
- Different license per package → a `LICENSE` file in each package dir + that package's manifest
- The root `LICENSE` does not override package manifests — each package declares its own

## Do / Don't

| Do | Don't |
|---|---|
| Always an SPDX expression in the manifest | the legacy `licenses` array or `license` object (deprecated) |
| `LICENSE` at the root, no extension | `LICENSE.md`, `LICENSE.txt` (the registry may not detect them) |
| sync manifest ↔ `LICENSE` file | `"license": "MIT"` but the file is Apache |
| `UNLICENSED` + `"private": true` for private | leaving the field empty or omitting license entirely |
| Use `gh api licenses/{key}` to fetch canonical text | copying a license from another repo with the wrong year/holder |
| Changing a license needs care — require consent from the main contributors | switching permissive → copyleft without review |

## Common Pitfalls

- No `LICENSE` file + no manifest field = all rights reserved — others cannot use the code by default
- `"license": "MIT"` but no `LICENSE` file → the registry shows MIT yet there is no legal text — still okay, but the file should exist
- The legacy `license` object `{ "type": "MIT", "url": "..." }` — deprecated in package.json
- The pyproject table `license = { text = "MIT" }` — deprecated under PEP 639; use a string
- Wrong copyright holder (the template name `[fullname]` left in) — must be fixed before publish
- A license in `LICENSE` that differs from the manifest → the audit/license checker flags a conflict

## Performance Notes

- Not a runtime concern — but audit tools (`license-checker`, `license-md`) scan `LICENSE` + manifest, and matching them keeps the report clean
- `license-files = ["LICENSE*"]` in pyproject globs `LICENSE`, `LICENSE.txt`, `LICENSE.md` — the wildcard covers variants

## Ecosystem / Integration

- The `license-md` package is an old badge generator (unmaintained) — use `gh api` + manifest fields directly
- GitHub detects the license from the `LICENSE` file automatically — showing a badge in the repo header
- npm/PyPI/crates.io read the manifest `license` field — an SPDX expression is required to be filterable/searchable
- Auditing dependencies is separate — use `license-checker`, `cargo-deny`, `pip-licenses` — not this skill's scope
- `https://choosealicense.com` — a decision tree for choosing a license; `https://spdx.org/licenses` — the SPDX ID reference
