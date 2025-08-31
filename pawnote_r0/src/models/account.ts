import { BaseInfo } from "./general";

export const AccountKind = {
	STUDENT: 6,
	PARENT: 7,
	TEACHER: 8,
} as const;

export type AccountKind = (typeof AccountKind)[keyof typeof AccountKind];

export type Account = Readonly<{
	address: string[];
	postalCode: string;
	province: string;
	city: string;
	email: string;
	phone: string;
}>;

export type StudentAccount = Readonly<{
	INE: string;
	iCalToken?: string;
	country: string;
}> &
	Account;

export type Kid = Readonly<{
	withStudentInfos: boolean;
	withTeacherInfos: boolean;
	withGradebook: boolean;
	iCalToken?: string;
}> &
	BaseInfo;

export type ParentAccount = Readonly<{
	name: string;
	lastName: string;
	courtesy: string;
	country: string;
	kids: Kid[];
}> &
	Account;

export type TeacherAccount = Readonly<{
	name: string;
	lastName: string;
	courtesy: string;
	iCalToken?: string;
}> &
	Account;
