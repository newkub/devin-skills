# Best Practice — Reverse Engineering With REA

> REA hands an agent structure over an artifact it cannot read as source. The value is in evidence that survives review, not in volume. Source: https://rea.tools and `github.com/morluto/rea` (accessed 2026-10-24)

## 1. Pick the surface before the tool

| Target | Surface | Why |
|---|---|---|
| Bundled JS app, ASAR, Electron `app.asar` | Static JS analysis | No execution, no engine, deterministic graph |
| Native binary (PE/ELF/Mach-O) | Provider session | Needs Hopper, Ghidra, or IDA |
| Running page in a Chromium-family browser | Passive CDP observation | No code evaluation, no automation |
| Running Electron `file://` renderer | Passive Electron inspection | Reads renderer state you already have |
| APK, .NET, WASM, SQLite, Go/Rust/Python/Erlang | Format-specific inspector | Answers metadata questions without a decompiler |
| Two builds, or source vs build | Comparison | A diff is a finding; a re-analysis is a rerun |

Choosing the surface first is what keeps a 300 MB analysis from landing in the context window. Running a decompiler on a case a static parse could answer costs minutes and buys nothing.

## 2. Write evidence once, then project

```bash
rea analyze-javascript-application /abs/path/to/app --json > app-evidence.json
jq -c '{source:{kind:"inline",evidence:.},view:{kind:"summary"}}' app-evidence.json > app-view.json
rea inspect-analysis-view --input app-view.json
```

Read the summary, then page into the one collection the question needs:

```bash
jq -c '{source:{kind:"evidence-file",path:"app-evidence.json"},view:{kind:"page",collection:"modules",offset:0,limit:32}}' \
  | rea inspect-analysis-view
```

`{"kind":"evidence-file"}` resolves relative to the CLI working directory; the MCP server needs an absolute path. Prefer one analysis plus projected views over repeated full analyses — the second run is both slower and a different snapshot.

## 3. Keep fact, observation, and unknown apart

Label every claim:

| Label | Means | Acceptable source |
|---|---|---|
| Static inference | Read from the artifact without running it | Module graph, strings, imports, decompiled bodies |
| Runtime observation | Seen in a live process or page | `observe-web-session` events, IPC channel metadata |
| Unknown | Not established | Empty page, exhausted search, ambiguous candidate |

An empty result from a partially analyzed target is not absence — it is absence from what was parsed. Check `coverage`, `limitations`, `unknowns`, and `normalized_result.statistics.parse_failures` before writing "not present".

## 4. Probe native code in a fixed order

`binary_overview` → `search` → `function` → `decompile` → `xrefs` → `trace` → `instructions`.

- Overview first: architecture, sections, imports, entry points — often enough to answer the question.
- Search strings and imports before decompiling; a literal seed is cheaper and more reliable than browsing functions.
- Decompilation is a reading aid. Validate any conclusion against strings, imports, xrefs, and instructions; a decompiler can invent a plausible-looking signature.
- `inspect-binary-layout`, `inspect-pe-certificates`, and `inspect-elf-notes` answer metadata questions with no decompiler at all.

## 5. Never let the tool pick the provider silently

- One provider stays bound to one session — reopen the binary to change it.
- `capability_unavailable` carries `details.selection_reason`. `ambiguous` means take an id from `details.candidate_ids`. `provider_unavailable` means repair the engine — not switch silently.
- CLI `--provider <id>` overrides the default; MCP `open_binary` takes `provider_id`.
- Hopper does not run on Windows. Plan for Ghidra (experimental, read-only, PE on local NTFS) or IDA there before promising a native deep dive.
- Linux needs a procps-compatible `ps` on `PATH` before the supervisor will launch Ghidra, JADX, firmware tools, or static JS analysis.

## 6. Close what you open

Retained evidence references are scoped to one connection. Call `export_evidence_bundle` before `close_binary` if the result must outlive the session, and treat a reference id from a dead connection as invalid rather than retrying it.

## 7. Treat output as a report, not a dump

- Default TOON is for reading; `--json` for machines (indented on a TTY, compact when piped).
- `--full-output` wraps everything in `{ok,error,meta}`. It makes a result parseable; it never proves completeness.
- `--detail summary`, `--evidence_output FILE`, and `--filter-output` exist so the answer arrives without the payload.
- `set -o pipefail` whenever output is piped — `| head` closes the pipe and the producer exits 141, which a plain pipeline reports as success.
- Exit `0` means the operation completed; partial evidence is still exit `0`. It is not a security verdict.

## Pitfalls

- Running the decompiler first on a bundle that a static analysis could map → expensive, and the decompiler output hides the module boundaries you actually need.
- Piping analysis JSON into `jq` and reading the whole thing → the context window is the budget you are trying to protect.
- Reporting a provider failure as "not found in binary" → the analysis never ran.
- Comparing two builds without checking coverage on both sides → a one-sided `added`/`removed` is only valid when the opposite graph has complete coverage.
- Analyzing third-party artifacts or pointing a debugging endpoint at a non-loopback interface → authorization and exposure, not analysis, become the finding.

## Related

- `references/apis.md`
- `usecases/triage-native-function.md`
- `usecases/trace-electron-feature.md`
- `usecases/observe-and-compare-web-page.md`
- `usecases/ci-static-analysis.md`
