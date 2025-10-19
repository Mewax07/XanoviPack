import forge from "node-forge";
import pako from "pako";
import { AES } from "~p0/definitions/private/aes";
import { apiProperties } from "~p0/definitions/private/api-properties";
import { aesKeys } from "~p0/definitions/private/keys";
import { SessionHandle } from "~p0/models";
import {
	AccessDeniedError,
	PageUnavailableError,
	RateLimitedError,
	ServerSideError,
	SessionExpiredError,
	SuspendedIPError,
} from "~p0/models/error";

export class ResponseFN {
	public constructor(
		private readonly session: SessionHandle,
		public data: any,
	) {
		const properties = apiProperties(this.session);

		this.session.information.order++;
		console.log("order response", this.session.information.order);
		const content = data;

		try {
			const response = JSON.parse(content);

			if (response.Erreur) {
				const error = response.Erreur.Title || "Server Error";
				throw new ServerSideError(error);
			}
			this.data = response[properties.secureData];

			if (!this.session.information.skipEncryption) {
				this.decrypt();
			}

			if (!this.session.information.skipCompression) {
				this.decompress();
			}

			if (typeof this.data === "string") {
				this.data = JSON.parse(this.data);
			}

			if (typeof this.data?.[properties.signature]?.Erreur !== "undefined") {
				throw new ServerSideError(this.data[properties.signature].MessageErreur);
			}
		} catch (error) {
			if (content.includes("La page a expir")) {
				throw new SessionExpiredError();
			} else if (content.includes("Votre adresse IP ")) {
				throw new SuspendedIPError();
			} else if (content.includes("La page dem") || content.includes("Impossible d'a")) {
				throw new PageUnavailableError();
			} else if (content.includes("Vous avez d")) {
				throw new RateLimitedError();
			} else if (content.includes("s refus")) {
				throw new AccessDeniedError();
			}

			throw error;
		}
	}

	private decrypt(): void {
		const { iv, key } = aesKeys(this.session);

		this.data = AES.decrypt(this.data, key, iv);

		if (!this.session.information.skipCompression) {
			this.data = forge.util.bytesToHex(this.data);
		}
	}

	private decompress(): void {
		const bytes = forge.util.hexToBytes(this.data);
		const compressed = new Uint8Array(Array.from(bytes).map((char) => char.charCodeAt(0)));
		this.data = pako.inflateRaw(compressed, { to: "string" });
	}
}
