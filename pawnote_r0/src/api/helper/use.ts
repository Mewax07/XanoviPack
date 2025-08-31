import { SessionHandle, UserResource } from "~p0/models";

function use(session: SessionHandle, index: number): void;
function use(session: SessionHandle, resource: UserResource): void;
function use(session: SessionHandle, value: any): void {
	session.userResource = typeof value === "number" ? session.user.resources[value] : value;
}

export { use };
