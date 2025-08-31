import { RequestFN } from "~p0/core";
import { decodeAttachment, decodePronoteDate } from "~p0/decoders";
import { decodeAssignmentTheme } from "~p0/decoders/assignment";
import { decodeAssignmentQCM } from "~p0/decoders/qcm";
import { decodeSubject } from "~p0/decoders/subject";
import { AssignmentReturnKind, SessionHandle, TabLocation } from "~p0/models";
import { Assignment, EntityState } from "~p0/models/assignment";
import { apiProperties } from "./private";
import { homeworkFromIntervals, homeworkFromWeek } from "./private/homework";

export const decodeAssignment = (assignment: any, session: SessionHandle): Assignment => {
	return {
		id: assignment.N,
		subject: decodeSubject(assignment.Matiere.V),
		description: assignment.descriptif.V,
		backgroundColor: assignment.CouleurFond,
		done: assignment.TAFFait,
		givenOn: decodePronoteDate(assignment.DonneLe.V),
		deadline: decodePronoteDate(assignment.PourLe.V),
		attachments: assignment.ListePieceJointe.V.map((attachment: any) => decodeAttachment(attachment, session)),
		difficulty: assignment.niveauDifficulte,
		length: assignment.duree,
		themes: assignment.ListeThemes.V.map((theme: any) => decodeAssignmentTheme(theme)),
		return: {
			kind: assignment.genreRendu ?? AssignmentReturnKind.None,
			canUpload: assignment.peuRendre ?? false,
			uploaded: assignment.documentRendu && decodeAttachment(assignment.documentRendu.V, session),
		},
		qcmDone: assignment.QCMFait,
		qcmInfo: assignment.executionQCM !== undefined ? decodeAssignmentQCM(assignment.executionQCM) : undefined,
		resourceID: assignment.cahierDeTextes?.V.N,
	};
};

const decoder = (session: SessionHandle, data: any): Array<Assignment> => {
	return data.ListeTravauxAFaire.V.map((homework: any) => decodeAssignment(homework, session));
};

export const assignmentsFromWeek = async (
	session: SessionHandle,
	weekNumber: number,
	extendsToWeekNumber?: number,
): Promise<Array<Assignment>> => {
	const reply = await homeworkFromWeek(session, TabLocation.Assignments, weekNumber, extendsToWeekNumber);
	return decoder(session, reply);
};

export const assignmentsFromIntervals = async (
	session: SessionHandle,
	startDate: Date,
	endDate: Date,
): Promise<Array<Assignment>> => {
	const reply = await homeworkFromIntervals(session, TabLocation.Assignments, startDate, endDate);
	// Only keep items assignments are in the intervals.
	return decoder(session, reply).filter((homework) => startDate <= homework.deadline && homework.deadline <= endDate);
};

export const assignmentStatus = async (session: SessionHandle, assignmentID: string, done: boolean): Promise<void> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "SaisieTAFFaitEleve", {
		[properties.signature]: { onglet: TabLocation.Assignments },

		[properties.data]: {
			listeTAF: [
				{
					E: EntityState.MODIFICATION,
					TAFFait: done,
					N: assignmentID,
				},
			],
		},
	});

	await request.send();
};
