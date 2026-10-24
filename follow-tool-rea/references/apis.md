# REA Reference

| key | value |
|---|---|
| package | `rea-agents` (bins `rea`, `rea-agents`) |
| install | `npx rea-agents@latest setup` · `npm install --global rea-agents` · `bun add -g rea-agents` |
| version | 6.7.0 (npm latest, verified 2026-10-24); docs pages still say 6.4.0 |
| license | MIT |
| mcp name | `io.github.morluto/rea` (local stdio server) |
| engines | `^22.19.0 \|\| ^24.11.0 \|\| >=26.0.0` |
| docs | https://rea.tools |
| repo | https://github.com/morluto/rea |
| skill-only install | `npx skills add morluto/rea --skill reverse-engineer-anything` (no MCP connection) |

## Setup And Lifecycle

| api | description | example |
|---|---|---|
| `setup` | installs MCP registration + REA skill; backs up config, asks before writing | `npx rea-agents@latest setup` |
| `--client <id>` | scope setup to one client | `--client claude_code` |
| `--dry-run` | print the plan without writing; reports `planned`, exit 0 | `setup --dry-run` |
| `doctor` | read-only readiness audit for a client, provider, or the skill | `rea doctor --client devin --json` |
| `update` | updates only the npm/Bun global install that owns the running CLI | `rea update` |
| `uninstall` | removes REA-owned registrations and skill files | `rea uninstall` |
| `uninstall --purge-data` | additionally removes cache/state under `~/.rea` | `rea uninstall --purge-data` |
| `completions` | shell completion scripts | `rea completions bash` |
| `mcp` | run the MCP server directly | `rea mcp` |

Registry registrations pin the version that ran setup: upgrading the package does not upgrade a live server, so re-run scoped setup and restart the client.

## Client IDs

`claude_code`, `claude_desktop`, `codex`, `cursor`, `gemini_cli`, `windsurf`, `devin`, `opencode`, `antigravity`, `copilot_cli`, `commandcode`, `qwen_code`, `kimi`, `vscode`, `grok_build`, `omp`, `pi`, `hermes`, `qoder`, `droid`, `trae`, `workbuddy`, `zcode`, `dsh`

24 IDs total. The last seven need `rea-agents` ≥6.5.0. An unknown ID fails setup; there is no wildcard.

## Providers (native decompilation)

| provider | platform | prerequisites | notes |
|---|---|---|---|
| `hopper` | macOS 12+, Linux | Hopper installed, license accepted | not available on Windows |
| `ghidra` | Windows x64 (experimental), macOS, Linux | Ghidra 12.1.4, JDK 21+ | read-only, PE on local NTFS |
| `ida` | verified profiles only | `REA_IDA_MCP_CONFIG` | reuses an IDA MCP bridge |
| (none) | any | — | static JS/Electron and passive web analysis need no provider |

| env | purpose |
|---|---|
| `REA_ANALYSIS_PROVIDER` | default provider when none is passed |
| `GHIDRA_INSTALL_DIR` | Ghidra root |
| `JAVA_HOME` | JDK 21+ for Ghidra |
| `REA_IDA_MCP_CONFIG` | IDA bridge configuration |
| `REA_GHIDRA_STARTUP_TIMEOUT_MS` / `REA_HOPPER_STARTUP_TIMEOUT_MS` | startup deadlines; invalid values fail a selected client |
| `REA_LOG_LEVEL` | invalid values fail every scope including skill-only |
| `REA_ASAR_MAX_HEADER_BYTES` | ASAR header budget, default 16 MiB, max 256 MiB |

CLI `--provider <id>` overrides the default; MCP `open_binary` takes `provider_id` and binds it to that session.

## CLI Command Groups

