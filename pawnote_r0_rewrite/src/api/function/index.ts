import { randomBytes } from "@noble/ciphers/utils.js";
import { base64 } from "@scure/base";
import { PKCS1_KEM } from "micro-rsa-dsa-dh/rsa.js";
import { Session } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { FonctionIdentifyRequest, FonctionParametresRequest } from "./request";
import { FonctionIdentifyModel, FonctionParametresModel, FonctionParametresSignature } from "./response";

export type FonctionParametresResponse = ResponseFunctionWrapper<FonctionParametresModel, FonctionParametresSignature>;

export class FonctionParametres extends RequestFunction<FonctionParametresRequest> {
	private static readonly name = "FonctionParametres";

	private readonly decoder = new ResponseFunction(this.session, FonctionParametresModel, FonctionParametresSignature);

	public constructor(session: Session) {
		super(session, FonctionParametres.name);
	}

	private readonly iv = randomBytes(16);

	private generateUUID(): string {
		let iv = this.iv;

		if (!this.session.rsa.custom || (this.session.rsa.custom && this.session.homepage.http)) {
			iv = PKCS1_KEM.encrypt(this.session.rsa.publicKey, this.iv);
		}

		return base64.encode(iv);
	}

	public async send(navigatorIdentifier: string | null = null): Promise<FonctionParametresResponse> {
		const response = await this.execute({
			identifiantNav: navigatorIdentifier,
			Uuid: this.generateUUID(),
		});

		this.session.aes.iv = this.iv;

		return this.decoder.decode(response);
	}
}

export class FonctionIdentify extends RequestFunction<FonctionIdentifyRequest> {
	private static readonly name = "Identification";

	private readonly decoder = new ResponseFunction(this.session, FonctionIdentifyModel);

	public constructor(session: Session) {
		super(session, FonctionIdentify.name);
	}

	public async send(parameters: {
		requestFirstMobileAuthentication: boolean;
		reuseMobileAuthentication: boolean;
		requestFromQRCode: boolean;
		useCAS: boolean;

		username: string;
		deviceUUID: string;
	}) {
		const response = await this.execute({
			genreConnexion: 0, // NOTE: used by accounts with multiple "types" of connection like a professor's account. (0 - domicile, 1 - dans la classe) (0 by default).
			genreEspace: this.session.homepage.webspace,
			identifiant: parameters.username,
			pourENT: parameters.useCAS,
			enConnexionAuto: false,
			enConnexionAppliMobile: parameters.reuseMobileAuthentication,
			demandeConnexionAuto: false,
			demandeConnexionAppliMobile: parameters.requestFirstMobileAuthentication,
			demandeConnexionAppliMobileJeton: parameters.requestFromQRCode,
			uuidAppliMobile: parameters.deviceUUID,
			loginTokenSAV: "",
		});

		return this.decoder.decode(response);
	}
}
