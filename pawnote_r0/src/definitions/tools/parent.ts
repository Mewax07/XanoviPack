import { SessionHandle } from "~p0/models";
import { Student } from "~p0/models/parent";

export const getStudentInstance = async (session: SessionHandle) => {
	const value: Student[] = session.user.resources.map((instance) => ({
		id: instance.id,
		name: instance.name,
		kind: instance.kind,
	}));

	return {
		value,
		count: value.length,
		hasMultiple: value.length > 1,
		isEmpty: value.length === 0,
		first: value[0] || null,
		last: value[value.length - 1] || null,
		all: () => value,
		findById: (id: string) => value.find((s) => s.id === id) || null,
		findByName: (name: string) => value.find((s) => s.name === name) || null,
		findByNameRegex: (regex: RegExp) => value.filter((s) => regex.test(s.name)),
		get: (query: string | number): Student | null => {
			if (typeof query === "number") {
				return value[query] ?? null;
			}

			if (query.includes("#")) {
				const id = query.slice(1);
				return value.find((s) => s.id === id) ?? null;
			} else {
				return value.find((s) => s.name.toLowerCase().includes(query.toLowerCase())) ?? null;
			}
		},
	};
};
