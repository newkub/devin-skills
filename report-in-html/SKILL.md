---
name: report-in-html
description: Build a single interactive HTML report with tables, dropdowns, sort and filter
argument-hint: "[scope]"
related:
  - open-web
---

## Goal

Create a single HTML file that presents a project analysis, an analysis, or a feature plan in the browser. The report supports interactive tables with sort, filter, group, and search, plus per-row dropdowns, theme toggling, and a sticky navigation menu

## Scope

- Create one self-contained `.html` file that needs no build
- Use Tailwind CSS via CDN, and Vue 3 where interactivity is needed
- Include a table that can sort, filter, group, and search
- Each table row can expand into a dropdown with extra columns
- The report body is in English; table cell content may use the project's language

## Execute

### 1. Prepare Data

> Goal: Have clean, structured data before rendering

1. Run `/deep-analyze` or the main skill that produced the data (e.g. `/idea-features`)
2. Convert the result into a JavaScript array of objects or 2D arrays
3. Ensure each row has a unique `id` and every required field
4. Add computed fields for `group` and `searchText` if needed

### 2. Build HTML Shell

> Goal: a single file that loads all assets from CDN

1. Use `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="UTF-8">`
2. Load Tailwind CSS: `https://cdn.tailwindcss.com`
3. For interactive mode, load Vue 3: `https://unpkg.com/vue@3/dist/vue.global.js`
4. Set `tailwind.config = { darkMode: 'class' }`
5. Create `<div id="app">` and a `<script>` block using `Vue.createApp`

### 3. Add Header And Theme Toggle

> Goal: a clear header with dark/light mode

1. Show the report title and a short description
2. Add a theme toggle button that switches the `dark` class on `<html>`
3. Save the preference in `localStorage`
4. Read `prefers-color-scheme` on load
5. Use clear status indicators (e.g. badge or icon) for the report type

### 4. Add Sticky Tabs And Key Findings

> Goal: a top-level navigation menu and summary

1. Build a sticky tab bar with `position: sticky; top: 0`
2. Use `backdrop-blur` and contrasting backgrounds
3. The first tab shows `Key Findings` cards in a responsive grid
4. Each tab has a badge showing its item count
5. Keep a clear visual hierarchy: title > subtitle > key findings > tabs

### 5. Build Interactive Table

> Goal: the table supports rich interaction

1. Render the table from the data array using `v-for`
2. Add a search box bound with `v-model`
3. Add filter chips for `Priority`, `Impact`, `Phase`, `Effort`
4. Add sort controls on column headers (click to toggle asc/desc)
5. Add a group-by option (e.g. group by `Phase` or `Priority`)
6. Add a `Clear` button whenever a filter is active
7. Show the `No results` empty state when filters return zero rows
8. Use a computed `filteredRows` for sort/filter/group/search

### 6. Add Per-Row Dropdown

> Goal: each row can expand to show extra detail

1. Add an expand/collapse arrow on each row
2. When expanded, show a dropdown panel below the row
3. The dropdown has at least two columns (e.g. `UX/UI Sketch` and `Plan`)
4. Keep content concise; use `pre` or `ul` for sketches and plans
5. Allow only one expanded row at a time if it improves UX

### 7. Add Summary And Diagrams

> Goal: non-table analysis results are visible too

1. Add summary sections for DB/Files, API/Functions, Components
2. Add text-based UX/UI sketches and architecture diagrams
3. Keep diagrams in `<pre>` blocks with a monospace font
4. Use cards and grids for summaries, not plain lists

### 8. Add Next Action

> Goal: the report ends with clear recommendations

1. Add a `Next Action` section at the bottom
2. Use a numbered or bulleted list
3. Reference the highest-importance items by `#`
4. Style the next actions with a distinct background or border

### 9. Open In Browser

> Goal: verify the report renders correctly

1. Save the file as `reports/<report-name>.html` or `.devin/reports/<report-name>.html`
2. Run `/open-web` or `Start-Process <path>` to open it in the browser
3. Confirm the tabs, theme, sort, filter, and dropdowns work

## Rules

### 1. Single Self-Contained File

- No build step, no external package installation
- All JS/CSS loaded from CDN
- Data embedded in `<script>`
- File size below 500 KB when possible

### 2. Report Body Language

- Headers, findings, summaries, diagrams, and next actions are in English
- Table cell content may be in the project's language (e.g. Thai)
- Never mix languages within the same paragraph

### 3. Table Interactivity

- Text search across every visible column
- Filter by `Priority`, `Impact`, `Phase`, `Effort`, `Difficult`
- Sort by any column (toggle asc/desc)
- Group rows by the selected column
- A button to clear filters
- Highlight active filter/sort states
- Show an empty state when no rows match

### 4. Per-Row Dropdown

- Each row has an expand button or a clickable row
- The expanded panel has at least two labeled columns
- For `/idea-features` output the columns should be `UX/UI Sketch` and `Plan`
- Dropdown content uses concise text or code blocks

### 5. Design Tokens And Visual Hierarchy

- Define a small design token set with CSS variables for brand, success, warning, danger, and neutral colors
- Use a consistent spacing scale: `4`, `8`, `12`, `16`, `24`, `32`, `48`
- Keep the font stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Use `text-sm` for tables, `text-base` for content, `text-2xl` for page titles
- Avoid more than 6 accent colors

### 6. UX/UI Improvements

- Rounded corners (`rounded-lg` for cards, `rounded` for buttons/badges)
- Subtle shadows (`shadow-sm` for cards, `shadow` for the sticky header)
- A sticky tab bar with `backdrop-blur`
- A sticky table header (`sticky top-0 z-10`) on wide tables
- Row hover states with `hover:bg-gray-50 dark:hover:bg-gray-700/50`
- Alternating row colors are optional but must preserve contrast
- Status colors: red for high/danger, yellow for medium/warning, green for low/success, blue for info
- Use badges/pills for `Priority`, `Phase`, `Impact`, `Effort`
- Group headers distinct from rows (background + bold)
- Summary cards in a responsive grid (`grid-cols-1 md:grid-cols-3`)

### 7. Responsive And Accessible

- Horizontal scrolling for wide tables (`overflow-x-auto`)
- On small screens, stack filters and tabs vertically
- Use `focus:outline-none focus:ring-2 focus:ring-blue-500` for focusable elements
- Never convey meaning by color alone; add text or an icon
- Use `aria-label` on icon-only buttons
- Respect `prefers-reduced-motion`
- Guarantee sufficient color contrast in both light and dark modes

### 8. Empty, Loading, And Error States

- Show a friendly `No results` message when filters match nothing
- Show a `Loading...` fallback while Vue initializes (use `v-cloak`)
- Include a `Reset filters` button in the empty state
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
  - Expand all dropdown rows automatically
  - Use black text on a white background
- Keep URLs and code blocks readable when printed

### 11. Safety

- No hardcoded secrets, credentials, or sensitive paths
- Use relative paths for project files
- Sanitize user-provided content before injecting it into HTML
- Use `DOMPurify` when rendering HTML from untrusted sources

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status); the single-file HTML is this skill's artifact, produced only when the user asks for HTML explicitly

## Expected Outcome

- A single `.html` file saved in the project
- Report body in English, table cells in the project's language when needed
- An interactive table with sort, filter, group, search, and sticky headers
- Per-row dropdowns with two columns
- Theme toggle, sticky tabs, key findings, summaries, diagrams, next actions
- Responsive, accessible, and print-friendly
- Clear empty/loading/error states
- The file opens in the browser and renders correctly
