# Tool Capgo CLI

## Install

```sh
bun add -D @capgo/cli
```

## Commands

| Command | Description | Options |
|---|---|---|
| `capgo init` | Initialize config | --apikey, --force |
| `capgo login` | Login / set API key | --apikey |
| `capgo app add` | Register app บน Capgo | --name, --icon |
| `capgo bundle upload` | Upload web bundle | --channel, --path, --external |
| `capgo bundle list` | List bundles | --channel |
| `capgo channel set` | Assign bundle to channel | --channel, --latest |
| `capgo channel delete` | Remove channel | --channel |
| `capgo key save` / `key delete` | Manage update signing keys | --key |

## Examples

```sh
bunx capgo bundle upload --channel production --path dist
bunx capgo channel set --channel production --latest
```
