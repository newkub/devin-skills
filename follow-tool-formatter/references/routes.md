# Tool Formatter Routes / Topics

Skill นี้เป็น generic formatter guide — routes ด้านล่างรวม docs ของ formatter ที่ใช้บ่อยตาม tech stack

## Prettier (prettier.io)

| Route / Topic | URL |
|---|---|
| Install / getting started | https://prettier.io/docs/install |
| Configuration (`.prettierrc`) | https://prettier.io/docs/configuration |
| Options | https://prettier.io/docs/options |
| Ignore (`.prettierignore`) | https://prettier.io/docs/ignore |
| CLI | https://prettier.io/docs/cli |
| Integrating with linters | https://prettier.io/docs/integrating-with-linters |
| Pre-commit hook | https://prettier.io/docs/precommit |

## Biome (biomejs.dev)

| Route / Topic | URL |
|---|---|
| Formatter | https://biomejs.dev/formatter/ |
| Configuration (`biome.json`) | https://biomejs.dev/reference/configuration/ |
| CLI reference | https://biomejs.dev/reference/cli/ |

## dprint (dprint.dev)

| Route / Topic | URL |
|---|---|
| Setup | https://dprint.dev/setup/ |
| Configuration (`dprint.json`) | https://dprint.dev/config/ |
| CLI | https://dprint.dev/cli/ |
| Plugins | https://dprint.dev/plugins/ |

## Others

| Tool | URL |
|---|---|
| rustfmt config (`rustfmt.toml`) | https://rust-lang.github.io/rustfmt/ |
| ruff format | https://docs.astral.sh/ruff/formatter/ |
| gofmt | https://pkg.go.dev/cmd/gofmt |

## Key Concepts

- `format` script = write mode; `format:check` / `--check` = CI gate (exit != 0 เมื่อมีไฟล์ยังไม่ format)
- ใช้ ignore file ของแต่ละ tool (`.prettierignore`, `biome.json` `files.includes`, `dprint.json` `excludes`) กัน generated/vendored files
- git hooks สำหรับ format-on-staged: repo ที่มี `.moon/workspace.yml` → moon `vcs.hooks`; repo อื่น → `/follow-tool-hk`
