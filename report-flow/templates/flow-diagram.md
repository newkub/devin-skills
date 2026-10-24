# <Flow Name>

Source: [...] · Trigger: [...] · End: [...] · Stakeholders: [...] · Date: [...]

## Steps

1. `<step name>` — Action: [...], Responsible: [...], Input: [...], Output: [...]
   1.1 `<sub-step>` — Action: [...], Input: [...], Output: [...]
> if `<condition>` → `<path A>`, if not → `<path B>`
2. `<step name>` — ... (loop: repeat while `<condition>`)

## Overview

| No. | Step | Action | Input | Output | Tool |
|---|---|---|---|---|---|
| `1` | `...` | `...` | `...` | `...` | `...` |

## Fill Rules

- One action per step; split steps that hold multiple actions; never merge systems without stating it.
- Every step states action, responsible party, input, and output; the system used goes in the `Tool` column.
- Decision points use the `> if ... → ..., if not → ...` form; when several options exist, state the default path.
- Loops state the condition that repeats; state the failure path when one exists.
- `No.` is the continuous step number 1..N ordered by time/dependency, matching the numbered list.
- Use general language, not tied to specific tools; keep a reusable flow in `docs/flows/`.
