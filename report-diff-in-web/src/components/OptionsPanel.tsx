import { For, Show, type JSX } from 'solid-js';
import { THEME_PAIRS, type ViewerOptions } from '../lib/options';
import type {
  DiffIndicators,
  DiffStyle,
  HunkSeparators,
  Layout,
  LineDiffType,
  ThemeMode,
  ThemePair,
} from '../types';
import { Button, IconButton, Segmented, Select, SwitchRow } from './ui';

const SWATCHES: Record<ThemePair, { dark: string; light: string }> = {
  pierre: { dark: '#171717', light: '#f6f4f0' },
  github: { dark: '#0d1117', light: '#ffffff' },
  one: { dark: '#282c34', light: '#fafafa' },
  vitesse: { dark: '#121212', light: '#ffffff' },
  catppuccin: { dark: '#1e1e2e', light: '#eff1f5' },
};

function Section(props: { title: string; hint?: string; children: JSX.Element }) {
  return (
    <section class="space-y-2.5 border-b border-border px-4 py-4 last:border-b-0">
      <div class="flex items-baseline justify-between gap-2">
        <h3 class="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          {props.title}
        </h3>
        <Show when={props.hint}>
          <span class="text-[10px] text-muted-foreground">{props.hint}</span>
        </Show>
      </div>
      {props.children}
    </section>
  );
}

