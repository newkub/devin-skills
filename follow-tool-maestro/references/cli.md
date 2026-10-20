| command | description | options |
|---|---|---|
| `maestro test <flow\|dir>` | run one flow or every `.yaml` in a directory | `--format JUNIT`, `--debug`, `--record` |
| `maestro hierarchy` | dump the current view hierarchy | pick stable selectors after a failure |
| `maestro mcp` | start the built-in MCP server for agentic control | ships inside the CLI |
| `maestro studio` | interactive inspector (free but closed-source — not the default path) | explicit user request only |
| `maestro --version` | print the CLI version | |

| flag | applies to | meaning |
|---|---|---|
| `--format JUNIT` | `test` | JUnit XML for CI artifacts |
| `--debug` | `test` | step through the flow command by command |
| `--record` | `test` | record a video of the run |
