# GPUIX CLI Reference

`@gpuix/cli` ships the `gpuix` binary. It scaffolds a standalone app from the
official example template and installs shell completions. It does not build or
package binaries — those stay with `bun build --compile` and `cargo-packager`.

| command | description | options |
|---------|-------------|---------|
| `gpuix new <dir>` | Downloads `example-app/` (the todo example: one file, `<virtual-list>`, native `<input>`, animated sidebar), rewrites its published React dependency to the installed adapter version, and installs it as a standalone project. No repository clone, native build, or Rust toolchain. | `<dir>` target directory |
| `gpuix completions install` | Installs shell completions for the `gpuix` command. | none |
| `bunx @gpuix/cli new <dir>` | Runs `gpuix new` without a global install. The documented first step for a new app. | same as `gpuix new` |
| `bun add -g @gpuix/cli` | Installs the CLI globally so `gpuix` is on `PATH`. Required before `gpuix completions install`. | none |

## After Scaffolding

| command | description | options |
|---------|-------------|---------|
| `bun run dev` | Starts the scaffolded app through its `package.json` script. | none |
| `bun --hot <entry>.tsx` | Development loop: a save remounts the React or Solid tree on the same window instead of opening a second one. Bun-specific; Node.js runs the app but has no hot remount. | entry file |
| `bun build --compile <entry>.tsx --outfile dist/app` | Emits one self-contained binary carrying the renderer — runs with no Bun and no Node install. | `--outfile`, `--target` |
| `cargo packager --release --config packager.json` | Wraps the compiled binary into a platform app bundle with icon and metadata. Install with `cargo install cargo-packager --locked`. | `--release`, `--config` |

## Notes

- `gpuix new` is the only documented subcommand besides `completions install`;
  the docs do not publish a build, run, or package subcommand. Use the Bun and
  cargo-packager commands above instead of looking for them.
- The generated app pins `@gpuix/react` and `@gpuix/native`; keep both on the
  same exact version when upgrading.
- Run `gpuix new` from an empty or new directory. It installs dependencies
  directly and does not create a nested repository.