export default function OptionsPanel(props: {
  open: boolean;
  options: ViewerOptions;
  update: (patch: Partial<ViewerOptions>) => void;
  reset: () => void;
  close: () => void;
}) {
  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-40">
        <div class="sheet-overlay absolute inset-0 fade-in" onClick={props.close} />
        <aside class="slide-in absolute top-0 right-0 flex h-full w-80 max-w-[92vw] flex-col border-l border-border bg-surface shadow-lg">
          <header class="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
            <div class="flex items-center gap-2">
              <span class="i-mdi-tune-variant text-base text-accent" />
              <div>
                <h2 class="text-sm font-semibold tracking-tight">Viewer options</h2>
                <p class="text-[10px] text-muted-foreground">Saved automatically to this browser</p>
              </div>
            </div>
            <IconButton icon="i-mdi-close" label="Close options" onClick={props.close} />
          </header>

          <div class="min-h-0 flex-1 overflow-auto">
            <Section title="Appearance">
              <Segmented
                value={props.options.themeMode}
                onChange={(value) => props.update({ themeMode: value })}
                options={[
                  { value: 'system' as ThemeMode, label: 'System', icon: 'i-mdi-monitor' },
                  { value: 'light' as ThemeMode, label: 'Light', icon: 'i-mdi-weather-sunny' },
                  { value: 'dark' as ThemeMode, label: 'Dark', icon: 'i-mdi-weather-night' },
                ]}
              />
              <div class="grid grid-cols-2 gap-1.5 pt-1">
                <For each={Object.entries(THEME_PAIRS)}>
                  {([key, pair]) => (
                    <button
                      type="button"
                      onClick={() => props.update({ themePair: key as ThemePair })}
                      class={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-left text-[11px] transition-colors ${
                        props.options.themePair === key
                          ? 'border-accent bg-muted text-foreground'
                          : 'border-border text-muted-foreground hover:border-border-hover hover:text-foreground'
                      }`}
                    >
                      <span class="flex shrink-0 overflow-hidden rounded-sm border border-border">
                        <span
                          class="size-3"
                          style={{ background: SWATCHES[key as ThemePair].light }}
                        />
                        <span
                          class="size-3"
                          style={{ background: SWATCHES[key as ThemePair].dark }}
                        />
                      </span>
                      <span class="truncate font-medium">{pair.label}</span>
                      <Show when={props.options.themePair === key}>
                        <span class="i-mdi-check ml-auto text-sm text-accent" />
                      </Show>
                    </button>
                  )}
                </For>
              </div>
            </Section>

            <Section title="Layout">
              <Segmented
                value={props.options.layout}
                onChange={(value) => props.update({ layout: value })}
                options={[
                  { value: 'all' as Layout, label: 'All files', icon: 'i-mdi-view-agenda-outline' },
                  { value: 'focus' as Layout, label: 'Focus', icon: 'i-mdi-file-outline' },
                ]}
              />
              <div class="grid grid-cols-2 gap-1.5">
                <Select
                  value={String(props.options.fontScale)}
                  label="Code font size"
                  onChange={(value) => props.update({ fontScale: Number(value) })}
                  options={[
                    { value: '0.85', label: 'Small · 85%' },
                    { value: '0.9', label: 'Compact · 90%' },
                    { value: '1', label: 'Default · 100%' },
                    { value: '1.1', label: 'Comfy · 110%' },
                    { value: '1.25', label: 'Large · 125%' },
                    { value: '1.5', label: 'Huge · 150%' },
                  ]}
                />
                <Select
                  value={props.options.hunkSeparators}
                  label="Hunk separators"
                  onChange={(value) => props.update({ hunkSeparators: value as HunkSeparators })}
                  options={[
                    { value: 'line-info', label: 'Line info' },
                    { value: 'line-info-basic', label: 'Line info basic' },
                    { value: 'metadata', label: 'Metadata' },
                    { value: 'simple', label: 'Simple' },
                  ]}
                />
              </div>
              <SwitchRow
                label="File sidebar"
                description="Show the changed-file navigator"
                checked={props.options.sidebar}
                onChange={(value) => props.update({ sidebar: value })}
              />
              <SwitchRow
                label="Sticky file headers"
                description="Pin the current file header while scrolling"
                checked={props.options.stickyHeaders}
                onChange={(value) => props.update({ stickyHeaders: value })}
              />
            </Section>

            <Section title="Diff">
              <Segmented
                value={props.options.diffStyle}
                onChange={(value) => props.update({ diffStyle: value })}
                options={[
                  { value: 'split' as DiffStyle, label: 'Split', icon: 'i-mdi-view-column-outline' },
                  { value: 'unified' as DiffStyle, label: 'Unified', icon: 'i-mdi-view-sequential-outline' },
                ]}
              />
              <div class="grid grid-cols-2 gap-1.5">
                <Select
                  value={props.options.inlineDiff}
                  label="Inline diff"
                  onChange={(value) => props.update({ inlineDiff: value as LineDiffType })}
                  options={[
                    { value: 'word-alt', label: 'Word (alt)' },
                    { value: 'word-line', label: 'Word + line' },
                    { value: 'word', label: 'Word' },
                    { value: 'char', label: 'Character' },
                    { value: 'none', label: 'None' },
                  ]}
                />
                <Select
                  value={props.options.indicators}
                  label="Change indicators"
                  onChange={(value) => props.update({ indicators: value as DiffIndicators })}
                  options={[
                    { value: 'bars', label: 'Bars' },
                    { value: 'classic', label: 'Classic' },
                    { value: 'none', label: 'None' },
                  ]}
                />
              </div>
              <SwitchRow
                label="Change backgrounds"
                description="Tint added and removed lines"
                checked={props.options.backgrounds}
                onChange={(value) => props.update({ backgrounds: value })}
              />
              <SwitchRow
                label="Line numbers"
                checked={props.options.lineNumbers}
                onChange={(value) => props.update({ lineNumbers: value })}
              />
              <SwitchRow
                label="Wrap long lines"
                checked={props.options.wrap}
                onChange={(value) => props.update({ wrap: value })}
              />
              <SwitchRow
                label="Highlight hovered line"
                checked={props.options.lineHover}
                onChange={(value) => props.update({ lineHover: value })}
              />
              <SwitchRow
                label="Line selection"
                description="Drag to select a line range"
                checked={props.options.selection}
                onChange={(value) => props.update({ selection: value })}
              />
            </Section>
          </div>

          <footer class="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-surface-elevated px-4 py-3">
            <span class="text-[10px] text-muted-foreground">@pierre/diffs · diffs.com</span>
            <Button size="sm" onClick={props.reset}>
              <span class="i-mdi-restore text-sm" /> Reset
            </Button>
          </footer>
        </aside>
      </div>
    </Show>
  );
}
