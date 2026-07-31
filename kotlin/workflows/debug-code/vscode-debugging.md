# VS Code Debugging

## Launch Configuration

Create `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "kotlin",
            "request": "launch",
            "name": "Kotlin Launch",
            "projectName": "my-project",
            "mainClass": "MainKt",
            "classPaths": [
                "${workspaceFolder}/build/classes/kotlin/main",
                "${workspaceFolder}/build/libs/*"
            ],
            "vmArgs": "-Djava.library.path=/path/to/libs"
        }
    ]
}
```

## Debugging Steps

1. Set breakpoints by clicking the gutter
2. Press F5 or click "Run and Debug"
3. Use debug controls in the debug toolbar
4. View variables in the Variables panel
