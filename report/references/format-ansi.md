# Format ansi

## report-ansi (merged content)

### Goal

Create terminal reports with ANSI colors, progress bars, status symbols, box-drawing characters, and a summary — for logs, status, progress, UX/UI sketches, and architecture diagrams

### Scope

Use for progress reports, status, error summaries, UX/UI sketches, and architecture diagrams in the terminal that stay readable

### Execute

#### 1. Collect Status

> Goal: Gather the data to report

1. Read logs or status from file/stdout
2. Identify the data categories
3. Count pass/fail/warning

#### 2. Format With ANSI

> Goal: Format with ANSI escape codes

1. Use green for success, red for error, yellow for warning, blue for info
2. Use bold for headers
3. Use progress bars for percentages (if any)
4. Use symbols ✅ ❌ ⚠️ ℹ️ for status

#### 3. Render Summary

> Goal: Show the summary on top

1. Summarize item counts by status
2. Show short key findings
3. Show progress if available
4. Put details below

#### 4. Draw Box Diagrams And Sketches

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

### Rules

#### 1. ANSI Safety

- Use ANSI codes supported by common terminals
- If output is redirected, honor NO_COLOR
- Do not use 256 colors unless necessary

#### 2. Readability

- Summary on top
- Group by category
- Pair symbols with colors
- Max width 80 characters for chat readability
- Use 2 spaces for indentation
- Separate sections with blank lines

#### 3. Consistency

- Use the same color set as `report-table`
- Do not mix multiple color schemes
- Use box-drawing characters consistently

#### 4. Sketch/Diagram Accuracy

- Reference only components, routes, modules that actually exist in the codebase
- Never invent UI elements or services that do not exist
- Keep labels short — at most 1 line per box/section
- Include route path/technology names in boxes when present

### Expected Outcome

- Terminal report with ANSI colors and a status summary
- Box-drawing sketches/diagrams readable in chat
- Component structure and user flow referencing the real codebase
- Works on common terminals and honors NO_COLOR
