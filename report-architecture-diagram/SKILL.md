---
name: report-architecture-diagram
description: Draw an architecture diagram with ANSI box-drawing in chat from the real codebase
argument-hint: "[scope]"
related:
  - scan-codebase
  - report
  - suggest-next-action
---

## Goal

Draw an architecture diagram with ANSI box-drawing characters in chat to visualize system structure, data flow, and component relationships from the real codebase

## Scope

Use to report the architecture of a system or a part being newly built — covering: system overview, module dependencies, data flow, API layer, database schema relationships, and integration points

## Execute

### 1. Analyze System Structure

> Goal: Analyze System Structure

1. Use `/scan-codebase` to find modules, services, and entry points
2. Identify main layers: frontend, API, server, database, external services
3. Identify dependencies between modules and packages
4. Identify external integrations (Stripe, Supabase, Resend, OpenAI, etc.)
5. Note component groups by domain (auth, booking, payment, etc.)

### 2. Define Diagram Scope

> Goal: Define Diagram Scope

1. Pick abstraction level: system overview, module-level, or feature-level
2. Define boundary: show only parts relevant to the current task
3. Identify data flow direction: top-down, left-right, or mixed
4. Set max width at 80 characters for chat readability

### 3. Draw System Overview

> Goal: Draw System Overview

1. Draw the outer container with double-line borders (`╔═╗║╚═╝`)
2. Draw main layers as boxes with single-line borders (`┌─┐│└─┘`)
3. Connect layers with arrows (`│`, `→`, `↓`) showing data flow
4. Draw external services as separate boxes connected by arrows
5. Add short labels in each box: layer name and key components

### 4. Draw Module Dependencies

> Goal: Draw Module Dependencies

1. Draw modules as boxes at the same level
2. Connect with arrows showing dependency direction
3. Use `├─` and `└─` for branching dependencies
4. Mark dependency type: `→` (uses), `⇄` (bidirectional), `↔` (sync)
5. Draw database schema groups as nested boxes

### 5. Draw Data Flow

> Goal: Draw Data Flow

1. Identify entry points: routes, API endpoints, server functions
2. Draw flow from entry point through layers to database
3. Use numbered arrows (`①→`, `②→`) for sequence
4. Mark async operations with `⇢` and sync with `→`
5. Show error paths with `✗` and success paths with `✓`

### 6. Add Annotations

> Goal: Add Annotations

1. Use `//` for inline comments
2. Use `⚠` for risk points or bottlenecks
3. Use `✨` for new components to be built
4. Put technology names in boxes (e.g. `oRPC`, `Drizzle`, `Stripe`)
5. Add a legend below if multiple symbol types are used

### 7. Validate And Present

> Goal: Validate And Present

1. Verify every box has a clear label
2. Verify arrows connect in the correct direction
3. Verify diagram width does not exceed 80 characters
4. Verify it references components and modules that actually exist in the codebase
5. Output the diagram directly in chat — do not create files

## Rules

### Report UX/UI

> Goal: readable report — key findings on top, leading to action (architecture diagram)

1. Summarize key findings above the details (architecture diagram)
2. Use `/report` for multi-column comparison tables (architecture diagram)
3. Use `/report` for status/progress/logs reports
4. Use "No." as the first column, ordered 1, 2, 3, ... with clear headers, grouped/ordered by importance (architecture diagram)
5. Use symbols ✅ ❌ ⚠️ for status indicators
6. Always use `/suggest-next-action` at the end of the report

### Accuracy

- Reference only components, modules, and routes that actually exist in the codebase
- Never fabricate modules or services
- Verify file names and paths from the codebase before drawing
- Show only parts relevant to the current context

### Box Drawing Characters

- Outer container: `╔═╗║╚═╝` (double-line)
- Layer boxes: `┌─┐│└─┘` (single-line)
- Section dividers: `├─┤` or `┬─┴`
- Arrows: `→ ↓ ↑ ⇄ ⇢ ↔`
- Branches: `├─ └─ │`
- Markers: `✓ ✗ ⚠ ✨ ① ② ③`

### Layout

- Max width 80 characters for chat readability
- Use 2 spaces for indentation
- Use consistent spacing between boxes
- Keep alignment symmetrical
- Separate sections with blank lines

### Content

- Use short labels — max 1 line per box
- Put technology names in boxes
- Show only essential relationships, not every detail
- Add a legend if special symbols are used
- Never create .md, .html, or .json files

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files; the diagram itself remains the skill's artifact

## Expected Outcome

- An ANSI architecture diagram in chat that is readable and clarifies system structure
- Clear data flow from entry point to database
- Component relationships referencing the real codebase
- Module dependencies that are visible and traceable
- External integrations shown clearly
- Report is readable with key findings on top
- Next action is clear
