# Common Debugging Issues

## Breakpoint Not Hit

- Check if code is compiled with debug info
- Verify breakpoint is enabled
- Ensure code path reaches the breakpoint
- Check for optimization flags

## Variables Not Visible

- Compile with `-g` flag for debug info
- Check variable scope
- Ensure code is not optimized away

## Async Code Hard to Debug

- Use logging for async operations
- Enable coroutine debugging
- Use breakpoints in suspend functions
- Check thread context
