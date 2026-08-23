---
name: report-in-html
description: Create a single interactive HTML file for browser-based reports with tables, dropdowns, sort/filt...
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - CSS
  - UI
  - collapse
  - desc
  - export
  - light
  - pills
  - sort
---
## Goal

Create a single HTML file that presents project findings, analysis, or feature plans in a browser. The report supports interactive tables with sort, filter, group, search, and per-row dropdowns, plus theme toggle and sticky navigation.

## Scope

- Generate one self-contained `.html` file with no build step
- Use Tailwind CSS via CDN and optionally Vue 3 for interactivity
- Include tables that can be sorted, filtered, grouped, and searched
- Each table row can expand into a dropdown with extra columns
- Report body is in English; table cell content may use the project language

## Execute

### 1. Prepare Data

> Goal: Have clean, structured data before rendering

1. Run `/analyze-project` or the parent skill that produced the data (e.g., `/idea-features`)
2. Convert results into a JavaScript array of objects or 2D arrays
3. Ensure each row has a unique `id` and all required fields
4. Add computed fields for `group` and `searchText` if needed

### 2. Build HTML Shell

> Goal: Single file with all assets loaded from CDN

1. Use `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="UTF-8">`
2. Load Tailwind CSS: `https://cdn.tailwindcss.com`
3. For interactive mode, load Vue 3: `https://unpkg.com/vue@3/dist/vue.global.js`
4. Set `tailwind.config = { darkMode: 'class' }`
5. Create `<div id="app">` and a `<script>` block using `Vue.createApp`

### 3. Add Header And Theme Toggle

> Goal: Clear header with dark/light mode

1. Show report title and short subtitle
2. Add a theme toggle button that toggles `dark` class on `<html>`
3. Persist preference in `localStorage`
4. Read `prefers-color-scheme` on load
5. Use a clear status indicator (e.g., badge or icon) for report type

### 4. Add Sticky Tabs And Key Findings

> Goal: Top-level navigation and summary

1. Create a sticky tab bar with `position: sticky; top: 0`
2. Use `backdrop-blur` and a contrasting background
3. First tab shows `Key Findings` cards in a responsive grid
4. Each tab gets a badge with item count
5. Use clear visual hierarchy: title > subtitle > key findings > tabs

### 5. Build Interactive Table

> Goal: Table supports rich interaction

1. Render table from data array using `v-for`
2. Add search input bound with `v-model`
3. Add filter chips for `Priority`, `Impact`, `Phase`, `Effort`
4. Add sort controls on column headers (click to toggle asc/desc)
5. Add group by selector (e.g., group by `Phase` or `Priority`)
6. Add a `Clear` button when any filter is active
7. Show a `No results` empty state when filters return zero rows
8. Use computed `filteredRows` for sort/filter/group/search

### 6. Add Per-Row Dropdown

> Goal: Each row can expand to show extra detail

1. Add an expand/collapse arrow on each row
2. When expanded, show a dropdown panel below the row
3. Dropdown has at least two columns (e.g., `UX/UI Sketch` and `Plan`)
4. Keep content concise; use `pre` or `ul` for sketches and plans
5. Only one row may be expanded at a time if it improves UX

### 7. Add Summary And Diagrams

> Goal: Non-table findings are also visible

1. Add summary sections for DB/Files, API/Functions, Components
2. Add text-based UX/UI sketch and architecture diagram
3. Keep diagrams in `<pre>` blocks with monospaced font
4. Use cards and grids for summary, not just plain lists

### 8. Add Next Action

> Goal: Report ends with a clear recommendation

1. Add a `Next Action` section at the bottom
2. Use numbered or bullet list
3. Reference the top-priority items by `#`
4. Style the next action with a distinct background or border

### 9. Open In Browser

> Goal: Verify the report renders correctly

1. Save the file under `reports/<report-name>.html` or `.devin/reports/<report-name>.html`
2. Run `/open-web` or `Start-Process <path>` to open in browser
3. Confirm tabs, theme, sort, filter, dropdowns work

