# Lib Markdown It CLI

## Install

```sh
bun add markdown-it        # binary `markdown-it` มากับ package
```

## Commands

| Command | Description | Options |
|---|---|---|
| `markdown-it <file>` | Render markdown → HTML | `--html`, `--linkify`, `--typographer` |
| `cat file.md \| markdown-it` | Stdin render | - |
| `markdown-it --version` | Show version | - |

## Examples

```sh
bunx markdown-it README.md > out.html
bunx markdown-it --html --linkify notes.md
```
