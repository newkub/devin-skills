# Node.js Debugging

## 1. Node.js Inspector

```bash
# Run with inspect flag
node --inspect app.js

# Run with inspect-brk (break on start)
node --inspect-brk app.js
```

## 2. Chrome DevTools

```bash
# Open Chrome DevTools
chrome://inspect

# Click on "Inspect" for your Node.js process
```

## 3. VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/app.js"
    }
  ]
}
```
