import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { Graph, groupColors, type GraphData, type SelectedNode } from "../Graph";

export function GraphPage() {
  const [search, setSearch] = createSignal("");
  const [prefix, setPrefix] = createSignal("all");
  const [selected, setSelected] = createSignal<SelectedNode | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [graphData, setGraphData] = createSignal<GraphData | null>(null);

  const saved = typeof localStorage !== "undefined" ? localStorage.getItem("visulize-theme") : null;
  const [dark, setDark] = createSignal(saved ? saved === "dark" : true);
  const [physics, setPhysics] = createSignal(true);
  const [reset, setReset] = createSignal(0);
  const [focus, setFocus] = createSignal<string | null>(null);
  const [zoom, setZoom] = createSignal<{ dir: "in" | "out" } | null>(null);

  createEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("visulize-theme", dark() ? "dark" : "light");
    }
  });

  const counts = createMemo(() =>
    graphData() ? { nodes: graphData()!.nodes.length, edges: graphData()!.edges.length } : { nodes: 0, edges: 0 }
  );

  const groups = createMemo(() => {
    const data = graphData();
    if (!data) return [];
    const set = new Set(data.nodes.map((n) => n.group));
    return [...set].sort();
  });

  const topSkills = createMemo(() => {
    if (!graphData()) return [];
    const deg = new Map<string, number>();
    for (const n of graphData()!.nodes) deg.set(n.id, 0);
    for (const e of graphData()!.edges) {
      deg.set(e.from, (deg.get(e.from) || 0) + 1);
      deg.set(e.to, (deg.get(e.to) || 0) + 1);
    }
    return [...deg.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, count]) => ({ id, count, node: graphData()!.nodes.find((n) => n.id === id)! }));
  });

  const doReset = () => setReset((v) => v + 1);
  const doFocus = () => { if (selected()) setFocus(selected()!.id); };
  const doRandom = () => {
    if (!graphData()) return;
    const n = graphData()!.nodes[Math.floor(Math.random() * graphData()!.nodes.length)];
    const incoming = graphData()!.edges.filter((e) => e.to === n.id).length;
    const outgoing = graphData()!.edges.filter((e) => e.from === n.id).length;
    setSelected({ ...n, incoming, outgoing });
    setFocus(n.id);
  };

  const selectNode = (n: SelectedNode) => {
    setSelected(n);
    setFocus(n.id);
  };

  return (
    <div class="app" classList={{ light: !dark() }}>
      <aside class="sidebar">
        <h1>Devin Skills</h1>
        <input
          type="text"
          placeholder="search..."
          value={search()}
          onInput={(e) => setSearch(e.currentTarget.value)}
        />
        <select value={prefix()} onChange={(e) => setPrefix(e.currentTarget.value)}>
          <option value="all">all prefixes</option>
          <For each={groups()}>
            {(g) => <option value={g}>{g}</option>}
          </For>
        </select>
        <div class="controls">
          <button onClick={() => setDark((v) => !v)}>{dark() ? "light" : "dark"}</button>
          <button onClick={() => setPhysics((v) => !v)}>{physics() ? "stop physics" : "start physics"}</button>
        </div>
        <div class="controls">
          <button onClick={() => setZoom({ dir: "out" })}>-</button>
          <button onClick={doReset}>fit</button>
          <button onClick={() => setZoom({ dir: "in" })}>+</button>
          <button onClick={doRandom}>random</button>
        </div>
        <Show when={selected()}>
          <div class="detail">
            <h3>{selected()!.id}</h3>
            <p class="desc">{selected()!.title}</p>
            <p class="meta">
              <span class="group-badge" style={{ "background-color": (groupColors[selected()!.group] || groupColors.default).background }}>{selected()!.group}</span>
              <span>incoming {selected()!.incoming} · outgoing {selected()!.outgoing}</span>
            </p>
            <div class="controls small">
              <button onClick={doFocus}>focus</button>
              <button onClick={() => setSelected(null)}>clear</button>
              <button onClick={() => navigator.clipboard?.writeText?.(selected()!.id)}>copy</button>
              <button onClick={() => window.open(`vscode://file/C:/Users/Veerapong/AppData/Roaming/devin/skills/${selected()!.dir}/SKILL.md`)}>open</button>
            </div>
          </div>
        </Show>
        <div class="section">
          <h4>top skills</h4>
          <ul class="top-list">
            <For each={topSkills()}>
              {(item) => (
                <li
                  onClick={() => {
                    const n = item.node;
                    const incoming = graphData()!.edges.filter((e) => e.to === n.id).length;
                    const outgoing = graphData()!.edges.filter((e) => e.from === n.id).length;
                    selectNode({ ...n, incoming, outgoing });
                  }}
                >
                  <span>{item.id}</span>
                  <span class="count">{item.count}</span>
                </li>
              )}
            </For>
          </ul>
        </div>
        <div class="section">
          <h4>legend</h4>
          <ul class="legend">
            <For each={groups()}>
              {(group) => {
                const c = groupColors[group] || groupColors.default;
                return (
                  <li>
                    <span class="dot" style={{ "background-color": c.background, "border-color": c.border }} />
                    <span class="cap">{group}</span>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
        <div class="status">{counts().nodes} nodes · {counts().edges} edges</div>
      </aside>
      <main class="canvas-wrap">
        <Show when={loading()}>
          <div class="skeleton" />
          <div class="loading-message">{graphData() ? `rendering ${counts().nodes} nodes...` : "loading skills..."}</div>
        </Show>
        <Show when={error()}>
          <div class="error-overlay">
            <p>failed to load graph</p>
            <pre>{error()}</pre>
            <button onClick={() => window.location.reload()}>retry</button>
          </div>
        </Show>
        <Graph
          search={search()}
          prefix={prefix()}
          dark={dark()}
          physics={physics()}
          reset={reset()}
          focus={focus()}
          highlight={selected()?.id ?? null}
          zoom={zoom}
          onSelect={setSelected}
          onData={setGraphData}
          onReady={() => setLoading(false)}
          onError={(e) => { setLoading(false); setError(String(e)); }}
        />
      </main>
    </div>
  );
}
