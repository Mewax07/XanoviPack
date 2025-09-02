import { RequestFN } from "~p0/core";
import {
	AccessDeniedError,
	AccountDisabledError,
	AuthenticateError,
	BadCredentialsError,
	SessionHandle,
} from "~p0/models";
import { apiProperties } from "./api-properties";

export const authenticate = async (session: SessionHandle, challenge: string) => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "Authentification", {
		[properties.data]: {
			connexion: 0, // NOTE: Probably the `accessKind` property, not sure though.
			challenge,
			espace: session.information.accountKind,
		},
	});

	const response = await request.send();
	const data = response.data[properties.data];

	if (typeof data.Acces === "number" && data.Acces !== 0) {
		switch (data.Acces) {
			case 1:
				throw new BadCredentialsError();

			case 2:
			case 3:
			case 4:
			case 5:
			case 7:
			case 8:
				throw new AccessDeniedError();

			case 6:
			case 10:
				throw new AccountDisabledError();

			case 9:
				if (typeof data.AccesMessage !== "undefined") {
					let error: string = data.AccesMessage.message ?? "(none)";

					if (data.AccesMessage.titre) {
						error += `${data.AccesMessage.titre} ${error}`;
					}

					throw new AuthenticateError(error);
				}
		}
	}

	return data;
};
