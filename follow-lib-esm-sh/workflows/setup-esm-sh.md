# Setup esm.sh

## Objective

Set up and use esm.sh for loading ES Modules in the browser

## Steps

### 1. Check Requirements

- Need to use ES Modules in the browser
- Need to import directly from bun
- Need tree-shaking to reduce bundle size

### 2. Basic Usage

```html
<script type="module">
  import { useState } from 'https://esm.sh/react@19.2.8'
  // Use React
</script>
```

### 3. Set Up Version Pinning

```html
<script type="module">
  import { useState } from 'https://esm.sh/react@19.2.8'
  // Specify the desired version
</script>
```

### 4. Use With TypeScript

```html
<script type="module">
  import { useState } from 'https://esm.sh/react@19.2.8?target=es2020'
  // Specify the target environment
</script>
```

### 5. Verify

- Open the browser and check the console
- Check that modules load successfully
- Check the network tab for the loading

## Correctness Check

- Modules load successfully
- No errors in the console
- Tree-shaking works correctly
