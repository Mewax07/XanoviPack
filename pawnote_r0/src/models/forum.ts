import { AssignmentTheme } from "./attachment";

export type EducationalForum = Readonly<{
	id: string;
	author: string;
	title: string;
	themes: AssignmentTheme[];
	startDiscusTime?: Date;
	endDiscusTime?: Date;
	state: "Open" | "Close";
	noReadedCount: number;
	memberCount: number;
}>;

export type ForumPost = Readonly<{
	id: string;
	author: string;
	date: string;
	content: string;
	isAuthor: boolean;
	isImportant: boolean;
	replyToAuthor?: string;
	replyToContent?: string;
}>;

export type ForumTopic = Readonly<{
	id: string;
	title: string;
	author: string;
	theme: string[];
	memberCount: number;
	description: string;
	posts: ForumPost[];
}>;
