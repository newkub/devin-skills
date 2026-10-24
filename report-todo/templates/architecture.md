# Plan Context — Architecture, File Structure, Tech Stack

Source: [actions from the plan]
Scope: [structure, layout, or stack change being planned]
Date: [YYYY-MM-DD]

Draw each block only when its scope changes; skip it when nothing changes.

## Architecture — before the plan table, when structure changes

```text
┌──────────────────┐      ┌──────────────────┐
│ [module A]       │─────▶│ [module B]       │
└──────────────────┘      └──────────────────┘
```

## File Structure — after the diagram, when the layout changes

```text
[root]/
├── [dir-a]/         # [role the folder carries]
└── [file-b]         # [what the plan changes here]
```

## Tech Stack — after the tree, when a choice is added or open

| No. | Layer | Tech |
|---|---|---|
| 1 | `[layer name]` | `[tech, with its layer boundary or TBD]` |

## Fill Rules

- Diagrams and trees are chat-only ANSI: no emoji and no `**` bold inside them.
- Every outer box uses uniform width with the right border aligned and undistorted — fix with `/draw-ansi`.
- A dependency that flips direction → `before` then `after` as two diagrams; files that move → two trees, never one mixed tree.
- The tree shows the target layout only: one root line, a `#` comment per folder that carries a role, unrelated branches kept out; the deep scan of an existing tree belongs to `/report-file-structure`.
- `Tech` names the boundary when a library is allowed in one layer only and `TBD` while the choice is open; before proposing a new dependency run `/follow-my-techstack` and `/use-lib-effective`.
