import { readFileSync } from "node:fs";
import { logPath, rollup } from "../data/store";
import {
	PRIORITY_ICON,
	STATUS_COLOR,
	STATUS_ICON,
	type AgentTask,
	type TaskStatus,
} from "../domain/types";

export const R = "\x1b[0m";
export const B = "\x1b[1m";
export const DIM = "\x1b[2m";
const INV = "\x1b[7m";
export const CYAN = "\x1b[36m";

export type Filter = "all" | "active" | "failed" | "done";
export type SortKey = "recent" | "status" | "priority";

export const FILTERS: Filter[] = ["all", "active", "failed", "done"];
export const SORTS: SortKey[] = ["recent", "status", "priority"];
const STATUS_ORDER: Record<TaskStatus, number> = {
	failed: 0,
	running: 1,
	blocked: 2,
	queued: 3,
	killed: 4,
	done: 5,
};
const PRI_ORDER = { high: 0, med: 1, low: 2 };

export function elapsed(t: AgentTask): string {
	const end = t.finishedAt ?? Date.now();
	const s = Math.max(0, Math.round((end - (t.startedAt ?? t.createdAt)) / 1000));
	if (s < 60) return `${s}s`;
	if (s < 3600) return `${Math.floor(s / 60)}m`;
	return `${Math.floor(s / 3600)}h${Math.floor((s % 3600) / 60)}m`;
}

export function lastLogLines(t: AgentTask, n = 1): string[] {
	try {
		const raw = readFileSync(logPath(t.id), "utf8").trimEnd().split("\n");
		return raw.slice(-n);
	} catch {
		return t.note ? [t.note] : [];
	}
}

export function applyView(
	tasks: AgentTask[],
	filter: Filter,
	sort: SortKey,
	q: string,
): AgentTask[] {
	let out = tasks.slice().reverse(); // recent first
	if (q) {
		const n = q.toLowerCase();
		out = out.filter(
			(t) =>
				t.name.toLowerCase().includes(n) ||
				t.role.toLowerCase().includes(n) ||
				t.id.startsWith(n),
		);
	}
	if (filter === "active")
		out = out.filter((t) => t.status === "running" || t.status === "queued");
	if (filter === "failed") out = out.filter((t) => t.status === "failed");
	if (filter === "done")
		out = out.filter((t) => t.status === "done" || t.status === "killed");
	if (sort === "status")
		out.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
	if (sort === "priority")
		out.sort((a, b) => PRI_ORDER[a.priority] - PRI_ORDER[b.priority]);
	return out;
}

export function row(
	t: AgentTask,
	tasks: AgentTask[],
	selected: boolean,
	width: number,
): string {
	const c = STATUS_COLOR[t.status];
	const sub = t.parent ? " └─" : rollup(tasks, t);
	const name = t.parent ? `  ${t.name}` : t.name;
	const cells = [
		`${STATUS_ICON[t.status]} ${t.status}`,
		`${PRIORITY_ICON[t.priority]}`,
		t.id.slice(0, 8),
		t.source === "devin" ? "◆" : "$",
		t.role,
		elapsed(t),
		sub,
		name,
	];
	const cols = [11, 4, 10, 4, 13, 8, 6] as const;
	const line = cells
		.map((cell, i) => cell.slice(0, cols[i] - 1).padEnd(cols[i]))
		.join("")
		.slice(0, width);
	const colored = `${c}${line}${R}`;
	return selected ? `${INV}${colored}${R}` : colored;
}

/** Flatten parents + their children into tree order. */
export function treeOrder(tasks: AgentTask[]): AgentTask[] {
	const kids = new Set(tasks.filter((t) => t.parent).map((t) => t.id));
	const out: AgentTask[] = [];
	for (const t of tasks) {
		if (kids.has(t.id)) continue;
		out.push(t);
		out.push(...tasks.filter((k) => k.parent === t.id));
	}
	return out;
}
