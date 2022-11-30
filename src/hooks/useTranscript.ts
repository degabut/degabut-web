import { setTimeout } from "@utils/timers";
import { Accessor, createEffect, createSignal } from "solid-js";
import { clearTimeout } from "worker-timers";
import { FormattedTranscript } from "./useVideoTranscript";

type Params = {
	transcripts: FormattedTranscript[];
	elapsed: number;
};

export const useTranscript = (params: Accessor<Params>) => {
	const [index, setIndex] = createSignal(-1);
	let optimisticUpdateTimeout: number | null = null;

	createEffect(() => {
		optimisticUpdateTimeout && clearTimeout(optimisticUpdateTimeout);
		optimisticUpdateTimeout = null;

		const elapsed = params().elapsed;
		const data = params().transcripts;

		let index = data.findIndex((t) => elapsed <= t.end);
		const transcript = data.at(index);
		if (!transcript) return;

		let delay = 0;
		if (elapsed >= transcript.start) {
			// current
			delay = transcript.end - elapsed;
		} else {
			// next
			const next = data[index];
			index--;
			if (!next) return;
			delay = next.start - elapsed;
		}

		const last = data.at(-1);
		if (last && elapsed >= last.end) setIndex(data.length - 1);
		else setIndex(index);

		if (delay < 1000 && elapsed < data[data.length - 1].end) {
			optimisticUpdateTimeout = setTimeout(() => setIndex((v) => v + 1), delay);
		}
	});

	return {
		index,
	};
};
