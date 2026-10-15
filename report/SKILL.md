---
name: report
description: "Pick the fitting report format: table or numbered list"
argument-hint: "[scope]"
related:
  - report-todo
  - report-progress
  - suggest-next-action
  - deep-review-codebase

---

## Goal

Select and execute the report format that fits the context

## Scope

Used for reporting results in chat; `/report` dispatches to `report-table` or `report-numbered` based on the data type

- Merged capability from the original skills that were moved into workflows

## Execute

### Workflows

| Domain      | Workflow |
|-------------|----------|
| `table`     | `## Merged Details → table` — reply as a table with a `No.` column, ordered |
| `html`      | `## Merged Details → html` — single interactive HTML file in the browser |
| `numbered`  | `## Merged Details → numbered` — numbered list sorted by priority |
| `codeblock` | `## Merged Details → codeblock` — code blocks for commands, snippets, config, logs, diff |

### 1. Select Format

> Goal: Pick the report format

1. If the data suits a multi-column table → use `/report table`
2. If the data suits steps/priority ordering → use `/report numbered`
3. If it is an action plan from chat not yet executed → use `/report-todo`
4. If it is commands, code snippets, config, logs, diff → use `/report codeblock`
5. If it is progress/status → use `/report-progress`
6. If it is TODO markers → read `TODO.md` + use `/scan-codebase` to find `TODO`/`FIXME`/`HACK` markers, then report table

### 2. Execute Selected Skill

> Goal: Report in the chosen format

1. Pass the data to the selected skill
2. Check that the output matches the format
3. If needed, use `/deep-review-codebase`

### 3. Apply UX/UI Format

> Goal: Make the report easy to read

1. Follow `[## Merged Details → `### references/uxui`](## Merged Details → `### references/uxui`)`
2. Use emoji per the defined legend
3. Sort by status with `completed` on top
4. Do not use bold markers

### 4. Finalize

> Goal: Summarize and point to the next action

1. Run `/suggest-next-action` if there are next steps
2. If the output came from `/report-todo`, it must include a table + numbered summary

## Rules

- `/report` does not write the report itself — it dispatches to a sub-format
- Use `/report table` when the work has comparison/status across multiple columns
- Use `/report numbered` when the work emphasizes step order
- Use `/report-todo` when the work has not started and needs an action plan
- Every table must have the `No.` column first
- Every report must summarize key findings at the top
- Use emoji per the legend in `## Merged Details → references/uxui`
- Do not use bold markers

- Every report of review findings goes out via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Merged Details

### codeblock

##### Goal

Reply in chat as a code block to highlight commands, code snippets, config, logs, or output that must be copy-pasteable

##### Scope

Use when the data suits a code block better than a table or numbered list, e.g.:
- commands or scripts
- code snippets
- config files
- error logs
- diff output

##### Execute

###### 1. Select Code Block Type

> Goal: Pick the fitting language/annotation

1. Shell command → use `bash` or `powershell`
2. Code snippet → use the matching language, e.g. `typescript`, `rust`, `python`
3. Config → use `json`, `toml`, `yaml`, `kdl`
4. Log → use `text`
5. Diff → use `diff`

###### 2. Add Context Header

> Goal: Say what this code block is

1. Before the code block, add a heading or a short note on which part it belongs to
2. For multiple blocks, separate them with `###` or a short description

###### 3. Format Content

> Goal: Make the code block easy to read and copy

1. Do not put line numbers inside the code block
2. Use ``` to open and close
3. State the language after ```
4. For multiple blocks, separate them with a short label above each
5. Put any extra explanation outside the code block

###### 4. Validate

> Goal: Check quality before sending

1. Check syntax correctness for the stated language
2. Check that the code block reads well on every device
3. If there are commands, state a dry run before execute

##### Rules

- Use a code block when the work suits copy-paste or syntax highlighting
- If a multi-column report is needed, use `/report` or `/report table`
- If multiple code blocks paired with a table are needed, use `/report table`
- State the language after the ``` marker
- Do not use bold markers inside a code block
- For multiple blocks, separate with `###` or a short label
- Reply in chat only

##### Expected Outcome

