export interface Node {
  id: string;
  type: string;
  label: string;
  metadata: Record<string, string>;
}

export interface Edge {
  source: string;
  target: string;
  type: string;
}

export interface RepoGraph {
  nodes: Node[];
  edges: Edge[];
}
