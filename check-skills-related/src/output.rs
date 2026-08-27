use std::collections::HashSet;

use crate::graph::{self, Graph};

fn join_sorted(set: &HashSet<String>) -> String {
    let mut v: Vec<&String> = set.iter().collect();
    v.sort();
    if v.is_empty() {
        "none".to_string()
    } else {
        v.iter().map(|s| s.as_str()).collect::<Vec<_>>().join(", ")
    }
}

fn sorted_vec(set: &HashSet<String>) -> Vec<String> {
    let mut v: Vec<String> = set.iter().cloned().collect();
    v.sort();
    v
}

pub fn run_summary(graph: &Graph, unknown: &[String]) {
    let total_skills = graph.len();
    let total_relations: usize = graph.values().map(|v| v.len()).sum();
    let orphan_count = graph.values().filter(|v| v.is_empty()).count();
    let cycles_found = graph::cycles(graph);

    println!("=== SKILL RELATION SUMMARY ===");
    println!("total skills:    {}", total_skills);
    println!("total relations: {}", total_relations);
    println!("orphan skills:   {}", orphan_count);
    if cycles_found.is_empty() {
        println!("cycle count:     0");
        println!("first cycle:     none");
    } else {
        println!("cycle count:     {}", cycles_found.len());
        println!("first cycle:     {}", cycles_found[0].join(" -> "));
    }
    if !unknown.is_empty() {
        println!("unknown refs:    {}", unknown.len());
    }
}

pub fn run_tree(graph: &Graph, target: &str, depth: usize, include_transitive: bool) {
    if !graph.contains_key(target) {
        eprintln!("ERROR: Skill not found: {}", target);
        std::process::exit(1);
    }
    println!("=== SKILL: {} ===", target);
    println!();
    println!("--- Call Tree (depth <= {}) ---", depth);
    graph::show_tree(target, graph, depth, 0, &mut Vec::new());
    println!();

    let direct = join_sorted(&graph[target]);
    let d = graph::max_depth(target, graph, &mut std::collections::HashMap::new(), &mut std::collections::HashSet::new());
    println!("--- Summary ---");
    println!("direct count:     {}", graph[target].len());
    println!("direct:           {}", direct);
    println!("depth:            {}", d);

    if include_transitive {
        let trans = graph::transitive_closure(target, graph, &mut std::collections::HashMap::new(), &mut std::collections::HashSet::new());
        let t = sorted_vec(&trans);
        println!("transitive count: {}", t.len());
        println!("transitive:       {}", if t.is_empty() { "none".to_string() } else { t.join(", ") });
    }

    for scc in graph::tarjan_scc(graph) {
        if scc.contains(target) {
            if let Some(c) = graph::find_one_cycle(&scc, graph) {
                println!("cycle:            {}", c.join(" -> "));
            }
            break;
        }
    }
}

pub fn run_cycles(graph: &Graph, first_cycle: bool) {
    let all = graph::cycles(graph);
    println!("=== CYCLES ===");
    if all.is_empty() {
        println!("no cycles found");
    } else {
        for c in &all {
            println!("{}", c.join(" -> "));
            if first_cycle {
                break;
            }
        }
        if !first_cycle {
            println!("\ntotal cycles: {}", all.len());
        }
    }
}

pub fn run_orphans(graph: &Graph) {
    let mut o: Vec<&String> = graph.iter().filter(|(_, v)| v.is_empty()).map(|(k, _)| k).collect();
    o.sort();
    println!("=== ORPHAN SKILLS ===");
    for name in &o {
        println!("{}", name);
    }
    println!("\ntotal: {}", o.len());
}

pub fn run_verify(graph: &Graph) -> i32 {
    let all = graph::cycles(graph);
    if all.is_empty() {
        println!("no cycles found");
        0
    } else {
        println!("cycle found: {}", all[0].join(" -> "));
        1
    }
}

pub fn run_full(graph: &Graph, include_transitive: bool) {
    let mut cache_d: std::collections::HashMap<String, usize> = std::collections::HashMap::new();
    let mut names: Vec<&String> = graph.keys().collect();
    names.sort();
    println!("=== SKILL RELATION FULL ===");
    for name in names {
        let direct = join_sorted(&graph[name]);
        let d = graph::max_depth(name, graph, &mut cache_d, &mut std::collections::HashSet::new());
        println!("--- {} ---", name);
        println!("  direct count: {}", graph[name].len());
        println!("  direct:       {}", direct);
        println!("  depth:        {}", d);
        if include_transitive {
            let trans = graph::transitive_closure(name, graph, &mut std::collections::HashMap::new(), &mut std::collections::HashSet::new());
            let t = sorted_vec(&trans);
            println!("  transitive:   {}", if t.is_empty() { "none".to_string() } else { t.join(", ") });
        }
    }
    let total_relations: usize = graph.values().map(|v| v.len()).sum();
    let orphan_count = graph.values().filter(|v| v.is_empty()).count();
    let all = graph::cycles(graph);
    println!("\n=== SUMMARY ===");
    println!("total skills:    {}", graph.len());
    println!("total relations: {}", total_relations);
    println!("orphan skills:   {}", orphan_count);
    if all.is_empty() {
        println!("cycle count:     0");
    } else {
        println!("cycle count:     {}", all.len());
        println!("first cycle:     {}", all[0].join(" -> "));
    }
}