- Code blocks with the language correctly declared
- Content readable and copyable
- Short and clear, never longer than necessary

### html

##### Goal

Create a single HTML file that presents project analysis, analysis results, or a feature plan in the browser. The report supports interactive tables with sort, filter, group, search, and per-row dropdowns, plus theme switching and a sticky navigation menu

##### Scope

- Create a single self-contained `.html` file that needs no build
- Use Tailwind CSS via CDN and optionally Vue 3 for interactivity
- Include tables that can sort, filter, group, and search
- Each table row can expand into a dropdown with additional columns
- Report body content is in English; table cell content may use the project's language

##### Execute

###### 1. Prepare Data

> Goal: Have clean structured data before rendering

1. Run `/deep-analyze` or the primary skill that produces the data (e.g. `/idea-features`)
2. Convert the result into a JavaScript array of objects or 2D arrays
3. Ensure each row has a unique `id` and all required fields
4. Add computed `group` and `searchText` fields if needed

###### 2. Build HTML Shell

> Goal: One file that loads all assets from CDN

1. Use `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="UTF-8">`
2. Load Tailwind CSS: `https://cdn.tailwindcss.com`
3. For interactive mode load Vue 3: `https://unpkg.com/vue@3/dist/vue.global.js`
4. Set `tailwind.config = { darkMode: 'class' }`
5. Create `<div id="app">` and a `<script>` block using `Vue.createApp`

###### 3. Add Header And Theme Toggle

> Goal: Clear header with dark/light mode

1. Show the report title and a short description
2. Add a theme toggle button that switches the `dark` class on `<html>`
3. Persist the preference in `localStorage`
4. Read `prefers-color-scheme` on load
5. Use clear status indicators (e.g. badge or icon) for the report type

###### 4. Add Sticky Tabs And Key Findings

> Goal: Top-level navigation and summary

1. Create a sticky tab bar with `position: sticky; top: 0`
2. Use `backdrop-blur` and a contrasting background
3. The first tab shows `Key Findings` cards in a responsive grid
4. Each tab has a badge showing its item count
5. Use a clear visual hierarchy: title > subtitle > key findings > tabs

###### 5. Build Interactive Table

> Goal: The table supports varied interaction

1. Render the table from the data array using `v-for`
2. Add a search box bound with `v-model`
3. Add filter chips for `Priority`, `Impact`, `Phase`, `Effort`
4. Add sort controls on column headers (click to toggle asc/desc)
5. Add a group-by option (e.g. group by `Phase` or `Priority`)
6. Add a `Clear` button when filters are active
7. Show a `No results` empty state when filters return zero rows
8. Use a computed `filteredRows` for sort/filter/group/search

###### 6. Add Per-Row Dropdown

> Goal: Each row can expand to show more detail

1. Add an expand/collapse arrow on each row
2. When expanded, show a dropdown panel below the row
3. The dropdown has at least two columns (e.g. `UX/UI Sketch` and `Plan`)
4. Keep content concise; use `pre` or `ul` for sketches and plans
5. Expand only one row at a time if it improves UX

###### 7. Add Summary And Diagrams

> Goal: Non-table analysis results are also visible

1. Add a summary section for DB/Files, API/Functions, Components
2. Add text-based UX/UI sketches and an architecture diagram
3. Keep diagrams in `<pre>` blocks with a monospace font
4. Use cards and grids for summaries, not plain lists

###### 8. Add Next Action

> Goal: The report ends with a clear recommendation

1. Add a `Next Action` section at the bottom
2. Use a numbered or bulleted list
3. Reference the highest-importance items with `#`
4. Style the next action with a standout background or border

###### 9. Open In Browser

> Goal: Verify the report renders correctly

1. Save the file under `reports/<report-name>.html` or `.devin/temp/report/<workspace>/<report-name>.html`
2. Run `/open-web` or `Start-Process <path>` to open it in the browser
3. Confirm tabs, theme, sort, filter, and dropdowns work

##### Rules

###### 1. Single Self-Contained File

- No build step and no external package installation
- All JS/CSS loaded from CDN
- Data embedded in `<script>`
- File size under 500 KB where possible

###### 2. Report Body Language

