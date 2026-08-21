---
name: create-vscode-extensions
description: Guidelines for creating VS Code extensions using TypeScript and VS Code
  API. Includes commands,...
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

สร้าง VS Code extensions ด้วย TypeScript และ VS Code API

## Scope

ใช้สำหรับการสร้าง extensions ที่ add commands, extend editor functionality, integrate กับ external tools และ create language support

## When to use

- ต้องการสร้าง extension สำหรับ VS Code
- ต้องการ add commands ให้ VS Code
- ต้องการ extend editor functionality
- ต้องการ integrate กับ external tools
- ต้องการ create language support

## Skills Related

- `/follow-write-devin-skills` - มาตรฐานการเขียน skills
- `lang-typescript`
- `lang-javascript`

## Execute

### 1. Create Project

```bash
bun create vscode-extension
```

### 2. Implement Features

ใช้ VS Code API สำหรับ implement features

### 3. Test

Test ใน VS Code ด้วย development mode

### 4. Publish

Publish ไปยัง VS Code Marketplace ด้วย vsce CLI

## Rules

### Development

- ใช้ TypeScript สำหรับ type safety
- Follow VS Code API guidelines
- ใช้ proper activation events

### Best Practices

- Implement error handling
- ใช้ proper contribution points
- Test บน multiple VS Code versions

## Expected Outcome

- VS Code extensions ที่ integrate กับ VS Code ecosystem
- Features ที่ responsive และ user-friendly
- Code ที่ follow VS Code best practices

## Step-by-Step Workflow

Workflow for creating a VS Code extension.

## Steps

1. **Install prerequisites**
   ```bash
   bun install -g yo generator-code
   ```

2. **Generate extension**
   ```bash
   yo code
   ```

3. **Choose extension type**
   - Extension (New Extension)
   - Color Theme
   - Language Support
   - Code Snippets
   - Keymap
   - Extension Pack

4. **Configure package.json**
   - Set extension name
   - Add commands
   - Configure activation events
   - Set contribution points

5. **Implement extension logic**
   - Create command handlers
   - Implement features
   - Add UI components

6. **Test locally**
   ```bash
   code .
   # Press F5 to launch Extension Development Host
   ```

7. **Build for production**
   ```bash
   bun run compile
   ```

8. **Package extension**
   ```bash
   bun install -g vsce
   vsce package
   ```

9. **Publish to marketplace**
   ```bash
   vsce publish
   ```

## Example: Simple Command

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World!');
  });

  context.subscriptions.push(disposable);
}
```

## Best Practices

- Use TypeScript
- Follow VS Code extension guidelines
- Test on different platforms
- Handle errors gracefully
- Use proper activation events

## References

Official resources for VS Code extension development

## Documentation

| Resource | URL |
|----------|-----|
| VS Code API | https://code.visualstudio.com/api |
| Extension Guide | https://code.visualstudio.com/api/get-started/extension-anatomy |
| Extension Anatomy | https://code.visualstudio.com/api/get-started/your-first-extension |
| Working with Extensions | https://code.visualstudio.com/api/working-with-extensions/overview |

## References

| Resource | URL |
|----------|-----|
| Extension Manifest | https://code.visualstudio.com/api/references/extension-manifest |
| Contribution Points | https://code.visualstudio.com/api/references/contribution-points |
| Activation Events | https://code.visualstudio.com/api/references/activation-events |
| VS Code API | https://code.visualstudio.com/api/references/vscode-api |
| Document | https://code.visualstudio.com/api/references/document |
| TextLine | https://code.visualstudio.com/api/references/vscode-api#TextLine |

## Guides

| Resource | URL |
|----------|-----|
| Command | https://code.visualstudio.com/api/extension-guides/command |
| Tree View | https://code.visualstudio.com/api/extension-guides/tree-view |
| WebView | https://code.visualstudio.com/api/extension-guides/webview |
| Custom Editors | https://code.visualstudio.com/api/extension-guides/custom-editors |
| Language Support | https://code.visualstudio.com/api/extension-guides/language-support |
| Debugging | https://code.visualstudio.com/api/extension-guides/debugging-extension |

## Examples

| Resource | URL |
|----------|-----|
| Sample Extensions | https://github.com/Microsoft/vscode-extension-samples |
| API Samples | https://code.visualstudio.com/api/references/vscode-api#examples |
| WebView Samples | https://github.com/Microsoft/vscode-extension-samples/tree/master/webview-sample |

## Tools

| Resource | URL |
|----------|-----|
| Yeoman Generator | https://www.bunjs.com/package/generator-code |
| VSCE CLI | https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce |
| TypeScript | https://www.typescriptlang.org/ |

## Publishing

| Resource | URL |
|----------|-----|
| Publishing Guide | https://code.visualstudio.com/api/working-with-extensions/publishing-extension |
| Marketplace | https://marketplace.visualstudio.com/ |
| Publisher Portal | https://marketplace.visualstudio.com/manage/publishers |

## Language Server

| Resource | URL |
|----------|-----|
| LSP Overview | https://microsoft.github.io/language-server-protocol/ |
| LSP Specification | https://microsoft.github.io/language-server-protocol/specification |
| LSP Extensions | https://code.visualstudio.com/api/language-extensions/language-server-extension-guide |

## Testing

| Resource | URL |
|----------|-----|
| Testing Guide | https://code.visualstudio.com/api/working-with-extensions/testing-extension |
| Mocha | https://mochajs.org/ |
| VSCode Test Runner | https://github.com/Microsoft/vscode-test |

## Community

| Resource | URL |
|----------|-----|
| Stack Overflow | https://stackoverflow.com/questions/tagged/vscode-extensions |
| GitHub Discussions | https://github.com/Microsoft/vscode-discussions |
| Reddit r/vscode | https://reddit.com/r/vscode |
