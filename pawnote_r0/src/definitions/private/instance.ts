import forge from "node-forge";
import { RequestFN } from "~p0/core";
import { decodeInstanceParameters } from "~p0/decoders";
import { InstanceParameters, SessionHandle } from "~p0/models";

export const instanceParameters = async (
	session: SessionHandle,
	navigatorIdentifier: string | null = null,
): Promise<InstanceParameters> => {
	const rsaKey = forge.pki.rsa.setPublicKey(
		new forge.jsbn.BigInteger(session.information.rsaModulus, 16),
		new forge.jsbn.BigInteger(session.information.rsaExponent, 16),
	);

	const aesIV = session.information.aesIV;
	let uuid: string;

	if (session.information.rsaFromConstants) {
		uuid = forge.util.encode64(session.information.http ? rsaKey.encrypt(aesIV) : aesIV, 64);
	} else {
		uuid = forge.util.encode64(rsaKey.encrypt(aesIV));
	}

	const data = {
		identifiantNav: navigatorIdentifier,
		Uuid: uuid,
	};

	const request = new RequestFN(session, "FonctionParametres", {
		data,
		donnees: data,
	});

	const response = await request.send();

	return decodeInstanceParameters(response.data.data || response.data.donnees);
};
