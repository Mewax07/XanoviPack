import { RequestFN } from "~p0/core";
import { decodeEducationalForum, decodeForumTopic } from "~p0/decoders/forum";
import { SessionHandle, TabLocation } from "~p0/models";
import { ForumAction, ForumActionNames } from "~p0/models/action";
import { EducationalForum, ForumTopic } from "~p0/models/forum";
import { apiProperties } from "../definitions/private";

export const educationalForum = async (session: SessionHandle): Promise<EducationalForum[]> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "ForumPedagogique", {
		[properties.signature]: {
			onglet: TabLocation.Forum,
		},
		[properties.data]: {
			type: "fpcr_Sujets",
		},
	});

	const response = await request.send();
	return decodeEducationalForum(response.data[properties.data]);
};

export const forumTopic = async (session: SessionHandle, forumId: string): Promise<ForumTopic> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "ForumPedagogique", {
		[properties.signature]: {
			onglet: TabLocation.Forum,
		},
		[properties.data]: {
			avecSujet: true,
			marqueur: "nonLu",
			modeVisuMembre: false,
			sujet: {
				N: forumId,
			},
			type: "fpcr_Posts",
			uniquementModeration: false,
		},
	});

	const response = await request.send();
	return decodeForumTopic(response.data[properties.data]);
};

export const sendForumMessage = async (session: SessionHandle, forumId: string, content: string, replyId?: string) => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "SaisieForumPedagogique", {
		[properties.signature]: {
			onglet: TabLocation.Forum,
		},
		[properties.data]: {
			contenu: content,
			post:
				replyId && replyId.length < 0
					? {
							N: replyId,
						}
					: null,
			sujet: {
				N: forumId,
			},
			type: "fpcs_Post_Creer",
		},
	});

	const response = await request.send();
	return {
		success: response.data.nom === "SaisieForumPedagogique",
		content,
	};
};

export const actionForum = async (session: SessionHandle, forumId: string, messageId: string, action: ForumAction) => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "SaisieForumPedagogique", {
		[properties.signature]: {
			onglet: TabLocation.Forum,
		},
		[properties.data]: {
			action,
			post: messageId,
			sujet: {
				N: forumId,
			},
			type: "fpcs_Post_Action",
		},
	});

	const response = await request.send();
	return {
		message: `Action "${ForumActionNames[action]}" send with ${response.data.nom === "SaisieForumPedagogique" ? "success issue" : "failed issue"}`,
	};
};
