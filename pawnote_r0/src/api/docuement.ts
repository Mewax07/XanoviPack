import { RequestFN } from "~p0/core";
import { decodeDocuments } from "~p0/decoders/document";
import { SessionHandle, TabLocation } from "~p0/models";
import { Document } from "~p0/models/document";
import { apiProperties } from "../definitions/private";

export const documents = async (session: SessionHandle): Promise<Document> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "DocumentsATelecharger", {
		[properties.signature]: {
			onglet: TabLocation.Documents,
		},
		[properties.data]: {
			avecCompetences: true,
			avecNotes: true,
		},
	});

	const response = await request.send();
	return decodeDocuments(response.data[properties.data]);
};
