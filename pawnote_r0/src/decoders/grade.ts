import { gradebookPDF } from "~p0/api";
import { AttachmentKind, PageUnavailableError, Period, SessionHandle, UnreachableError } from "~p0/models";
import {
	Grade,
	GradeBook,
	GradeBookSubject,
	GradeKind,
	GradesOverview,
	GradeValue,
	ReportCard,
	SubjectAverages,
	SubjectReport,
} from "~p0/models/grade";
import { decodeAttachment } from "./attachment";
import { decodeQCM } from "./qcm";
import { decodeSubject } from "./subject";
import { decodePronoteDate } from "./time";

export const decodeGradesOverview = (overview: any, session: SessionHandle): GradesOverview => {
	return {
		grades: overview.listeDevoirs.V.map((grade: any) => decodeGrade(grade, session)),
		subjectsAverages: overview.listeServices.V.map(decodeSubjectAverages),
		classAverage: overview.moyGeneraleClasse && decodeGradeValue(overview.moyGeneraleClasse.V),
		overallAverage: overview.moyGenerale && decodeGradeValue(overview.moyGenerale.V),
	};
};

export const decodeSubjectAverages = (average: any): SubjectAverages => {
	return {
		student: average.moyEleve && decodeGradeValue(average.moyEleve.V),
		outOf: average.baremeMoyEleve && decodeGradeValue(average.baremeMoyEleve.V),
		defaultOutOf: average.baremeMoyEleveParDefaut && decodeGradeValue(average.baremeMoyEleveParDefaut.V),
		class_average: average.moyClasse && decodeGradeValue(average.moyClasse.V),
		min: average.moyMin && decodeGradeValue(average.moyMin.V),
		max: average.moyMax && decodeGradeValue(average.moyMax.V),
		subject: decodeSubject(average),
		backgroundColor: average.couleur,
	};
};

export const decodeGradeValue = (grade: string | number): GradeValue => {
	let kind: GradeKind = GradeKind.Grade;
	let value: number;

	// see `constructor()` (typenote.js)
	if (typeof grade === "string") {
		// see `getGenreNote(aChaine)` (typenote.js)
		if (grade.split("|").length >= 2) {
			kind = parseInt(grade.split("|")[1]) as GradeKind;
		}

		// see `noteToValeur(aStrNote)` (typenote.js)
		value = parseFloat(grade.replace(",", "."));

		if (kind === GradeKind.AbsentZero || kind === GradeKind.UnreturnedZero) {
			value = 0.0;
		}
		// NOTE: there's apparently an `else if` condition here that's missing
		// that mentions the "Congratulations" grade kind.
		// not sure how this affects the code for now but it's worth noting.
	} else if (typeof grade === "number") {
		value = grade;
	} else throw new UnreachableError("decodeGradeValue");

	return {
		kind,
		points: value,
	};
};

export const decodeGrade = (grade: any, session: SessionHandle): Grade => {
	const id = grade.N;
	const isBonus = grade.estBonus;

	const attachment = (key: string, genre: string) =>
		grade[key] &&
		decodeAttachment(
			{
				G: AttachmentKind.File,
				L: grade[key],
				N: id,
			},
			session,
			{ G: genre },
		);

	const qcm = (qcm: any) =>
		decodeQCM({
			N: id,
			O: qcm,
		});

	return {
		id,
		value: decodeGradeValue(grade.note.V),
		outOf: decodeGradeValue(grade.bareme.V),
		defaultOutOf: decodeGradeValue(grade.baremeParDefaut.V),
		date: decodePronoteDate(grade.date.V),
		subject: decodeSubject(grade.service.V),
		average: grade.moyenne && decodeGradeValue(grade.moyenne.V),
		max: grade.noteMax && decodeGradeValue(grade.noteMax.V),
		min: grade.noteMin && decodeGradeValue(grade.noteMin.V),
		coefficient: grade.coefficient,
		comment: grade.commentaire,
		commentaireSurNote: grade.commentaireSurNote,
		isBonus,
		isOptional: grade.estFacultatif && !isBonus,
		isOutOf20: grade.estRamenerSur20,
		subjectFile: attachment("libelleSujet", "DevoirSujet"),
		correctionFile: attachment("libelleCorrige", "DevoirCorrige"),
		qcmCorrectionFile: grade.executionQCM && qcm(grade.executionQCM),
	};
};

