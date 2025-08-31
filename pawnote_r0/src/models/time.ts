import { BaseInfo } from "./general";

export type Period = Readonly<{
	startDate: Date;
	endDate: Date;
}> &
	BaseInfo;

export type Holiday = Readonly<{
	id: string;
	name: string;
	startDate: Date;
	endDate: Date;
}>;

export type WeekFrequency = Readonly<{
	label: string;
	fortnight: number;
}>;
