import { ForumAction, SessionHandle, toMarkdown } from "../pawnote_r0/src";
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

	const forum = await Xanovi.pronote.educationalForum(session);
	const topic = await Xanovi.pronote.forumTopic(session, forum[0].id);
	console.log(topic);

	const newForumMessage = await Xanovi.pronote.sendForumMessage(session, forum[0].id, "contenue du message en texte");
	console.log(newForumMessage);

	const action = await Xanovi.pronote.actionForum(session, forum[0].id, topic.posts[0].id, ForumAction.DELETE);
	console.log(action);
}

main();
