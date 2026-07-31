# IntelliJ IDEA Debugging

## Setting Breakpoints

1. Click on the gutter next to the line number
2. Red dot indicates a breakpoint
3. Right-click for breakpoint options:
   - Condition: Break when expression is true
   - Log: Evaluate expression without breaking
   - Disable: Temporarily disable breakpoint

## Debugging Configuration

```kotlin
// Example code to debug
fun processUsers(users: List<User>): List<String> {
    return users
        .filter { it.age >= 18 }  // Set breakpoint here
        .map { it.name }
        .sorted()
}
```

## Debugging Steps

1. Click the "Debug" button (bug icon)
2. Execution pauses at breakpoint
3. Use debug controls:
   - **Step Over (F8)**: Execute current line
   - **Step Into (F7)**: Enter function call
   - **Step Out (Shift+F8)**: Exit current function
   - **Resume (F9)**: Continue execution
   - **Stop**: Stop debugging

## Viewing Variables

- **Variables Tab**: Shows all variables in current scope
- **Watches**: Add custom expressions to watch
- **Evaluate Expression (Alt+F8)**: Evaluate arbitrary code

## Conditional Breakpoints

```kotlin
// Break only when user.name starts with "A"
users.filter { it.age >= 18 }  // Right-click → Condition: it.name.startsWith("A")
```

## Exception Breakpoints

1. Run → View Breakpoints
2. Click "+" → Java Exception Breakpoints
3. Select exception type (e.g., NullPointerException)
4. Breaks when exception is thrown