export function decodeGradesRaising(data: any): ReportCard {
	const subjects: SubjectReport[] = data.ListeServices.V.map((srv: any) => ({
		id: srv.N,
		name: srv.L,
		color: srv.couleur,
		parentSubject: srv.SurMatiere?.V?.N !== "0" ? srv.SurMatiere.V.N : undefined,
		teachers: (srv.ListeProfesseurs?.V ?? []).map((t: any) => ({
			id: t.N,
			name: t.L,
		})),
		grades: (srv.ListeDevoirs?.V ?? []).map((dv: any) => ({
			id: dv.N ?? null,
			value: {
				kind: GradeKind.Grade,
				points: parseFloat(dv.Note.V),
			},
			outOf: {
				kind: GradeKind.Grade,
				points: parseFloat(dv.Bareme.V),
			},
			defaultOutOf: {
				kind: GradeKind.Grade,
				points: parseFloat(dv.BaremeParDefaut.V),
			},
			coefficient: 1, // pas toujours donné → fallback à 1
			comment: dv.Commentaire,
			hint: dv.Hint,
			backgroundColor: dv.couleur,
			isOptional: dv.estFacultatif,
		})),
	}));

	return {
		editable: data.Editable,
		maxGrades: data.NbrMaxDevoirs,
		subjects,
		classInfo: {
			id: data.Classe.V.N,
			label: data.Classe.V.L,
		},
		absences: {
			absences: data.ListeAbsences.V.strAbsences,
			delays: data.ListeAbsences.V.strRetards,
			punishments: data.ListeAbsences.V.strPunitions,
			sanctions: data.ListeAbsences.V.strSanctions,
		},
		engagements: (data.listeEngagements?.V ?? []).map((e: any) => ({
			id: e.N,
			label: e.L,
		})),
	};
}

export const decodeGradeBook = async (
	session: SessionHandle,
	period: Period,
	gradeBookData: any,
): Promise<GradeBook> => {
	// When bad period is used, the return is `{ data: {}, nom: 'PageBulletins' }` but the session don't expire.
	if (Object.keys(gradeBookData).length == 0 || gradeBookData.message) throw new PageUnavailableError();

	let overallAssessments: { name: string; value: string }[] =
		gradeBookData.ObjetListeAppreciations.V.ListeAppreciations.V.map((assessment: any) => {
			return { name: assessment.Intitule, value: assessment.L };
		});
	const subjects = (gradeBookData.ListeServices.V as Array<any>).map((subjectData) => {
		return {
			subject: decodeSubject(subjectData.Matiere?.V),
			subjectGroup: subjectData.SurMatiere.V,
			coef: parseInt(subjectData.Coefficient.V),

			averages: {
				student: parseFloat(subjectData.MoyenneEleve.V.replace(",", ".")),
				classOverall: parseFloat(subjectData.MoyenneClasse.V.replace(",", ".")),
				max: parseFloat(subjectData.MoyenneSup.V.replace(",", ".")),
				min: parseFloat(subjectData.MoyenneInf.V.replace(",", ".")),
			},

			assessments: (subjectData.ListeAppreciations.V as Array<any>).map((a) => a.L),
			teachers:
				subjectData.ListeElements?.V.map((elem: any) => elem.ListeProfesseurs?.V.map((v: any) => v.L)) ??
				subjectData.ListeProfesseurs?.V.map((a: any) => a.L) ??
				[],
		} as GradeBookSubject;
	});

	return {
		overallAssessments,
		graph: gradeBookData?.graphe?.replace("\\n", ""),
		subjects,
		url: await gradebookPDF(session, period),
	};
};
