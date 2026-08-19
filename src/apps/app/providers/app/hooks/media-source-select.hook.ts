import { IMediaSource } from "@media-source";
import { createSignal } from "solid-js";

export const useMediaSourceSelect = () => {
	const [ids, setIds] = createSignal<Record<string, IMediaSource | undefined>>({});

	const toggle = (mediaSource: IMediaSource) => {
		setIds((prev) => {
			const next = { ...prev };
			if (next[mediaSource.id]) delete next[mediaSource.id];
			else if (Object.keys(next).length < 100) next[mediaSource.id] = mediaSource;
			return next;
		});
	};

	const clear = () => {
		setIds({});
	};

	return { ids, toggle, clear };
};
