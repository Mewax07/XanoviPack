import { RequestFN } from "~p0/core";
import { SessionHandle, TabLocation } from "~p0/models";
import { apiProperties } from "./api-properties";
import { getUTCDate } from "./date";
import { translateToWeekNumber } from "./week-number";

export const homeworkFromWeek = async (
	session: SessionHandle,
	tab: TabLocation,
	weekNumber: number,
	extendsToWeekNumber?: number,
): Promise<any> => {
	const properties = apiProperties(session);

	const request = new RequestFN(session, "PageCahierDeTexte", {
		[properties.signature]: { onglet: tab },
		[properties.data]: {
			domaine: {
				_T: 8,
				V:
					typeof extendsToWeekNumber === "number"
						? `[${weekNumber}..${extendsToWeekNumber}]`
						: `[${weekNumber}]`,
			},
		},
	});

	const response = await request.send();
	return response.data[properties.data];
};

export const homeworkFromIntervals = async (
	session: SessionHandle,
	tab: TabLocation,
	startDate: Date,
	endDate: Date,
): Promise<any> => {
	startDate = getUTCDate(startDate);
	endDate = getUTCDate(endDate);

	const startWeekNumber = translateToWeekNumber(startDate, session.instance.firstMonday);
	const endWeekNumber = translateToWeekNumber(endDate, session.instance.firstMonday);

	return homeworkFromWeek(session, tab, startWeekNumber, endWeekNumber);
};
