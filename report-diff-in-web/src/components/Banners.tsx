import { Show } from 'solid-js';
import { Button } from './ui';

export default function Banners(props: {
  error: string | null;
  unparsed: number;
  onRetry: () => void;
}) {
  return (
    <>
      <Show when={props.error}>
        <div class="flex shrink-0 items-center gap-2 border-b border-border bg-surface px-3 py-2">
          <span class="i-mdi-alert-circle-outline shrink-0 text-base text-destructive" />
          <span class="shrink-0 text-xs font-medium text-destructive">Could not load diff</span>
          <span class="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
            {props.error}
          </span>
          <Button size="sm" onClick={props.onRetry}>
            <span class="i-mdi-refresh text-sm" /> Retry
          </Button>
        </div>
      </Show>
      <Show when={props.unparsed > 0}>
        <div class="flex shrink-0 items-center gap-2 border-b border-border bg-surface px-3 py-1.5">
          <span class="i-mdi-file-alert-outline shrink-0 text-sm text-warning" />
          <span class="text-[11px] text-muted-foreground">
            {props.unparsed} {props.unparsed === 1 ? 'file has' : 'files have'} no previewable hunks
            (binary or unsupported patch) and stay listed in the sidebar.
          </span>
        </div>
      </Show>
    </>
  );
}
