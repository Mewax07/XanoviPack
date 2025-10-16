import { SessionHandle } from "../pawnote_r0/src";
import Xanovi from "../src";

const PRONOTE_URL = "https://demo.index-education.net/pronote";
const USERNAME = "demonstration";
const PASSWORD = "pronotevs";

async function main() {
	const session: SessionHandle = Xanovi.pronote.createSessionHandle();
	await Xanovi.pronote.loginCredentials(session, {
		url: PRONOTE_URL,
		kind: Xanovi.pronote.AccountKind.STUDENT,
		username: USERNAME,
		password: PASSWORD,
		deviceUUID: "my-device-uuid",
	});

	const tab = session.userResource.tabs.get(Xanovi.pronote.TabLocation.Evaluations);
	if (!tab) throw new Error("Cannot retrieve periods for the grades tab, you maybe don't have access to it.");
	const selectedPeriod = tab.defaultPeriod!;

	const homepage = await Xanovi.pronote.homepage(session, new Date());
	console.log(homepage);

	const evaluations = await Xanovi.pronote.evaluations(session, selectedPeriod);
    console.log(evaluations);

	// const instance = await Xanovi.pronote.getInstance(session);
	// console.log(instance);

    // const results = await Xanovi.pronote.result(session, instance[0]);
    // console.log(results);
}

main();
