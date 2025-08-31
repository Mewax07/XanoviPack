import { AssignmentDifficulty, AssignmentReturn, AssignmentTheme, Attachment } from "./attachment";
import { Subject } from "./class";
import { QCMInfos } from "./qcm";

export const EntityState = {
	NONE: 0,
	CREATION: 1,
	MODIFICATION: 2,
	DELETION: 3,
	CHILDREN_MODIFICATION: 4,
} as const;

export type EntityState = (typeof EntityState)[keyof typeof EntityState];

export type Assignment = Readonly<{
	id: string;
	subject: Subject;
	description: string;
	backgroundColor: string;
	done: boolean;
	deadline: Date;
	givenOn: Date;
	attachments: Array<Attachment>;
	difficulty: AssignmentDifficulty;
	length?: number;
	themes: AssignmentTheme[];
	return: AssignmentReturn;
	qcmDone?: boolean;
	qcmInfo?: QCMInfos;
	resourceID?: string;
}>;
