import { Period } from "~p0/models";
import { encodeGeneral_r0 } from "./general";

export const encodePeriod = (period: Period) => {
	return encodeGeneral_r0(period);
};

export const encodePronoteDate = (date: Date): string => {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
