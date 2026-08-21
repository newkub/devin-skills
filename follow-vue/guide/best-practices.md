# Best Practices

## Component Structure

| Order | Section | Description |
|-------|---------|-------------|
| 1 | Script Setup | Logic และ imports |
| 2 | Props | Component inputs |
| 3 | Emits | Component events |
| 4 | Reactive State | refs และ reactives |
| 5 | Computed | Cached values |
| 6 | Watchers | Side effects |
| 7 | Methods | Functions |
| 8 | Template | UI markup |

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.vue` |
| Components | kebab-case in template | `<user-profile />` |
| Composables | use prefix | `useCounter()` |
| Stores | defineStore suffix | `useUserStore()` |
| Types | PascalCase | `UserProps` |

## Composition API Guidelines

```typescript
// Good: Organize by feature
<script setup>
import { ref, computed } from 'vue';

// Related logic together
const firstName = ref('');
const lastName = ref('');
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
</script>
```

## Props Definition

```typescript
// Good: Define with TypeScript
defineProps<{
  title: string;
  count?: number;
  items: string[];
}>();
```

## Avoid These

| Anti-Pattern | Better Approach |
|--------------|-----------------|
| Mutation in template | Use computed |
| Large components | Split into smaller |
| Any type | Proper types |
| Magic strings | Constants |
| Inline styles | CSS classes |

## Performance Tips

- Use `v-show` instead of `v-if` for frequent toggling
- Use `v-memo` for expensive renders
- Lazy load components with `defineAsyncComponent`
- Use `shallowRef` for large objects
- Avoid deep reactive for performance-critical data
