import { AssignmentTheme, Attachment } from "./attachment";
import { Subject } from "./class";

export const ResourceContentCategory = {
	NONE: 0,
	LESSON: 1,
	CORRECTION: 2,
	DST: 3,
	ORAL_INTERROGATION: 4,
	TD: 5,
	TP: 6,
	EVALUATION_COMPETENCES: 7,
	EPI: 8,
	AP: 9,
	VISIO: 12,
} as const;

export type ResourceContentCategory = (typeof ResourceContentCategory)[keyof typeof ResourceContentCategory];

export type ResourceContent = Readonly<{
	id: string;
	title?: string;
	description?: string;
	category: ResourceContentCategory;
	categoryText?: string;
	files: Attachment[];
	themes: AssignmentTheme[];
	educativeValue: number;
}>;

export type Resource = Readonly<{
	id: string;
	startDate: Date;
	endDate: Date;
	subject: Subject;
	haveAssignment: boolean;
	assignmentDeadline?: Date;
	backgroundColor: string;
	contents: Array<ResourceContent>;
	teachers: string[];
	groups: string[];
}>;
