import { Show, createSignal, onCleanup } from 'solid-js';
import { useActions } from '../lib/use-actions';
import { useChecks } from '../lib/use-checks';
import { useDiff } from '../lib/use-diff';
import { useOptions } from '../lib/use-options';
import { usePrActions } from '../lib/use-pr-actions';
import { useShortcuts } from '../lib/use-shortcuts';
import { sourceLabel } from '../lib/source';
import { useWorkbench } from '../lib/use-workbench';
import Banners from './Banners';
import CommentDialog from './CommentDialog';
import ConfirmDialog from './ConfirmDialog';
import DiffPanel, { type ViewerApi } from './DiffPanel';
import EmptyState from './EmptyState';
import Header from './Header';
import HelpModal from './HelpModal';
import OptionsPanel from './OptionsPanel';
import Sidebar from './Sidebar';
import SourceDialog from './SourceDialog';
import StatusBar from './StatusBar';
import ToastView, { type Toast } from './Toast';
import Toolbar, { THEME_MODE_ICON } from './Toolbar';

export default function App() {
  const { options, update, reset, isDark, cycleTheme } = useOptions();
  const diff = useDiff();
  const checks = useChecks();
  const [toast, setToast] = createSignal<Toast | null>(null);
  const [sourceOpen, setSourceOpen] = createSignal(false);
  const [optionsOpen, setOptionsOpen] = createSignal(false);
  const [helpOpen, setHelpOpen] = createSignal(false);
  let viewerApi: ViewerApi | null = null;
  let toastTimer: ReturnType<typeof setTimeout> | undefined;

  const notify = (tone: Toast['tone'], text: string) => {
    setToast({ tone, text });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 4200);
  };

  onCleanup(() => {
    if (toastTimer) clearTimeout(toastTimer);
  });

  const viewer = useWorkbench(diff, checks, (id) => viewerApi?.scrollTo(id), () => options().layout);
  const actions = useActions(() => viewer.source());
  const pr = usePrActions(actions, viewer.reload, notify);

  const focusSearch = () => {
    if (!options().sidebar) update({ sidebar: true });
    setTimeout(() => document.getElementById('file-search')?.focus(), 0);
  };

  const closeOverlays = () => {
    if (pr.pending()) {
      pr.setPending(null);
      return true;
    }
    if (pr.commentOpen()) {
      pr.setCommentOpen(false);
      return true;
    }
    if (helpOpen()) {
      setHelpOpen(false);
      return true;
    }
    if (optionsOpen()) {
      setOptionsOpen(false);
      return true;
    }
    if (sourceOpen()) {
      setSourceOpen(false);
      return true;
    }
    return false;
  };

  useShortcuts(() => ({
    openHelp: () => setHelpOpen(true),
    openOptions: () => setOptionsOpen(true),
    closeOverlays,
    focusSearch,
    cycleTheme,
    toggleSidebar: () => update({ sidebar: !options().sidebar }),
    toggleStyle: () => update({ diffStyle: options().diffStyle === 'split' ? 'unified' : 'split' }),
    toggleWrap: () => update({ wrap: !options().wrap }),
    toggleLayout: () => update({ layout: options().layout === 'all' ? 'focus' : 'all' }),
    nextFile: () => viewer.stepFile(1),
    previousFile: () => viewer.stepFile(-1),
    reload: viewer.reload,
  }));

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify('success', 'Link copied to the clipboard');
    } catch {
      notify('danger', 'Could not access the clipboard');
    }
  };

  const statusInfo = () => {
    if (diff.loading() && !diff.data()) return { label: 'Loading diff…', tone: 'accent' as const };
    if (diff.error()) return { label: 'Load failed', tone: 'danger' as const };
    if (!viewer.source()) return { label: 'No source selected', tone: 'warning' as const };
    const totals = diff.totals();
    return {
      label: `${sourceLabel(viewer.source()!)} · ${diff.fileList().length} files · +${totals.add} −${totals.del}`,
      tone: 'success' as const,
    };
  };

  return (
    <div class="flex h-full flex-col overflow-hidden bg-background text-foreground">
      <Header
        source={viewer.source()}
        data={diff.data()}
        checks={checks.checks()}
        busy={actions.busy()}
        themeMode={options().themeMode}
        themeIcon={THEME_MODE_ICON[options().themeMode]}
        onOpenSource={() => setSourceOpen(true)}
        onOpenOptions={() => setOptionsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        onCycleTheme={cycleTheme}
        onRefresh={viewer.reload}
        onCopy={() => void copyLink()}
        onAction={pr.requestAction}
        onComment={() => pr.setCommentOpen(true)}
      />

      <Banners
        error={diff.error()}
        unparsed={diff.fileList().length - diff.metas().filter(Boolean).length}
        onRetry={viewer.reload}
      />

      <main class="flex min-h-0 flex-1">
        <Show when={options().sidebar && viewer.source()}>
          <Sidebar
            files={diff.fileList()}
            indices={viewer.indices()}
            metas={diff.metas()}
            activeIdx={viewer.activeIdx()}
            viewed={viewer.viewed()}
            query={viewer.query()}
            status={viewer.status()}
            sort={viewer.sort()}
            treeView={viewer.treeView()}
            hideViewed={viewer.hideViewed()}
            total={diff.fileList().length}
            onQuery={viewer.setQuery}
            onStatus={viewer.setStatus}
            onSort={viewer.setSort}
            onTreeView={viewer.setTreeView}
            onHideViewed={viewer.setHideViewed}
            onSelect={viewer.selectFile}
            onToggleViewed={(idx) => viewer.toggleViewed(idx)}
            onMarkAll={viewer.markAllViewed}
          />
        </Show>

        <section class="flex min-w-0 flex-1 flex-col">
          <Show
            when={viewer.source()}
            fallback={<EmptyState onOpen={() => setSourceOpen(true)} onOpenHelp={() => setHelpOpen(true)} />}
          >
            <Toolbar
              options={options()}
              activeFile={viewer.activeFile()}
              activeIdx={viewer.activeIdx()}
              visible={viewer.indices().length}
              total={diff.fileList().length}
              onUpdate={update}
              onPrev={() => viewer.stepFile(-1)}
              onNext={() => viewer.stepFile(1)}
              onOpenOptions={() => setOptionsOpen(true)}
            />

            <DiffPanel
              items={viewer.viewerItems()}
              options={options()}
              isDark={isDark()}
              source={viewer.source()}
              sourceKey={viewer.sourceKey()}
              cacheKey={viewer.cacheKey()}
              loading={diff.loading()}
              scrollTarget={viewer.scrollTarget()}
              activeFile={viewer.activeFile()}
              activeVisible={viewer.activeVisible()}
              focus={options().layout === 'focus'}
              onApi={(api) => {
                viewerApi = api;
              }}
            />
          </Show>
        </section>
      </main>

      <StatusBar options={options()} status={statusInfo()} onOpenHelp={() => setHelpOpen(true)} />

      <OptionsPanel
        open={optionsOpen()}
        options={options()}
        update={update}
        reset={reset}
        close={() => setOptionsOpen(false)}
      />

      <SourceDialog
        open={sourceOpen()}
        current={viewer.source()}
        onApply={(next) => {
          viewer.open(next);
          setSourceOpen(false);
        }}
        onClose={() => setSourceOpen(false)}
      />

      <HelpModal open={helpOpen()} onClose={() => setHelpOpen(false)} />

      <CommentDialog
        open={pr.commentOpen()}
        busy={actions.busy() === 'comment'}
        onClose={() => pr.setCommentOpen(false)}
        onSubmit={(body) => void pr.submitComment(body)}
      />

      <ConfirmDialog
        open={!!pr.pending()}
        title={pr.pending()?.title ?? ''}
        message={pr.pending()?.message ?? ''}
        confirmLabel={pr.pending()?.confirm ?? 'Confirm'}
        danger={pr.pending()?.danger ?? false}
        busy={!!actions.busy()}
        onConfirm={pr.confirmPending}
        onClose={() => pr.setPending(null)}
      />

      <ToastView toast={toast()} />
    </div>
  );
}
