import { RequestFN } from "~p0/core";
import { decodeEvaluation } from "~p0/decoders/evaluation";
import { encodePeriod } from "~p0/encoders";
import { Period, SessionHandle, TabLocation } from "~p0/models";
import { Evaluation } from "~p0/models/evaluation";
import { apiProperties } from "../definitions/private";

export const evaluations = async (session: SessionHandle, period: Period): Promise<Array<Evaluation>> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "DernieresEvaluations", {
		[properties.signature]: { onglet: TabLocation.Evaluations },

		[properties.data]: {
			periode: encodePeriod(period),
		},
	});

	const response = await request.send();

	return response.data[properties.data].listeEvaluations.V.map(decodeEvaluation);
};
