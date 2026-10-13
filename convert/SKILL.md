---
name: convert
description: Convert format/structure — esm, files, git submodules, scripts, svg via convert-* skills
argument-hint: "[domain]"
related:
  - refactor
  - migration-with-astgrep
  - update-references
  - run-format
  - ask-me

---

## Goal

Dispatch to the skill matching the conversion domain — the parent only routes.

## Scope

- The argument is the domain; if omitted → `/ask-me` picks the domain

## Execute

### Convert Skills

| Domain | Skill |
|---|---|
| `esm` | `/convert-esm` — CJS → ESM migration |
| `files-format` | `/convert-files-format` — convert file formats (json/yaml/toml etc.) |
| `git-submodules` | `/convert-git-submodules` — directory → git submodule |
| `scripts` | `/convert-scripts` — convert commands into runnable scripts |
| `svg` | `/convert-svg` — image → SVG conversion |
| `lang-en` | `/convert-to-lang-en` — convert output/reports to English |
| `lang-th` | `/convert-to-lang-th` — convert output/reports to Thai |

1. Identify the domain from the argument (e.g. `/convert esm`)
2. If the domain is supported → invoke the skill from the table and follow its flow
3. If the domain is missing or unknown → `/ask-me` picks the domain

## Rules

- The parent only dispatches — never duplicate the target skill's workflow
- Conversions that touch files with references → always `/update-references`

- Use /refactor if needed
- Use /migration-with-astgrep if needed
- Use /run-format if needed

## Expected Outcome

- The caller is dispatched to the skill matching the domain and converts per that skill's flow