- Headers, analysis results, summaries, diagrams, and next actions are in English
- Table cell content may stay in the project's language (e.g. Thai)
- Never mix languages within one paragraph

###### 3. Table Interactivity

- Text search across all visible columns
- Filter by `Priority`, `Impact`, `Phase`, `Effort`, `Difficult`
- Sort by any column (toggle asc/desc)
- Group rows by a chosen column
- A button to clear filters
- Highlight active filter/sort state
- Show an empty state when no rows match

###### 4. Per-Row Dropdown

- Each row has an expand button or is a clickable row
- The expanded panel has at least two labeled columns
- For `/idea-features` output the columns should be `UX/UI Sketch` and `Plan`
- Dropdown content uses concise text or code blocks

###### 5. Design Tokens And Visual Hierarchy

- Define a small design-token set with CSS variables for brand, success, warning, danger, and neutral colors
- Use a consistent spacing scale: `4`, `8`, `12`, `16`, `24`, `32`, `48`
- Keep the font stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Use `text-sm` for tables, `text-base` for content, `text-2xl` for page titles
- Avoid more than 6 accent colors

###### 6. UX/UI Improvements

- Rounded corners (`rounded-lg` for cards, `rounded` for buttons/badges)
- Subtle shadows (`shadow-sm` for cards, `shadow` for the sticky header)
- Sticky tab bar with `backdrop-blur`
- Sticky table header (`sticky top-0 z-10`) on wide tables
- Row hover state with `hover:bg-gray-50 dark:hover:bg-gray-700/50`
- Alternating row colors are optional but must keep contrast
- Status colors: red for high/danger, yellow for medium/warning, green for low/success, blue for info
- Use badges/pills for `Priority`, `Phase`, `Impact`, `Effort`
- Group headers differ from rows (background + bold)
- Summary cards in a responsive grid (`grid-cols-1 md:grid-cols-3`)

###### 7. Responsive And Accessible

- Horizontal scroll for wide tables (`overflow-x-auto`)
- On small screens stack filters and tabs vertically
- Use `focus:outline-none focus:ring-2 focus:ring-blue-500` for focusable elements
- Never rely on color alone to convey meaning; add text or an icon
- Use `aria-label` for icon-only buttons
- Respect `prefers-reduced-motion`
- Guarantee sufficient color contrast in both light and dark mode

###### 8. Empty, Loading, And Error States

- Show a friendly `No results` message when filters match nothing
- Show a `Loading...` fallback while Vue initializes (use `v-cloak`)
- Include a `Reset filters` action in the empty state
- If data is missing, show a clear message instead of a broken table

###### 9. Micro-Interactions

- Highlight the active sort column
- Show a count badge on the active tab
- Animate row expansion with a simple `max-height` transition (respect `prefers-reduced-motion`)
- Use subtle hover transitions for buttons and rows
- Show `Copied` or `Saved` feedback for any copy/export

###### 10. Print And Share

- Add a print-friendly CSS block:
  - Hide the sticky tab bar, theme toggle, and filters
  - Auto-expand all dropdown rows
  - Use black text on a white background
- Keep URLs and code blocks readable when printed

###### 11. Always Open After Create

- Every completed HTML report must always be opened via `/open-web`
- Do not consider the work done until it opens in the browser
- If it cannot open → report the problem and find a way via `Start-Process` or an OS command

###### 12. Safety

- Never hardcode secrets, credentials, or sensitive paths
- Use relative paths for project files
- Sanitize user-provided content before injecting it into HTML
- Use `DOMPurify` when rendering HTML from an untrusted source

- Use /visualize-in-web if needed
- Use /open-files-in-web if needed

##### Expected Outcome

- A single `.html` file saved in the project
- Report body in English, table cells in the project language when needed
- Interactive table with sort, filter, group, search, and sticky headers
- Per-row dropdowns with two columns
- Theme toggle, sticky tabs, key findings, summaries, diagrams, next action
- Responsive, accessible, and print-friendly
- Clear empty/loading/error states
- The file opens in the browser and renders correctly

### numbered

##### Goal

Reply in chat as a numbered list to emphasize priority or steps

##### Scope

