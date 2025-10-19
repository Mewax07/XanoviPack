import { bytesToUtf8, hexToBytes } from "@noble/ciphers/utils.js";
import { deserialize } from "~d0/index";
import { inflate } from "~p0_rw/core/inflate";
import { HttpResponse } from "~s0/response";
import {
	AccessDeniedError,
	PageUnavailableError,
	RateLimitedError,
	ServerSideError,
	SessionExpiredError,
	SuspendedIpError,
} from "./errors";
import { Session } from "./session";

export interface ResponseFunctionWrapper<DataModel, SignatureModel = undefined> {
	data: DataModel;
	signature?: SignatureModel;
}

export class ResponseFunction<
	DataModel extends new (...args: any[]) => any,
	SignatureModel extends (new (...args: any[]) => any) | undefined = undefined,
> {
	public constructor(
		private readonly session: Session,
		private readonly DataModel: DataModel,
		private readonly SignatureModel?: SignatureModel,
	) {}

	public async decode(
		response: HttpResponse,
	): Promise<
		ResponseFunctionWrapper<
			InstanceType<DataModel>,
			SignatureModel extends new (...args: any[]) => any ? InstanceType<SignatureModel> : undefined
		>
	> {
		this.session.api.order++;
		console.log("order response", this.session.api.order);

		const content = await response.toString();

		try {
			const json = JSON.parse(content);

			if (json.Erreur) {
				const error = json.Erreur.Titre || "Server Error";
				throw new ServerSideError(error.title);
			}

			let data = json[this.session.api.properties.secureData];
			if (typeof data === "string") {
				data = hexToBytes(data);

				if (!this.session.api.skipEncryption) {
					data = this.session.aes.decrypt(data);
				}

				if (!this.session.api.skipCompression) {
					data = inflate(data);
				}

				data = JSON.parse(bytesToUtf8(data));
			}

			if (data[this.session.api.properties.signature]?.Erreur) {
				throw new ServerSideError(data[this.session.api.properties.signature].MessageErreur);
			}

			return {
				data: deserialize(this.DataModel, data.data),
				signature:
					this.SignatureModel &&
					deserialize(this.SignatureModel, data[this.session.api.properties.signature]),
			};
		} catch (error) {
			if (content.includes("La page a expir")) {
				throw new SessionExpiredError();
			} else if (content.includes("Votre adresse IP ")) {
				throw new SuspendedIpError();
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
}
