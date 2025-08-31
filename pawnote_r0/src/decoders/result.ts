import { BrevetReport, Pillar } from "~p0/models/result";

export const decodeBrevetReport = (data: any): BrevetReport => {
	return {
		cycle: data.competences.palier.V.L,
		pillars: data.competences.listePiliers.V.map(
			(p: any): Pillar => ({
				label: p.L,
				code: p.N,
				level: {
					label: p.niveauDAcquisition.V.L,
					code: p.niveauDAcquisition.V.N,
					grade: p.niveauDAcquisition.V.G,
				},
				points: parseInt(p.points.V, 10),
				maxPoints: parseInt(p.bareme.V, 10),
				isForeignLanguage: p.estPilierLVE,
			}),
		),
		totalPoints: parseInt(data.competences.totalPoints.V, 10),
		totalMaxPoints: parseInt(data.competences.totalBareme.V, 10),
		complements: {
			additionalTeaching: data.Complements.enseignementComplement.V.G,
			extraPoints: data.Complements.nombreDePoints.V.G,
		},
		evaluation: {
			principalOpinion: data.appGenerale.avisChefDEtablissement.V.L,
			annualAppreciation: data.appGenerale.appreciationAnnuelle.V.N ?? null,
		},
	};
};
