export type Class = Readonly<{
	id: string;
	name: string;
}>;

export type Subject = Readonly<{
	id: string;
	name: string;
	inGroups: boolean;
}>;

export type Teacher = Readonly<{
	id: string;
	name: string;
}>;