## Rules

### 1. Single Self-Contained File

- No build step, no external package installation
- All JS/CSS loaded from CDN
- Data embedded inside `<script>`
- File size under 500 KB if possible

### 2. Report Body Language

- Header, findings, summary, diagrams, and next action are in English
- Table cell content may be in the project language (e.g., Thai)
- Do not mix languages within the same paragraph

### 3. Table Interactivity

- Search by text across all visible columns
- Filter by `Priority`, `Impact`, `Phase`, `Effort`, `Difficult`
- Sort by any column (asc/desc toggle)
- Group rows by a selected column
- Clear filters button
- Highlight active filter/sort state
- Show empty state when no rows match

### 4. Per-Row Dropdown

- Each row has an expand button or clickable row
- Expanded panel has at least two labeled columns
- For `/idea-features` output, columns should be `UX/UI Sketch` and `Plan`
- Dropdown content uses concise text or code blocks

### 5. Design Tokens And Visual Hierarchy

- Define a small design token set with CSS variables for brand, success, warning, danger, and neutral colors
- Use consistent spacing scale: `4`, `8`, `12`, `16`, `24`, `32`, `48`
- Keep font stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Use `text-sm` for tables, `text-base` for body, `text-2xl` for page title
- Avoid more than 6 accent colors

### 6. UX/UI Improvements

- Rounded corners (`rounded-lg` for cards, `rounded` for buttons/badges)
- Subtle shadows (`shadow-sm` for cards, `shadow` for sticky headers)
- Sticky tab bar with `backdrop-blur`
- Sticky table headers (`sticky top-0 z-10`) on wide tables
- Row hover state with `hover:bg-gray-50 dark:hover:bg-gray-700/50`
- Alternating row colors optional, but keep contrast
- Status colors: red for high/danger, yellow for medium/warning, green for low/success, blue for info
- Use badges/pills for `Priority`, `Phase`, `Impact`, `Effort`
- Group headers distinct from rows (background + bold)
- Summary cards in responsive grid (`grid-cols-1 md:grid-cols-3`)

### 7. Responsive And Accessible

- Horizontal scroll for wide tables (`overflow-x-auto`)
- On small screens, stack filters and tabs vertically
- Use `focus:outline-none focus:ring-2 focus:ring-blue-500` for focusable elements
- Do not use color alone to convey meaning; add text or icon
- Use `aria-label` for icon-only buttons
- Respect `prefers-reduced-motion`
- Ensure sufficient color contrast in both light and dark mode

### 8. Empty, Loading, And Error States

- Show a friendly `No results` message when filters match nothing
- Show a `Loading...` fallback while Vue initializes (use `v-cloak`)
- Provide a `Reset filters` button in empty state
- If data is missing, show a clear message instead of a broken table

### 9. Micro-Interactions

- Highlight the active sort column
- Show a count badge on the active tab
- Animate row expansion with a simple `max-height` transition (respect `prefers-reduced-motion`)
- Use subtle hover transitions for buttons and rows
- Show `Copied` or `Saved` feedback for any copy/export actions

### 10. Print And Share

- Add a print-friendly CSS block:
  - Hide sticky tab bar, theme toggle, and filters
  - Expand all dropdown rows automatically
  - Use black text on white background
- Keep URLs and code blocks readable when printed

### 11. Safety

- No secrets, credentials, or hardcoded sensitive paths
- Use relative paths for project files
- Sanitize any user-provided content before injecting into HTML
- Use `DOMPurify` if rendering HTML from untrusted sources

## Expected Outcome

- A single `.html` file saved in the project
- Report body in English, table cells in the project language if needed
- Interactive table with sort, filter, group, search, and sticky headers
- Per-row dropdown with two columns
- Theme toggle, sticky tabs, key findings, summary, diagrams, next action
- Responsive, accessible, and print-friendly
- Clear empty/loading/error states
- File opens in browser and renders correctly