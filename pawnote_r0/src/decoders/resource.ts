import { Resource, ResourceContent, SessionHandle } from "~p0/models";
import { decodeAssignmentTheme } from "./assignment";
import { decodeAttachment } from "./attachment";
import { decodeSubject } from "./subject";
import { decodePronoteDate } from "./time";

export const decodeResourceContent = (content: any, session: SessionHandle): ResourceContent => {
	return {
		id: content.N,
		title: content.L,
		description: content.descriptif.V,
		category: content.categorie.V.G,
		categoryText: content.categorie.V.L,
		files: content.ListePieceJointe.V.map((attachment: any) => decodeAttachment(attachment, session)),
		themes: content.ListeThemes.V.map((theme: any) => decodeAssignmentTheme(theme)),
		// TODO: Investigate to see what is contained here when not `-1`.
		educativeValue: content.parcoursEducatif,
	};
};

export const decodeResource = (resource: any, session: SessionHandle): Resource => {
	return {
		id: resource.N,
		startDate: decodePronoteDate(resource.Date.V),
		endDate: decodePronoteDate(resource.DateFin.V),
		subject: decodeSubject(resource.Matiere.V),

		haveAssignment: typeof resource.dateTAF !== "undefined",
		assignmentDeadline: resource.dateTAF?.V && decodePronoteDate(resource.dateTAF.V),

		teachers: resource.listeProfesseurs.V.map((teacher: any) => teacher.L),
		groups: resource.listeGroupes.V.map((group: any) => group.L),

		backgroundColor: resource.CouleurFond,
		contents: resource.listeContenus.V.map((content: any) => decodeResourceContent(content, session)),
	};
};
