import { readFileSync, statSync } from "node:fs";
import { killTask, pump, reconcile, runTask } from "../application/runner";
import {
	getTask,
	logPath,
	pendingDeps,
	removeTask,
	rollup,
} from "../data/store";
import {
	PRIORITY_COLOR,
	PRIORITY_ICON,
	STATUS_COLOR,
	STATUS_ICON,
	type AgentTask,
	type TaskStatus,
} from "../domain/types";

const R = "\x1b[0m";
const B = "\x1b[1m";
const DIM = "\x1b[2m";
const INV = "\x1b[7m";
const CYAN = "\x1b[36m";

type Filter = "all" | "active" | "failed" | "done";
type SortKey = "recent" | "status" | "priority";

const FILTERS: Filter[] = ["all", "active", "failed", "done"];
const SORTS: SortKey[] = ["recent", "status", "priority"];
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

function logSize(t: AgentTask): string {
	try {
		const b = statSync(logPath(t.id)).size;
		return b > 1024 * 1024
			? `${(b / 1024 / 1024).toFixed(1)}M`
			: b > 1024
				? `${(b / 1024).toFixed(0)}K`
				: `${b}B`;
	} catch {
		return t.source === "devin" ? "devin" : "-";
	}
}

function applyView(
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

function row(
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
function treeOrder(tasks: AgentTask[]): AgentTask[] {
	const kids = new Set(tasks.filter((t) => t.parent).map((t) => t.id));
	const out: AgentTask[] = [];
	for (const t of tasks) {
		if (kids.has(t.id)) continue;
		out.push(t);
		out.push(...tasks.filter((k) => k.parent === t.id));
	}
	return out;
}

/** Live TUI — poll task state, ClickUp-style table + detail pane. */
export async function watchDashboard(): Promise<void> {
	let sel = 0;
	let filter: Filter = "all";
	let sort: SortKey = "recent";
	let q = "";
	let searchMode = false;

	const view = () => treeOrder(applyView(reconcile(), filter, sort, q));

	const render = () => {
		const tasks = view();
		const all = reconcile();
		sel = Math.max(0, Math.min(sel, tasks.length - 1));
		const w = process.stdout.columns || 100;
		const running = all.filter((t) => t.status === "running").length;
		const failed = all.filter((t) => t.status === "failed").length;

		let out = `\x1b[2J\x1b[H`;
		out += `${B}${CYAN}subagents${R} ${DIM}·${R} ${all.length} tasks · ${CYAN}${running} running${R}${failed ? ` · \x1b[31m${failed} failed${R}` : ""}\n`;
		out += `${DIM}filter:${R}${FILTERS.map((f) => (f === filter ? `${B}${f}${R}` : f)).join(" ")}  ${DIM}sort:${R}${SORTS.map((s) => (s === sort ? `${B}${s}${R}` : s)).join(" ")}  ${searchMode ? `${B}/${q}${R}` : q ? `${DIM}/${q}${R}` : ""}\n\n`;

		out += `${DIM}${"STATUS".padEnd(11)}${"PRI".padEnd(4)}${"ID".padEnd(10)}${"SRC".padEnd(4)}${"ROLE".padEnd(13)}${"ELAPSED".padEnd(8)}${"SUB".padEnd(6)}NAME${R}\n`;
		for (const [i, t] of tasks.entries()) {
			out += `${row(t, tasks, i === sel, w)}\n`;
		}
		if (tasks.length === 0)
			out += `${DIM}  (no tasks — try filter: all)${R}\n`;

		// Detail pane: selected task preview
		const t = tasks[sel];
		if (t) {
			out += `\n${DIM}${"─".repeat(Math.min(w, 80))}${R}\n`;
			out += `${B}${t.name}${R} ${DIM}${t.id} · ${t.source} · ${t.role}${R}\n`;
			if (t.cmd) out += `${DIM}cmd: ${t.cmd}${R}\n`;
			const deps = pendingDeps(all, t);
			if (deps.length > 0)
				out += `\x1b[35m⊘ waiting on: ${deps.join(", ")}${R}\n`;
			if (t.parent)
				out += `${DIM}subtask of ${t.parent}${R}\n`;
			for (const l of lastLogLines(t, 3)) out += `${DIM}│ ${l.slice(0, w - 4)}${R}\n`;
		}

		out += `\n${DIM}↑↓ move · / search · f filter · s sort · p pump · r retry · k kill · d del · q quit${R}`;
		process.stdout.write(out);
	};

	if (process.stdin.isTTY) {
		process.stdin.setRawMode(true);
		process.stdin.on("data", (buf) => {
			const k = buf.toString();
			if (searchMode) {
				if (k === "\r" || k === "\x1b") searchMode = false;
				else if (k === "\x7f") q = q.slice(0, -1);
				else if (k >= " ") q += k;
				render();
				return;
			}
			if (k === "q" || k === "\x03") process.exit(0);
			else if (k === "/") searchMode = true;
			else if (k === "f")
				filter = FILTERS[(FILTERS.indexOf(filter) + 1) % FILTERS.length];
			else if (k === "s")
				sort = SORTS[(SORTS.indexOf(sort) + 1) % SORTS.length];
			else if (k === "\x1b[B") sel++;
			else if (k === "\x1b[A") sel--;
			else if (k === "p") pump();
			else {
				const t = view()[sel];
				if (!t) {
					render();
					return;
				}
				if (k === "k") killTask(t);
				else if (k === "d") {
					removeTask(t.id);
					sel = Math.max(0, sel - 1);
				} else if (k === "r" && (t.status === "failed" || t.status === "killed")) {
					runTask({ ...t, status: "queued" });
				}
			}
			render();
		});
	}

	render();
	const timer = setInterval(render, 1000);
	process.on("exit", () => clearInterval(timer));
	await new Promise(() => {});
}

/** Tail-style dump of a task's log. */
export function printLog(id: string): void {
	try {
		process.stdout.write(readFileSync(logPath(id), "utf8"));
	} catch {
		console.error(`no log for ${id}`);
	}
}

export function printTable(opts: {
	status?: string;
	role?: string;
	q?: string;
} = {}): void {
	let tasks = reconcile().slice().reverse();
	if (opts.status) tasks = tasks.filter((t) => t.status === opts.status);
	if (opts.role) tasks = tasks.filter((t) => t.role === opts.role);
	if (opts.q) {
		const n = opts.q.toLowerCase();
		tasks = tasks.filter(
			(t) => t.name.toLowerCase().includes(n) || t.id.startsWith(n),
		);
	}
	tasks = treeOrder(tasks);
	console.log(
		`${"STATUS".padEnd(11)}${"PRI".padEnd(4)}${"ID".padEnd(10)}${"SRC".padEnd(6)}${"ROLE".padEnd(13)}${"ELAPSED".padEnd(8)}${"SUB".padEnd(6)}NAME`,
	);
	for (const t of tasks) {
		const c = STATUS_COLOR[t.status];
		const sub = t.parent ? " └─" : rollup(tasks, t);
		const name = t.parent ? `  ${t.name}` : t.name;
		console.log(
			`${c}${STATUS_ICON[t.status]} ${t.status.padEnd(9)}${R}${PRIORITY_COLOR[t.priority]}${PRIORITY_ICON[t.priority].padEnd(4)}${R}${t.id.slice(0, 8).padEnd(10)}${(t.source === "devin" ? "devin" : "shell").padEnd(6)}${t.role.slice(0, 12).padEnd(13)}${elapsed(t).padEnd(8)}${sub.padEnd(6)}${name}`,
		);
	}
	if (tasks.length === 0) console.log("(no tasks)");
}
