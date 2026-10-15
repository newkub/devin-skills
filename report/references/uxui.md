# Uxui

## Report UX/UI Guidelines

### Goal

Make every report format easy to read, quick to understand, and clear about the action

### Principles

#### 1. Summary First

- Every report must start with key findings or a 2-3 point summary
- Use short bullets before the details

#### 2. Sort By Status

- When status exists: sort `completed` or `done` first
- Then: `in_progress` → `pending` → `blocker` → `failed`

#### 3. Emoji Legend

| Status | Emoji |
|---|---|
| pass/done | `✅` |
| open/in progress | `⏳` |
| blocked | `❌` |
| warning | `⚠️` |
| info | `ℹ️` |
| waiting on user | `❓` |

#### 4. Table Format

- The first column must be `No.`
- Do not use bold markers `**`
- Use backticks for code, paths, skill names
- Headers clear, without excessive special characters

#### 5. Numbered List

- One number = one single-responsibility item
- Order by priority
- Use sub-bullets when needed

#### 6. Code Blocks

- State the language
- No line numbers
- Separate multiple blocks with short headings

#### 7. Progress

- Use a progress bar such as `████████████░░ 80%`
- State the percentage and the trend (↑ ↓ →)

#### 8. Next Action

- End with an actionable next step
- Never leave a report without direction
