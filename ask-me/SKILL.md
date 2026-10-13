---
name: ask-me
description: Ask the user with options and a recommendation; supports multi-select, multi-step, tech stack
argument-hint: "[question]"
allowed-tools:
  - ask_user_question
  - read
  - skill
  - todo_write
related:
  - ask-project-requirement
  - follow-my-persona
  - follow-your-suggestion
  - ask-again
  - dont-ask-me
  - update-references
  - plan
  - search-skills

---

## Goal

Ask the user a question with predefined options and a recommendation (recommended) to get confirmation, choose among alternatives, or request more information. Supports single-select, multi-select, multi-step flows, and tech stack questions

## Scope

Use for general questions that need an option-based answer, not for gathering requirements (use `/ask-project-requirement`) and not for interviewing preferences (use `/follow-my-persona`)

Supports tech stack questions such as runtime, language, framework, library, database, test tool, deploy target, CI tool, and package manager

Use the `ask_user_question` tool only; no other way of asking the user is allowed

## Execute

### 1. Identify Question Type And Flow

> Goal: Identify the question type and the multi-step structure

1. Analyze what kind of answer is needed: `single`, `multiselect`, `text`, `confirm`
2. If answers are needed across several topics → design a `multi-step` flow split into steps
3. Each step consists of 1-4 questions, with one `ask_user_question` call per step
4. For `confirm`, offer yes/no or proceed/abort options
5. For `single`, offer 2-4 options and the user picks one
6. For `multiselect`, offer 2-4 options and the user can pick several; set `multi_select: true`
7. For `text`, let the user answer freely without forcing options

### 2. Prepare Multi-Step Questions

> Goal: Prepare the questions, options, and recommendation for each step

1. Split the questions into steps in the order they must be asked
2. Each step has 1-4 questions, and each question has 2-4 options
3. Every option needs a concise `label` and a `description` with the details
4. Mark the recommended option with a visual marker prefixed to the `label`, e.g. `✨ Continue with /plan` or `(recommended) Continue with /plan`, and explain the reason in `description`
5. Set `multi_select: true` for questions that allow multiple choices
6. Don't add an "other" option, since the user can always answer in their own words
7. The options must cover every plausible case
8. Order the options with the recommended one first
9. Add a `Skip` option so the user can bypass this question — `description`: "Skip this question; use the default or continue without answering"
10. Add a `Suggest another` option so the user can request different choices — `description`: "Ask the AI to suggest other options not on the list"

### 3. Ask With `ask_user_question`

> Goal: Send the questions to the user

1. Write the `question` clearly and concisely with enough context
2. Send 1-4 questions at once in `ask_user_question` for each step
3. Send `options` with `label`, `description`, and `multi_select: true/false`
4. For multi-step, ask the next step after processing the current step's answers

### 4. Process Multi-Step Response

> Goal: Process the user's answers in a multi-step flow

1. Pair each question with its answer from the mapping `ask_user_question` returns
2. If `multi_select: true` → `selected` is an array and may contain multiple labels
3. If `multi_select: false` → `selected` contains a single label
4. If the user answered in their own words (custom_text), analyze it and adjust the plan accordingly
5. If the user picks `Skip`, continue using the default or skipping that step
6. If the user picks `Suggest another`, offer 2-4 new options that don't repeat the old ones
7. If there is a next step → ask it
8. When the multi-step flow is done → summarize all answers and proceed
9. Never re-ask a question the user has already answered

### 5. Tech Stack And Tool Questions

> Goal: Support questions about tech stack, runtime, framework, library, and tools

