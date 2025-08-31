import { UnreachableError } from "~p0/models";
import { QCM, QCMInfos, QCMThemes, QCMValue } from "~p0/models/qcm";
import { decodePronoteDate } from "./time";

export const decodeQCMTheme = (theme: any): QCMThemes => ({
	id: theme.N,
	name: theme.L,
});

export const decodeAssignmentQCM = (qcm: any): QCMInfos => {
	const qcmInfo = qcm.V;
	const qcmValue = qcmInfo.QCM.V;

	return {
		id: qcmValue.N,
		name: qcmValue.L,
		kind: qcmValue.G,
		nbQuestTotal: qcmValue.nbQuestionsTotal,
		nbPointsTotal: qcmValue.nombreDePointsTotal,
		nbQuestRequired: qcmValue.nombreQuestObligatoires,
		fileAvaible: qcmInfo.fichierDispo,
		isInProgress: qcmInfo.estEnPublication,
		themes: qcmInfo.ListeThemes.V.map(decodeQCMTheme),
		startDate: decodePronoteDate(qcmInfo.dateDebutPublication.V),
		endDate: decodePronoteDate(qcmInfo.dateFinPublication.V),
		isLinkedToHomework: qcmInfo.estLieADevoir,
		isLinkedToEvaluation: qcmInfo.estLieAEvaluation,
		isFinished: qcmInfo.estFini,
		isActivity: qcmInfo.estUneActivite,
		isStarted: qcmInfo.estDemarre,
		isDeletable: qcmInfo.estSupprimable,
		nbQuestReply: qcmInfo.nbQuestRepondues,
		nbQuestRight: qcmInfo.nbQuestBonnes,
		maxQcmTime: qcmInfo.dureeMaxQCM,
		nbMaxAttempts: qcmInfo.nbMaxTentative,
		modeDistributionCorrection: qcmInfo.modeDiffusionCorrige,
		publicName: qcmInfo.nomPublic,
	};
};

export const decodeQCM = (qcm: any): QCM => {
	const name = qcm.O.V.QCM.V.L;
	const id = qcm.N;
	const qcmInfo = qcm.O.V;
	const qcmValue = qcmInfo.QCM.V;

	return {
		name,
		id,
		qcmID: qcmInfo.N,
		nbQuestTotal: qcmValue.nbQuestionsTotal,
		nbPointsTotal: qcmValue.nombreDePointsTotal,
		nbQuestRequired: qcmValue.nombreQuestObligatoires,
		fileAvaible: qcmInfo.fichierDispo,
		isInProgress: qcmInfo.estEnPublication,
		startDate: decodePronoteDate(qcmInfo.dateDebutPublication.V),
		endDate: decodePronoteDate(qcmInfo.dateFinPublication.V),
		isLinkWithGrade: qcmInfo.estLieADevoir,
		isLinkWithEvaluation: qcmInfo.estLieAEvaluation,
		isFinished: qcmInfo.estFini,
		isActivity: qcmInfo.estUneActivite,
		isStarted: qcmInfo.estDemarre,
		isDeletable: qcmInfo.estSupprimable,
		nbQuestReply: qcmInfo.nbQuestRepondues,
		nbQuestRight: qcmInfo.nbQuestBonnes,
		qcmNote: decodeQCMValue(qcmInfo.noteQCM.V),
		maxQcmTime: qcmInfo.dureeMaxQCM,
		nbMaxAttempts: qcmInfo.nbMaxTentative,
		modeDistributionCorrection: qcmInfo.modeDiffusionCorrige,
		correctionDate: decodePronoteDate(qcmInfo.dateCorrige.V),
		service: qcmInfo.service.V,
		coefficient: qcmInfo.coefficientDevoir.V,
		publicName: qcmInfo.nomPublic,
	};
};

export const decodeQCMValue = (grade: string | number): QCMValue => {
	let value: number;

	// see `constructor()` (typenote.js)
	if (typeof grade === "string") {
		// see `noteToValeur(aStrNote)` (typenote.js)
		value = parseFloat(grade.replace(",", "."));

		// NOTE: there's apparently an `else if` condition here that's missing
		// that mentions the "Congratulations" grade kind.
		// not sure how this affects the code for now but it's worth noting.
	} else if (typeof grade === "number") {
		value = grade;
	} else throw new UnreachableError("decodeGradeValue");

	return {
		points: value,
	};
};
