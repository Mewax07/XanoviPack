import type { Fetcher } from "~f0/index";
import { Queue } from "~p0/api/private/queue";
import { AccountKind } from "./account";
import { BaseInfo } from "./general";
import { Holiday, Period, WeekFrequency } from "./time";
import { UserAuthorizations, UserResource } from "./user";

export const SessionAccessKind = {
	ACCOUNT: 0,
	ACCOUNT_CONNECTION: 1,
	DIRECT_CONNECTION: 2,
	TOKEN_ACCOUNT_CONNECTION: 3,
	TOKEN_DIRECT_CONNECTION: 4,
	COOKIE_CONNECTION: 5,
} as const;

export type SessionAccessKind = (typeof SessionAccessKind)[keyof typeof SessionAccessKind];

export interface SessionInformation {
	readonly id: number;
	readonly accountKind: AccountKind;
	readonly demo: boolean;
	readonly url: string;
	readonly accessKind: SessionAccessKind;
	readonly rsaModulus: string;
	readonly rsaExponent: string;
	readonly rsaFromConstants: boolean;
	aesKey: string;
	aesIV: string;
	readonly skipEncryption: boolean;
	readonly skipCompression: boolean;
	readonly http: boolean;
	readonly poll: boolean;
	order: number;
	lastConnection: Date;
}

export type InstanceParameters = Readonly<{
	nextBusinessDay: Date;
	firstMonday: Date;
	firstDate: Date;
	lastDate: Date;
	navigatorIdentifier: string;
	version: number[];
	endings: string[];
	periods: Period[];
	holidays: Holiday[];
	weekFrequencies: Map<number, WeekFrequency>;
	blocksPerDay: number;
}>;

export type UserParameters = Readonly<{
	authorizations: UserAuthorizations;
	resources: Array<UserResource>;
}> &
	BaseInfo;

export type SessionHandle = {
	information: SessionInformation;
	instance: InstanceParameters;
	user: UserParameters;
	userResource: UserResource;
	readonly queue: Queue;
	readonly fetcher: Fetcher;
	presence: null | ReturnType<typeof setInterval>;
};
