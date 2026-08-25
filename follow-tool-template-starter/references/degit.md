# degit Reference

## Overview

`degit` makes copies of git repositories. When you run `degit some-user/some-repo`, it finds the latest commit on `https://github.com/some-user/some-repo` and downloads the associated tar file to the platform-appropriate cache directory if it doesn't already exist locally. This is much quicker than using `git clone`, because you're not downloading the entire git history.

`degit` resolves refs through an internal git backend, downloads tar snapshots by default, and falls back to SSH cloning when tarball fetches or extraction fail. Public HTTPS sources do not need a local `git` binary on your `PATH`, but SSH/private repositories still do.

## Install

```bash
# Global install via npm
npm install -g degit

# Run without installing (npx)
npx degit user/repo

# Run with bun (bunx)
bunx degit user/repo
```

`degit` requires Node.js 20 or later.

## Version Info

- Latest stable: `3.7.1`
- License: MIT
- Node.js: `>=20`
- Source: https://github.com/Rich-Harris/degit

## Peer Dependencies

No peer dependencies. `degit` is a standalone CLI with no runtime peer requirements. Optional: a local `git` binary on `PATH` is only needed for SSH/private repository fallback cloning.

## CLI Commands

### Basic syntax

```text
degit <src>[#ref] [<dest>] [options]
```

`src` is the repository to copy. `dest` is the directory to extract into; if omitted, `degit` uses the current directory.

### Supported sources

`degit` supports GitHub, GitLab, Bitbucket, and Sourcehut.

```bash
# GitHub
degit user/repo
degit github:user/repo
degit https://github.com/user/repo
degit git@github.com:user/repo

# GitLab
degit gitlab:user/repo
degit https://gitlab.com/user/repo

# Bitbucket
degit bitbucket:user/repo
degit https://bitbucket.org/user/repo

# Sourcehut
degit git.sr.ht/user/repo
degit https://git.sr.ht/user/repo
```

### Specify a tag, branch, or commit

Append `#ref` to any source:

```bash
degit user/repo#dev           # branch
degit user/repo#v1.2.3        # release tag
degit user/repo#1234abcd      # commit hash
```

If you omit the ref, `degit` resolves the repository's default branch.

### Create a new folder

```bash
degit user/repo my-new-project
degit -r user/repo
```

### Clone a subdirectory

Add the subdirectory to the source:

```bash
degit user/repo/subdirectory
degit https://github.com/user/repo/tree/main/subdirectory
```

### Clone specific files

Use `--files` or `-F`. Separate paths with commas or repeat the flag:

```bash
degit user/repo my-project --files README.md,src/index.ts
degit user/repo my-project -F README.md -F src/index.ts
```

### Options

| Option | Short | Description |
|---|---|---|
| `--help` | `-h` | Show help text |
| `--version` | `-V` | Show the version |
| `--cache` | `-c` | Only use the local cache; do not hit the network |
| `--force` | `-f` | Allow cloning into a non-empty destination directory |
| `--files <paths>` | `-F <paths>` | Keep only the listed files or directories |
| `--repo-name` | `-r` | Clone into a directory named after the repository |
| `--verbose` | `-v` | Print extra progress information |
| `--mode <mode>` | `-m` | `tar` (default) or `git`. `--mode=git` is accepted for compatibility but prints a deprecation notice |

### Aliases

```bash
degit alias github:user/repo myRepo
degit myRepo
degit unalias myRepo
degit ls
```

Aliases are stored in `aliases.json` inside the `degit` cache directory.

### Interactive mode

Running `degit` with no arguments starts an interactive picker. It prompts for a source, destination, and whether to use the cache. If the destination is not empty, it asks whether to overwrite.

## Usage Patterns

### Clone a template from template-starter

```bash
# Clone a specific template subdirectory (no git history)
bunx degit newkub/template-starter/templates/<template-name> <target-dir>

# Clone with a specific ref
bunx degit newkub/template-starter/templates/<template-name>#v1.0.0 <target-dir>

# Clone only specific files
bunx degit newkub/template-starter/templates/<template-name> <target-dir> --files README.md,package.json

# Force clone into a non-empty directory
bunx degit newkub/template-starter/templates/<template-name> <target-dir> --force

# Clone into a directory named after the repo
bunx degit -r newkub/template-starter
```

### Caching

`degit` caches downloaded tar snapshots in a platform-appropriate directory:

- Linux/BSD: `$XDG_CACHE_HOME/degit` or `~/.cache/degit`
- macOS: `~/Library/Caches/degit`
- Windows: `%LOCALAPPDATA%\degit` or `~/AppData/Local/degit`

Use `--cache` to skip the network request and only use a local cached copy.

### Private repositories

Private repositories are handled automatically. `degit` tries the HTTPS tarball path by default and falls back to SSH cloning when it cannot fetch or extract a snapshot. SSH/private repositories still require `git` on your `PATH`.

### degit.json actions

After the initial clone, `degit` looks for a `degit.json` file at the top level of the destination and runs the actions it defines.

```json
[
  {
    "action": "clone",
    "src": "user/another-repo"
  },
  {
    "action": "search_replace",
    "files": ["package.json", "README.md"],
    "pattern": "\\{\\{project_name\\}\\}",
    "replacement": "PROJECT_NAME"
  },
  {
    "action": "remove",
    "files": ["LICENSE"]
  }
]
```

### ESM API

```js
import degit from 'degit';

const emitter = degit('user/repo', {
  cache: true,
  force: true,
  verbose: true,
});

emitter.on('info', (info) => {
  console.log(info.message);
});

emitter.on('warn', (info) => {
  console.warn(info.message);
});

await emitter.clone('path/to/dest');
```

## Source

- https://github.com/Rich-Harris/degit
- https://github.com/Rich-Harris/degit/blob/master/README.md
- https://github.com/Rich-Harris/degit/blob/master/docs/USAGE.md
- https://github.com/Rich-Harris/degit/blob/master/docs/CHANGELOG.md
- https://www.npmjs.com/package/degit
