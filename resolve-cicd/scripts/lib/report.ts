export function isUnrecoverable(text: string): boolean {
	const lower = text.toLowerCase();
	return (
		lower.includes("spending limit") ||
		lower.includes("billing") ||
		lower.includes("payment") ||
		lower.includes("no runner") ||
		lower.includes("runner matching")
	);
}

export function formatDuration(start: string, end: string): string {
	const diff = new Date(end).getTime() - new Date(start).getTime();
	if (diff < 1_000) return `${diff}ms`;
	return `${Math.round(diff / 1_000)}s`;
}

function truncate(str: string, len: number): string {
	if (str.length <= len) return str;
	return `${str.slice(0, len - 3)}...`;
}

function stripAnsi(text: string): string {
	const esc = String.fromCharCode(0x1b);
	return text.replace(new RegExp(`${esc}\\[[0-9;]*m`, "g"), "");
}

export function extractRootCause(details: string, conclusion: string): string {
	const cleaned = stripAnsi(details)
		.replace(/\r\n/g, "\n")
		.split("\n")
		.map((l) => l.replace(/^X\s+/, "").trim())
		.filter(
			(l) =>
				l.length > 0 &&
				!l.startsWith("JOBS") &&
				!l.startsWith("Triggered via") &&
				!l.startsWith("+") &&
				!l.startsWith("=") &&
				!l.startsWith("-"),
		);

	for (const line of cleaned) {
		const lower = line.toLowerCase();
		if (
			lower.includes("spending limit") ||
			lower.includes("billing") ||
			lower.includes("payment") ||
			lower.includes("no runner") ||
			lower.includes("runner matching")
		) {
			return line;
		}
	}

	for (const line of cleaned) {
		const lower = line.toLowerCase();
		if (
			lower.includes("error") ||
			lower.includes("failed") ||
			lower.includes("cannot") ||
			lower.includes("unable") ||
			lower.includes("exit code")
		) {
			return line;
		}
	}

	return `conclusion: ${conclusion}`;
}

export function printReport(
	mode: "CI" | "CD",
	platform: string,
	target: string,
	status: string,
	duration: string,
	rootCause: string,
	action: string,
) {
	const cols = [
		"No.",
		"Mode",
		"Platform",
		"Target",
		"Status",
		"Duration",
		"Root Cause",
		"Action",
	];
	const widths = [3, 8, 12, 20, 8, 8, 24, 28];
	const values = [
		"1",
		mode,
		platform,
		target,
		status,
		duration,
		rootCause,
		action,
	].map((v, i) => truncate(v, widths[i]).padEnd(widths[i]));

	const sep = `+${widths.map((w) => "-".repeat(w + 2)).join("+")}+`;
	process.stdout.write(`\n${sep}\n`);
	process.stdout.write(
		`| ${cols.map((c, i) => c.padEnd(widths[i])).join(" | ")} |\n`,
	);
	process.stdout.write(`${sep}\n`);
	process.stdout.write(`| ${values.join(" | ")} |\n`);
	process.stdout.write(`${sep}\n\n`);
}
