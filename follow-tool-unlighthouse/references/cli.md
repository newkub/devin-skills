| key | value |
|---|---|
| install | `bun add -D unlighthouse` |
| version | 0.18.1 |
| repository | https://github.com/harlan-zw/unlighthouse |
| docs | https://unlighthouse.dev/integrations/cli |

| commands | description | default | options |
|---|---|---|---|
| `unlighthouse --site <url>` | Audit site (opens dashboard at `localhost:5678`) | — | `--root`, `--config-file`, `--output-path`, `--cache`/`--no-cache`, `--desktop`, `--mobile`, `--throttle`, `--samples`, `--debug` |
| `unlighthouse-puppeteer` | Run with puppeteer | — | `--site`, `--urls`, `--exclude` |
| `unlighthouse-ci` | CI mode (exit 1 on budget fail) | — | `--site`, `--budget`, `--build-static`, `--reporter` (`json`, `jsonExpanded`, `csv`, `csvExpanded`, `lighthouseServer`), `--lhci-host`, `--lhci-build-token` |
| `unlighthouse --help` | Show help | — | (none) |
