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

function extractFormAction(html: string): string | null {
	const m = html.match(/<form[^>]*action=(?:'|")([^'"]+)(?:'|")[^>]*>/i);
	return m ? m[1] : null;
}
function extractInputs(html: string): Record<string, string> {
	const fields: Record<string, string> = {};
	const inputRe = /<input\b[^>]*name=(?:'|")([^'"]+)(?:'|")[^>]*>/gi;
	let match;
	while ((match = inputRe.exec(html)) !== null) {
		const tag = match[0];
		const name = match[1];
		const valMatch = tag.match(/value=(?:'|")([^'"]*)(?:'|")/i);
		fields[name] = valMatch ? valMatch[1] : "";
	}
	return fields;
}

function extractRedirectHref(html: string): string | null {
	const m = html.match(/<a\s+href=["']([^"']+)["']/i);
	return m ? m[1] : null;
}

async function submitAutoFormHtml(baseUrl: string, html: string) {
	let action = extractFormAction(html);
	if (!action) throw new Error("Impossible de trouver l'action du form.");
	if (!/^https?:\/\//i.test(action)) {
		const base = new URL(baseUrl);
		action = new URL(action, base).toString();
	}

	const fields = extractInputs(html);

	const params = new URLSearchParams();
	for (const [k, v] of Object.entries(fields)) {
		params.set(k, v);
	}

	const req = new HttpRequest.Builder(action)
		.setHeader("User-Agent", UA)
		.setHeader("Cookie", cookiesHeader())
		.setFormUrlEncodedBody(params)
		.setMethod(HttpRequest.Method.POST)
		.setRedirection(HttpRequest.Redirection.MANUAL)
		.build();

	const res = await send(req);

	const setCookie = res.headers.getSetCookie();
	cookies = { ...cookies, ...parseSetCookie(setCookie) };

	const location = res.headers.get("location");
	const body = await res.toString();

	return { res, location, body };
}

async function get(url: string) {
	const req = new HttpRequest.Builder(url)
		.setHeader("User-Agent", UA)
		.setHeader("Cookie", cookiesHeader())
		.setRedirection(HttpRequest.Redirection.MANUAL)
		.build();

	const res = await send(req);
	const setCookie = res.headers.getSetCookie();
	cookies = { ...cookies, ...parseSetCookie(setCookie) };

	const location = res.headers.get("location");
	const body = await res.toString();

	return { res, location, body };
}

async function sendSAML(baseUrl: string, html: string) {
	const result = await submitAutoFormHtml(baseUrl, html);

	console.log("POST envoyé vers (action):", result.res.url ?? "unknown");
	console.log("Location après POST (si redirigé):", result.location);

	return result;
}

const SAML_Html = `<form name="form1" action="/idp/profile/SAML2/Redirect/SSO?execution=e1s1" method="post">
    <input type="hidden" name="csrf_token" value="_6b26ee97f934e63d3be45fd5dc7877242bb02990" />
    <input name="shib_idp_ls_exception.shib_idp_session_ss" type="hidden" />
    <input name="shib_idp_ls_success.shib_idp_session_ss" type="hidden" value="false" />
    <input name="shib_idp_ls_value.shib_idp_session_ss" type="hidden" />
    <input name="shib_idp_ls_exception.shib_idp_persistent_ss" type="hidden" />
    <input name="shib_idp_ls_success.shib_idp_persistent_ss" type="hidden" value="false" />
    <input name="shib_idp_ls_value.shib_idp_persistent_ss" type="hidden" />
    <input name="shib_idp_ls_supported" type="hidden" />
    <input name="_eventId_proceed" type="hidden" />
    <noscript>
        <input type="submit" value="Continue" />
    </noscript>
</form>`;

async function start() {
	const result = await sendSAML("https://educonnect.education.gouv.fr/", SAML_Html);

	let nextUrl = result.location ?? extractRedirectHref(result.body) ?? null;
	if (!nextUrl) {
		console.log("Aucune redirection trouvée après le POST initial.");
		return;
	}

	const getNextUrl = await get(nextUrl);
	console.log(getNextUrl);

	const getStep2 = await get("https://educonnect.education.gouv.fr/idp/profile/SAML2/Redirect/SSO?execution=e2s1");
	console.log(getStep2);

	console.log("\nCookies finaux :", cookies);
}

await start();
