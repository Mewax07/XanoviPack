import forge from "node-forge";
import pako from "pako";
import { AES } from "~p0/api/private/aes";
import { apiProperties } from "~p0/api/private/api-properties";
import { aesKeys } from "~p0/api/private/keys";
import { AccountKind, SessionHandle } from "~p0/models";
import { ResponseFN } from "./response-function";

export class RequestFN {
	public constructor(
		private readonly session: SessionHandle,
		public name: string,
		public data: any,
	) {}

	public process(): {
		order: string;
		url: URL;
	} {
		this.session.information.order++;

		const order = this.generateOrder();
		const url = new URL(
			`${this.session.information.url}/appelfonction/${this.session.information.accountKind}/${this.session.information.id}/${order}`,
		);

		if (!this.session.information.skipCompression) {
			this.compress();
		}

		if (!this.session.information.skipCompression) {
			this.compress();
		}

		if (!this.session.information.skipEncryption) {
			this.encrypt();
		}

		return { order, url };
	}

	private keys() {
		return aesKeys(this.session, this.session.information.order === 1);
	}

	private generateOrder(): string {
		const { key, iv } = this.keys();
		return AES.encrypt(this.session.information.order.toString(), key, iv);
	}

	private stringify(): string {
		return forge.util.encodeUtf8(JSON.stringify(this.data) || "");
	}

	private compress(): void {
		const buffer = forge.util.createBuffer(this.stringify()).toHex();

		const deflated = pako.deflateRaw(buffer, { level: 6 });
		const bytes = Array.from(deflated)
			.map((byte) => String.fromCharCode(byte))
			.join("");

		this.data = forge.util.bytesToHex(bytes);
	}

	private encrypt(): void {
		const { key, iv } = this.keys();

		const data = !this.session.information.skipCompression ? forge.util.hexToBytes(this.data) : this.stringify();

		this.data = AES.encrypt(data, key, iv);
	}

	public async send(debug: boolean = false): Promise<ResponseFN> {
		return this.session.queue.push(async () => {
			const payload = this.process();
			const properties = apiProperties(this.session);

			if (this.session?.user && this.data?.Signature) {
				if (this.session.information.accountKind === AccountKind.PARENT) {
					const kid = this.session.user.resources.at(0);
					this.data.Signature.membre = {
						N: kid?.id,
						G: kid?.kind,
					};
				}
			}

			if (debug) {
				console.log({
					url: payload.url,
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					content: JSON.stringify({
						[properties.session]: this.session.information.id,
						[properties.orderNumber]: payload.order,
						[properties.requestId]: this.name,
						[properties.secureData]: this.data,
					}),
				});
			}

			const response = await this.session.fetcher({
				url: payload.url,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				content: JSON.stringify({
					[properties.session]: this.session.information.id,
					[properties.orderNumber]: payload.order,
					[properties.requestId]: this.name,
					[properties.secureData]: this.data,
				}),
			});

			return new ResponseFN(this.session, response.content);
		});
	}
}
