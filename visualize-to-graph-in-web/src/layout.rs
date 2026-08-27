use crate::Graph;

const REPULSION: f64 = 500.0;
const ATTRACTION: f64 = 0.03;
const DAMPING: f64 = 0.85;
const INITIAL_TEMP: f64 = 50.0;
const PADDING: f64 = 60.0;

pub fn compute(graph: &mut Graph, width: f64, height: f64, iterations: usize) {
    if graph.nodes.is_empty() {
        return;
    }

    let n = graph.nodes.len();
    let mut velocities: Vec<(f64, f64)> = vec![(0.0, 0.0); n];

    for node in &mut graph.nodes {
        if node.x == 0.0 && node.y == 0.0 {
            node.x = fastrand::f64() * width;
            node.y = fastrand::f64() * height;
        }
    }

    for i in 0..iterations {
        let temp = INITIAL_TEMP * (1.0 - i as f64 / iterations as f64);

        for (a, (node_a, va)) in graph
            .nodes
            .iter()
            .zip(velocities.iter_mut())
            .enumerate()
        {
            for (b, node_b) in graph.nodes.iter().enumerate() {
                if a == b {
                    continue;
                }
                let dx = node_a.x - node_b.x;
                let dy = node_a.y - node_b.y;
                let dist_sq = dx * dx + dy * dy + 1.0;
                let force = REPULSION / dist_sq;
                let dist = dist_sq.sqrt();
                va.0 += (dx / dist) * force;
                va.1 += (dy / dist) * force;
            }
        }

        for edge in &graph.edges {
            if let (Some(a), Some(b)) = (graph.node_index(&edge.from), graph.node_index(&edge.to)) {
                let dx = graph.nodes[b].x - graph.nodes[a].x;
                let dy = graph.nodes[b].y - graph.nodes[a].y;
                let dist = (dx * dx + dy * dy).sqrt() + 0.01;
                let force = ATTRACTION * dist;
                velocities[a].0 += (dx / dist) * force;
                velocities[a].1 += (dy / dist) * force;
                velocities[b].0 -= (dx / dist) * force;
                velocities[b].1 -= (dy / dist) * force;
            }
        }

        for (node, v) in graph.nodes.iter_mut().zip(velocities.iter_mut()) {
            v.0 *= DAMPING;
            v.1 *= DAMPING;
            let v_mag = (v.0 * v.0 + v.1 * v.1).sqrt();
            let step = v_mag.min(temp);
            if v_mag > 0.0 {
                node.x += (v.0 / v_mag) * step;
                node.y += (v.1 / v_mag) * step;
            }
            node.x = node.x.clamp(PADDING, width - PADDING);
            node.y = node.y.clamp(PADDING, height - PADDING);
        }
    }

    normalize(graph, width, height);
}

fn normalize(graph: &mut Graph, width: f64, height: f64) {
    let min_x = graph.nodes.iter().map(|n| n.x).fold(f64::INFINITY, f64::min);
    let max_x = graph.nodes.iter().map(|n| n.x).fold(f64::NEG_INFINITY, f64::max);
    let min_y = graph.nodes.iter().map(|n| n.y).fold(f64::INFINITY, f64::min);
    let max_y = graph.nodes.iter().map(|n| n.y).fold(f64::NEG_INFINITY, f64::max);

    let range_x = (max_x - min_x).max(1.0);
    let range_y = (max_y - min_y).max(1.0);
    let available_w = width - PADDING * 2.0;
    let available_h = height - PADDING * 2.0;

    for node in &mut graph.nodes {
        node.x = PADDING + (node.x - min_x) / range_x * available_w;
        node.y = PADDING + (node.y - min_y) / range_y * available_h;
    }
}
