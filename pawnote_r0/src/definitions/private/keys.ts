import forge from "node-forge";
import { SessionHandle } from "~p0/models";

type Keys = {
	iv: forge.util.ByteBuffer;
	key: forge.util.ByteBuffer;
};

export const aesKeys = (session: SessionHandle, forceEmptyIV = false): Keys => {
	const iv = forge.util.createBuffer(forceEmptyIV ? "" : session.information.aesIV);
	const key = forge.util.createBuffer(session.information.aesKey);

	return { iv, key };
};
