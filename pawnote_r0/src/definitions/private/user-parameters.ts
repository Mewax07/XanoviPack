import { RequestFN } from "~p0/core/request-function";
import { decodeUserParameters } from "~p0/decoders";
import type { SessionHandle } from "~p0/models";
import { UserParameters } from "~p0/models";
import { apiProperties } from "./api-properties";

export const userParameters = async (session: SessionHandle): Promise<UserParameters> => {
	const request = new RequestFN(session, "ParametresUtilisateur", {});
	const response = await request.send();
	return decodeUserParameters(response.data[apiProperties(session).data], session);
};
