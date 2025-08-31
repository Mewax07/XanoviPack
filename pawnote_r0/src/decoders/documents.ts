import { CategroyList, Document, DocumentList } from "~p0/models/document";
import { decodeGeneral_r0 } from "./general";

export const decodeDocuments = (documents: any): Document => {
	return {
		certificate: {
			name: documents.diplome.V.L,
			isAnCFG: documents.diplome.V.estUnCFG,
		},
		periodicReportsList: documents.listeBilansPeriodiques.V.map((r: any) => {
			return {
				name: r.L,
				period: decodeGeneral_r0(r.periode.V),
				class: {
					id: r.classe.V.N,
					name: r.classe.V.L,
				},
			} as DocumentList;
		}),
		bulletinsList: documents.listeBulletins.V.map((r: any) => {
			return {
				name: r.L,
				period: decodeGeneral_r0(r.periode.V),
				class: {
					id: r.classe.V.N,
					name: r.classe.V.L,
				},
			} as DocumentList;
		}),
		categoryList: documents.listeCategories.V.map((r: any) => {
			return {
				id: r.N,
				name: r.L,
				color: r.couleur,
			} as CategroyList;
		}),
	};
};
