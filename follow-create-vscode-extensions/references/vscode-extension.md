# VSCode Extension Reference

## Official Sources

- VS Code API: https://code.visualstudio.com/api
- Extension Manifest: https://code.visualstudio.com/api/references/extension-manifest
- Contribution Points: https://code.visualstudio.com/api/references/contribution-points
- Activation Events: https://code.visualstudio.com/api/references/activation-events
- Publishing: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- reactive-vscode: https://github.com/antfu/reactive-vscode

## package.json Manifest

```json
{
  "name": "my-extension",
  "displayName": "My Extension",
  "description": "...",
  "version": "1.0.0",
  "publisher": "my-publisher",
  "engines": { "vscode": "^1.90.0" },
  "categories": ["Other"],
  "main": "./out/extension.js",
  "activationEvents": ["onCommand:myExtension.helloWorld"],
  "contributes": {
    "commands": [{
      "command": "myExtension.helloWorld",
      "title": "Hello World"
    }]
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./"
  },
  "devDependencies": {
    "@types/vscode": "^1.90.0",
    "typescript": "^5.8.0"
  }
}
```

## Basic Extension

```typescript
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('myExtension.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World!')
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "out",
    "lib": ["ES2022"],
    "sourceMap": true,
    "rootDir": "src",
    "strict": true
  }
}
```

## package And Publish

```bash
bunx @vscode/vsce package
bunx @vscode/vsce publish
```

## Create With reactive-vscode

```bash
bun create reactive-vscode
```

หรือ:

```bash
bun add -D reactive-vscode
```

```typescript
import { defineExtension, useCommand } from 'reactive-vscode'

export = defineExtension(() => {
  useCommand('myExtension.helloWorld', () => {
    window.showInformationMessage('Hello World!')
  })
})
```

## Common Contribution Points

- `commands`: register commands
- `menus`: add menu items
- `keybindings`: add shortcuts
- `configuration`: add settings
- `views`: add tree views
- `languages`: add language support

## Activation Events

- `onCommand:{command}`
- `onLanguage:{language}`
- `onView:{view}`
- `onUri`
- `onStartupFinished`
- `*` (ทั้งหมด)

## Project Structure

```text
my-extension/
  .vscode/
  src/
    extension.ts
  test/
  package.json
  tsconfig.json
  .vscodeignore
  CHANGELOG.md
  README.md
```

## .vscodeignore

```text
out/test
src
.gitignore
.yarnrc
vsc-extension-quickstart.md
node_modules
```

## Best Practices

- ไม่ active ทั้งหมดถ้าไม่จำเป็น
- Dispose ทุก resource ด้วย `context.subscriptions`
- ใช้ `vscode` เป้น devDependency, external ใน bundle
- สร้าง major version tags สำหรับ release
