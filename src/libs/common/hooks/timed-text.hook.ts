import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js";

export type TimedText = {
	text: string;
	startTime: number;
	endTime?: number;
};

type Params = {
	timedTexts: TimedText[];
	elapsed: number;
};

export const useTimedText = (params: Accessor<Params>) => {
	const [index, setIndex] = createSignal(-1);
	let optimisticUpdateTimeout: NodeJS.Timeout | null = null;

	onCleanup(() => clearUpdateTimeout());

	createEffect(() => {
		clearUpdateTimeout();

		const elapsed = params().elapsed;
		const data = params().timedTexts;

		const indexes = [];
		for (const [i, t] of data.entries()) {
			if (t.startTime <= elapsed && (!t.endTime || t.endTime >= elapsed)) indexes.push(i);
		}

		let index =
			indexes.length > 1
				? indexes[indexes.length - 1]
				: data.findIndex((t) => elapsed <= (t.endTime ?? Infinity));
		const timedText = data.at(index);
		if (!timedText) return;

		let delay = 0;
		const next = data.at(elapsed >= timedText.startTime ? index + 1 : index--);
		if (next) delay = next.startTime - elapsed;

		const last = data.at(-1);
		if (last && elapsed >= (last.endTime ?? Infinity)) setIndex(data.length - 1);
		else setIndex(index);

		if (delay < 5000 && elapsed < (data[data.length - 1].endTime ?? Infinity) && !last) {
			optimisticUpdateTimeout = setTimeout(() => setIndex((v) => v + 1), delay);
		}
	});

	const clearUpdateTimeout = () => {
		optimisticUpdateTimeout && clearTimeout(optimisticUpdateTimeout);
		optimisticUpdateTimeout = null;
	};

	return {
		index,
	};
};