Use for data that needs ordering, steps, or priority emphasized rather than comparison

##### Execute

###### 1. Prepare Items

> Goal: Gather the items to report

1. Collect the data
2. Split each item to a single responsibility
3. Assign priority

###### 2. Number And Group

> Goal: Order and group

1. Use 1, 2, 3, ... by priority
2. With multiple categories, separate groups with `##` headers
3. Within a group, sort by priority

###### 3. Format

> Goal: Make it readable

1. Start with a 2-3 point summary before the numbered list
2. Use emoji per status: `✅` `⏳` `❌` `⚠️`
3. Use sub-bullets under each number if needed
4. Use backticks for code, paths, skill names
5. Use `/report table` if the data suits a table better
6. Use `/report codeblock` if there are commands or code snippets

###### 4. Validate

> Goal: Check quality

1. Check numbering order
2. Check each item holds a single responsibility
3. Run `/suggest-next-action` if there are next steps

##### Rules

- One number = one idea/step
- Sort by priority or status with `completed` first
- Use backticks for paths, commands, skill names
- Use emoji per the `/report` legend
- Do not use bold markers
- Reply in chat only

##### Expected Outcome

- Numbered list in correct order
- Each item concise and clear
- Next action stated if any

### table

##### Goal

Reply in chat as a table with the `No.` column first, numbered 1, 2, 3, ...

##### Scope

Use for data that needs multi-column comparison or a complete status view in one table

##### Execute

###### 1. Prepare Data

> Goal: Gather and prepare the data

1. Collect the data to report
2. Group by category
3. Assign priority
4. Decide the fitting columns

###### 2. Build Table

> Goal: Build a readable table

1. The first column must be `No.` numbered 1, 2, 3, ...
2. Use clear headers
3. Order columns by importance
4. Use alignment appropriate to the data types

###### 3. Group And Sort

> Goal: Group and order

1. Group data by category
2. Use headers to separate groups
3. Sort within a group by priority
4. When status exists, sort: `✅ completed` → `⏳ in_progress` → `⚠️ pending` → `❌ blocker`

###### 4. Add Summary

> Goal: Summarize for fast understanding

1. Start with 2-3 key findings
2. State the overall status with emoji
3. Run `/suggest-next-action` if there are next steps

###### 5. Validate

> Goal: Check quality before sending

1. Check `No.` ordering
2. Check grouping and sorting
3. Check emoji follow the legend
4. Run `/deep-review-codebase` if needed

##### Rules

- Every table must have the `No.` column first
- If unsure of the format, use `/report` to dispatch per context
- Use backticks for code, paths, skill names
- Use symbols ✅ ❌ ⚠️ for status
- Do not use bold markers
- Reply in chat only

##### Expected Outcome

- Table with the `No.` column numbered correctly
- Clear grouping and sorting
- Data easy to read

### references/format-ansi

#### report-ansi (merged content)

##### Goal

Create terminal reports with ANSI colors, progress bars, status symbols, box-drawing characters, and a summary — for logs, status, progress, UX/UI sketches, and architecture diagrams

##### Scope

Use for progress reports, status, error summaries, UX/UI sketches, and architecture diagrams in the terminal that stay readable

##### Execute

###### 1. Collect Status

> Goal: Gather the data to report

1. Read logs or status from file/stdout
2. Identify the data categories
3. Count pass/fail/warning

###### 2. Format With ANSI

> Goal: Format with ANSI escape codes

1. Use green for success, red for error, yellow for warning, blue for info
2. Use bold for headers
3. Use progress bars for percentages (if any)
4. Use symbols ✅ ❌ ⚠️ ℹ️ for status

###### 3. Render Summary

> Goal: Show the summary on top

1. Summarize item counts by status
2. Show short key findings
3. Show progress if available
4. Put details below

###### 4. Draw Box Diagrams And Sketches

> Goal: Draw diagrams/sketches with ANSI box-drawing characters

