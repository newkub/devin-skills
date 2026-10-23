// Every markdown table row must keep the header's cell count.
// A backtick run opens a span that only a run of the same length closes, so
// nested fences like ```` ```ts ```` stay atomic and their `|` never splits a cell.
export function splitCells(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  for (let i = 0; i < line.length; ) {
    const ch = line[i];
    if (ch === "\\" && line[i + 1] === "|") {
      cur += "|";
      i += 2;
    } else if (ch === "`") {
      let run = 0;
      while (line[i + run] === "`") run++;
      const fence = "`".repeat(run);
      const end = line.indexOf(fence, i + run);
      if (end < 0) {
        cur += fence;
        i += run;
      } else {
        cur += line.slice(i, end + run);
        i = end + run;
      }
    } else if (ch === "|") {
      out.push(cur);
      cur = "";
      i++;
    } else {
      cur += ch;
      i++;
    }
  }
  out.push(cur);
  if (line.trimStart().startsWith("|")) out.shift();
  if (line.trimEnd().endsWith("|") && out.length) out.pop();
  return out;
}

const isTableRow = (line: string) => /^\s*\|/.test(line);

function isSeparatorRow(line: string): boolean {
  if (!isTableRow(line)) return false;
  const cs = splitCells(line);
  return cs.length > 0 && cs.every((c) => /^:?-+:?$/.test(c.trim()));
}

export function checkTables(body: string, offset: number): string[] {
  const issues: string[] = [];
  const lines = body.split(/\r?\n/);
  let fence = false;
  let i = 0;
  while (i < lines.length) {
    if (/^\s*(```|~~~)/.test(lines[i])) {
      fence = !fence;
      i++;
      continue;
    }
    if (fence || !isTableRow(lines[i]) || i + 1 >= lines.length || !isSeparatorRow(lines[i + 1])) {
      i++;
      continue;
    }
    const width = splitCells(lines[i]).length;
    const sepWidth = splitCells(lines[i + 1]).length;
    if (sepWidth !== width)
      issues.push(`L${i + 1 + offset} separator ${sepWidth} cells != header ${width}`);
    let j = i + 2;
    while (j < lines.length && isTableRow(lines[j]) && !isSeparatorRow(lines[j])) {
      const cells = splitCells(lines[j]).length;
      if (cells !== width) issues.push(`L${j + 1 + offset} ${cells} cells != header ${width}`);
      j++;
    }
    i = j;
  }
  return issues;
}
