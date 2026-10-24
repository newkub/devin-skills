# File Structure Report

Root: [...] · Depth: [...] · Date: [...] · Filtered: [...] entries (`node_modules`, `.git`, `dist`, `build`, `.cache`)

```text
📁 <root>/
├── 📁 <dir>/              (<file count>)
│   ├── 📁 <subdir>/
│   └── 📄 <file> (<size>)
├── 🔧 <config file>
├── 📦 <package file>
└── ...                    (beyond depth — hidden count stated below)
```

## Stats

| No. | Metric | Value |
|---|---|---|
| `1` | `Total files` | `...` |
| `2` | `Total size` | `...` |

## Fill Rules

- Tree characters `├── │ └──` only; at each level directories first, then files, alphabetical.
- Icons: `📁` directory, `📄` file, `🔧` tooling/config, `📦` package; never show binary files.
- Default depth 3; cut deeper directories with `...` and state the hidden-file count in the summary.
- Show size only on large files (top 5 largest listed); show file counts on directories.
- Mark entry points, config, documentation, and CI/CD files as highlights.
- Stats count only unfiltered files; state percentage per file type; separate source from generated files.
