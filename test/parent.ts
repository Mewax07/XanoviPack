import { SessionHandle } from "../pawnote_r0/src";
import Xanovi from "../src";

const PRONOTE_URL = "https://demo.index-education.net/pronote";
const USERNAME = "demonstration";
const PASSWORD = "pronotevs";

async function main() {
	const session: SessionHandle = Xanovi.pronote.createSessionHandle();
	await Xanovi.pronote.loginCredentials(session, {
		url: PRONOTE_URL,
		kind: Xanovi.pronote.AccountKind.PARENT,
		username: USERNAME,
		password: PASSWORD,
		deviceUUID: "my-device-uuid",
	});

    const myKidsList = await Xanovi.pronote.getInstance(session);
    console.log(myKidsList.get(1));
}

main();