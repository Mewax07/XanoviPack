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

	const tab = session.userResource.tabs.get(Xanovi.pronote.TabLocation.Grades);
	if (!tab) throw new Error("Cannot retrieve periods for the grades tab, you maybe don't have access to it.");
	const selectedPeriod = tab.defaultPeriod!;

	const notes = await Xanovi.pronote.gradesOverview(session, selectedPeriod);
	console.log(notes);

	/* Permet de récupérer les élève enregistrer dans la list des UserResources
	 * NOTE: Pour les parents sa permet de voir les différents enfants et donc pouvoir mieux controller les requetes
	 * Pour les accountKind STUDENT sa fonctionne aussi sa retourne l'instance de l'élève
	 * Pout les accountKind TEACHER sa fonctionne également, sa retourne l'instance du prof
	 */
	const instance = await Xanovi.pronote.getInstance(session);
	console.log(instance);

	const releverDeNotes = await Xanovi.pronote.gradesRaising(session, selectedPeriod, instance[0].id);
	console.log(releverDeNotes);
}

main();
