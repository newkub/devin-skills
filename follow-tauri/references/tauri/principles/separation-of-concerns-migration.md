---
title: Separation of Concerns Migration
description: Migration strategy สำหรับ Separation of Concerns
---

## Incremental Refactoring

1. Identify code with mixed concerns
2. Extract business logic to services
3. Create interfaces for dependencies
4. Implement infrastructure layer
5. Update frontend to use IPC

## Testing During Migration

1. Write tests for existing behavior
2. Refactor while maintaining tests
3. Add new tests for separated concerns
4. Verify all tests pass
