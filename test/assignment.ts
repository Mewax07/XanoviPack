import { SessionHandle } from "../pawnote_r0/src";
import Xanovi from "../src";

import util from "util";

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

	const assignments = await Xanovi.pronote.assignmentsFromWeek(session, 1, 4);

	const musiqueAssignments = assignments.filter((a) => a.subject.name.toUpperCase() === "MUSIQUE");

	for (const assignment of musiqueAssignments) {
		if (!assignment.done) {
			await Xanovi.pronote.assignmentStatus(session, assignment.id, true);
			console.log("(done) => successfully marked as done.");
		} else {
			console.log("(done) => already marked as done.");
		}
	}

	for (const assignment of assignments) {
		console.log("──────────────────────────────");
		console.log(`📌 Matière      : ${assignment.subject.name}`);
		console.log(`📝 Consigne     : ${assignment.description.replace(/<[^>]+>/g, "")}`);
		console.log(`🎨 Couleur      : ${assignment.backgroundColor}`);
		console.log(`✅ Fait ?       : ${assignment.done ? "✔️ Oui" : "❌ Non"}`);
		console.log(`📅 Donné le     : ${assignment.givenOn.toLocaleDateString("fr-FR")}`);
		console.log(`⏰ Pour le      : ${assignment.deadline.toLocaleDateString("fr-FR")}`);
		console.log(`📎 Pièces jointes: ${assignment.attachments.length}`);
		console.log(`📊 Difficulté   : ${assignment.difficulty}`);
		console.log(`⏱️ Durée estimée: ${assignment.length} min`);

		if (assignment.themes.length > 0) {
			console.log("📚 Thèmes       : " + assignment.themes.map((t: any) => t.name).join(", "));
		}

		if (assignment.qcmInfo !== undefined) {
			console.log(`❓ QCM:         : ${util.inspect(assignment.qcmInfo)}`);
		}

		console.log(
			`📤 Rendu        : ${assignment.return.canUpload ? "Autorisé" : "Non"} (type ${assignment.return.kind})`,
		);

		if (assignment.resourceID) {
			const resource = await Xanovi.pronote.resource(session, assignment.resourceID);
			console.log("(info) =>", resource);
		}
	}
}

main();
