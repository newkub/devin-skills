use std::collections::{HashMap, HashSet, VecDeque};

pub type Graph = HashMap<String, HashSet<String>>;

pub fn tarjan_scc(graph: &Graph) -> Vec<HashSet<String>> {
    let mut index_counter: usize = 0;
    let mut stack: Vec<String> = Vec::new();
    let mut on_stack: HashSet<String> = HashSet::new();
    let mut indices: HashMap<String, usize> = HashMap::new();
    let mut lowlinks: HashMap<String, usize> = HashMap::new();
    let mut sccs: Vec<HashSet<String>> = Vec::new();

    let mut keys: Vec<String> = graph.keys().cloned().collect();
    keys.sort();
    for v in &keys {
        if !indices.contains_key(v) {
            strongconnect(
                v.clone(),
                graph,
                &mut index_counter,
                &mut stack,
                &mut on_stack,
                &mut indices,
                &mut lowlinks,
                &mut sccs,
            );
        }
    }
    sccs
}

#[allow(clippy::too_many_arguments)]
fn strongconnect(
    v: String,
    graph: &Graph,
    index_counter: &mut usize,
    stack: &mut Vec<String>,
    on_stack: &mut HashSet<String>,
    indices: &mut HashMap<String, usize>,
    lowlinks: &mut HashMap<String, usize>,
    sccs: &mut Vec<HashSet<String>>,
) {
    indices.insert(v.clone(), *index_counter);
    lowlinks.insert(v.clone(), *index_counter);
    *index_counter += 1;
    stack.push(v.clone());
    on_stack.insert(v.clone());

    for w in graph.get(&v).into_iter().flatten() {
        if !indices.contains_key(w) {
            strongconnect(
                w.clone(),
                graph,
                index_counter,
                stack,
                on_stack,
                indices,
                lowlinks,
                sccs,
            );
            let lv = lowlinks[&v];
            let lw = lowlinks[w];
            lowlinks.insert(v.clone(), lv.min(lw));
        } else if on_stack.contains(w) {
            let lv = lowlinks[&v];
            let iw = indices[w];
            lowlinks.insert(v.clone(), lv.min(iw));
        }
    }

    if lowlinks[&v] == indices[&v] {
        let mut scc: HashSet<String> = HashSet::new();
        loop {
            let w = stack.pop().unwrap();
            on_stack.remove(&w);
            scc.insert(w.clone());
            if w == v {
                break;
            }
        }
        sccs.push(scc);
    }
}

pub fn find_one_cycle(scc: &HashSet<String>, graph: &Graph) -> Option<Vec<String>> {
    if scc.len() <= 1 {
        return None;
    }
    let mut starts: Vec<String> = scc.iter().cloned().collect();
    starts.sort();
    for start in &starts {
        let mut nbrs: Vec<String> = graph.get(start).into_iter().flatten().cloned().collect();
        nbrs.sort();
        for nxt in &nbrs {
            if nxt == start || !scc.contains(nxt) {
                continue;
            }
            let mut q: VecDeque<(String, Vec<String>)> = VecDeque::new();
            let mut visited: HashSet<String> = HashSet::new();
            visited.insert(nxt.clone());
            q.push_back((nxt.clone(), vec![nxt.clone()]));
            while let Some((node, path)) = q.pop_front() {
                let mut children: Vec<String> =
                    graph.get(&node).into_iter().flatten().cloned().collect();
                children.sort();
                for cand in children {
                    if !scc.contains(&cand) {
                        continue;
                    }
                    if cand == *start {
                        let mut c = vec![start.clone()];
                        c.extend(path);
                        c.push(start.clone());
                        return Some(c);
                    }
                    if !visited.contains(&cand) {
                        visited.insert(cand.clone());
                        let mut p2 = path.clone();
                        p2.push(cand.clone());
                        q.push_back((cand, p2));
                    }
                }
            }
        }
    }
    None
}

pub fn cycles(graph: &Graph) -> Vec<Vec<String>> {
    let mut out = Vec::new();
    for scc in tarjan_scc(graph) {
        if let Some(c) = find_one_cycle(&scc, graph) {
            out.push(c);
        }
    }
    out
}

pub fn max_depth(
    node: &str,
    graph: &Graph,
    cache: &mut HashMap<String, usize>,
    visiting: &mut HashSet<String>,
) -> usize {
    if let Some(&d) = cache.get(node) {
        return d;
    }
    if visiting.contains(node) {
        return 0;
    }
    visiting.insert(node.to_string());
    let mut best = 0usize;
    for c in graph.get(node).into_iter().flatten() {
        let d = max_depth(c, graph, cache, visiting);
        if d > best {
            best = d;
        }
    }
    visiting.remove(node);
    cache.insert(node.to_string(), best + 1);
    best + 1
}

pub fn transitive_closure(
    node: &str,
    graph: &Graph,
    cache: &mut HashMap<String, HashSet<String>>,
    stack: &mut HashSet<String>,
) -> HashSet<String> {
    if let Some(c) = cache.get(node) {
        return c.clone();
    }
    if stack.contains(node) {
        return HashSet::new();
    }
    stack.insert(node.to_string());
    let mut res = HashSet::new();
    for c in graph.get(node).into_iter().flatten() {
        res.insert(c.clone());
        res.extend(transitive_closure(c, graph, cache, stack));
    }
    stack.remove(node);
    cache.insert(node.to_string(), res.clone());
    res
}

pub fn show_tree(
    node: &str,
    graph: &Graph,
    max_depth: usize,
    depth: usize,
    path: &mut Vec<String>,
) {
    if depth > max_depth {
        return;
    }
    if path.contains(&node.to_string()) {
        println!("{}{} (cycle)", "  ".repeat(depth), node);
        return;
    }
    println!("{}{}", "  ".repeat(depth), node);
    path.push(node.to_string());
    let mut children: Vec<&String> = graph.get(node).into_iter().flatten().collect();
    children.sort();
    for c in children {
        show_tree(c, graph, max_depth, depth + 1, path);
    }
    path.pop();
}
