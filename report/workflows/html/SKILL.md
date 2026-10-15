---
name: report-html
description: Create a single HTML file that presents project analysis, analysis results, or a feature plan in the browser. The report supports interactive tables with sort, filter, group, se...
related:
  - report
---

## Goal

Create a single HTML file that presents project analysis, analysis results, or a feature plan in the browser. The report supports interactive tables with sort, filter, group, search, and per-row dropdowns, plus theme switching and a sticky navigation menu

## Scope

- Create a single self-contained `.html` file that needs no build
- Use Tailwind CSS via CDN and optionally Vue 3 for interactivity
- Include tables that can sort, filter, group, and search
- Each table row can expand into a dropdown with additional columns
- Report body content is in English; table cell content may use the project's language

## Execute

### 1. Prepare Data

> Goal: Have clean structured data before rendering

1. Run `/deep-analyze` or the primary skill that produces the data (e.g. `/idea-features`)
2. Convert the result into a JavaScript array of objects or 2D arrays
3. Ensure each row has a unique `id` and all required fields
4. Add computed `group` and `searchText` fields if needed

### 2. Build HTML Shell

> Goal: One file that loads all assets from CDN

1. Use `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="UTF-8">`
2. Load Tailwind CSS: `https://cdn.tailwindcss.com`
3. For interactive mode load Vue 3: `https://unpkg.com/vue@3/dist/vue.global.js`
4. Set `tailwind.config = { darkMode: 'class' }`
5. Create `<div id="app">` and a `<script>` block using `Vue.createApp`

### 3. Add Header And Theme Toggle

> Goal: Clear header with dark/light mode

1. Show the report title and a short description
2. Add a theme toggle button that switches the `dark` class on `<html>`
3. Persist the preference in `localStorage`
4. Read `prefers-color-scheme` on load
5. Use clear status indicators (e.g. badge or icon) for the report type

### 4. Add Sticky Tabs And Key Findings

> Goal: Top-level navigation and summary

1. Create a sticky tab bar with `position: sticky; top: 0`
2. Use `backdrop-blur` and a contrasting background
3. The first tab shows `Key Findings` cards in a responsive grid
4. Each tab has a badge showing its item count
5. Use a clear visual hierarchy: title > subtitle > key findings > tabs

### 5. Build Interactive Table

> Goal: The table supports varied interaction

1. Render the table from the data array using `v-for`
2. Add a search box bound with `v-model`
3. Add filter chips for `Priority`, `Impact`, `Phase`, `Effort`
4. Add sort controls on column headers (click to toggle asc/desc)
5. Add a group-by option (e.g. group by `Phase` or `Priority`)
6. Add a `Clear` button when filters are active
7. Show a `No results` empty state when filters return zero rows
8. Use a computed `filteredRows` for sort/filter/group/search

### 6. Add Per-Row Dropdown

> Goal: Each row can expand to show more detail

1. Add an expand/collapse arrow on each row
2. When expanded, show a dropdown panel below the row
3. The dropdown has at least two columns (e.g. `UX/UI Sketch` and `Plan`)
4. Keep content concise; use `pre` or `ul` for sketches and plans
5. Expand only one row at a time if it improves UX

### 7. Add Summary And Diagrams

> Goal: Non-table analysis results are also visible

1. Add a summary section for DB/Files, API/Functions, Components
2. Add text-based UX/UI sketches and an architecture diagram
3. Keep diagrams in `<pre>` blocks with a monospace font
4. Use cards and grids for summaries, not plain lists

### 8. Add Next Action

> Goal: The report ends with a clear recommendation

1. Add a `Next Action` section at the bottom
2. Use a numbered or bulleted list
3. Reference the highest-importance items with `#`
4. Style the next action with a standout background or border

### 9. Open In Browser

> Goal: Verify the report renders correctly

1. Save the file under `reports/<report-name>.html` or `.devin/temp/report/<workspace>/<report-name>.html`
2. Run `/open-web` or `Start-Process <path>` to open it in the browser
3. Confirm tabs, theme, sort, filter, and dropdowns work

## Rules

### 1. Single Self-Contained File

- No build step and no external package installation
- All JS/CSS loaded from CDN
- Data embedded in `<script>`
- File size under 500 KB where possible

### 2. Report Body Language

- Headers, analysis results, summaries, diagrams, and next actions are in English
- Table cell content may stay in the project's language (e.g. Thai)
- Never mix languages within one paragraph

### 3. Table Interactivity

- Text search across all visible columns
- Filter by `Priority`, `Impact`, `Phase`, `Effort`, `Difficult`
- Sort by any column (toggle asc/desc)
- Group rows by a chosen column
- A button to clear filters
- Highlight active filter/sort state
- Show an empty state when no rows match

### 4. Per-Row Dropdown

- Each row has an expand button or is a clickable row
- The expanded panel has at least two labeled columns
- For `/idea-features` output the columns should be `UX/UI Sketch` and `Plan`
- Dropdown content uses concise text or code blocks

### 5. Design Tokens And Visual Hierarchy

- Define a small design-token set with CSS variables for brand, success, warning, danger, and neutral colors
- Use a consistent spacing scale: `4`, `8`, `12`, `16`, `24`, `32`, `48`
- Keep the font stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Use `text-sm` for tables, `text-base` for content, `text-2xl` for page titles
- Avoid more than 6 accent colors

### 6. UX/UI Improvements

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

### 7. Responsive And Accessible

- Horizontal scroll for wide tables (`overflow-x-auto`)
- On small screens stack filters and tabs vertically
- Use `focus:outline-none focus:ring-2 focus:ring-blue-500` for focusable elements
- Never rely on color alone to convey meaning; add text or an icon
- Use `aria-label` for icon-only buttons
- Respect `prefers-reduced-motion`
- Guarantee sufficient color contrast in both light and dark mode

### 8. Empty, Loading, And Error States

- Show a friendly `No results` message when filters match nothing
- Show a `Loading...` fallback while Vue initializes (use `v-cloak`)
- Include a `Reset filters` action in the empty state
- If data is missing, show a clear message instead of a broken table

### 9. Micro-Interactions

- Highlight the active sort column
- Show a count badge on the active tab
- Animate row expansion with a simple `max-height` transition (respect `prefers-reduced-motion`)
- Use subtle hover transitions for buttons and rows
- Show `Copied` or `Saved` feedback for any copy/export

### 10. Print And Share

- Add a print-friendly CSS block:
  - Hide the sticky tab bar, theme toggle, and filters
  - Auto-expand all dropdown rows
  - Use black text on a white background
- Keep URLs and code blocks readable when printed

### 11. Always Open After Create

- Every completed HTML report must always be opened via `/open-web`
- Do not consider the work done until it opens in the browser
- If it cannot open → report the problem and find a way via `Start-Process` or an OS command

### 12. Safety

- Never hardcode secrets, credentials, or sensitive paths
- Use relative paths for project files
- Sanitize user-provided content before injecting it into HTML
- Use `DOMPurify` when rendering HTML from an untrusted source

- Use /visualize-in-web if needed
- Use /open-files-in-web if needed

## Expected Outcome

- A single `.html` file saved in the project
- Report body in English, table cells in the project language when needed
- Interactive table with sort, filter, group, search, and sticky headers
- Per-row dropdowns with two columns
- Theme toggle, sticky tabs, key findings, summaries, diagrams, next action
- Responsive, accessible, and print-friendly
- Clear empty/loading/error states
- The file opens in the browser and renders correctly
