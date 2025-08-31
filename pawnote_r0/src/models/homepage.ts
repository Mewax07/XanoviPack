export type PartnerARD = Partner &
	Readonly<{
		canRefreshData: boolean;
		wallets: PartnerARDWallet[];
	}>;

export type PartnerARDWallet = Readonly<{
	name: string;
	description: string;
	warning: boolean;
	balance: number;
	balanceDescription: string;
}>;

export type HomepageLink = Readonly<{
	url: string;
	name: string;
	description: string;
}>;

export type Partner = Readonly<{
	/**
	 * Object to send to PRONOTE to login using SSO.
	 */
	sso: any;
}>;

export type Homepage = Readonly<{
	partnerARD?: PartnerARD;
	// NOTE: Not sure if we can have more data about Turboself than just SSO.
	partnerTurboself?: Partner;

	links: Array<HomepageLink>;
}>;