1. Analyze which kind of technology the question is about: `runtime`, `language`, `framework`, `library`, `database`, `test-tool`, `deploy-target`, `ci-tool`, `package-manager`
2. Use `follow-lang-*`, `follow-framework-*`, `follow-tool-*`, `follow-lib-*`, `follow-service-*` to build the options and recommendations
3. Reference project manifests (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`) and conventions to determine the defaults and recommendations
4. If the tech stack is complex → split into multi-step: `runtime` → `language` → `framework` → `library` → `deploy-target`
5. The recommended option must state a technical reason, e.g. "Bun uses native APIs and is faster than Node.js in this project"
6. If a map of skills by tech stack or task is needed, run `/search-skills`

## Rules

### 1. When To Ask

Ask the user when:

- There is a decision to make and it is unclear what the user wants
- Direction needs to be confirmed before proceeding
- There is not enough information to proceed correctly
- Several approaches are possible and the user should choose

### 2. When Not To Ask

Don't ask the user when:

- The answer is obvious from context or memory
- It is requirement gathering (use `/ask-project-requirement`)
- It is a preferences interview (use `/follow-my-persona`)
- The action is low-risk and can just be done
- The user or workflow specifies `/dont-ask-me`

### 3. Question Design

- Keep questions short with enough context
- Use language the user understands; avoid jargon
- Avoid questions that cause confusion or ambiguity
- Details on options, multi_select, and multi-step are already in Execute #2; not repeated here
- For multi-step, tell the user which step number this is

### 4. Recommendation

- Every question must have at least one recommended option
- Mark the recommended option with a visual marker prefixed to the `label`, e.g. `✨`, `⭐`, `👍`, or the text `(recommended)`
- If the user or context doesn't want emoji, use `(recommended)` instead
- Don't create a separate `recommended` option
- Explain in `description` why this option is recommended
- Recommendations must be grounded in context, best practices, or project conventions
- If several options are roughly equally good, make the simplest one the recommended choice

### 5. Interaction Patterns

- multi-step: ask 1-4 questions per step, wait for answers, then ask the next step
- If the user answers in their own words, adjust the plan accordingly
- Never re-ask a question that was already answered
- If an answer leads to a new question, follow up with it
- Once answers are in, proceed immediately without stalling
- If the user picks `Skip` many times in a row, consider using defaults instead of asking further
- If the user picks `Suggest another` a second time, use `/ask-again` or ask open-ended
- If the user says "don't understand", "ask again" → use `/ask-again` to rephrase
- If the user picks `Skip` on every question, stop asking and proceed with all defaults

### 6. Update References

- If the user's answer leads to editing, moving, renaming, or deleting files/skills → act on the answer, then always run `/update-references`
- No need to ask for confirmation before updating references, since it is a mandatory step after changes

- Use /follow-your-suggestion if needed
## Examples

### Question Categories

- `runtime`: "Choose a runtime for the backend" — `Bun`, `Node.js`, `Deno`, `Rust`, `Go`
- `language`: "Choose a language for the CLI" — `TypeScript/Bun`, `Rust`, `Zig`, `Python`
- `framework`: "Choose a framework for the web app" — `Next.js`, `Nuxt`, `SolidStart`, `SvelteKit`, `Astro`
- `library`: "Choose a validation library" — `Zod`, `ArkType`, `Valibot`
- `database`: "Choose a database" — `PostgreSQL`, `SQLite`, `Turso`, `Supabase`
- `test-tool`: "Choose a test runner" — `Vitest`, `Playwright`, `Cypress`
- `deploy-target`: "Choose a deploy platform" — `Vercel`, `Cloudflare`, `Railway`
- `ci-tool`: "Choose a CI tool" — `GitHub Actions`, `Renovate`, `Changesets`

### Example: Single-Select Question

```json
{
  "question": "Choose a runtime for the backend",
  "header": "Runtime",
  "multi_select": false,
  "options": [
    { "label": "✨ Bun", "description": "Recommended — fast, supports native APIs" },
    { "label": "Node.js", "description": "large ecosystem, works for general use" },
    { "label": "Deno", "description": "secure by default for TypeScript" }
  ]
}
```

### Example: Multi-Select Question

```json
{
  "question": "Choose the tools to install",
  "header": "Extra tools",
  "multi_select": true,
  "options": [
    { "label": "Vitest", "description": "test runner" },
    { "label": "Playwright", "description": "E2E testing" },
    { "label": "Biome", "description": "lint + format" }
  ]
}
```

## Expected Outcome

- The user can decide easily from clear options with a recommendation
- Supports single-select, multi-select, and multi-step flows
- Supports tech stack questions across runtime, language, framework, library, and tools
- Reduces AI guesswork
- Work stays aligned with what the user wants
- The user can skip or request other options at any point in the conversation
