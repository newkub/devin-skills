# API Reference

## Component Props

### Button

| Prop | Type | Default | Description |
|-----|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost"` | `"primary"` | Button style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `disabled` | `boolean` | `false` | Disable button |
| `children` | `JSX.Element` | - | Button content |

### Card

| Prop | Type | Default | Description |
|-----|------|---------|-------------|
| `class` | `string` | - | Additional classes |
| `children` | `JSX.Element` | - | Card content |

### Input

| Prop | Type | Default | Description |
|-----|------|---------|-------------|
| `type` | `"text" \| "email" \| "password"` | `"text"` | Input type |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Input value |
| `onInput` | `(value: string) => void` | - | Input handler |
| `disabled` | `boolean` | `false` | Disable input |

### Dialog

| Prop | Type | Default | Description |
|-----|------|---------|-------------|
| `open` | `boolean` | `false` | Dialog open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open change handler |
| `children` | `JSX.Element` | - | Dialog content |

### Select

| Prop | Type | Default | Description |
|-----|------|---------|-------------|
| `value` | `string` | - | Selected value |
| `onValueChange` | `(value: string) => void` | - | Value change handler |
| `options` | `Array<{value: string, label: string}>` | - | Select options |
| `placeholder` | `string` | - | Placeholder text |

## Kobalte Primitives

### TextField

| Component | Props | Description |
|-----------|-------|-------------|
| `TextField` | `value`, `onValueChange`, `validationState` | Text field container |
| `TextField.Label` | - | Label element |
| `TextField.Input` | `type`, `placeholder`, `disabled` | Input element |
| `TextField.ErrorMessage` | - | Error message |

### Checkbox

| Component | Props | Description |
|-----------|-------|-------------|
| `Checkbox` | `checked`, `onChange`, `disabled` | Checkbox container |
| `Checkbox.Input` | - | Input element |
| `Checkbox.Label` | - | Label element |

## Corvu Primitives

### Dialog

| Component | Props | Description |
|-----------|-------|-------------|
| `Dialog` | `open`, `onOpenChange` | Dialog container |
| `Dialog.Trigger` | - | Trigger element |
| `Dialog.Portal` | - | Portal container |
| `Dialog.Content` | - | Content element |
| `Dialog.Overlay` | - | Overlay element |

### Popover

| Component | Props | Description |
|-----------|-------|-------------|
| `Popover` | `open`, `onOpenChange` | Popover container |
| `Popover.Trigger` | - | Trigger element |
| `Popover.Portal` | - | Portal container |
| `Popover.Content` | - | Content element |

## Utility Functions

### cn()

Merge Tailwind classes:

```tsx
import { cn } from "./utils/cn"

cn("px-4 py-2", "bg-blue-500")
```

## Type Exports

```tsx
export type { ButtonProps }
export type { CardProps }
export type { InputProps }
```
