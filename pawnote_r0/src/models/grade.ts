import { Attachment } from "./attachment";
import { Subject } from "./class";
import { QCM } from "./qcm";

export const GradeKind = {
	Error: -1,
	Grade: 0,
	Absent: 1,
	Exempted: 2,
	NotGraded: 3,
	Unfit: 4,
	Unreturned: 5,
	AbsentZero: 6,
	UnreturnedZero: 7,
	Congratulations: 8,
} as const;

export type GradeKind = (typeof GradeKind)[keyof typeof GradeKind];

export type GradeValue = Readonly<{
	kind: GradeKind;
	points: number;
}>;

export type SubjectAverages = Readonly<{
	student?: GradeValue;
	class_average?: GradeValue;
	max?: GradeValue;
	min?: GradeValue;
	outOf?: GradeValue;
	defaultOutOf?: GradeValue;
	subject: Subject;
	backgroundColor: string;
}>;

export type Grade = Readonly<{
	/** the id of the grade (used internally) */
	id: string;
	/** the actual grade */
	value: GradeValue;
	/** the maximum amount of points */
	outOf: GradeValue;
	/** the default maximum amount of points */
	defaultOutOf?: GradeValue;
	/** the date on which the grade was given */
	date: Date;
	/** the subject in which the grade was given */
	subject: Subject;
	/** the average of the class */
	average?: GradeValue;
	/** the highest grade */
	max?: GradeValue;
	/** the lowest grade */
	min?: GradeValue;
	/** the coefficient of the grade */
	coefficient: number;
	/** comment on the grade description */
	comment: string;
	/** note on the grade */
	commentaireSurNote?: string;
	/** is the grade bonus : only points above 10 count */
	isBonus: boolean;
	/** is the grade optional : the grade only counts if it increases the average */
	isOptional: boolean;
	/** is the grade out of 20. Example 8/10 -> 16/20 */
	isOutOf20: boolean;
	/** the file of the subject */
	subjectFile?: Attachment;
	/** the file of the correction */
	correctionFile?: Attachment;
	/** the correction of a QCM */
	qcmCorrectionFile?: QCM;
}>;

export type GradesOverview = Readonly<{
	subjectsAverages: SubjectAverages[];
	overallAverage?: GradeValue;
	classAverage?: GradeValue;
	grades: Grade[];
}>;

/** Relever de note */
export type Teacher = Readonly<{
	id: string;
	name: string;
}>;

export type RawGrade = Readonly<{
	/** unique identifier (intern Pronote N) */
	id: string;
	/** grade value */
	value: GradeValue;
	/** maximum grade value (bareme) */
	outOf: GradeValue;
	/** default maximum grade value */
	defaultOutOf?: GradeValue;
	/** coefficient (weight) */
	coefficient: number;
	/** comment/description */
	comment: string;
	/** HTML hint given by Pronote (date + extra info) */
	hint: string;
	/** background color */
	backgroundColor?: string;
	/** is the grade optional (facultatif) */
	isOptional: boolean;
}>;

export type SubjectReport = Readonly<{
	id: string;
	name: string;
	color: string;
	parentSubject?: string;
	teachers: Teacher[];
	grades: RawGrade[];
}>;

export type ClassInfo = Readonly<{
	id: string;
	label: string;
}>;

export type AbsenceInfo = Readonly<{
	absences: string;
	delays: string;
	punishments?: string;
	sanctions?: string;
}>;

export type Engagement = Readonly<{
	id: string;
	label: string;
}>;

export type ReportCard = Readonly<{
	editable: boolean;
	maxGrades: number;
	subjects: SubjectReport[];
	classInfo: ClassInfo;
	absences: AbsenceInfo;
	engagements: Engagement[];
}>;

export type GradeBook = Readonly<{
	message?: string;
	/**
	 * The differents assessments like the mentions or the overall rating
	 */
	overallAssessments: {
		name: string;
		value: string;
	}[];
	/**
	 * graph image as base64 png (with white backgound)
	 */
	graph?: string;
	subjects: GradeBookSubject[];
	url: string;
}>;

export type GradeBookSubject = {
	subject: Subject;
	subjectGroup: string;
	coef: number;
	averages: {
		student: number;
		classOverall: number;
		max: number;
		min: number;
	};
	assessments: string[];
	teachers: string[];
};
