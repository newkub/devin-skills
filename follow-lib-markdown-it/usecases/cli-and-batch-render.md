# Use Case — CLI and Batch Rendering

> Render one file from the terminal, then render a docs tree with a script that skips unchanged files. Source: https://github.com/markdown-it/markdown-it (accessed 2026-10-20)

## 1. Render one file from the CLI

```bash
bunx markdown-it README.md > README.html
bunx markdown-it --linkify --typographer docs/guide.md > guide.html
```

The CLI prints HTML to stdout, so redirection is the output step. `--html` also exists and enables raw HTML — use it only for a file you maintain, never for content authored by someone else.

## 2. Pipe a snippet

```bash
cat notes.md | bunx markdown-it
```

Stdin rendering is the fastest way to check what a construct produces before writing code: paste a table, a nested list, or a link with a title and read the HTML.

## 3. Batch render a folder

```ts
// scripts/render-docs.ts
import { Glob } from "bun";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt("commonmark", { html: false, linkify: true });

for await (const file of new Glob("docs/**/*.md").scan(".")) {
  const source = await Bun.file(file).text();
  const target = `dist/${file.replace(/\.md$/, ".html")}`;

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `<!doctype html><meta charset="utf-8">${md.render(source)}`);
}
```

One instance for the whole run — constructing `MarkdownIt` per file reloads every rule and plugin for nothing. `mkdir` with `recursive: true` is required because the output tree mirrors directories the first file may not have created.

## 4. Skip unchanged files

```ts
const manifestPath = "dist/render-manifest.json";
const manifest: Record<string, string> = await Bun.file(manifestPath)
  .json()
  .catch(() => ({}));

const hash = new Bun.CryptoHasher("sha256").update(source).digest("hex");
if (manifest[file] === hash) continue;

manifest[file] = hash;
```

A docs build re-renders hundreds of files on every run otherwise. Keying the manifest by path and content hash keeps the build incremental and makes a deleted page visible as a stale entry.

## 5. Fail the build on a render error

```ts
try {
  await writeFile(target, md.render(source));
} catch (error) {
  console.error(`render failed: ${file}`);
  throw error;
}
```

With a plugin such as a highlighter, a bad language name can throw mid-render. A build that logs and continues ships a page with missing content; naming the file and rethrowing stops it at the source.

## 6. Verify

1. `bunx markdown-it README.md | head -20` — the output starts with the expected tag, not an error
2. Run the batch script twice — the second run writes nothing and the manifest is unchanged
3. Add a new markdown file — exactly one new HTML file appears
4. Open one generated page in a browser — links, code, and tables render as expected
5. `/run-build` — the docs step is part of the build, not a manual command

## Pitfalls

- Using `--html` for user-authored markdown, which turns the CLI into an XSS generator.
- Constructing a new `MarkdownIt` per file, so plugin setup dominates the build time.
- Writing to a nested path without creating the directory first, which throws `ENOENT`.
- Treating a render error as a warning, so one broken page ships silently.
- Caching by path only, so an edited file keeps its old HTML.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/rendering.md`
- `usecases/presets-and-hardening.md`
- `usecases/render-with-shiki.md`
