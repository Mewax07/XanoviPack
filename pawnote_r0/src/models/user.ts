import { Attachment } from "./attachment";
import { BaseInfo } from "./general";
import { Tab, TabLocation } from "./tab";

export type UserAuthorizations = Readonly<{
	canReadDiscussions: boolean;
	canDiscuss: boolean;
	canDiscussWithStaff: boolean;
	canDiscussWithParents: boolean;
	canDiscussWithStudents: boolean;
	canDiscussWithTeachers: boolean;
	hasAdvancedDiscussionEditor: boolean;
	maxAssignmentFileUploadSize: number;
	tabs: TabLocation[];
}>;

export type UserResource = Readonly<{
	className?: string;
	establishmentName: string;
	profilePicture: Attachment | null;
	isDirector: boolean;
	isDelegate: boolean;
	isMemberCA: boolean;
	tabs: Map<TabLocation, Tab>;
}> &
	BaseInfo;
