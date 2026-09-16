import { onMount, onCleanup, type Accessor, type Setter } from 'solid-js';

export interface ShortcutDeps {
  helpOpen: Accessor<boolean>;
  setHelpOpen: Setter<boolean>;
  mergeOpen: Accessor<boolean>;
  setMergeOpen: Setter<boolean>;
  commentOpen: Accessor<boolean>;
  setCommentOpen: Setter<boolean>;
  hasFiles: () => boolean;
  moveSelection: (delta: number) => void;
  scrollDiff: (delta: number) => void;
  focusFilter: () => void;
  toggleTheme: () => void;
  toggleDiffStyle: () => void;
  toggleWrap: () => void;
  reload: () => void;
}

const isTyping = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null;
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
};

export function useShortcuts(d: ShortcutDeps) {
  onMount(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (d.helpOpen()) { d.setHelpOpen(false); return; }
        if (d.mergeOpen()) { d.setMergeOpen(false); return; }
        if (d.commentOpen()) { d.setCommentOpen(false); return; }
        if (isTyping(e)) { (e.target as HTMLElement).blur(); return; }
      }
      if (isTyping(e)) return;
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        d.setHelpOpen(!d.helpOpen());
        return;
      }
      if (!d.hasFiles()) return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === '[' || e.key === ']') {
        e.preventDefault();
        d.moveSelection(e.key === 'ArrowLeft' || e.key === '[' ? -1 : 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'k' || e.key === 'j') {
        e.preventDefault();
        d.scrollDiff(e.key === 'ArrowUp' || e.key === 'k' ? -60 : 60);
      } else if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        d.scrollDiff(e.key === 'PageUp' ? -400 : 400);
      } else if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        d.focusFilter();
      } else if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        d.toggleTheme();
      } else if (e.key === 'v' && !e.ctrlKey && !e.metaKey) {
        d.toggleDiffStyle();
      } else if (e.key === 'w' && !e.ctrlKey && !e.metaKey) {
        d.toggleWrap();
      } else if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        d.reload();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    onCleanup(() => window.removeEventListener('keydown', onKeyDown));
  });
}
