import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";

dayjs.extend(relative);

export const secondsToTime = (totalSeconds: number): string => {
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return [hours, minutes, seconds]
		.map((v) => (v < 10 ? "0" + v : v))
		.filter((v, i) => v !== "00" || i > 0)
		.join(":");
};

export const getRelativeTime = (time: Date | string): string => {
	const dayDifference = dayjs(time).diff(dayjs(), "day");
	if (dayDifference >= 7) {
		return "on " + dayjs(time).format("D MMM YYYY");
	} else {
		return dayjs().to(time);
	}
};
