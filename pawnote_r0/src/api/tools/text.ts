export const toPlainText = (input: string): string => {
	let text = input.replace(/<br\s*\/?>/gi, "\n");

	text = text.replace(/<[^>]+>/g, "");
	text = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));

	// @ts-ignore
	const textarea = globalThis.document?.createElement ? document.createElement("textarea") : null;
	if (textarea) {
		textarea.innerHTML = text;
		text = textarea.value;
	}

	return text.trim();
};

export const toMarkdown = (input: string): string => {
	let text = input;

	text = text.replace(/<br\s*\/?>/gi, "  \n");
	text = text.replace(/<\/div\s*>/gi, "\n");
	text = text.replace(/<div[^>]*>/gi, "");

	text = text.replace(/<\/?strong>/gi, "**");
	text = text.replace(/<\/?b>/gi, "**");

	text = text.replace(/<\/?em>/gi, "*");
	text = text.replace(/<\/?i>/gi, "*");

	text = text.replace(/<\/?u>/gi, "_");

	text = text.replace(/<ul[^>]*>/gi, "\n");
	text = text.replace(/<\/ul>/gi, "\n");
	text = text.replace(/<ol[^>]*>/gi, "\n");
	text = text.replace(/<\/ol>/gi, "\n");
	text = text.replace(/<li[^>]*>/gi, "- ");
	text = text.replace(/<\/li>/gi, "\n");

	text = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));

	// @ts-ignore
	const textarea = globalThis.document?.createElement ? document.createElement("textarea") : null;
	if (textarea) {
		textarea.innerHTML = text;
		text = textarea.value;
	}

	return text.trim();
};
