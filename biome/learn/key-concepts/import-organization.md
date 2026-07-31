# Import Organization

## Overview

Biome automatically organizes imports to keep code clean and consistent.

## Key Concepts

### Automatic Sorting

- Groups imports by type
- Sorts alphabetically within groups
- Removes duplicate imports

### Import Groups

1. External libraries (node_modules)
2. Internal modules (relative paths)
3. Type imports

### Deduplication

- Removes duplicate import statements
- Merges imports from same module

## Configuration

```json
{
  "organizeImports": {
    "enabled": true
  }
}
```

## Usage

```bash
# Organize imports
bunx biome check --write ./src

# Organize imports only
bunx biome check --write --only=organize-imports ./src
```

## Example

### Before

```typescript
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { useState } from 'react';
```

### After

```typescript
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
```

## Integration

- Runs automatically with `biome check --write`
- Can be run separately
- Configurable ignore patterns
