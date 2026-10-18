# setup-package

Package manifest setup (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) — used once at project start or when the manifest isn't publish-ready — merged from `/setup-package`

1. Detect ecosystems from manifest files — several ecosystems → handle one at a time; none → skip
2. Required fields per ecosystem:
   - Node/Bun `package.json`: `name`, `version`, `description`, `license`, `repository`, `homepage`, `files` (state what is published, e.g. `dist`, `README.md`, `LICENSE`), `exports`/`main` pointing at build output; if `private: true` → ask the user whether to release publicly
   - Rust `Cargo.toml`: `package.name`, `version`, `description`, `license`, `repository`, `categories`, `keywords`, `edition`, `rust-version`; `[[bin]]`/`[lib]` per project type; monorepo → `workspace` + `/follow-monorepo`
   - Python `pyproject.toml`: `project.name`, `version`, `description`, `license`, `readme`, `requires-python`, `classifiers`, `build-system` (setuptools/hatchling/flit), `project.scripts` if there is a CLI
   - Go `go.mod`: `module` path, `go` version; no `LICENSE`/`README.md` → recommend adding them
3. Scripts: must have `build`, `test:all`, `verify` (`verify` = `check && test` or `lint && typecheck && test`) — never add a `release` script (release goes through the `/setup-cicd` workflow or `/follow-tool-*`)
4. Missing field → have the user fill it in or use the project's defaults; run `/follow-tasks` to complete the scripts
5. Validate: `/deep-review-codebase` the manifest + `/run-verify` — fail → fix and retry ≤3
6. Monorepo: `/follow-monorepo` first; workspace packages don't need `private: false` if publishing happens at the root
7. Never publish yourself — publish via `/publish-package-to-registry` or `/run-release`
