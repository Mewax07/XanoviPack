import { Subject } from "./class";

export const AttachmentKind = {
	Link: 0,
	File: 1,
} as const;

export type AttachmentKind = (typeof AttachmentKind)[keyof typeof AttachmentKind];

export const AssignmentDifficulty = {
	None: 0,
	Easy: 1,
	Medium: 2,
	Hard: 3,
} as const;

export type AssignmentDifficulty = (typeof AssignmentDifficulty)[keyof typeof AssignmentDifficulty];

export type AssignmentTheme = Readonly<{
	id: string;
	name: string;
	subject: Subject;
}>;

export const AssignmentReturnKind = {
	None: 0,
	Paper: 1,
	FileUpload: 2,
	Kiosk: 3,

	/** Only available since version 2024. */
	AudioRecording: 4,
} as const;

export type AssignmentReturnKind = (typeof AssignmentReturnKind)[keyof typeof AssignmentReturnKind];

export type AssignmentReturn = {
	readonly kind: AssignmentReturnKind;
	uploaded?: Attachment;
	canUpload: boolean;
	// NOTE: Not sure if we can block the upload once the user has uploaded a file (so the property updates from `true` to `false`)
	// If we cannot, then this should be readonly.
};

export type Attachment = Readonly<{
	kind: AttachmentKind;
	name: string;
	url: string;
	id: string;
}>;
