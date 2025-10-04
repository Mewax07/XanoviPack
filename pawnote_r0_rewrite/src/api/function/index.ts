import { randomBytes } from "@noble/ciphers/utils.js";
import { base64 } from "@scure/base";
import { PKCS1_KEM } from "micro-rsa-dsa-dh/rsa.js";
import { Session } from "../../models";
import { RequestFunction } from "../../models/request";
import { ResponseFunction, ResponseFunctionWrapper } from "../../models/response";
import { FonctionParametresModel, FonctionParametresSignature } from "./response";

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
