import { AssignmentTheme } from "~p0/models";
import { decodeSubject } from "./subject";

export const decodeAssignmentTheme = (theme: any): AssignmentTheme => ({
	id: theme.N,
	name: theme.L,
	subject: decodeSubject(theme.Matiere.V),
});
