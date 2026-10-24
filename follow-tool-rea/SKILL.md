---
name: follow-tool-rea
description: Use REA to reverse-engineer binaries, JS/Electron apps, and web pages via its MCP server and CLI
argument-hint: "[scope]"
related:
  - deep-analyze
  - use-chrome-devtools
  - analyze-attack-surface
  - follow-tool-github-actions

---

## Goal

Inspect a target the agent cannot read as source — a native binary, a JavaScript/Electron bundle, a live page, an APK, .NET, WASM, SQLite, or firmware payload — through REA's MCP server and `rea` CLI, keeping every finding tied to retained evidence instead of inference

## Scope

For artifacts whose source is not in the repository, or where a shipped artifact must be compared against source

- REA = "Reverse Engineering for your coding agent": one local MCP server plus the `rea` CLI over the same contracts
- Package `rea-agents@6.7.0` (npm latest, verified 2026-10-24), MIT, bins `rea` and `rea-agents`; docs https://rea.tools, repo `github.com/morluto/rea`
- Analysis runs locally, but results are returned to the agent — the model provider's data policy applies to whatever the analysis surfaces
- Static JavaScript/Electron analysis needs no native engine, Java, browser, Docker, or API key; native decompilation needs Hopper, Ghidra, or IDA
- Not a general browser-automation surface — CDP use here is passive observation; active automation belongs to `/use-chrome-devtools` and the Playwright family
- Owner domain: `/deep-analyze` (unknown-artifact analysis); exposed-surface triage after a finding → `/analyze-attack-surface`
- CI wiring for the pinned static-analysis job → `/follow-tool-github-actions`

## Execute

### 1. Install And Connect

> Goal: register the MCP server and matching skill without hand-editing client config

1. Guided setup: `npx rea-agents@latest setup` — backs up config, asks before applying, and installs both the MCP connection and REA's own `reverse-engineer-anything` skill
2. Target one client: add `--client <id>`; plan without writing: add `--dry-run` (prints `planned`, exit 0)
3. Client IDs: `claude_code`, `claude_desktop`, `codex`, `cursor`, `gemini_cli`, `windsurf`, `devin`, `opencode`, `antigravity`, `copilot_cli`, `commandcode`, `qwen_code`, `kimi`, `vscode`, `grok_build`, `omp`, `pi`, `hermes`, `qoder`, `droid`, `trae`, `workbuddy`, `zcode`, `dsh`
4. Registry registrations pin the version that performed setup — updating the package does not update a running server; re-run scoped setup and restart the client
5. Permanent CLI: `npm install --global rea-agents` (or `bun add -g rea-agents`); one-shot use: `npx -y rea-agents@latest <command>`
6. Windows: use `npx.cmd` when script execution is disabled by policy
7. Skill-only install (`npx skills add morluto/rea --skill reverse-engineer-anything`) carries instructions but no MCP connection — it is never sufficient on its own
8. Remove: `rea uninstall` (registrations + skill files) or `rea uninstall --purge-data` (also `~/.rea` cache/state)

### 2. Check Readiness For The Task

> Goal: verify only the surface the task needs

1. One agent registration: `npx -y rea-agents@latest doctor --client <id> --json` → `"healthy": true`
2. One native engine: `rea doctor --provider ghidra --json` (or `hopper`, `ida`)
3. Installed instructions: `rea doctor --skill --json`
4. Per-operation availability for the live session: call `binary_session` with `{}` and read `result.tool_availability` — it works before any target is open and is more precise than `doctor` for MCP
5. Audit-wide `healthy: false` does not block a task whose own scope check passes — prefer a scoped report over declaring the tool broken
6. Linux: the shared process supervisor needs a procps-compatible `ps` on `PATH` before it will launch Ghidra, JADX, firmware tools, or static JS/Electron analysis

### 3. Pick The Entry Surface

> Goal: choose the operation before touching the target

