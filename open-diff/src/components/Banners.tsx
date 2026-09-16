import { Show, type Accessor } from 'solid-js';

export default function Banners(props: {
  error: Accessor<string | null>;
  loading: Accessor<boolean>;
  actionOutput: Accessor<string | null>;
}) {
  return (
    <>
      <Show when={props.error()}>
        <div class="shrink-0 px-4 py-2 bg-red-950/40 text-red-200 text-sm border-b border-red-900/50 flex items-center gap-2">
          <span class="i-mdi-alert-circle-outline w-4 h-4" /> {props.error()}
        </div>
      </Show>

      <Show when={props.loading()}>
        <div class="shrink-0 px-4 py-2 text-xs text-[var(--text-dim)] flex items-center gap-2">
          <span class="i-mdi-loading w-3.5 h-3.5 animate-spin" /> Loading diff…
        </div>
      </Show>

      <Show when={props.actionOutput()}>
        <div class="shrink-0 px-4 py-2 bg-green-950/40 text-green-200 text-xs border-b border-green-900/50 font-mono whitespace-pre-wrap">{props.actionOutput()}</div>
      </Show>
    </>
  );
}
