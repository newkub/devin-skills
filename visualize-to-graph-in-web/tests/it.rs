use visualize_to_graph_in_web::{generate_html, layout, Graph, Node, Edge};

#[test]
fn graph_round_trip_and_layout() {
    let mut graph = Graph {
        nodes: vec![
            Node { id: "a".into(), label: "A".into(), group: "skill".into(), x: 0.0, y: 0.0 },
            Node { id: "b".into(), label: "B".into(), group: "report".into(), x: 0.0, y: 0.0 },
            Node { id: "c".into(), label: "C".into(), group: "skill".into(), x: 0.0, y: 0.0 },
        ],
        edges: vec![
            Edge { from: "a".into(), to: "b".into(), label: None },
            Edge { from: "b".into(), to: "c".into(), label: None },
        ],
    };

    layout::compute(&mut graph, 1000.0, 800.0, 100);

    assert!(graph.nodes.iter().all(|n| n.x >= 0.0 && n.x <= 1000.0 && n.y >= 0.0 && n.y <= 800.0));
}

#[test]
fn html_generation_contains_data() {
    let graph = Graph {
        nodes: vec![
            Node { id: "a".into(), label: "A".into(), group: "skill".into(), x: 100.0, y: 200.0 },
        ],
        edges: vec![],
    };

    let html = generate_html(&graph).unwrap();
    assert!(html.contains(r#""id":"a""#));
    assert!(html.contains(r#""label":"A""#));
    assert!(html.contains("createRoot"));
    assert!(html.contains("createSignal"));
}