| Target | Entry |
|---|---|
| Bundled JS app, ASAR, Electron `app.asar` | `analyze-javascript-application` (static, no execution) |
| Native binary (PE/ELF/Mach-O) | `open_binary` → `binary_overview` → `search`/`function`/`decompile`/`xrefs`/`trace` |
| Live web page in a Chromium-family browser | `list-browser-targets` → `inspect-web-page` / `observe-web-session` |
| Running Electron `file://` renderer | `list-electron-targets` → `inspect-electron-page` |
| APK, .NET/managed, WASM, SQLite, Go/Rust/Python/Erlang artifacts | the matching `inspect-*` command |
| Two builds, or build vs source | `compare`, `compare-application-versions`, `compare-source-to-bundle` |
| Traffic capture | `inspect-artifact` over HAR/SAZ, `capture-process` / `compare-process-captures` |

### 4. Static JavaScript And Electron Analysis

> Goal: map a bundled application without executing it

1. `rea analyze-javascript-application /abs/path/to/app --json > app-evidence.json` — accepts an application directory or an ASAR, not a single source file
2. Project the result instead of re-reading: `inspect-analysis-view` with `{"kind":"summary"}`, or a page view `{"kind":"page","collection":"modules","offset":0,"limit":32}`
3. Trace one feature from a literal seed — `trace-application-feature` accepts `node`, `route`, `string`, `api`, `ipc-channel`, `module`, or native export; exact or literal-substring only, no regex
4. Follow data flow with `trace-javascript-semantics` (`backward-provenance`, `forward-influence`, `callers`, `ownership`)
5. Compare versions with `compare-application-versions` — items are `unchanged`/`added`/`removed`/`changed`/`unknown`, and one-sided absence is only `added`/`removed` when the opposite graph has complete coverage
6. Bind source to bundle with `import-reference-source` + `compare-source-to-bundle`, and export shapes with `compare-javascript-export-shapes`
7. A native handoff appears only when the add-on's exact content digest matches provider evidence; otherwise the result reports `requires-provider-analysis` and REA never starts a provider implicitly

### 5. Native Binary Analysis

> Goal: decompile with an explicit, licensed provider

1. Providers: Hopper (macOS 12+ / Linux, not Windows), Ghidra 12.1.4 + JDK 21+ (Windows x64 experimental, read-only, PE on local NTFS), IDA (verified profiles)
2. Set `GHIDRA_INSTALL_DIR` / `JAVA_HOME` / `REA_IDA_MCP_CONFIG`, or default via `REA_ANALYSIS_PROVIDER`
3. CLI `--provider <id>` overrides default; MCP `open_binary` takes `provider_id` and the provider stays bound to that session
4. `ambiguous` selection returns `candidate_ids` — pick one; `provider_unavailable` means repair the engine, not switch silently
5. Probe order: `binary_overview` → `search` → `function` → `decompile` → `xrefs` → `trace` → `instructions`; `inspect-binary-layout`, `inspect-pe-certificates`, and `inspect-elf-notes` answer metadata questions without a decompiler
6. Close sessions with `close_binary` — retained evidence references are scoped to one connection

### 6. Passive Web And Electron Observation

> Goal: observe a page you already have running, without evaluating code

1. Start your own browser with a dedicated profile: `--remote-debugging-port=9222 --user-data-dir=<tmp>`; REA never launches or terminates it
2. Endpoints are literal loopback only (`http://127.0.0.1:PORT` or `ws://127.0.0.1:PORT/devtools/browser/<id>`); `localhost`, LAN, HTTPS, credentials, queries, and wildcards are rejected
3. Since Chrome 136 `--remote-debugging-port` is ignored for the default profile — use a dedicated profile, or `chrome://inspect/#remote-debugging` and pass the browser socket
4. `inspect-web-page` returns DOM, accessibility nodes, scripts, resources, safe metadata, network/console metadata, and optional redacted storage fingerprints
5. `observe-web-session` records ordered reload, SPA navigation, redirect, failure, lifecycle, and target-termination events for an external action — it is not a clicker
6. `analyze-web-bundle` parses captured scripts statically; `compare-web-captures` and `compare-web-screenshots` diff two captures (missing or truncated evidence is never treated as equivalence)
7. Electron: passive `inspect-electron-page` over an existing endpoint, or active `capture-electron-scenario` which launches the app through Playwright and owns its lifetime

### 7. Handle Output, Evidence, And Large Results

> Goal: keep a 300 MB analysis out of the context window