1. Run `/scan-codebase` to find the relevant components, routes, modules
2. Pick the view type: full page, dialog/modal, component, flow, system overview, module dependency
3. Set the target device: desktop, mobile, or both — max width 80 characters
4. Draw the frame with `┌─┐│└─┘` (single-line) or `╔═╗║╚═╝` (double-line) for the outer container
5. Draw the main sections: header, content area, sidebar, footer, layers, modules
6. Use `├─┤`, `┬─┴`, `├─`, `└─`, `│` for dividers/branching
7. Use `[Button]`, `[Input]`, `[____]`, `[✓]`, `[ ]`, `[Select ▼]`, `[×]` for interactive elements
8. Use arrows `→ ↓ ↑ ⇄ ↔ ⇢` to show flow/dependency
9. Use `◇` for decision, `○` start, `●` end, or numbered steps `① ② ③`
10. Show mobile view with a single column, bottom navigation, touch targets `[  Button  ]`
11. Use `//` for inline annotations, `⚠` for concerns, `✨` for new components
12. Verify the layout is no wider than 80 characters, alignment is symmetric, and it references the real codebase

##### Rules

###### 1. ANSI Safety

- Use ANSI codes supported by common terminals
- If output is redirected, honor NO_COLOR
- Do not use 256 colors unless necessary

###### 2. Readability

- Summary on top
- Group by category
- Pair symbols with colors
- Max width 80 characters for chat readability
- Use 2 spaces for indentation
- Separate sections with blank lines

###### 3. Consistency

- Use the same color set as `report-table`
- Do not mix multiple color schemes
- Use box-drawing characters consistently

###### 4. Sketch/Diagram Accuracy

- Reference only components, routes, modules that actually exist in the codebase
- Never invent UI elements or services that do not exist
- Keep labels short — at most 1 line per box/section
- Include route path/technology names in boxes when present

##### Expected Outcome

- Terminal report with ANSI colors and a status summary
- Box-drawing sketches/diagrams readable in chat
- Component structure and user flow referencing the real codebase
- Works on common terminals and honors NO_COLOR

### references/format-codeblock

#### report-codeblock (merged content)

##### Goal

Format code/text output (codeblocks, diffs, JSON, markdown) cleanly and readably

##### Scope

Used for formatting:
- Code snippets with syntax highlighting
- Code diffs and changes
- JSON output for API responses and structured data
- Markdown documents for documentation and README

##### Execute

###### 1. Format Code Blocks

> Goal: Format Code Blocks

1. Declare the programming language for syntax highlighting
2. Use correct language tags (`typescript`, `python`, `rust`, etc.)
3. Use proper indentation (2 or 4 spaces)
4. Add comments for complex code

###### 2. Format Diffs

> Goal: Format Diffs

1. Use the standard unified diff format (`+`, `-`, context)
2. Group changes by file
3. Add file paths and change statistics (additions, deletions)
4. Use context lines for readability

###### 3. Format JSON

> Goal: Format JSON

1. Use pretty print with 2-space indentation
2. Use consistent naming conventions (`camelCase` or `snake_case`)
3. Use `null` instead of undefined or empty strings
4. Add metadata: `timestamp`, `version`, `status`

###### 4. Format Markdown

> Goal: Format Markdown

1. Use the heading hierarchy (H1-H6) appropriately
2. Use H1 for the document title (only once)
3. Use H2-H3 for main sections, H4-H6 for subsections
4. Do not skip heading levels

###### 5. Add Metadata

> Goal: Add Metadata

1. Add the filename or path above the code block
2. Add line numbers if needed
3. Add the commit hash for diffs
4. Add a timestamp for JSON output

###### 6. Highlight Key Parts

> Goal: Highlight Key Parts

1. Use bold for important keywords
2. Use comments for explanations in code
3. Use markers for function/class changes in diffs
4. Use inline annotations when needed

##### Rules

###### Report UX/UI

> Goal: Reports read easily, summarize key findings on top, and lead to action

1. Summarize key findings on top before details
2. Use `/report table` for multi-column comparison tables
3. Use `/report-progress` for status/progress/logs reports
4. Use the "No." column first, numbered 1, 2, 3, ... with clear headers, grouped/ordered by importance
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always end with `/suggest-next-action`

###### Code Formatting

- Use correct standard language tags
- Use consistent indentation through the code block
- Use consistent code style
- Use plain text when no suitable language exists

###### Diff Format

