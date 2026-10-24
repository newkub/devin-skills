---
name: report-ansi
description: Report in ANSI: status, progress, boxes, trees, diagrams at ≤80 columns
argument-hint: "[status|progress|box|tree|diagram|fix]"
related:
  - report
  - draw-ansi
  - report-todo
  - report-progress
  - report-file-structure
  - report-architecture-diagram
  - report-flow
  - draw-svg-image
---

## Goal

Render a terminal-shaped report in chat — status lines, progress, boxed sections, file trees, and diagrams — where every outer box stays aligned, every line fits the viewer, and every mark traces back to real data

## Scope

- Use when the report is terminal-shaped: health/status, progress, log summary, UX/UI sketch, architecture, flow, or file tree
- Chat output only: the whole render sits inside one ` ```text ` block; this skill never writes a file
- Boundary: comparison across columns → `/report table`; action plan → `/report-todo`; repairing a distorted box → `/draw-ansi`; an image instead of text → `/draw-svg-image`; a long-form artifact → `/report`
- The view-specific report skills feed this render: `/report-progress` for a status snapshot, `/report-file-structure` for the layout, `/report-architecture-diagram` for components, `/report-flow` for execution order

## Execute

### 1. Collect The Data

> Goal: every mark in the render comes from evidence, never from imagination

1. Read the source: command output, log file, status command, or a codebase scan via `/code-search`
2. Count pass / warn / fail / skipped and keep the raw number behind each count
3. Name only components, routes, modules, and files that exist; an unknown value is `TBD`, never a guess
4. Keep the source label (command, path, or session) beside the summary so the numbers can be re-checked

### 2. Pick One View

> Goal: one view per report — status and diagram never compete for the same block

| Need | View |
|---|---|
| health, check results, counts | Summary block + status lines |
| completion of a long run | Progress bar + step line |
| grouped facts, layered sections | Boxed panel (`┌─┐│└─┘`) |
| target layout, moved files | File tree (`├── │ └──`) |
| flow, dependency, UI sketch | Diagram (arrows, decision, start/end) |
| what changes | Before block, then after block |

1. Pick the first view that answers the question; two questions → two blocks, never one merged block
2. A layout or dependency that flips direction → show `before` then `after` as two renders
3. Anything that does not fit a view belongs in a table via `/report` or a plan via `/report-todo`

### 3. Render

> Goal: uniform width, stable borders, symbols that carry meaning without color

1. Summary first, details below: counts by status, then the key findings, then the long lines
2. Keep every line at or under 80 columns; measure the longest inner line and pad the shorter ones
3. Boxes: outer `┌ ─ ┐ │ └ ┘`, dividers `├ ┤ ┬ ┴ ┼`, nested box never shrinks below its own content
4. File tree: one root line, `├──` and `└──` with `│` continuation, a `#` role comment after each folder that carries one; annotate only the branches the report covers
5. Diagrams: `→ ↓ ↑ ⇄ ↔` for direction, `◇` decision, `○` start, `●` end, `① ② ③` for ordered steps, `[Button]` `[Input]` `[✓]` `[ ]` for UI elements inside a sketch
6. Status markers: `[ok]` `[warn]` `[fail]` `[info]` inside boxes and aligned columns; single-width `✓ ✗ !` when the column is narrow; emoji only on a free-standing line where nothing needs to line up
7. Put the result in one ` ```text ` block — never ` ```ansi `
8. Fix a box that still drifts with `/draw-ansi --fix --width <n>` instead of nudging spaces by hand

### 4. Color And Safety

> Goal: color adds emphasis, never the only signal, and never breaks a log or a pipe

1. Colors are optional: green ok, red fail, yellow warn, blue info; bold for a header row
2. Markers carry the status on their own — a reader without color still reads the same result
3. Honor `NO_COLOR`; output that may be redirected, copied into a file, or pasted into a non-ANSI viewer → plain text
4. Use widely supported codes only; no 256-color palette, no background fills that hide text
5. No `**` bold and no escape codes inside a table cell that a Markdown renderer will parse

### 5. Verify Before Sending

> Goal: the block reads correctly in a monospace viewer at any width

1. Every line of a box has the same display width and the right borders form one column
2. No line exceeds 80 columns; no tab characters; no trailing spaces outside a box
3. No double-width character (emoji, CJK) inside an aligned column — measure, do not assume
4. Counts in the summary equal the counts in the detail, and both equal the source data
5. No invented component, route, or file; every `TBD` is genuinely unknown
6. A distorted render is a defect: fix it with `/draw-ansi` before sending, never ship it with a note

## Rules

### 1. Alignment First

- Uniform outer width, aligned right borders, padded inner lines — a broken border invalidates the whole render
- Box width follows the content plus padding, capped at 80 columns; truncate with `…` rather than overflow
- One indentation unit: 2 spaces, applied consistently at every nesting level

### 2. Evidence Before Decoration

- Design the view around the data collected in `### 1`, not around a shape that looks good
- A diagram of the target state is a plan, not an observation — say which one the block shows
- Nothing is invented to fill a box; an empty section is removed or marked `none`

### 3. One Meaning Per Symbol

- Each marker, arrow, and color has one meaning for the whole report; mixing two legends is a defect
- Status is never color-only, and never marker-only without a label in the detail lines
- Box styles do not mix: single-line `┌─┐` throughout, or double-line `╔═╗` throughout — never both in one render

### 4. Chat And Storage Safety

- Output stays in chat; writing a file belongs to `/report`, `/report-before-after`, or `/report-in-html`
- No secrets, tokens, or full raw logs in a render — summarize and keep the count
- A render that needs more than 80 columns is the wrong view, not the wrong terminal; switch to a table or split it

## Expected Outcome

- One aligned ` ```text ` block: summary, status, and the fitting view — nothing wider than 80 columns
- Boxes with uniform outer width, aligned borders, and no distorted nesting
- File trees and diagrams that reference only what exists, with before/after shown as two renders when a direction flips
- Status readable without color, escapes suppressed under `NO_COLOR` and plain-text output
- A defect repaired by `/draw-ansi` before sending, never shipped with a caveat
