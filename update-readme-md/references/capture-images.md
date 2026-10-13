# Step: Draw Usage ANSI

> Goal: Draw supporting ANSI for the Usage section instead of capturing images

## Execute

### 1. Draw Web Usage ANSI

> Goal: Draw ANSI showing the web page layout for Usage via Web

1. Wrap the content in a `<details>` + `<summary>` accordion
2. Inside, draw the main layout of the web page with box-drawing characters
3. Show key UI elements: header, main content, buttons, inputs
4. Use a ` ```text ` codeblock
5. Every line must have the same length — pad with spaces so the right borders align

### 2. Draw CLI `--help` ANSI

> Goal: Draw ANSI showing the terminal output of `command --help` for Usage via CLI

1. Show the command `bunx <package> --help` or `<cli-binary> --help` in a bash codeblock
2. Draw the `--help` terminal output with box-drawing characters
3. Include the Usage, Options, and Commands/Subcommands shown in the help
4. Use a ` ```text ` codeblock
5. Every line must have the same length

### 3. Draw TUI Usage ANSI

> Goal: Draw ANSI showing the TUI layout for Usage via TUI

1. Wrap the content in a `<details>` + `<summary>` accordion
2. Inside, list the key shortcuts (e.g. `↑`/`↓`, `Enter`, `q`)
3. Draw the TUI screen with box-drawing characters
4. Use a ` ```text ` codeblock
5. Every line must have the same length

### 4. Draw Other Usage ANSI

> Goal: Draw ANSI for other access methods (Desktop, Extension)

1. Draw a suitable layout or output with box-drawing characters
2. Use a ` ```text ` codeblock
3. Every line must have the same length

## Rules

- No need to use `/capture web` or `/capture terminal` for the README
- Use ANSI box-drawing characters to draw instead of capturing real images
- `Usage via Web` and `Usage via TUI` must be inside a `<details>` + `<summary>` accordion
- CLI: show the ANSI of `command --help` specifically
- Every line in the ANSI codeblock must have the same length — pad with spaces so the right borders align
- Use a ` ```text ` codeblock (not ` ```ansi ` to avoid color rendering on GitHub)
- Check that every line has complete box-drawing borders on both left and right
- Width should be identical on every line — use a fixed width, e.g. 60 characters
- No ANSI below the logo/badges in the Hero section

