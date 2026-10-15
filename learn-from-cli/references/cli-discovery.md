# CLI Discovery

Explore a CLI tool to learn its subcommands, options, flags and output before using it

## 1. Basic Discovery

1. Run `<cli> --version` to see the version
2. Run `<cli> --help` or `<cli> -h`
3. Run `<cli> help <subcommand>` if it has subcommands
4. Run `<cli> <subcommand> --help` to see each subcommand's options

## 2. Machine-Readable Context

If the CLI supports machine-readable metadata:

1. Run `<cli> agent-context` if available
2. Run `<cli> completion` or `<cli> --generate-bash-completion`
3. Record the command list, flags and argument types

## 3. Document

Summary of what was found:

- command groups
- basic usage examples
- options/flags worth knowing
- exit codes and output format

## Notes

- Use `/learn-pattern` if needed
- Use `/deep-test` cli if needed
- Use `/run-test` if needed
