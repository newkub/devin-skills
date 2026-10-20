---
name: search
description: Cross-source search — files, GitHub stars, npm, Raindrop, MCP, skills, drive D via search-* skills
argument-hint: "[domain]"
related:
  - follow-tool-crw
  - use-astgrep
  - ask-me
  - report

---

## Goal

Dispatch to the skill for the chosen search source — the parent only routes

## Scope

- The argument is the domain; if omitted → `/ask-me` to pick a domain

## Execute

### Search Skills

| Domain | Skill |
|---|---|
| `files-patterns` | `/search-files-patterns` — search files by pattern/glob |
| `github-star` | `/search-github-star` — search within GitHub starred repos |
| `mcp` | `/search-mcp` — search MCP servers |
| `npm-libraries` | `/search-npm-libraries` — search/compare npm packages on npmx.dev (TypeScript + ESM) |
| `project-in-drive-d` | `/search-project-in-drive-d` — search projects on drive D |
| `raindrop` | `/search-raindrop` — search bookmarks via the raindrop CLI |
| `similar` | `/search-similar` — search for similar code/files |
| `skills` | `/search-skills` — search for related skills |

1. Determine the domain from the argument (e.g. `/search npm-libraries`)
2. If the domain is supported → invoke the skill from the table and follow that skill's flow
3. If no domain is given or it is unknown → `/ask-me` to pick a domain

## Rules

- The parent only dispatches — never duplicate the target skill's workflow
- If deep research is needed after finding a source → continue with `/learn-from-web` or `/deep-research`

- Use /follow-tool-crw if needed
- Use /use-astgrep if needed
- Use /report if needed

## Expected Outcome

- The caller is dispatched to the skill matching the source and searches per that flow
