| key | value |
|---|---|
| package | `packslip` — standalone CLI binary; consumer libraries are separate (Rust crate for installers/mirrors, Node.js package for verification) |
| install | `mise use -g packslip` · `curl -fsSL https://packslip.sh -o /tmp/packslip-install.sh && sh /tmp/packslip-install.sh` · PowerShell `irm https://packslip.sh/install.ps1 -OutFile $env:TEMP\packslip-install.ps1; & $env:TEMP\packslip-install.ps1` |
| version | 1.9.x (`install` needs ≥ 1.5.0; ≥ 1.5.1 on group-writable umask) |
| license | MIT |
| docs | https://packslip.dev/ |
| CLI reference | https://packslip.dev/cli/ |
| spec | predicateType `https://packslip.dev/release/v1` |
| CI action | `jdx/packslip@v1` · release lists: `jdx/packslip/releases` |

| field | description | notes |
|---|---|---|
| `subject` | sha256 digest per artifact file | one entry per file |
| `predicate.artifacts[].name` | file name | |
| `predicate.artifacts[].url` | download URL | |
| `predicate.artifacts[].format` | archive format | tar.gz, zip |
| `predicate.artifacts[].bin` | executable paths inside the archive | installer puts them on PATH |
| `predicate.artifacts[].os` / `arch` / `libc` | platform selectors | linux/darwin/windows, x64/arm64, gnu/musl |
| `predicate.resources` | man pages, completions, CLI specs (usage), agent skills, SBOMs, desktop files | |
| host requirements | libraries/commands needed at runtime | |
| bundle | `packslip.sigstore.json` beside the artifacts | sigstore bundle wrapping an in-toto statement |
| consumer libs | Rust crate for building installers/mirrors · published Node.js package for verification | |
