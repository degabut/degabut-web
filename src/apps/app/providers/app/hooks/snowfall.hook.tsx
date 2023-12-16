import { useScreen } from "@common/hooks";
import { TimeUtil } from "@common/utils";
import { RandomUtil } from "@common/utils/random.util";
import { useSettings } from "@settings/hooks";
import { createEffect, onCleanup } from "solid-js";

const createSnowflake = (duration: number) => {
	const snowflake = document.createElement("div");
	snowflake.classList.add("fixed", "top-0", "bg-white", "rounded-full", "z-50");

	snowflake.style.left = Math.random() * window.innerWidth + "px";
	snowflake.style.opacity = RandomUtil.randomInt(5, 25) + "%";
	snowflake.style.width = RandomUtil.randomInt(2, 6) + "px";
	snowflake.style.height = snowflake.style.width;
	document.body.appendChild(snowflake);

	const randomDuration = RandomUtil.randomInt(duration, duration * 2);
	setTimeout(() => {
		snowflake.style.top = window.innerHeight + "px";
		snowflake.style.transition = `top ${randomDuration}s linear`;
	}, 0);
	setTimeout(() => snowflake.remove(), randomDuration * 1000 + 500);
};

const amountRange = [1, 4] as const; // average amount per 100px screen width
const durationRange = [2, 8] as const;

const getValueFromRange = (range: readonly [number, number], value: number, reverse?: boolean) => {
	const [min, max] = range;
	const rangeSize = max - min;
	const percentage = value / 100;
	return reverse ? min + rangeSize * percentage : max - rangeSize * percentage;
};

export const useSnowfall = () => {
	if (!TimeUtil.isNearNewYear()) return;

	let interval: NodeJS.Timer;
	const { settings } = useSettings();
	const screen = useScreen();

	createEffect(() => {
		settings["app.snowfall.enabled"]
			? start(settings["app.snowfall.amount"], settings["app.snowfall.speed"], screen.size)
			: stop();
	});

	const start = (amount: number, speed: number, screenSize: number) => {
		if (interval) stop();

		const duration = getValueFromRange(durationRange, speed);
		const amountOnScreen = (getValueFromRange(amountRange, amount, true) * screenSize) / 100;
		const delay = (duration / amountOnScreen) * 1000;

		interval = setInterval(() => createSnowflake(duration), delay);
	};

	const stop = () => clearInterval(interval);

	onCleanup(stop);
};
