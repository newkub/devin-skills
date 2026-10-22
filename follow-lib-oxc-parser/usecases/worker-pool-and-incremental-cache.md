# Use Case — Parse a Large Repo with Workers and a Cache

> Parsing thousands of files sequentially is usually fine; the pool and the cache exist so a second run only re-parses what changed. Source: https://raw.githubusercontent.com/oxc-project/oxc/main/napi/parser/README.md (accessed 2026-10-20)

## 1. Decide whether you need workers at all

| Files | Approach |
|-------|----------|
| up to a few thousand | Sequential `parseSync` in one process |
| tens of thousands, or heavy per-node analysis | Worker pool + `parseSync` inside each worker |
| I/O-bound (network files, huge reads) | `parse()` is reasonable; otherwise it only adds overhead |

Oxc is roughly 3x faster than Babel and 2x faster than SWC, so the pool is for CPU-bound post-analysis, not for parsing alone. A thread per file loses to a sequential loop — chunk the work.

## 2. One module that runs as both main and worker

```ts
// scripts/parse-pool.ts
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { availableParallelism } from "node:os";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { parseSync } from "oxc-parser";

type Job = { file: string; source: string };
type Summary = { file: string; errors: number; imports: number; exports: number };

function summarize({ file, source }: Job): Summary {
  const result = parseSync(file, source);
  return {
    file,
    errors: result.errors.length,
    imports: result.module.staticImports.length,
    exports: result.module.staticExports.length,
  };
}

if (!isMainThread) {
  parentPort!.postMessage((workerData as Job[]).map(summarize));
} else {
  await main();
}
```

The worker entry is the same file — `new Worker(new URL(import.meta.url))` works for `.ts` only under a runtime that strips types (Bun, Node 22+ with type stripping); otherwise point at the compiled `.js`.

## 3. Chunk by CPU count, not by file

```ts
function chunk<T>(items: T[], parts: number): T[][] {
  const size = Math.ceil(items.length / parts);
  return Array.from({ length: parts }, (_, i) => items.slice(i * size, (i + 1) * size))
    .filter((c) => c.length > 0);
}

function runWorker(batch: Job[]): Promise<Summary[]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), { workerData: batch });
    worker.once("message", resolve);
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (code !== 0) reject(new Error(`worker exited with ${code}`));
    });
  });
}
```

`availableParallelism()` beats `cpus().length`, and leaving one core free keeps the machine responsive and the main thread able to aggregate results.

## 4. Cache by mtime and size, and re-verify when it matters

```ts
type Cache = Record<string, Summary & { mtimeMs: number; size: number }>;

function loadCache(path: string): Cache {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Cache;
  } catch {
    return {};
  }
}

function isFresh(file: string, entry: Cache[string] | undefined): boolean {
  if (!entry) return false;
  const stat = statSync(file);
  return entry.mtimeMs === stat.mtimeMs && entry.size === stat.size;
}

function saveCache(path: string, cache: Cache) {
  writeFileSync(path, JSON.stringify(cache));
}
```

`mtimeMs` plus `size` misses two edits inside the same millisecond and a same-length rewrite. Hash the source while you read it (`Bun.hash`, `createHash("sha256")`) when a stale cache would produce a wrong verdict, such as a lint gate.

## 5. Read only what changed

```ts
async function main() {
  const files = listSourceFiles("src");
  const cache = loadCache(".cache/ast-summary.json");

  const changed = files.filter((f) => !isFresh(f, cache[f]));
  const jobs = changed.map((file) => ({ file, source: readFileSync(file, "utf8") }));

  const workers = Math.max(1, availableParallelism() - 1);
  const summaries = (await Promise.all(chunk(jobs, workers).map(runWorker))).flat();

  for (const summary of summaries) {
    const stat = statSync(summary.file);
    cache[summary.file] = { ...summary, mtimeMs: stat.mtimeMs, size: stat.size };
  }

  saveCache(".cache/ast-summary.json", cache);
  console.log(`${files.length - changed.length} cached, ${changed.length} parsed, ${summaries.filter((s) => s.errors > 0).length} with errors`);
}

function listSourceFiles(root: string): string[] {
  return readdirSync(root, { recursive: true, encoding: "utf8" })
    .filter((f) => /\.(m?[jt]sx?|d\.ts)$/.test(f))
    .filter((f) => !/(^|\/)(node_modules|dist|build|coverage)\//.test(f))
    .map((f) => join(root, f));
}
```

Filtering before reading is what makes the run fast — a `node_modules` walk dwarfs parsing cost.

## 6. Keep memory flat in the sequential path

```ts
// sequential variant: read, parse, summarize, drop the source before the next file
for (const file of files) {
  const summary = summarize({ file, source: readFileSync(file, "utf8") });
  results.push(summary);
}
```

An AST is several times larger than its source, and in this variant the source is also freed each iteration. Holding every `program` alive across a repository is the fastest way to run out of heap — keep the summary, never the tree.

## 7. Verify

1. Run twice with no edits — the second run reports every file as cached and exits quickly
2. Touch one file — exactly one file is re-parsed
3. Delete the cache — the full run still produces the same summaries
4. Compare worker output with a sequential run — identical counts for every file
5. Kill a worker mid-run (throw inside `summarize`) — the promise rejects instead of hanging
6. Parse a repo containing `node_modules` — no file from that directory appears in the summary
7. `/run-profiler` — the pool beats the sequential path only on the large fixture, not on the small one

## Pitfalls

- One worker per file — thread startup and message copies cost more than the parse itself.
- `worker.once("message", resolve)` without an `exit` check, so a worker crash looks like a success with no data.
- Caching by path alone, so a stale entry survives an edit and the gate passes on old code.
- Re-parsing unchanged files because the cache key includes absolute paths that differ between CI and a laptop.
- Keeping every AST in an array "for later" and hitting the heap limit on a large repo.
- Using async `parse()` inside the worker and awaiting it in a loop — no gain over `parseSync`.
- Assuming the NAPI binary works on Bun without a smoke test; fall back to Node/`tsx` if the `.node` module misbehaves.

## Related

- `references/apis.md`
- `best-practices/ast-analysis.md`
- `usecases/extract-imports-and-exports.md`
- `usecases/parse-errors-and-dialects.md`
