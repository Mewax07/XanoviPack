import { HttpRequest, send } from "~s0/index.bun";

const UA =
	"Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 PRONOTE Mobile APP Version/2.0.11";

let cookies: Record<string, string> = {};

function parseSetCookie(setCookieRaw: string | string[] | undefined): Record<string, string> {
	const out: Record<string, string> = {};
	if (!setCookieRaw) return out;
	const arr = Array.isArray(setCookieRaw) ? setCookieRaw : [setCookieRaw];
	for (const line of arr) {
		const [k, ...v] = line.split("=");
		if (!k || !v) continue;
		out[k.trim()] = v.join("=").split(";")[0].trim();
	}
	return out;
}

function cookiesHeader(): string {
	return Object.entries(cookies)
		.map(([k, v]) => `${k}=${v}`)
		.join("; ");
}

async function get(url: string) {
	const request = new HttpRequest.Builder(url)
		.setHeader("User-Agent", UA)
		.setHeader("Cookie", cookiesHeader())
		.setRedirection(HttpRequest.Redirection.MANUAL)
		.build();

	const response = await send(request);

	const setCookie = response.headers.getSetCookie();
	cookies = { ...cookies, ...parseSetCookie(setCookie) };

	const location = response.headers.get("location");

	const html = await response.toString();

	return { response, location, html };
}

async function startCAS() {
	const initialUrl = "https://www.monbureaunumerique.fr/";
	await get(initialUrl);

	const url =
		"https://cas.monbureaunumerique.fr/login?selection=EDU&service=https%3A%2F%2Fwww.monbureaunumerique.fr%2Fsg.do%3FPROC%3DIDENTIFICATION_FRONT&submit=Confirm";

	const { location, html } = await get(url);

	if (html.includes("<form") && html.includes("SAMLRequest")) {
		console.log("Formulaire SAML détecté !");
		console.log(html);
		console.log("\nCookies actuels:", cookies);
	}

	if (location) {
		console.log("Redirection détectée vers :", location);
	}
}

async function connect() {
	const initialUrl = "https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=e1s2";
	const res = await get(initialUrl);

	const html = await res.response.toHTML();
	console.log(html.html());
}

// await startCAS();

connect();
