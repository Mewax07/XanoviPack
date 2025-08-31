import { RequestFN } from "~p0/core";
import { decodeResource } from "~p0/decoders/resource";
import { Assignment, SessionHandle, TabLocation } from "~p0/models";
import { Resource } from "~p0/models/resource";
import { decodeAssignment } from "./assignments";
import { apiProperties, homeworkFromIntervals, homeworkFromWeek } from "./private";

const decoder = (session: SessionHandle, data: any): Array<Resource> => {
	return data.ListeCahierDeTextes.V.map((resource: any) => decodeResource(resource, session));
};

export const resourcesFromWeek = async (
	session: SessionHandle,
	weekNumber: number,
	extendsToWeekNumber?: number,
): Promise<Resource[]> => {
	const reply = await homeworkFromWeek(session, TabLocation.Resources, weekNumber, extendsToWeekNumber);
	return decoder(session, reply);
};

export const resourcesFromIntervals = async (
	session: SessionHandle,
	startDate: Date,
	endDate: Date,
): Promise<Resource[]> => {
	const reply = await homeworkFromIntervals(session, TabLocation.Resources, startDate, endDate);
	return decoder(session, reply).filter((lesson) => startDate <= lesson.endDate && lesson.endDate <= endDate);
};

export const resourceAssignments = async (session: SessionHandle, resourceID: string): Promise<Array<Assignment>> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "donneesContenusCDT", {
		[properties.signature]: { onglet: TabLocation.Resources },

		[properties.data]: {
			pourTAF: true,
			cahierDeTextes: { N: resourceID },
		},
	});

	const response = await request.send();

	return response.data[properties.data].ListeCahierDeTextes.V[0].ListeTravailAFaire.V.map((assignment: any) =>
		decodeAssignment(assignment, session),
	);
};

export const resource = async (session: SessionHandle, resourceID: string): Promise<Resource> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "donneesContenusCDT", {
		[properties.signature]: { onglet: TabLocation.Resources },

		[properties.data]: {
			cahierDeTextes: { N: resourceID },
		},
	});

	const response = await request.send();

	const resource = response.data[properties.data].ListeCahierDeTextes.V[0];
	return decodeResource(resource, session);
};
