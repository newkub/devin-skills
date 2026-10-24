---
name: report
description: "Pick the fitting report format: table or numbered list"
argument-hint: "[scope]"
related:
  - report-ansi
  - report-todo
  - report-progress
  - suggest-next-action
  - deep-review

---

## Goal

Select and execute the report format that fits the context

## Scope

Used for reporting results in chat; `/report` dispatches to `report-table` or `report-numbered` based on the data type

- Merged capability from the original skills that were moved into workflows
- Terminal-shaped reports (status, progress, boxes, trees, diagrams) live in the `/report-ansi` skill; `references/format-ansi.md` is kept only as a pointer
- References: [Format codeblock](references/format-codeblock.md), [Format numbered bullet](references/format-numbered-bullet.md)

## Execute

### Workflows

| Domain      | Workflow |
|-------------|----------|
| `table`     | `workflows/table/SKILL.md` — reply as a table with a `No.` column, ordered |
| `html`      | `workflows/html/SKILL.md` — single interactive HTML file in the browser |
| `numbered`  | `workflows/numbered/SKILL.md` — numbered list sorted by priority |
| `codeblock` | `workflows/codeblock/SKILL.md` — code blocks for commands, snippets, config, logs, diff |

### 1. Select Format

> Goal: Pick the report format

1. If the data suits a multi-column table → use `/report table`
2. If the data suits steps/priority ordering → use `/report numbered`
3. If it is an action plan from chat not yet executed → use `/report-todo`
4. If it is commands, code snippets, config, logs, diff → use `/report codeblock`
5. If it is progress/status → use `/report-progress`
6. If it is terminal-shaped — status lines, progress bars, boxed panels, file trees, flow or architecture diagrams — use `/report-ansi`
7. If it is TODO markers → read `TODO.md` + use `/scan-codebase` to find `TODO`/`FIXME`/`HACK` markers, then report table

### 2. Execute Selected Skill

> Goal: Report in the chosen format

1. Pass the data to the selected skill
2. Check that the output matches the format
3. If needed, use `/deep-review`

### 3. Apply UX/UI Format

> Goal: Make the report easy to read

1. Follow `[references/uxui.md](references/uxui.md)`
2. Use emoji per the defined legend
3. Sort by status with `completed` on top
4. Do not use bold markers

### 4. Finalize

> Goal: Summarize and point to the next action

1. Run `/suggest-next-action` if there are next steps
2. If the output came from `/report-todo`, it must be numbered bullets, one action per bullet, with no table

## Rules

- `/report` does not write the report itself — it dispatches to a sub-format
- Use `/report table` when the work has comparison/status across multiple columns
- Use `/report numbered` when the work emphasizes step order
- Use `/report-todo` when the work has not started and needs an action plan
- Use `/report-ansi` when the output is terminal-shaped: status lines, progress bars, boxed panels, file trees, or diagrams; render it in one ` ```text ` block at most 80 columns wide
- Every table must have the `No.` column first
- Every report must summarize key findings at the top
- Use emoji per the legend in `references/uxui.md`
- Do not use bold markers

- Every report of review findings goes out via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files


## Expected Outcome

- The report comes out in the fitting format
- `/report-todo` for action plans from chat
- Key findings and next action clearly summarized
