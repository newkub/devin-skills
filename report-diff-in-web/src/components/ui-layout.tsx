import { Show, type JSX } from 'solid-js';
import { IconButton } from './ui';

export function Field(props: { label: string; hint?: string; children: JSX.Element }) {
  return (
    <label class="flex flex-col gap-1.5">
      <span class="text-[11px] font-medium text-secondary-foreground">{props.label}</span>
      {props.children}
      <Show when={props.hint}>
        <span class="text-[10px] leading-snug text-muted-foreground">{props.hint}</span>
      </Show>
    </label>
  );
}

export function Modal(props: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: JSX.Element;
  footer?: JSX.Element;
  width?: string;
}) {
  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="modal-overlay absolute inset-0 fade-in" onClick={props.onClose} />
        <div
          class={`relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-lg rise-in ${props.width ?? 'max-w-lg'}`}
        >
          <header class="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div class="min-w-0">
              <h2 class="text-sm font-semibold tracking-tight">{props.title}</h2>
              <Show when={props.subtitle}>
                <p class="mt-1 text-xs text-muted-foreground">{props.subtitle}</p>
              </Show>
            </div>
            <IconButton icon="i-mdi-close" label="Close" onClick={props.onClose} />
          </header>
          <div class="min-h-0 flex-1 overflow-auto px-5 py-4">{props.children}</div>
          <Show when={props.footer}>
            <footer class="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-surface-elevated px-5 py-3">
              {props.footer}
            </footer>
          </Show>
        </div>
      </div>
    </Show>
  );
}

export function EmptyHint(props: { icon: string; title: string; children?: JSX.Element }) {
  return (
    <div class="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
      <span class={`${props.icon} text-3xl text-muted-foreground`} />
      <div class="text-sm font-medium">{props.title}</div>
      <Show when={props.children}>
        <div class="max-w-sm text-xs leading-relaxed text-muted-foreground">{props.children}</div>
      </Show>
    </div>
  );
}
