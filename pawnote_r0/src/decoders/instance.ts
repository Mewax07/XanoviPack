import { InstanceParameters, WeekFrequency } from "~p0/models";
import { decodeDomain } from "./domain";
import { decodeHoliday, decodePeriod, decodePronoteDate } from "./time";

export const decodeInstanceParameters = (parameters: any): InstanceParameters => {
	const weekFrequencies = new Map<number, WeekFrequency>();

	for (const fortnight of [1, 2]) {
		const frequency = decodeDomain(parameters.General.DomainesFrequences[fortnight].V);
		for (const week of frequency) {
			weekFrequencies.set(week, {
				label: parameters.General.LibellesFrequences[fortnight],
				fortnight,
			});
		}
	}

	return {
		version: parameters.General.versionPN.split(".").map(Number),
		nextBusinessDay: decodePronoteDate(parameters.General.JourOuvre.V),
		firstMonday: decodePronoteDate(parameters.General.PremierLundi.V),
		firstDate: decodePronoteDate(parameters.General.PremiereDate.V),
		lastDate: decodePronoteDate(parameters.General.DerniereDate.V),

		navigatorIdentifier: parameters.identifiantNav,
		endings: parameters.General.ListeHeuresFin.V.map((ending: any) => ending.L),
		periods: parameters.General.ListePeriodes.map(decodePeriod),
		holidays: parameters.General.listeJoursFeries.V.map(decodeHoliday),
		weekFrequencies,
		blocksPerDay: parameters.General.PlacesParJour,
	};
};
