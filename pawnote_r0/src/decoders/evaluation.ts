import { Evaluation, Skill } from "~p0/models/evaluation";
import { decodeSubject } from "./subject";
import { decodePronoteDate } from "./time";

export const decodeSkill = (skill: any): Skill => {
	return {
		id: skill.N,

		level: skill.L,
		abbreviation: skill.abbreviation,

		coefficient: skill.coefficient,

		domainID: skill.domaine.V.N,
		domainName: skill.domaine.V.L,

		itemID: skill.item?.V.N,
		itemName: skill.item?.V.L,

		order: skill.ordre,

		pillarID: skill.pilier.V.N,
		pillarName: skill.pilier.V.L,
		pillarPrefixes: skill.pilier.V.strPrefixes.split(",").map((prefix: any) => prefix.trim()),
	};
};

export const decodeEvaluation = (evaluation: any): Evaluation => {
	const skills: Skill[] = evaluation.listeNiveauxDAcquisitions.V.map(decodeSkill);
	skills.sort((skillA, skillB) => skillA.order - skillB.order);

	return {
		skills,
		name: evaluation.L,
		id: evaluation.N,
		teacher: evaluation.individu.V.L,
		coefficient: evaluation.coefficient,
		description: evaluation.descriptif,
		subject: decodeSubject(evaluation.matiere.V),
		levels: evaluation.listePaliers.V.map((level: any) => level.L),
		date: decodePronoteDate(evaluation.date.V),
	};
};
