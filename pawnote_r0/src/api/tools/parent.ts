import { SessionHandle } from "~p0/models";
import { Student } from "~p0/models/parent";

export const getStudentInstance = async (session: SessionHandle): Promise<Student[]> => {
	return session.user.resources.map((instance) => ({
		id: instance.id,
		name: instance.name,
		kind: instance.kind,
	}));
};
