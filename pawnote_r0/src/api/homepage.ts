import { RequestFN } from "~p0/core";
import { decodeHomepage } from "~p0/decoders/homepage";
import { encodePronoteDate } from "~p0/encoders";
import { SessionHandle, TabLocation } from "~p0/models";
import { Homepage } from "~p0/models/homepage";
import { apiProperties, translateToWeekNumber } from "../definitions/private";

export const homepage = async (session: SessionHandle, day = session.instance.nextBusinessDay): Promise<Homepage> => {
	const properties = apiProperties(session);

	const weekNumber = translateToWeekNumber(day, session.instance.firstMonday);
	const next = encodePronoteDate(day);

	const request = new RequestFN(session, "PageAccueil", {
		[properties.signature]: { onglet: TabLocation.Presence },

		[properties.data]: {
			avecConseilDeClasse: true,

			dateGrille: {
				_T: 7,
				V: next,
			},

			numeroSemaine: weekNumber,

			coursNonAssures: {
				numeroSemaine: weekNumber,
			},

			personnelsAbsents: {
				numeroSemaine: weekNumber,
			},

			incidents: {
				numeroSemaine: weekNumber,
			},

			exclusions: {
				numeroSemaine: weekNumber,
			},

			donneesVS: {
				numeroSemaine: weekNumber,
			},

			registreAppel: {
				date: {
					_T: 7,
					V: next,
				},
			},

			previsionnelAbsServiceAnnexe: {
				date: {
					_T: 7,
					V: next,
				},
			},

			donneesProfs: {
				numeroSemaine: weekNumber,
			},

			EDT: {
				numeroSemaine: weekNumber,
			},

			TAFARendre: {
				date: {
					_T: 7,
					V: next,
				},
			},

			TAFEtActivites: {
				date: {
					_T: 7,
					V: next,
				},
			},

			partenaireCDI: {
				CDI: {},
			},

			tableauDeBord: {
				date: {
					_T: 7,
					V: next,
				},
			},

			modificationsEDT: {
				date: {
					_T: 7,
					V: next,
				},
			},
		},
	});

	const response = await request.send();
	return decodeHomepage(response.data[properties.data]);
};
