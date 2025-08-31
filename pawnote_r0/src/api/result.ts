import { RequestFN } from "~p0/core";
import { decodeBrevetReport } from "~p0/decoders";
import { encodeGeneral_r0 } from "~p0/encoders";
import { BrevetReport, SessionHandle, Student, TabLocation } from "~p0/models";
import { apiProperties } from "./private";

export const result = async (session: SessionHandle, student: Student): Promise<BrevetReport> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "PageFicheBrevet", {
		[properties.signature]: { onglet: TabLocation.Results },

		[properties.data]: {
			eleve: encodeGeneral_r0(student),
		},
	});

	const response = await request.send();
	return decodeBrevetReport(response.data[properties.data]);
};
