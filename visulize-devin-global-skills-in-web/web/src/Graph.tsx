import { createEffect, createSignal, onCleanup, onMount, type Component } from "solid-js";

type GraphNode = { id: string; label: string; title: string; group: string };
type GraphEdge = { from: string; to: string };
type GraphData = { nodes: GraphNode[]; edges: GraphEdge[] };

const colors: Record<string, { background: string; border: string }> = {
  follow: { background: "#6366f1", border: "#4f46e5" },
  run: { background: "#22c55e", border: "#16a34a" },
  check: { background: "#f97316", border: "#ea580c" },
  report: { background: "#06b6d4", border: "#0891b2" },
  idea: { background: "#ec4899", border: "#db2777" },
  default: { background: "#94a3b8", border: "#64748b" },
};

declare global {
  interface Window {
    vis: any;
  }
}

export const Graph: Component<{
  search: string;
  prefix: string;
  onSelect: (node: GraphNode) => void;
  onReady: () => void;
}> = (props) => {
  let container: HTMLDivElement;
  let network: any;
  const [raw, setRaw] = createSignal<GraphData | null>(null);
  const [colored, setColored] = createSignal<GraphData | null>(null);

  onMount(async () => {
    const res = await fetch("/skills-graph.json");
    const data: GraphData = await res.json();
    setRaw(data);
    const nodes = data.nodes.map((n) => ({
      ...n,
      color: colors[n.group] || colors.default,
    }));
    setColored({ nodes, edges: data.edges });

    const ds = {
      nodes: new window.vis.DataSet(nodes),
      edges: new window.vis.DataSet(data.edges),
    };
    network = new window.vis.Network(container, ds, {
      nodes: {
        shape: "dot",
        size: 9,
        font: { color: "#e2e8f0", size: 12 },
        borderWidth: 2,
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 0.4 } },
        width: 0.8,
        color: { color: "#64748b" },
      },
      physics: { stabilization: { iterations: 80 } },
      interaction: { hover: true, tooltipDelay: 200 },
    });
    network.on("selectNode", () => {
      const id = network.getSelectedNodes()[0];
      const node = nodes.find((n) => n.id === id);
      if (node) props.onSelect(node);
    });
    props.onReady();
  });

  onCleanup(() => network?.destroy());

  createEffect(() => {
    if (!network || !colored() || !raw()) return;
    const q = props.search.toLowerCase().trim();
    const p = props.prefix;
    const visible = colored()!.nodes.filter((n) => {
      const matchSearch = !q || n.id.toLowerCase().includes(q) || n.title.toLowerCase().includes(q);
      const matchPrefix = p === "all" || n.group === p;
      return matchSearch && matchPrefix;
    });
    const ids = new Set(visible.map((n) => n.id));
    const visibleEdges = raw()!.edges.filter((e) => ids.has(e.from) && ids.has(e.to));
    network.setData({
      nodes: new window.vis.DataSet(visible),
      edges: new window.vis.DataSet(visibleEdges),
    });
  });

  return <div ref={(el) => (container = el)} class="graph-canvas" />;
};
