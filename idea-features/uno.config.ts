import { defineConfig, presetIcons, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
  presets: [presetWind4(), presetIcons()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  theme: {
    colors: {
      background: 'hsl(var(--color-background))',
      foreground: 'hsl(var(--color-foreground))',
      surface: 'hsl(var(--color-surface))',
      'surface-elevated': 'hsl(var(--color-surface-elevated))',
      'surface-foreground': 'hsl(var(--color-surface-foreground))',
      muted: 'hsl(var(--color-muted))',
      'muted-foreground': 'hsl(var(--color-muted-foreground))',
      accent: {
        DEFAULT: 'hsl(var(--color-accent))',
        hover: 'hsl(var(--color-accent-hover))',
        active: 'hsl(var(--color-accent-active))',
        foreground: 'hsl(var(--color-accent-foreground))',
      },
      primary: {
        DEFAULT: 'hsl(var(--color-primary))',
        hover: 'hsl(var(--color-primary-hover))',
        active: 'hsl(var(--color-primary-active))',
        foreground: 'hsl(var(--color-primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--color-secondary))',
        foreground: 'hsl(var(--color-secondary-foreground))',
      },
      success: 'hsl(var(--color-success))',
      'success-foreground': 'hsl(var(--color-success-foreground))',
      warning: 'hsl(var(--color-warning))',
      'warning-foreground': 'hsl(var(--color-warning-foreground))',
      destructive: {
        DEFAULT: 'hsl(var(--color-destructive))',
        foreground: 'hsl(var(--color-destructive-foreground))',
      },
      border: 'hsl(var(--color-border))',
      'border-hover': 'hsl(var(--color-border-hover))',
      ring: 'hsl(var(--color-ring))',
      overlay: 'hsl(var(--color-overlay))',
      skeleton: 'hsl(var(--color-skeleton))',
      'skeleton-shine': 'hsl(var(--color-skeleton-shine))',
    },
  },
});
