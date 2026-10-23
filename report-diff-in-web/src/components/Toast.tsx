import { Show } from 'solid-js';

export interface Toast {
  tone: 'success' | 'danger';
  text: string;
}

export default function ToastView(props: { toast: Toast | null }) {
  return (
    <Show when={props.toast}>
      {(value) => (
        <div class="pointer-events-none fixed right-4 bottom-12 z-[60]">
          <div
            class={`rise-in flex items-center gap-2 rounded-lg border px-3 py-2 text-xs shadow-lg ${
              value().tone === 'success'
                ? 'border-border bg-surface text-success'
                : 'border-border bg-surface text-destructive'
            }`}
          >
            <span
              class={`${value().tone === 'success' ? 'i-mdi-check-circle' : 'i-mdi-alert-circle'} text-base`}
            />
            <span class="max-w-80 text-secondary-foreground">{value().text}</span>
          </div>
        </div>
      )}
    </Show>
  );
}
