export const decodeDomain = (api: string): number[] => {
	api = api.trim();
	if (api[0] !== "[" || api[api.length - 1] !== "]") return [];

	api = api.slice(1, -1);
	if (api.length === 0) return [];

	const output: number[] = [];

	for (const part of api.split(",")) {
		if (part.includes("..")) {
			const [start, end] = part.split("..").map((n) => parseInt(n));
			for (let index = start; index <= end; index++) output.push(index);
		} else output.push(parseInt(part));
	}

	return output;
};
