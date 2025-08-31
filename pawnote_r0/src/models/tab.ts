import { Period } from "./time";

export const TabLocation = {
	Grades: 198,
	GradesRaise: 12,
	Resources: 89,
	Assignments: 88,
	Timetable: 16,
	Evaluations: 201,
	Account: 49,
	Presence: 7,
	News: 8,
	Notebook: 19,
	Discussions: 131,
	Gradebook: 13,
	Menus: 10,
	Documents: 148,
	Forum: 275,
	Results: 34,
} as const;

export type TabLocation = (typeof TabLocation)[keyof typeof TabLocation];

export type Tab = Readonly<{
	defaultPeriod?: Period;
	location: TabLocation;
	periods: Period[];
}>;
