# Biome Configuration Reference

## biome.json Schema

Full schema URL: `https://biomejs.dev/schemas/1.9.0/schema.json`

## files

```typescript
{
  files: {
    ignore?: string[],  // Patterns to ignore
  }
}
```

## organizeImports

```typescript
{
  organizeImports: {
    enabled?: boolean,  // Default: true
    ignore?: string[],  // Patterns to ignore
  }
}
```

## linter

```typescript
{
  linter: {
    enabled?: boolean,  // Default: true
    run?: "all" | "safe" | "unsafe",  // Default: "safe"
    rules?: {
      recommended?: boolean,
      a11y?: RuleObject,
      complexity?: RuleObject,
      correctness?: RuleObject,
      performance?: RuleObject,
      security?: RuleObject,
      style?: RuleObject,
      suspicious?: RuleObject,
      nursery?: RuleObject,
      [ruleName: string]: "error" | "warn" | "off" | RuleObject
    }
  }
}

type RuleObject = {
  level?: "error" | "warn" | "off",
  options?: any
}
```

## formatter

```typescript
{
  formatter: {
    enabled?: boolean,  // Default: true
    indentStyle?: "tab" | "space",  // Default: "tab"
    indentWidth?: number,  // Default: 2
    lineWidth?: number,  // Default: 80
    lineEnding?: "lf" | "crlf" | "cr",  // Default: "lf"
    attributePosition?: "auto" | "break-attributes" | "inline",  // Default: "auto"
  }
}
```

## javascript

```typescript
{
  javascript: {
    formatter?: {
      quoteStyle?: "single" | "double",  // Default: "double"
      quoteProperties?: "asNeeded" | "preserve",  // Default: "asNeeded"
      semicolons?: "always" | "as-needed",  // Default: "always"
      trailingCommas?: "all" | "es5" | "none",  // Default: "es5"
      arrowParentheses?: "always" | "as-needed",  // Default: "always"
      bracketSameLine?: boolean,  // Default: false
      bracketSpacing?: boolean,  // Default: true
      jsxQuoteStyle?: "single" | "double",  // Default: "double"
      operatorPosition?: "same" | "break" | "tail",
trailingNewline?: boolean,  // Default: true
    }
  }
}
```

## json

```typescript
{
  json: {
    formatter?: {
      enabled?: boolean,  // Default: true
      indentStyle?: "tab" | "space",  // Default: "space"
      indentWidth?: number,  // Default: 2
    }
  }
}
```

## css

```typescript
{
  css: {
    formatter?: {
      enabled?: boolean,  // Default: true
      quoteStyle?: "single" | "double",  // Default: "double"
    }
  }
}
```

## overrides

```typescript
{
  overrides?: [
    {
      include?: string[],  // Glob patterns
      exclude?: string[],  // Glob patterns
      languageOptions?: {
        // Language-specific settings
      },
      organizeImports?: OrganizeImportsConfig,
      linter?: LinterConfig,
      formatter?: FormatterConfig,
    }
  ]
}
```

## extends

```typescript
{
  extends?: string[],  // Paths to base configs
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `BIOME_CONFIG_PATH` | Path to config file |
| `BIOME_LOG_PATH` | Path to log file |
| `RUST_LOG` | Rust log level (debug, info, warn, error) |