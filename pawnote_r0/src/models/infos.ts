import type { AccountKind } from "./account";

export type RefreshInformation = Readonly<{
	url: string;
	token: string;
	username: string;
	kind: AccountKind;
	navigatorIdentifier: string;
}>;
