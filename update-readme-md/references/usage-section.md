# Usage Section

> Goal: Write `## Usage` covering every access method with ANSI drawing

## Section Structure

`## Usage` must have a `### Usage via ...` for each access method the project supports:

- Web
- API
- CLI
- SDK
- TUI
- Desktop
- Browser Extension

## Content Types

### Usage via Web

- Wrap the content in a `<details>` + `<summary>` accordion
- The summary states a short flow/screen description, e.g. `Web app click flow & layout`
- Inside: text instructions saying what to press where + ANSI drawing showing the layout

### Usage via API

- Code block with import and function call
- Examples must be runnable
- Followed by a references table `| api | description | options | default |`

### Usage via CLI

- Bash code block with `command --help`
- The ANSI drawing must show the terminal output of `--help` specifically
- Include Usage, Options, and Commands/Subcommands as shown in the help

### Usage via SDK

- Code block with install + import + usage
- A complete example covering all 3 parts
- Followed by a references table if present

### Usage via TUI

- Wrap the content in a `<details>` + `<summary>` accordion
- The summary states the TUI flow, e.g. `TUI keyboard shortcuts & layout`
- Inside: text instructions for the key shortcuts + ANSI drawing showing the TUI layout

### Usage via Desktop / Browser Extension

- Text instructions explaining how to open/install and use it
- Followed by an ANSI drawing showing the layout when appropriate

## Accordion Rules

- `Usage via Web` and `Usage via TUI` must wrap their content in `<details>` + `<summary>`
- The `<details>` block must have a blank line before opening and before closing
- Inside the accordion must contain text instructions + ANSI drawing

## ANSI Rules

- Use the ` ```text ` codeblock (not ` ```ansi `)
- Use ANSI box-drawing characters to draw the layout/output
- Every line must be the same length — use space padding to align the right border
- The width should be the same on every line — use a fixed width, e.g. 60 characters
- No need to use `/capture web` or `/capture terminal` for the README

