import { SessionHandle, UnreachableError } from "~p0/models";
import { Account, AccountKind, Kid, ParentAccount, StudentAccount, TeacherAccount } from "~p0/models/account";

export const decodeAccountKindFromPath = (path: string): AccountKind => {
	const segments = path.split(".");
	segments.pop();

	switch (segments.pop()) {
		case "eleve":
			return AccountKind.STUDENT;
		case "parent":
			return AccountKind.PARENT;
		case "professeur":
			return AccountKind.TEACHER;
		default:
			throw new UnreachableError("decodeAccountKindFromPath");
	}
};

export const decodeAccount = (
	account: any,
	session: SessionHandle,
): StudentAccount | ParentAccount | TeacherAccount => {
	const information = account.Informations;

	const base: Account = {
		address: [information.adresse1, information.adresse2, information.adresse3, information.adresse4],
		postalCode: information.codePostal,
		province: information.province,
		city: information.ville,
		email: information.eMail,
		phone: `+${information.indicatifTel} ${information.telephonePortable}`,
	};

	switch (session.information.accountKind) {
		case AccountKind.STUDENT: {
			let iCalToken: string | undefined;
			if (session.instance.version[0] >= 2024) {
				iCalToken = account.iCal?.liste.V[0]?.paramICal;
			}
			return {
				...base,
				INE: information.numeroINE,
				iCalToken,
				country: information.pays,
			};
		}

		case AccountKind.PARENT: {
			let iCalTokenList: any[] | undefined;
			if (session.instance.version[0] >= 2024) {
				iCalTokenList = account.iCal?.liste.V;
			}

			const kids: Kid[] =
				account.Autorisations.listeEleves?.V?.map((k: any) => ({
					id: k.N,
					name: k.L,
					kind: k.P,
					withStudentInfos: Boolean(k.estDestinataireInfosEleve),
					withTeacherInfos: Boolean(k.estDestinataireInfosProfesseur),
					withGradebook: Boolean(k.estDestinataireBulletin),
					iCalToken: iCalTokenList?.filter((r) => r.N === k.N)[0]?.paramICal,
				})) ?? [];

			return {
				...base,
				name: information.nom,
				lastName: information.prenoms,
				courtesy: information.civilite,
				country: information.pays,
				kids,
			};
		}

		case AccountKind.TEACHER: {
			let iCalToken: string | undefined;
			if (session.instance.version[0] >= 2024) {
				iCalToken = account.iCal?.liste.V[0]?.paramICal;
			}
			return {
				...base,
				name: information.nom,
				lastName: information.prenoms,
				courtesy: information.civilite,
				iCalToken,
			};
		}

		default:
			throw new Error(`Unsupported account kind: ${session.information.accountKind}`);
	}
};
