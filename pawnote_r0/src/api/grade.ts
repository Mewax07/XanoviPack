import { RequestFN } from "~p0/core";
import { decodeGradeBook, decodeGradesOverview, decodeGradesRaising } from "~p0/decoders/grade";
import { encodePeriod } from "~p0/encoders";
import { Period, SessionHandle, TabLocation } from "~p0/models";
import { GradeBook, GradesOverview, ReportCard } from "~p0/models/grade";
import { apiProperties } from "./private";

export const gradesOverview = async (session: SessionHandle, period: Period): Promise<GradesOverview> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "DernieresNotes", {
		[properties.signature]: { onglet: TabLocation.Grades },

		[properties.data]: {
			Periode: encodePeriod(period),
		},
	});

	const response = await request.send();
	return decodeGradesOverview(response.data[properties.data], session);
};

export const gradesRaising = async (session: SessionHandle, period: Period, eleveId: string): Promise<ReportCard> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "PageReleve", {
		[properties.signature]: { onglet: TabLocation.GradesRaise },

		[properties.data]: {
			eleve: {
				N: eleveId,
			},
			periode: {
				G: 2, // NOTE: Aucune idée de pourquoi c'est 2 mais c'est 2.
				N: period.id,
			},
		},
	});

	const response = await request.send();
	return decodeGradesRaising(response.data[properties.data]);
};

export const gradebook = async (session: SessionHandle, period: Period): Promise<GradeBook> => {
	const properties = apiProperties(session);

	period = { ...period, kind: 2 };

	const request = new RequestFN(session, "PageBulletins", {
		[properties.data]: {
			classe: {},
			eleve: {},
			periode: encodePeriod(period),
		},
		[properties.signature]: { onglet: TabLocation.Gradebook },
	});

	const response = await request.send();
	return await decodeGradeBook(session, period, response.data[properties.data]);
};
