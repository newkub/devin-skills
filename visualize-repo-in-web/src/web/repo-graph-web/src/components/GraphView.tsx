import cytoscape from 'cytoscape';
import { createEffect, createResource, createSignal, onCleanup, onMount } from 'solid-js';
import type { RepoGraph, Node, Edge } from '../types';

const fetchData = async (): Promise<RepoGraph> => {
  const res = await fetch('/repo-graph.json');
  return res.json();
};

function colorByType(type: string) {
  switch (type) {
    case 'directory':
      return '#3b82f6';
    case 'file':
      return '#10b981';
    case 'module':
      return '#f59e0b';
    case 'dependency':
      return '#ec4899';
    default:
      return '#a1a1aa';
  }
}

export default function GraphView(props: { query: string; filter: string }) {
  let container: HTMLDivElement | undefined;
  const [cy, setCy] = createSignal<cytoscape.Core | null>(null);
  const [data] = createResource(fetchData);
  const [selected, setSelected] = createSignal<Node | null>(null);

  onMount(() => {
    if (!container) return;
    const instance = cytoscape({
      container,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: cytoscape.NodeSingular) => colorByType(ele.data('type')),
            label: 'data(label)',
            color: '#e4e4e7',
            'font-size': '10px',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 'mapData(degree, 1, 10, 12, 40)',
            height: 'mapData(degree, 1, 10, 12, 40)',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1,
            'line-color': '#52525b',
            'target-arrow-color': '#52525b',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: { name: 'cose', padding: 10 } as any,
    });
    setCy(instance);

    instance.on('tap', 'node', (evt) => {
      const node = evt.target.data() as Node;
      setSelected(node);
    });

    onCleanup(() => instance.destroy());
  });

  createEffect(() => {
    const graph = data();
    if (!graph) return;
    const instance = cy();
    if (!instance) return;

    const elements: cytoscape.ElementsDefinition = {
      nodes: graph.nodes.map((n: Node) => ({ data: { ...n } })),
      edges: graph.edges.map((e: Edge) => ({ data: { ...e } })),
    };
    instance.elements().remove();
    instance.add(elements);
    (instance.layout({ name: 'cose', padding: 10 } as any).run as () => void)();
  });

  createEffect(() => {
    const q = props.query.toLowerCase();
    const f = props.filter;
    const instance = cy();
    if (!instance) return;

    instance.batch(() => {
      instance.nodes().forEach((node) => {
        const data = node.data() as Node;
        const matchesQuery = data.label.toLowerCase().includes(q);
        const matchesFilter = f === 'all' || data.type === f;
        node.style('display', matchesQuery && matchesFilter ? 'element' : 'none');
      });
    });
  });

  return (
    <div class="relative h-full w-full">
      <div ref={container} class="h-full w-full" />
      {selected() && (
        <div class="absolute bottom-4 right-4 w-72 p-4 rounded bg-zinc-800 border border-zinc-600">
          <h3 class="font-semibold">{selected()?.label}</h3>
          <p class="text-sm text-zinc-400">{selected()?.type}</p>
          <pre class="mt-2 text-xs text-zinc-300 overflow-auto">{JSON.stringify(selected()?.metadata, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
