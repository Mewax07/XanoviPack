import type { AccountKind } from "./account";

export interface BaseAuthenticationParams {
	url: string;
	kind: AccountKind;
	username: string;
	deviceUUID: string;
	navigatorIdentifier?: string;
}

export interface PasswordAuthenticationParams extends BaseAuthenticationParams {
	password: string;
	token?: never;
}

export interface TokenAuthenticationParams extends BaseAuthenticationParams {
	token: string;
	password?: never;
}

export type AuthenticationParams = PasswordAuthenticationParams | TokenAuthenticationParams;

export type AuthenticationQR = Readonly<{
	url: string;
	token: string;
	username: string;
	kind: AccountKind;
}>;
