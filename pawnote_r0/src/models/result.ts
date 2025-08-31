export type AcquisitionLevel = {
	label: string;
	code: string;
	grade: number;
};

export type Pillar = {
	label: string;
	code: string;
	level: AcquisitionLevel;
	points: number;
	maxPoints: number;
	isForeignLanguage: boolean;
};

export type BrevetReport = {
	cycle: string;
	pillars: Pillar[];
	totalPoints: number;
	totalMaxPoints: number;
	complements: {
		additionalTeaching: number;
		extraPoints: number;
	};
	evaluation: {
		principalOpinion: string;
		annualAppreciation: string | null;
	};
};
