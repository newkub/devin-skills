use crate::Graph;

const TEMPLATE: &str = include_str!("template.html");
const PLACEHOLDER: &str = "__GRAPH_DATA__";

pub fn render(graph: &Graph) -> anyhow::Result<String> {
    let data = serde_json::to_string(graph)?;
    if !TEMPLATE.contains(PLACEHOLDER) {
        anyhow::bail!("template is missing placeholder {}", PLACEHOLDER);
    }
    Ok(TEMPLATE.replace(PLACEHOLDER, &data))
}
