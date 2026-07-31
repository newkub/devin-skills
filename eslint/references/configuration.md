# ESLint - Configuration Reference

Configuration options สำหรับ ESLint Flat Config

## Flat Config Structure

```javascript
// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

export default [
  // Array of configuration objects
  {
    // Files to apply this config
    files: ['**/*.js'],
    
    // Files to ignore
    ignores: ['**/node_modules/**'],
    
    // Language options
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly'
      }
    },
    
    // Plugins
    plugins: {
      react: react
    },
    
    // Rules
    rules: {
      'no-unused-vars': 'warn'
    }
  }
];
```

## Language Options

### ecmaVersion

```javascript
{
  languageOptions: {
    ecmaVersion: 2022  // ES2022
  }
}

// Available values:
// '3', '5', '6', '2015', '2016', ... '2022', 'latest'
```

### sourceType

```javascript
{
  languageOptions: {
    sourceType: 'module'  // ES modules (import/export)
    // or 'script' for CommonJS
  }
}
```

### globals

```javascript
{
  languageOptions: {
    globals: {
      // Readonly
      console: 'readonly',
      document: 'readonly',
      window: 'readonly',
      
      // Writable
      myVariable: 'writable',
      
      // Off (disable)
      jQuery: 'off'
    }
  }
}
```

## Files and Ignores

### files

```javascript
// String or array of glob patterns
{
  files: ['**/*.js']
}

{
  files: ['**/*.js', '**/*.ts']
}

{
  files: ['src/**', 'tests/**']
}

{
  files: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/dist/**'
  ]
}
```

### ignores

```javascript
{
  ignores: [
    '**/node_modules/**',
    'dist/**',
    'build/**',
    '*.min.js'
  ]
}

// Can be string or array
{
  ignores: '**/vendor/**'
}
```

## Plugins

### Loading Plugins

```javascript
import react from 'eslint-plugin-react';
import vue from 'eslint-plugin-vue';
import unicorn from 'eslint-plugin-unicorn';

{
  plugins: {
    react: react,
    vue: vue,
    unicorn: unicorn
  }
}
```

### Using Plugin Rules

```javascript
{
  plugins: {
    react: reactPlugin
  },
  rules: {
    'react/jsx-uses-react': 'error',
    'react/prop-types': 'warn'
  }
}
```

## Rules

### Rule Severity

```javascript
{
  rules: {
    // Off
    'no-console': 'off',
    'no-console': 0,
    
    // Warning
    'no-unused-vars': 'warn',
    'no-unused-vars': 1,
    
    // Error
    'no-debugger': 'error',
    'no-debugger': 2
  }
}
```

### Rule Options

```javascript
{
  rules: {
    // Single option
    'quotes': ['error', 'single'],
    
    // Object options
    'no-unused-vars': ['error', {
      args: 'after-used',
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    
    // Multiple options
    'max-len': ['error', {
      code: 100,
      comments: 80,
      strings: 100,
      ignoreUrls: true
    }]
  }
}
```

## Environments

### Predefined Globals

```javascript
{
  languageOptions: {
    globals: {
      // Node.js
      node: true,
      
      // Browser
      browser: true,
      
      // ES6+
      es6: true,
      es2020: true,
      es2022: true,
      
      // Testing
      jest: true,
      mocha: true,
      jasmine: true,
      qunit: true,
      
      // Common
      commonjs: true,
      amd: true,
      
      // Libraries
      jquery: true,
      lodash: true,
      underscore: true
    }
  }
}
```

## Processors

### Markdown Processor

```javascript
import markdown from 'eslint-plugin-markdown';

export default [
  {
    files: ['**/*.md'],
    plugins: {
      markdown: markdown
    },
    processor: markdown.processors['.md']
  }
];
```

### Custom Processor

```javascript
{
  processor: {
    preprocess(code, filename) {
      // Extract code blocks
      return [{ text: code, filename }];
    },
    postprocess(messages) {
      // Map messages back to original
      return messages;
    }
  }
}
```

## TypeScript Configuration

### Parser Setup

```javascript
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  }
];
```

### Type-aware Rules

```javascript
{
  plugins: {
    '@typescript-eslint': tseslint.plugin
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_'
    }],
    '@typescript-eslint/explicit-function-return-type': 'warn'
  }
}
```

## React Configuration

### Basic Setup

```javascript
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  react.configs.recommended,
  reactHooks.configs.recommended,
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
```

### JSX Configuration

```javascript
{
  rules: {
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-fragments': 'error'
  }
}
```

## Vue Configuration

```javascript
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  ...vue.configs[':recommended'],
  {
    files: ['**/*.vue'],
    processor: vue.processors['.vue'],
    languageOptions: {
      parser: vueParser
    }
  }
];
```

## Example Configs

### JavaScript Only

```javascript
import eslint from '@eslint/js';

export default [
  eslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn'
    }
  }
];
```

### TypeScript

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
];
```

### React + TypeScript

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.recommended,
  reactHooks.configs.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  }
];
```

### With Prettier

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier
];
```

## Cache Configuration

### Default Location

```text
.eslintcache
```

### Custom Location

```javascript
// eslint.config.js
export default [
  {
    rules: { /* ... */ }
  }
];

// CLI: --cache --cache-location ./node_modules/.cache/.eslintcache
```

## Complete Example

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import vue from 'eslint-plugin-vue';
import unicorn from 'eslint-plugin-unicorn';

export default [
  // Base recommended rules
  eslint.configs.recommended,
  
  // TypeScript
  ...tseslint.configs.recommended,
  
  // React
  react.configs.recommended,
  reactHooks.configs.recommended,
  
  // Vue
  ...vue.configs[':recommended'],
  
  // Custom rules
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error'
    }
  },
  
  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_'
      }]
    }
  },
  
  // Test files
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    rules: {
      'no-undefined': 'off'
    }
  },
  
  // Ignores
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js'
    ]
  }
];
```

## Summary

```text
┌─────────────────────────────────────────────────┐
│           Flat Config Structure                 │
├─────────────────────────────────────────────────┤
│                                                  │
│   export default [                              │
│     {                                          │
│       files: ['**/*.js'],                     │
│       languageOptions: { ... },               │
│       plugins: { ... },                       │
│       rules: { ... }                          │
│     },                                        │
│     { ignores: ['node_modules/**'] }         │
│   ];                                           │
│                                                  │
└─────────────────────────────────────────────────┘
```