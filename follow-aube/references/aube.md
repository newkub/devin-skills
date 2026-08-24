# Aube Package Manager for Node.js

## Install

### Recommended: mise

```bash
mise use -g aube
```

This installs `aube` on your PATH and lets mise manage future upgrades.

### From npm

```bash
npm install -g --ignore-scripts=false @endevco/aube
npx --ignore-scripts=false @endevco/aube --version
```

The npm package uses a `preinstall` script to fetch native binaries.
Pass `--ignore-scripts=false` so it works even if `ignore-scripts=true`
is set in npm config.

### From Homebrew

```bash
brew install jdx/tap/aube
```

### From crates.io

```bash
cargo install aube --locked
```

### Verify

```bash
aube --version
```

## Version Info

- Repository: `https://github.com/jdx/aube`
- Docs: `https://aube.jdx.dev/`
- License: MIT
- npm package: `@endevco/aube`

## Commands

### Run Scripts (`aubr`)

`aubr` is shorthand for `aube run`. It auto-installs dependencies first
if `package.json` or the lockfile changed.

```bash
aubr test       # run test script, auto-installs first
aubr build      # run build script, auto-installs first
aubr dev        # run dev script, auto-installs first
```

Skip the install check:

```bash
aube run --no-install build
aube test --no-install
```

Optional scripts:

```bash
aube run --if-present lint
```

### One-Off Binaries (`aubx`)

`aubx` is shorthand for `aube dlx`. Installs into a throwaway project
and runs the requested binary.

```bash
aubx vitest      # run vitest without installing
aubx tsc         # run tsc without installing
aubx -p create-vite create-vite my-app
```

### Local Binaries (`aube exec`)

```bash
aube exec vitest
aube exec tsc -- --noEmit
```

### Install Dependencies

```bash
aube install     # Install all dependencies
```

Most local work does not need a separate install command. `aubr`,
`aube test`, and `aube exec` check install freshness first.

### Add Dependencies

```bash
aube add react              # add dependency
aube add -D vitest          # add dev dependency
aube add -O fsevents        # add optional dependency
aube add -E typescript      # add exact version
aube add --save-peer react  # add as peer dependency
aube add -g cowsay          # add globally

# Specifiers
aube add react@latest
aube add alias-name@npm:actual-name@^1
aube add jsr:@std/collections@^1.0.0
aube add workspace:*
aube add file:../local-package
```

### Remove Dependencies

```bash
aube remove react
aube remove -g cowsay
```

### Update Dependencies

```bash
aube update              # update within package.json ranges
aube update react        # update specific package
aube update --latest react  # update past manifest range
```

### Dedupe and Prune

```bash
aube dedupe              # collapse duplicate versions
aube dedupe --check      # exit non-zero if lockfile would change
aube prune               # remove extraneous packages
aube prune --prod        # keep only production deps
```

## Lockfile Compatibility

Aube reads and writes existing lockfiles in place:

| Lockfile | Support |
|---|---|
| `package-lock.json` | Read and write |
| `npm-shrinkwrap.json` | Read and write |
| `yarn.lock` | Read and write |
| `pnpm-lock.yaml` | Read and write |
| `aube-lock.yaml` | Native format |

No migration needed - aube works with your existing lockfile.

## Security

### Paranoid Mode

```yaml
# aube-workspace.yaml
paranoid: true
```

This forces every strict security setting on:
- `jailBuilds = true`
- `trustPolicy = no-downgrade`
- `minimumReleaseAgeStrict = true`
- `strictStoreIntegrity = true`
- `strictDepBuilds = true`
- `advisoryCheck = required`

### Default Security Features

- Trust downgrades fail at resolve
- New releases have 24h cooling window
- Block known-malicious packages
- Prompt on near-zero-download installs
- Lifecycle scripts wait for approval
- Exotic transitive deps blocked

### Approve Build Scripts

```bash
aube approve-builds
```

Or in config:

```yaml
# aube-workspace.yaml
allowBuilds:
  esbuild: true
  sharp: true
```

## CI Integration

```yaml
# GitHub Actions
- uses: jdx/aube-action@v1
- run: aube install

# Pinned version with Node
- uses: jdx/aube-action@v1
  with:
    version: 1.5.1
    node-version: "22"
    run-install: true
```

With `node-version: auto`, the action reads `mise.toml`, `.tool-versions`,
`.nvmrc`, `.node-version`, or `package.json` `devEngines.runtime`.

## Workspace Support

```bash
aube -r run build                          # run in all workspaces
aube -F '@scope/*' run test                # filter by glob
aube -F './packages/api' exec tsc -- --noEmit  # filter by path
aube -F 'api...' run build                 # dependency graph selector
```

## Source URLs

- Aube docs: `https://aube.jdx.dev/`
- Installation: `https://aube.jdx.dev/installation`
- Manage dependencies: `https://aube.jdx.dev/package-manager/dependencies.html`
- Run scripts: `https://aube.jdx.dev/package-manager/scripts.html`
- Security: `https://aube.jdx.dev/security.html`
- GitHub: `https://github.com/jdx/aube`
- GitHub Action: `https://github.com/jdx/aube-action`
