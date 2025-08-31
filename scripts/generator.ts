import fs from "fs";
import path from "path";
import prettier, { Options } from "prettier";

const srcFolder = path.join(__dirname, "../pawnote_r0/src");
const prettierConfig = (JSON.parse(fs.readFileSync(path.join(__dirname, "../.prettierrc"), "utf-8")) as Options) || {};
console.log(prettierConfig);

async function generateIndex(folder) {
	const items = fs.readdirSync(folder);

	let exports: string[] = [];

	for (const item of items) {
		const fullPath = path.join(folder, item);
		const stats = fs.statSync(fullPath);

		if (stats.isDirectory()) {
			// On exporte le sous-dossier lui-même
			exports.push(`export * from "./${item}";`);
		} else if (stats.isFile() && item.endsWith(".ts") && item !== "index.ts" && !item.endsWith(".d.ts")) {
			const relativePath = "./" + item.replace(/\.ts$/, "");
			exports.push(`export * from "${relativePath}";`);
		}
	}

	if (exports.length > 0) {
		let content = exports.join("\n");
		content = await prettier.format(content, { ...prettierConfig, parser: "typescript" });
		fs.writeFileSync(path.join(folder, "index.ts"), content);
		console.log(`✅ index.ts généré pour ${folder}`);
	}
}

async function processFolder(folder) {
	const items = fs.readdirSync(folder);
	for (const item of items) {
		const fullPath = path.join(folder, item);
		const stats = fs.statSync(fullPath);

		if (stats.isDirectory()) {
			await processFolder(fullPath);
			await generateIndex(fullPath);
		} else if (stats.isFile() && fullPath.endsWith(".ts")) {
			const content = fs.readFileSync(fullPath, "utf-8");
			const formatted = await prettier.format(content, {
				...prettierConfig,
				parser: "typescript",
			});
			fs.writeFileSync(fullPath, formatted);
		}
	}
}

await processFolder(srcFolder);
console.log("🎉 Tous les fichiers formatés et tous les index.ts générés !");
