let network;
let allNodes = [];
let allEdges = [];

const colors = {
  follow: { background: "#6366f1", border: "#4f46e5" },
  run: { background: "#22c55e", border: "#16a34a" },
  check: { background: "#f97316", border: "#ea580c" },
  report: { background: "#06b6d4", border: "#0891b2" },
  idea: { background: "#ec4899", border: "#db2777" },
  default: { background: "#94a3b8", border: "#64748b" },
};

async function init() {
  const res = await fetch("./skills-graph.json");
  const data = await res.json();
  allNodes = data.nodes.map((n) => ({
    ...n,
    color: colors[n.group] || colors.default,
  }));
  allEdges = data.edges;

  const container = document.getElementById("mynetwork");
  const options = {
    nodes: { shape: "dot", size: 10, font: { color: "#e2e8f0", size: 12 }, borderWidth: 2 },
    edges: { arrows: { to: { enabled: true, scaleFactor: 0.4 } }, width: 0.8, color: { color: "#64748b" } },
    physics: { stabilization: { iterations: 120 } },
    interaction: { hover: true, tooltipDelay: 200 },
  };
  network = new vis.Network(container, { nodes, edges } = { nodes: new vis.DataSet(allNodes), edges: new vis.DataSet(allEdges) }, options);
  network.on("selectNode", showDetails);
  showCounts();
}

function showDetails(params) {
  const node = allNodes.find((n) => n.id === params.nodes[0]);
  const detail = document.getElementById("detail");
  if (!node) { detail.textContent = "select a node to see details"; return; }
  const incoming = allEdges.filter((e) => e.to === node.id).length;
  const outgoing = allEdges.filter((e) => e.from === node.id).length;
  detail.innerHTML = `<strong>${node.id}</strong><p>${node.title || ""}</p><p>incoming: ${incoming} | outgoing: ${outgoing}</p>`;
}

function showCounts() {
  const detail = document.getElementById("detail");
  detail.insertAdjacentHTML("beforeend", `<p>total nodes: ${allNodes.length} | edges: ${allEdges.length}</p>`);
}

function filter() {
  const prefix = document.getElementById("prefix").value;
  const q = document.getElementById("search").value.toLowerCase().trim();
  const visible = allNodes.filter((n) => {
    const matchPrefix = prefix === "all" || n.group === prefix;
    const matchSearch = !q || n.id.toLowerCase().includes(q) || (n.title || "").toLowerCase().includes(q);
    return matchPrefix && matchSearch;
  });
  const ids = new Set(visible.map((n) => n.id));
  const visibleEdges = allEdges.filter((e) => ids.has(e.from) && ids.has(e.to));
  network.setData({ nodes: new vis.DataSet(visible), edges: new vis.DataSet(visibleEdges) });
}

document.getElementById("search").addEventListener("input", filter);
document.getElementById("prefix").addEventListener("change", filter);
document.getElementById("reset").addEventListener("click", () => {
  document.getElementById("search").value = "";
  document.getElementById("prefix").value = "all";
  network.fit();
  filter();
});

init().catch((e) => console.error(e));
