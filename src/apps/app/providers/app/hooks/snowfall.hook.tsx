import { useScreen } from "@common/hooks";
import { TimeUtil } from "@common/utils";
import { RandomUtil } from "@common/utils/random.util";
import { useSettings } from "@settings/hooks";
import { createEffect, onCleanup } from "solid-js";

const amountRange = [0.5, 8] as const; // average amount per 100px screen width
const durationRange = [2, 8] as const;
const randomDurationMultiplier = 2;

const getValueFromRange = (range: readonly [number, number], value: number, reverse?: boolean) => {
	const [min, max] = range;
	const rangeSize = max - min;
	const percentage = value / 100;
	return reverse ? min + rangeSize * percentage : max - rangeSize * percentage;
};

class Snowflake {
	element: HTMLElement;
	private duration: number;
	private iterationCount: number;

	constructor(duration: number, iterationCount: number) {
		this.element = document.createElement("div");
		this.element.classList.add("fixed", "top-0", "bg-white", "z-50", "rounded-full", "aspect-square");
		this.duration = duration;
		this.iterationCount = iterationCount;
	}

	start() {
		this.element.style.left = RandomUtil.number(0, 100) + "%";
		this.element.style.opacity = RandomUtil.number(5, 50) + "%";
		this.element.style.width = RandomUtil.number(2, 6) + "px";
		this.element.style.filter = `blur(${RandomUtil.number(0, 4)}px)`;

		const randomDuration = RandomUtil.number(this.duration, this.duration * randomDurationMultiplier, 1);
		this.element.style.animation = `fall ${randomDuration}s linear ${this.iterationCount || "infinite"}`;

		this.element.onanimationend = () => this.reset();
	}

	private reset() {
		this.element.style.animation = "none";
		setTimeout(() => this.start());
	}

	stop() {
		this.element.onanimationend = null;
		this.element.style.transition = "opacity 1s linear";
		this.element.style.opacity = "0%";

		setTimeout(() => this.element.remove(), 1000);
	}
}

export const useSnowfall = () => {
	if (!TimeUtil.isNearNewYear()) return;

	const snowflakePool: Snowflake[] = [];
	let createInterval: NodeJS.Timeout | null = null;
	const { settings } = useSettings();
	const screen = useScreen();

	createEffect(() => {
		settings["app.snowfall.enabled"]
			? start(settings["app.snowfall.amount"], settings["app.snowfall.speed"], screen.size)
			: stop();
	});

	const start = (amount: number, speed: number, screenSize: number) => {
		stop();

		const duration = getValueFromRange(durationRange, speed);

		const randomMultiplier = (1 + randomDurationMultiplier) / 2;
		const amountOnScreen = ((getValueFromRange(amountRange, amount, true) * screenSize) / 100) * randomMultiplier;

		const complexity = (amount * 1.25 + speed * 0.75) / 2;
		const iteration = complexity > 50 ? 0 : complexity > 50 ? 2 : 1;

		let i = 0;
		createInterval = setInterval(() => {
			i++;
			const snowflake = new Snowflake(duration, iteration);
			snowflakePool.push(snowflake);
			document.body.appendChild(snowflake.element);
			snowflake.start();

			if (i >= amountOnScreen && createInterval) clearInterval(createInterval);
		}, ((duration * randomMultiplier) / amountOnScreen) * 1000);
	};

	const stop = () => {
		if (createInterval) clearInterval(createInterval);
		for (const snowflake of snowflakePool) snowflake.stop();
	};

	onCleanup(stop);
};
