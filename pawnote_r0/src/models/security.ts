export const DoubleAuthMode = {
	MGDA_PasEncoreChoisi: 0,
	MGDA_Inactive: 1,
	MGDA_NotificationSeulement: 2,
	MGDA_SaisieCodePIN: 3,
} as const;

export type DoubleAuthMode = (typeof DoubleAuthMode)[keyof typeof DoubleAuthMode];

export type PasswordRules = Readonly<{
	maxLength: number;
	minLength: number;

	rules: number[]; // TODO: type the numbers to an enum
}>;

export const DoubleAuthClientAction = {
	AIHMSC_PersonnalisationMotDePasse: 0,
	AIHMSC_ChoixStrategie: 1,
	AIHMSC_ChoixCodePINetSource: 2,
	AIHMSC_SaisieCodePINetSource: 3,
	AIHMSC_ReinitCodePINetSource: 4,
	AIHMSC_SaisieSourcePourNotifSeulement: 5,
} as const;

export type DoubleAuthClientAction = (typeof DoubleAuthClientAction)[keyof typeof DoubleAuthClientAction];

export type SecurityModal = Readonly<{
	availableSecurityModes: DoubleAuthMode[];
	defaultSecurityMode: DoubleAuthMode;
	passwordRules: PasswordRules;

	shouldCustomPassword: boolean;
	shouldCustomDoubleAuth: boolean;

	shouldEnterPIN: boolean;
	shouldEnterSource: boolean;

	/**
	 * Should be internal use only.
	 */
	context: {
		authentication: any;
		identity: any;
		initialUsername?: string;
	};
}>;
