---
title: Diagram Template
description: Mermaid diagram conventions - renders natively on GitHub
---

# Diagram Template

GitHub renders ` ```mermaid ` blocks natively — use them for architecture/flow instead of ASCII art when the diagram is complex.

```md
## Architecture

​```mermaid
flowchart LR
  A[Entry] --> B{Router}
  B -->|/rpc/*| C[API]
  B -->|else| D[Static assets]
​```
```

## Rules

- Mermaid for graphs/sequences/flows; fenced text for simple trees
- Node labels = real file/module names — no abstract boxes
- One diagram per concern; link the page that describes it
- Verify syntax: `bunx @mermaid-js/mermaid-cli` or GitHub preview
