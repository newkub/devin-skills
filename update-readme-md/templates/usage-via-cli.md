## Usage via CLI

```bash
bunx <package> --help
```

```text
┌──────────────────────────────────────────────────────────┐
│  $ bunx <package> --help                                 │
│                                                          │
│  USAGE                                                   │
│    <package> <command> [options]                         │
│                                                          │
│  COMMANDS                                                │
│    generate    Generate a resource                       │
│    copy        Copy the last result                      │
│                                                          │
│  OPTIONS                                                 │
│    --length    Length of the output         [default: 16]│
│    --help      Show this help message                    │
└──────────────────────────────────────────────────────────┘
```

| api | description | options | default |
|-----|-------------|---------|---------|
| `generate()` | Generate a resource | `length`, `uppercase`, `lowercase`, `numbers`, `symbols` | `length=16`, all enabled |
