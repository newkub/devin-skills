# Capture Terminal


Capture terminal output as PNG/SVG/HTML images for docs/README/reports via `capture terminal` (merged from `capture-terminal`)

#### Terminal — Execute

##### 1. Capture

```bash
bun D:/newkub/agents-capture/src/presentation/cli.ts terminal --cmd "<command>" --out <file.png>
bun D:/newkub/agents-capture/src/presentation/cli.ts terminal --cmd "git log --oneline -5" --out docs/screenshots/git-log.png --title "Git Log"
```

- The CLI runs `--cmd`, captures stdout/stderr as text, then pipes it into the installed tool
- `--tool auto` (default) picks by file extension: `terminal-shot` → `termframe` → `termshot`
- `--theme dark` (default) — choices are `dark`, `catppuccin`, `tokyo-night`, `github-dark`

##### 2. Tool Selection (choose it yourself via `--tool`)

| Tool | Formats | Best for | Install |
|------|---------|---------|---------|
| `terminal-shot` | png, svg, html | documentation/README — themes + window chrome | `bun add -g terminal-shot` |
| `termframe` | svg | precise vector output, auto-sizing | `scoop install termframe` |
| `termshot` | png | CI/CD pipelines | GitHub releases: `mr-pmillz/termshot` |

- If no tool is installed → the CLI errors with an install hint
- Quick screenshot without a tool → Windows Snipping Tool (`Win + Shift + S`)

##### 3. Direct Tool Usage (advanced options)

```bash
terminal-shot --output <path>.png --theme dark --title "Title"   # stdin
termframe -o <path>.svg -- <command>                              # runs the cmd itself
echo "text" | termframe -o <path>.svg                             # from text
termshot <command>            # or termshot --raw-read < file.txt
```

#### Terminal — Rules

- PNG for raster/web, SVG for vector/print, HTML for interactive docs
- Store files in `docs/screenshots/` or `test/screenshots/` — name them after the command/test case, e.g. `cli-help.png`
- Set a suitable terminal size (80x24 or 120x30), a readable monospace font, and good contrast
- Avoid overly long output — use `--max-height` if the tool supports it
- Use /capture web when you need to capture a web terminal (ttyd, etc.)

#### Terminal — Expected Outcome

- A high-quality terminal output image at the given path, easy to read and suitable for documentation

