import { getUTCTime } from "./date";

export const translateToWeekNumber = (dateToTranslate: Date, startDay: Date): number => {
	const daysDiff = Math.floor((getUTCTime(dateToTranslate) - getUTCTime(startDay)) / (1000 * 60 * 60 * 24));
	return 1 + Math.floor(daysDiff / 7);
};