1. Default output is TOON; `--json` indents on a TTY and compacts when piped; `--format md` for reports
2. `--full-output` wraps everything in `{ok,error,meta}` — use it when a result must be machine-parsed, never as proof of completeness
3. `--detail summary` and `--evidence_output FILE` deliver compact answers from the CLI
4. Large-evidence pattern: write the full record once, then project it — `jq -c '{source:{kind:"inline",evidence:.},view:{kind:"summary"}}' app-evidence.json > app-view.json` and feed that to `inspect-analysis-view`
5. `{"source":{"kind":"evidence-file","path":"…"}}` works too: the CLI resolves relative to the cwd, the MCP server needs an absolute path
6. MCP analysis returns `evidence_id`; reuse `{"kind":"retained-evidence","evidence_id":"…"}` within the same connection, and `export_evidence_bundle` before closing
7. `--token-limit` / `--token-offset` paginate oversized output; `--filter-output` narrows it in place

### 8. Read Failure And Coverage Honestly

> Goal: never turn a partial analysis into a green claim

1. Exit codes: `0` completed (partial evidence is allowed), `1` could not complete, `128+N` signal-derived (`130` SIGINT, `143` SIGTERM, `141` SIGPIPE from `| head`)
2. Setup returns `0` for a `planned` dry run and for a cancelled plan, `1` for `needs_confirmation` / `needs_human`; `doctor` returns `1` when required checks fail
3. Use `set -o pipefail` whenever output is piped, or a truncated pipe reports success
4. Exit zero is not a security verdict and not proof of coverage — inspect `coverage`, `limitations`, `unknowns`, and `normalized_result.statistics.parse_failures`
5. `unsupported_target` means the operation does not accept that input shape (for example a single source file where an application directory or ASAR is required) — fix the input, never switch operations to obtain a pass

## Rules

### 1. Evidence Over Inference

- Quote the Evidence field that supports a claim; label static inference, runtime observation, and unknown separately
- An exhausted or empty page never proves absence from an incompletely analyzed target
- Duplicate or ambiguous candidates stay `unknown`; REA will not pick a fuzzy match for you
- Reports can contain paths, URLs, and source-derived facts — only analyze and publish artifacts you are authorized to share

### 2. Provider Discipline

- Never let an agent silently switch providers, execute the artifact, or ignore a provider failure to obtain a result
- One provider stays bound to one session — reopen the binary to change it
- Treat provider decompilation as a reading aid; validate conclusions against strings, imports, xrefs, and certificates
- Hopper is unavailable on Windows — plan for Ghidra (experimental, read-only) or IDA there before promising native deep-dive work

### 3. Safety And Authorization

- Analyze only artifacts you own or are authorized to inspect; do not point REA at third-party services or credentials
- Do not expose a debugging port on a non-loopback interface
- Active Electron scenarios run with normal host privileges — lifecycle ownership is not a sandbox
- Do not rely on REA inferring secrets from names; treat any recovered credential as live and rotate it

### 4. Output Discipline

- Prefer one analysis plus projected views over repeated full analyses
- Keep raw Evidence files out of the repository unless the user asks for them
- Do not paste full decompiled output into chat — summarize and cite the function/offset

## References

- [Install, providers, CLI commands, exit codes, limits](references/apis.md)
- See best-practices/ for recommended patterns and pitfalls

### Use Cases

| Scenario | Use case |
|----------|----------|
| Locate and decompile one function in an unknown binary | `usecases/triage-native-function.md` |
| Trace one feature across an Electron bundle to its native add-on | `usecases/trace-electron-feature.md` |
| Capture and diff a live page without automating it | `usecases/observe-and-compare-web-page.md` |
| Run pinned static analysis in GitHub Actions | `usecases/ci-static-analysis.md` |

- See usecases/ for end-to-end scenario recipes
- References: [Reverse engineering with REA](best-practices/reverse-engineering-with-rea.md)

## Expected Outcome

- The MCP server is registered for the intended client and its own readiness check passes
- The right surface is chosen before the target is touched — static, native, passive runtime, or comparison
- Analysis output stays compact because full evidence is written once and projected
- Every reported finding names its evidence and separates fact from unknown
- Partial or failed analysis is reported as such, never converted into a passing claim
