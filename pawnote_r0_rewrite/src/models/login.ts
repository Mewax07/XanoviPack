import { deserialize } from "~d0/deserialize";
import { UA } from "~p0/core/user-agent";
import { HeaderKeys } from "~s0/headers";
import { send } from "~s0/index.bun";
import { HttpRequest, HttpRequestRedirection } from "~s0/request";
import { FonctionParametres } from "../api/function";
import { BusyPageError, PageUnavailableError, SuspendedIpError } from "./errors";
import { Instance } from "./instance";
import { Parameters } from "./params";
import { HomepageSession, Session } from "./session";
import { Webspace } from "./webspace";

export class Login {
	private session?: Session;

	public constructor(private readonly instance: Instance) {}

	public async initializeWithStudentCredentials(
		username: string,
		password: string,
		deviceUUID = crypto.randomUUID() as string,
		navigatorIdentifier: string | null = null,
	) {
		return this._initializeWithCredentials(Webspace.Students, username, password, deviceUUID, navigatorIdentifier);
	}

	private async _initializeWithCredentials(
		webspace: Webspace,
		username: string,
		password: string,
		deviceUUID: string,
		navigatorIdentifier: string | null,
	) {
		const instance = await this.instance.getInformation();
		const homepage = await this.getWebspaceHomepageSession(webspace);

		this.session = new Session(instance, homepage, this.instance.base);
		const parameters = new Parameters(await new FonctionParametres(this.session).send(navigatorIdentifier));

		console.log(parameters);
	}

	private async getWebspaceHomepageSession(
		webspace: Webspace,
		cookies: Record<string, string> = {},
	): Promise<HomepageSession> {
		const params = new URLSearchParams();
		params.set("fd", "1");
		params.set("login", "true");
		params.set("bydlg", "A6ABB224-12DD-4E31-AD3E-8A39A1C2C335");
		const url = this.instance.base + "/" + Webspace.toMobilePath(webspace) + "?" + params.toString();

		const request = new HttpRequest.Builder(url)
			.setRedirection(HttpRequestRedirection.MANUAL)
			.setHeader(HeaderKeys.USER_AGENT, UA)
			.setAllCookies(cookies)
			.build();

		const response = await send(request);
		let html = await response.toString();

		if (html.includes("Votre adresse IP est provisoirement suspendue")) {
			throw new SuspendedIpError();
		} else if (html.includes("Le site n'est pas disponible")) {
			throw new PageUnavailableError();
		} else if (html.includes("Le site est momentanément indisponible")) {
			throw new BusyPageError();
		}

		html = html.replace(/ /gu, "").replace(/\n/gu, "");

		const from = "Start(";
		const to = ")}catch";

		const arg = html.substring(html.indexOf(from) + from.length, html.indexOf(to));

		const json = JSON.parse(arg.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/gu, '"$2": ').replace(/'/gu, '"'));

		return deserialize(HomepageSession, json);
	}
}
