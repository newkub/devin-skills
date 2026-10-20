| command | description | notes |
|---|---|---|
| `packslip create [ARTIFACTS]…` | build and sign a release manifest | run after artifacts + release exist |
| `packslip verify <BUNDLE>` | verify the signer and the local files you supply | |
| `packslip show <BUNDLE>` | read manifest metadata without verifying | `--raw` prints the bundle |
| `packslip install <PROJECT>` | discover the release, pick an artifact, download, install declared commands | e.g. `github.com/jdx/mise`; needs ≥ 1.5.0 |
| `packslip pin <BUNDLE>` | print the signer fingerprint for pinning | |
| `packslip releases <FLAGS>` | manage signed release lists — withdraw or recommend | |
| `packslip keygen [-o <OUT>]` | generate an Ed25519 publisher key | for publishers outside CI |
| `packslip schema [--releases] [--report]` | print the manifest / release-list JSON schema | |
| `packslip completion <SHELL>` | bash, zsh, fish, powershell | |
| `packslip version [-J]` | print the version | `--json` |

| flag | default | meaning |
|---|---|---|
| `--identity-prefix <url>` | — | expected signer workflow identity (verify) |
| `--issuer <url>` | — | OIDC issuer, e.g. `https://token.actions.githubusercontent.com` (verify) |
| `--pin <fingerprint>` | — | extra signer check on top of the identity flags (verify/install) |
| `--artifact <path>` | — | local file checked against the bundle digest (verify) |
| `-h, --help` | — | command help (`packslip install --help`) |
| `-V, --version` | — | print version |
