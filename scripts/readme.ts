import fs from "fs";
import path from "path";

function stripCodeFences(s: string) {
	return s.replace(/```[\s\S]*?```/g, "");
}

function countTodos(markdown: string) {
	const checked = (markdown.match(/(^|\s)-\s*\[[xX]\]/g) || []).length;
	const unchecked = (markdown.match(/(^|\s)-\s*\[\s\]/g) || []).length;
	const total = checked + unchecked;
	const percent = total ? Math.round((checked / total) * 100) : 0;
	return { checked, unchecked, total, percent };
}

function progressBar(percent: number, width = 24) {
	const filled = Math.round((percent / 100) * width);
	return "█".repeat(filled) + "░".repeat(Math.max(0, width - filled));
}

const content = fs.readFileSync(path.join(__dirname, "../README.md"), "utf-8");

const sectionRegex = /^(##\s+Todo List[^\n]*?)\n([\s\S]*?)(?=^##\s+|\Z)/gim;

const matches = [...content.matchAll(sectionRegex)];

if (matches.length === 0) {
	console.log("Aucune section '## Todo List' trouvée.");
	process.exit(0);
}

let globalChecked = 0;
let globalTotal = 0;

for (const m of matches) {
	const rawTitle = m[1].trim();
	const rawBody = m[2];
	const body = stripCodeFences(rawBody);

	const { checked, total, percent } = countTodos(body);
	globalChecked += checked;
	globalTotal += total;

	const title = rawTitle.replace(/^##\s+/, "");

	console.log(`📌 ${title}`);
	console.log(`   ${progressBar(percent)}  ${percent}%`);
	console.log(`   ✅ ${checked}/${total}\n`);
}

const globalPercent = globalTotal ? Math.round((globalChecked / globalTotal) * 100) : 0;

console.log("=== Résumé Global ===");
console.log(`   ${progressBar(globalPercent)}  ${globalPercent}%`);
console.log(`   ✅ ${globalChecked}/${globalTotal}`);
