---
name: visualize-in-web
description: Create Web visuals in the browser under the OS temp directory
argument-hint: "[scope]"
related:
  - report
  - open-files-in-web
  - report-readme-html
  - run-test

---

## Goal

Create a Web (HTML) visual in the browser to make data, structure, or concepts easy to understand, choosing the frontend runtime based on the user context

## Scope

- Visualize complex data, structure, or concepts
- Generate a single no-build file in the OS temp directory
- Pick the runtime based on context: `Vue 3`, `solid-js/html`, `Alpine.js`, or `Vanilla JS`
- No-build only — `TSX` components or a build step are not supported

## Execute

### 1. Analyze Content

> Goal: Understand the content to visualize

1. Identify the content type (`data`, `structure`, `flow`, `concept`, `comparison`)
2. Identify the relationships and hierarchy
3. Choose a suitable layout (`tables`, `hierarchies`, `flows`, `comparisons`, `statistics`, `relationships`)

### 2. Select Runtime

> Goal: Select the frontend runtime based on the user context

1. Check the user context: project stack, active files, or config
2. If the user uses `Solid` → use `solid-js/html` or `solid-js/h` from a CDN
3. If the user uses `Vue` → use the Vue 3 global build from unpkg
4. If the user uses `Alpine` → use the Alpine.js CDN
5. If unclear → default to Vue 3
6. `TSX`/build is not supported in this skill — tell the user about the limitation

### 3. Generate Web Mode

> Goal: Generate an HTML visual

1. Run `/report html` for the base HTML structure
2. Use the runtime selected in step 2
3. Use Tailwind CSS for styling
4. For a tab system, refer to `/report-readme-html`
5. Create the file in the OS temp directory:
   - Windows: `$env:TEMP\visualize-<name>.html`
   - macOS/Linux: `tmp/visualize-<name>.html`
6. Run `/open-web` to open it in the browser

### 4. Design Visual Layout

> Goal: Design the layout by content type

1. Data tables: use `<el-table>` or HTML tables with sorting
2. Hierarchies: use a tree structure or nested boxes
3. Flows: use arrows and decision points
4. Comparisons: use a side-by-side layout
5. Statistics: use charts or bar graphs
6. Relationships: use a graph or matrix

### 5. Add Interactivity

> Goal: Add interaction for Web mode

1. Add search with `<el-input>` or `<input v-model>`
2. Add filtering with computed properties
3. Add expand/collapse with `<el-collapse>`
4. Add tabs to group data
5. Add dark mode with `<html class="dark">`

## Rules

### 1. Output Location

- Create files only in the OS temp directory, as temporary files
- Windows: use the `$env:TEMP` environment variable
- macOS/Linux: use the `tmp` directory
- Name the file `visualize-<descriptive-name>.html`
- Do not create files in the project directory

### 2. Web Standards

- Follow `/report html` for the HTML structure
- Pick the frontend runtime based on the user context (`Vue`, `Solid`, `Alpine`, `Vanilla`)
- Use the Tailwind CSS CDN
- Support dark mode
- For Element Plus components, refer to `/report-readme-html`

### 3. No Build

- A single file with no build step
- JS/CSS/Runtime loaded from a CDN
- `TSX` or build is not supported — if needed, tell the user about the limitation

### 4. Content Clarity

- Prioritize clarity over aesthetics
- Use clear labels and annotations
- Group related data
- Use color/contrast for emphasis

- Use /open-files-in-web if needed
- Use /deep-test visual if needed
- Use /run-test if needed

## Expected Outcome

- An easy-to-understand Web visual
- A temporary file in the OS temp directory
- Opened in the browser with interaction
- Complex data turned into an easy-to-understand visual
- The runtime chosen based on the user context
