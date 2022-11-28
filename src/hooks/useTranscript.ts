import axios from "axios";
import { Accessor, createResource, createSignal, onCleanup } from "solid-js";
import { clearTimeout as wtClearTimeout, setTimeout as wtSetTimeout } from "worker-timers";
import { IS_DESKTOP } from "../constants";
import { FormattedTranscript } from "./useVideoTranscript";

type Params = {
	transcripts: FormattedTranscript[];
	startedAt: Date | null;
};

const bcSetTimeout = IS_DESKTOP ? setTimeout : wtSetTimeout;
const bcClearTimeout = IS_DESKTOP ? clearTimeout : wtClearTimeout;

const getDelay = async () => {
	const start = Date.now();
	const time = await axios.get("https://worldtimeapi.org/api/ip");
	const end = Date.now();
	const current = new Date(time.data.datetime).getTime() - (end - start) / 2;
	const difference = end - current;
	return difference;
};

export const useTranscript = (params: Accessor<Params>) => {
	let updateTimeout: number | null = null;
	const [delay] = createResource(getDelay);
	const [index, setIndex] = createSignal(-1);

	onCleanup(() => {
		updateTimeout && bcClearTimeout(updateTimeout);
	});

	const currentTime = () => Date.now() - (delay() || 0);

	const start = () => {
		updateTimeout && bcClearTimeout(updateTimeout);
		updateTimeout = null;
		setIndex(-1);

		const startedAt = params().startedAt;
		if (!startedAt) return;

		const elapsed = currentTime() - new Date(startedAt).getTime();
		const data = params().transcripts;

		let initialIndex = data.findIndex((t) => elapsed <= t.end);
		const transcript = data.at(initialIndex);
		if (!transcript) return;

		let delay = 0;
		if (elapsed >= transcript.start) {
			// current
			delay = transcript.end - elapsed;
		} else {
			// next
			const next = data[initialIndex];
			initialIndex--;
			if (!next) return;
			delay = next.start - elapsed;
		}
		setIndex(initialIndex);

		updateTimeout = bcSetTimeout(updateActiveIndex, delay);
	};

	const updateActiveIndex = () => {
		const startedAt = params().startedAt;
		if (!startedAt) return;

		setIndex((v) => v + 1);
		const elapsed = currentTime() - new Date(startedAt).getTime();
		const data = params().transcripts;
		const next = data.at(index() + 1);

		if (!next) return;
		const delay = Math.max(next.start - elapsed, 0);
		updateTimeout = bcSetTimeout(updateActiveIndex, delay);
	};

	return {
		start,
		index,
	};
};
