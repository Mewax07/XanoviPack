import { UserResource } from "~p0/models";

export const encodeUserResource = (resource: UserResource): any => ({
	G: resource.kind,
	L: resource.name,
	N: resource.id,
});