| group | commands |
|---|---|
| session | `analyze`, `inspect`, `search`, `function`, `decompile`, `xrefs`, `trace`, `instructions`, `inspect-analysis-view` |
| static JavaScript | `analyze-javascript-application`, `trace-application-feature`, `trace-javascript-semantics`, `compare-application-versions`, `compare-source-to-bundle`, `compare-javascript-export-shapes`, `reconcile-javascript-runtime`, `import-reference-source` |
| artifacts | `inspect-artifact`, `extract-artifact`, `compare`, `inspect-binary-layout`, `inspect-go-binary`, `inspect-rust-binary`, `inspect-pe-certificates`, `inspect-elf-notes`, `inspect-python-pyc`, `inspect-erlang-beam`, `inspect-sqlite-database`, `inspect-managed-artifact`, `inspect-managed-members`, `inspect-model-artifact`, `inspect-il2cpp-metadata` |
| web (passive) | `list-browser-targets`, `inspect-web-page`, `observe-web-session`, `compare-web-captures`, `compare-web-screenshots`, `capture-web-screenshot`, `export-web-scripts`, `analyze-web-bundle`, `discover-webmcp-tools`, `capture-browser-scenario` |
| electron | `list-electron-targets`, `inspect-electron-page`, `capture-electron-scenario`, `inspect-electron-fuses` |
| process/environment | `capture-process`, `compare-process-captures`, `trace-application-feature`, `environment-serve`, `environment-export`, `environment-compare` |
| evidence | `evidence-export`, `evidence-import` |
| meta | `providers`, `capabilities`, `doctor`, `setup`, `update`, `uninstall`, `completions`, `mcp` |

## MCP Tools

| tool | purpose |
|---|---|
| `binary_session` | session state + `result.tool_availability`; callable before any target is open |
| `open_binary` / `close_binary` | start/end a provider-backed session (`provider_id` binds for the session) |
| `binary_overview`, `inspect_binary_layout`, `inspect_macho`, `address_to_file_offset` | layout and metadata |
| `analyze_function`, `get_call_graph`, `get_navigation_context`, `compare_functions` | function-level analysis |
| `analyze_javascript_application` | static app/ASAR graph; returns `evidence_id` |
| `inspect_analysis_view` | projection over evidence: `summary`, `page`, `retained-evidence`, `evidence-file`, `inline` |
| `compare_artifacts`, `compare_application_versions`, `compare_source_to_bundle`, `compare_javascript_export_shapes`, `compare_web_captures` | diffs |
| `inspect_artifact`, `extract_artifact`, `inspect_keyed_archive`, `inspect_asset_catalog`, `inspect_plist`, `decode_interface_builder` | artifact readers |
| `inspect_adb_client`, `inspect_apktool_client` | Android tooling probes |
| `discover_webmcp_tools` | returns `input_schema` + `input_schema_sha256`; never exposes `WebMCP.invokeTool` |
| `capture_browser_scenario`, `capture_process_scenario` | active capture |
| `export_evidence_bundle`, `get_evidence_bundle` | move evidence between connections |
| `evaluate_reconstruction_coverage` | coverage vs unknowns |

## Output Flags

| flag | effect |
|---|---|
| (default) | TOON on a terminal |
| `--json` | indented on a TTY, compact when piped |
| `--format md` | Markdown report |
| `--full-output` | wraps the result in `{ok,error,meta}`; an envelope, not a completeness signal |
| `--detail summary` | compact answer without the full record |
| `--evidence_output FILE` | write the evidence record to a file |
| `--filter-output` | narrow fields in place |
| `--token-limit` / `--token-offset` | paginate oversized output |

## Exit Codes

| code | meaning |
|---|---|
| `0` | completed; partial evidence is still allowed |
| `1` | could not complete; also `needs_confirmation` / `needs_human`, and `doctor` with failed required checks |
| `128+N` | signal-derived: `130` SIGINT, `143` SIGTERM, `141` SIGPIPE (for example from `\| head`) |

`setup --dry-run` and a cancelled setup both exit 0. Use `set -o pipefail` whenever output is piped.

## Limits And Budgets

| limit | value |
|---|---|
| CDP WebSocket message | 64 MiB (`payload_limit`) |
| Electron script sources | 32 MiB UTF-8 total, 20 s collection deadline |
| ASAR header | 16 MiB default, `REA_ASAR_MAX_HEADER_BYTES` ≤256 MiB |
| ASAR header cache | 8 archives, budget-bounded |
| Screenshot compare working memory | 256 MiB |
| Active Electron startup | 60 s, including the initial snapshot |
| Post-cancellation state read | 5 s before the initial snapshot is kept |
| Browser discovery deadline | 10 s |

Retained evidence references are scoped to one connection — export a bundle before `close_binary`. Evidence retention needs REA ≥4.1.0.
