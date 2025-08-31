import { Class } from "./class";
import { Period } from "./time";

export interface Certificate {
	name: string;
	isAnCFG: boolean;
}

export interface DocumentList {
	name: string;
	period: Period;
	class: Class;
}

export interface CategroyList {
	name: string;
	id: string;
	color: string;
}

export type Document = Readonly<{
	certificate: Certificate;
	periodicReportsList: DocumentList[];
	bulletinsList: DocumentList[];
	categoryList: CategroyList[];
}>;
