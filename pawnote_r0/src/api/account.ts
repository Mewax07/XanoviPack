import { RequestFN } from "~p0/core/request-function";
import { decodeAccount } from "~p0/decoders/account";
import { SessionHandle } from "~p0/models";
import { Account } from "~p0/models/account";
import { TabLocation } from "~p0/models/tab";
import { apiProperties } from "../definitions/private/api-properties";

export const account = async (session: SessionHandle): Promise<Account> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "PageInfosPerso", {
		[properties.signature]: {
			onglet: TabLocation.Account,
		},
	});

	const response = await request.send();
	return decodeAccount(response.data[properties.data], session);
};
