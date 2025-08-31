import { EducationalForum, ForumPost, ForumTopic } from "~p0/models/forum";
import { decodeQCMTheme } from "./qcm";
import { decodePronoteDate } from "./time";

export const decodeForumSubject = (data: any): EducationalForum => {
	const forumData = {
		id: data.N,
		author: data.strAuteur,
		title: data.titre,
		themes: data.listeThemes.V.map(decodeQCMTheme),
		noReadedCount: data.nbNonLu,
		memberCount: data.nbMembres,
		state: data.etatPub === "EP_Ouvert" ? "Open" : "Close",
	};
	if (data.startDiscusTime) {
		forumData.startDiscusTime = decodePronoteDate(data.heureApres.V);
	}
	if (data.endDiscusTime) {
		forumData.endDiscusTime = decodePronoteDate(data.heureAvant.V);
	}
	return forumData as EducationalForum;
};

export const decodeEducationalForum = (data: any): EducationalForum[] => {
	return data.listeSujets.V.map(decodeForumSubject);
};

export const decodeForumPost = (data: any): ForumPost => {
	return {
		id: data.N,
		author: data.strAuteur,
		date: data.strDate,
		content: data.contenu,
		isAuthor: data.estAuteur ?? false,
		isImportant: data.estImportant ?? false,
		replyToAuthor: data.strAuteurSource,
		replyToContent: data.contenuSource,
	};
};

export const decodeForumTopic = (data: any): ForumTopic => {
	const sujet = data.sujet.V;
	return {
		id: sujet.N,
		title: sujet.titre,
		author: sujet.strAuteur,
		theme: sujet.listeThemes.V.map((t: any) => t.L),
		memberCount: sujet.nbMembres,
		description: sujet.htmlPost.V,
		posts: data.listePosts.V.map(decodeForumPost),
	};
};
