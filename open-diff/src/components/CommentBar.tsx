import type { Accessor, Setter } from 'solid-js';

export default function CommentBar(props: {
  commentText: Accessor<string>;
  setCommentText: Setter<string>;
  onSubmit: () => void;
}) {
  return (
    <div class="shrink-0 px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)] flex items-center gap-2">
      <input
        class="input flex-1 !py-1.5 !rounded-full text-xs"
        placeholder="Write a PR comment… (Enter to send, Esc to cancel)"
        value={props.commentText()}
        onInput={(e) => props.setCommentText(e.currentTarget.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') props.onSubmit(); }}
        autofocus
      />
      <button class="btn text-xs !rounded-full" onClick={props.onSubmit} disabled={!props.commentText().trim()}>Send</button>
    </div>
  );
}