- Use the standard unified diff format
- Use consistent markers for additions/deletions
- Use sufficient context for readability
- State the change type (added, modified, deleted)

###### JSON Format

- Use consistent naming conventions throughout the JSON
- Order fields by importance
- Use nested objects for related data
- Check there are no circular references

###### Markdown Format

- Use bold for keywords, italic for emphasis
- Use code blocks with language tags
- Use backticks for inline code
- Use descriptive link text and alt text

##### Expected Outcome

- Code blocks with correct syntax highlighting
- Clear readable diffs
- Valid consistent JSON output
- Readable well-structured markdown documents
- Report readable with key findings on top
- Clear next action

### references/format-numbered-bullet

#### report-numbered-bullet (merged content)

##### Goal

Format output as a numbered list, bullet list, or a numbered/bullet mix according to context

##### Scope

Use for general reports that do not need a table, choosing the format by order, item relationships, and action requirements

##### Execute

###### 1. Choose Format

> Goal: Pick the fitting report format

1. Needs sequence or priority → numbered list
2. Unordered items → bullet list
3. Multiple main topics each with sub-details → numbered + bullet
4. Needs a table mixed in → also run `/report table`

###### 2. Numbered List

> Goal: Show clear ordering

1. Use the form `N. <short text>`
2. Order by priority, dependency, or time
3. Never pack multiple tasks into one item — if found, run `/follow-single-responsibility` first
4. Use when the reader must follow steps

###### 3. Bullet List

> Goal: Show an unordered list

- Use `-` or `*` per item
- Each bullet should be concise
- Use when items carry equal weight
- Group with sub-headings when there are several categories

###### 4. Numbered + Bullet

> Goal: Show main topics with sub-details

1. Use a numbered list for main topics
2. Use bullets for details under each topic
3. Keep single responsibility: 1 main item = 1 unit of work
4. Use for plans, findings reports, or action items

##### Rules

###### 1. Single Responsibility

- Each main item must hold a single responsibility
- If one item contains multiple "and"s or ","s → run `/follow-single-responsibility` first

###### 2. Reference Support

- URL present → include as `<url>` or a markdown link
- Skill present → use `/<skill-name>`
- File path present → use backticks
- Code/command present → use a code block

###### 3. Consistency

- Use one language within one list
- Line starting style stays consistent (sentence case or title case throughout)
- Do not mix `1.` with `1)` or `-` with `*` within the same category

###### 4. Output Length

- No more than 250 lines per report; if longer → split topics into `references/` or `/report html`
- Each bullet/number stays within 2 lines unless necessary

- Use /report-todo if needed

##### Expected Outcome

- Output in numbered, bullet, or numbered + bullet form per context
- Each item holds a single responsibility
- Complete references: URL, skills, paths
- Readable, concise, and action-ready

### references/uxui

#### Report UX/UI Guidelines

##### Goal

Make every report format easy to read, quick to understand, and clear about the action

##### Principles

###### 1. Summary First

- Every report must start with key findings or a 2-3 point summary
- Use short bullets before the details

###### 2. Sort By Status

- When status exists: sort `completed` or `done` first
- Then: `in_progress` → `pending` → `blocker` → `failed`

###### 3. Emoji Legend

| Status | Emoji |
|---|---|
| pass/done | `✅` |
| open/in progress | `⏳` |
| blocked | `❌` |
| warning | `⚠️` |
| info | `ℹ️` |
| waiting on user | `❓` |

###### 4. Table Format

- The first column must be `No.`
- Do not use bold markers `**`
- Use backticks for code, paths, skill names
- Headers clear, without excessive special characters

###### 5. Numbered List

- One number = one single-responsibility item
- Order by priority
- Use sub-bullets when needed

###### 6. Code Blocks

- State the language
- No line numbers
- Separate multiple blocks with short headings

###### 7. Progress

- Use a progress bar such as `████████████░░ 80%`
- State the percentage and the trend (↑ ↓ →)

###### 8. Next Action

- End with an actionable next step
- Never leave a report without direction

## Expected Outcome

- The report comes out in the fitting format
- `/report-todo` for action plans from chat
- Key findings and next action clearly summarized
