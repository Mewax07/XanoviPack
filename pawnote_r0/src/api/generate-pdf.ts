import { RequestFN } from "~p0/core";
import { encodeGeneral_r0 } from "~p0/encoders/general";
import { encodePeriod } from "~p0/encoders/time";
import { Period, SessionHandle, TabLocation } from "~p0/models";
import { Instance } from "~p0/models/parent";
import { apiProperties } from "../definitions/private";

export const generatePDF = async (session: SessionHandle, student: Instance): Promise<string> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "GenerationPDF", {
		[properties.data]: {
			avecDepot: true,
			genreGenerationPDF: 11,
			options: {
				// defaults from pronote
				portrait: true,
				taillePolice: 8,
			},
			eleve: encodeGeneral_r0(student),
		},
		[properties.signature]: { onglet: TabLocation.Documents },
	});

	const response = await request.send();
	return session.information.url + "/" + encodeURI(response.data[properties.data].url.V);
};

export const gradebookPDF = async (session: SessionHandle, period: Period): Promise<string> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "GenerationPDF", {
		[properties.data]: {
			avecCodeCompetences: false,
			genreGenerationPDF: 2,
			options: {
				// defaults from pronote
				adapterHauteurService: false,
				desEleves: false,
				gererRectoVerso: false,
				hauteurServiceMax: 15,
				hauteurServiceMin: 10,
				piedMonobloc: true,
				portrait: true,
				taillePolice: 6.5,
				taillePoliceMin: 5,
				taillePolicePied: 6.5,
				taillePolicePiedMin: 5,
			},
			period: encodePeriod(period),
		},
		[properties.signature]: { onglet: TabLocation.Gradebook },
	});

	const response = await request.send();
	return session.information.url + "/" + encodeURI(response.data[properties.data].url.V);
};
