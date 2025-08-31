export type QCMThemes = Readonly<{
	id: string;
	name: string;
}>;

export type QCMInfos = Readonly<{
	id: string;
	kind: number;
	name: string;
	nbQuestTotal: number;
	nbPointsTotal: number;
	nbQuestRequired: number;
	fileAvaible: boolean;
	isInProgress: boolean;
	themes: QCMThemes;
	startDate: Date;
	endDate: Date;
	isLinkedToHomework: boolean;
	isLinkedToEvaluation: boolean;
	isFinished: boolean;
	isActivity: boolean;
	isStarted: boolean;
	isDeletable: boolean;
	nbQuestReply: number;
	nbQuestRight: number;
	maxQcmTime: number;
	nbMaxAttempts: number;
	modeDistributionCorrection: number;
	publicName: string;
}>;

export type QCMValue = Readonly<{
	points: number;
}>;

export type QCM = Readonly<{
	name: string;
	id: string;
	qcmID: string;
	nbQuestTotal: number;
	nbPointsTotal: number;
	nbQuestRequired: number;
	fileAvaible: boolean;
	isInProgress: boolean;
	startDate: Date;
	endDate: Date;
	isLinkWithGrade: boolean;
	isLinkWithEvaluation: boolean;
	isFinished: boolean;
	isActivity: boolean;
	isStarted: boolean;
	isDeletable: boolean;
	nbQuestReply: number;
	nbQuestRight: number;
	qcmNote: QCMValue;
	maxQcmTime: number;
	nbMaxAttempts: number;
	modeDistributionCorrection: number;
	correctionDate: Date;
	service: string;
	coefficient: number;
	publicName: string;
}>;
