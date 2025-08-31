import { BaseInfo } from "~p0/models/general";

export const encodeGeneral_r0 = (data: BaseInfo): any => {
	return {
		N: data.id,
		G: data.kind,
		L: data.name,
	};
};
