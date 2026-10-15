# Format numbered bullet

## report-numbered-bullet (merged content)

### Goal

Format output as a numbered list, bullet list, or a numbered/bullet mix according to context

### Scope

Use for general reports that do not need a table, choosing the format by order, item relationships, and action requirements

### Execute

#### 1. Choose Format

> Goal: Pick the fitting report format

1. Needs sequence or priority → numbered list
2. Unordered items → bullet list
3. Multiple main topics each with sub-details → numbered + bullet
4. Needs a table mixed in → also run `/report table`

#### 2. Numbered List

> Goal: Show clear ordering

1. Use the form `N. <short text>`
2. Order by priority, dependency, or time
3. Never pack multiple tasks into one item — if found, run `/follow-single-responsibility` first
4. Use when the reader must follow steps

#### 3. Bullet List

> Goal: Show an unordered list

- Use `-` or `*` per item
- Each bullet should be concise
- Use when items carry equal weight
- Group with sub-headings when there are several categories

#### 4. Numbered + Bullet

> Goal: Show main topics with sub-details

1. Use a numbered list for main topics
2. Use bullets for details under each topic
3. Keep single responsibility: 1 main item = 1 unit of work
4. Use for plans, findings reports, or action items

### Rules

#### 1. Single Responsibility

- Each main item must hold a single responsibility
- If one item contains multiple "and"s or ","s → run `/follow-single-responsibility` first

#### 2. Reference Support

- URL present → include as `<url>` or a markdown link
- Skill present → use `/<skill-name>`
- File path present → use backticks
- Code/command present → use a code block

#### 3. Consistency

- Use one language within one list
- Line starting style stays consistent (sentence case or title case throughout)
- Do not mix `1.` with `1)` or `-` with `*` within the same category

#### 4. Output Length

- No more than 250 lines per report; if longer → split topics into `references/` or `/report html`
- Each bullet/number stays within 2 lines unless necessary

- Use /report-todo if needed

### Expected Outcome

- Output in numbered, bullet, or numbered + bullet form per context
- Each item holds a single responsibility
- Complete references: URL, skills, paths
- Readable, concise, and action-ready
