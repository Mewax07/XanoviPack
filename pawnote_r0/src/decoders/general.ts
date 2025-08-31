import { BaseInfo } from "~p0/models/general";

export const decodeGeneral_r0 = (data: any): BaseInfo => {
	return {
		id: data.N,
		kind: data.G,
		name: data.L,
	};
};
