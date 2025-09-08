import { useApi } from "@common";
import { type IMediaSource } from "@media-source";
import { useLibrary, UserApi } from "@user";
import dayjs from "dayjs";
import { createEffect, createResource, createSignal } from "solid-js";

export const useTimeline = () => {
	const library = useLibrary();
	const api = useApi();
	const user = new UserApi(api.client);
	const timeline = structuredClone(library?.monthlyPlayActivity()?.sort((a, b) => +b.date - +a.date));
	const [startIndex, setStartIndex] = createSignal(0);
	const [data, setData] = createSignal<
		{
			month: string;
			data: IMediaSource[];
		}[]
	>([]);

	const [fetcher] = createResource(
		startIndex,
		async (startIndex) => {
			if (startIndex < 0 || !timeline) return [];
			const months = timeline.splice(startIndex, 5);
			const promises = months.map((m) => {
				const start = dayjs(m.date).startOf("month").format("YYYY-MM-DD");
				const end = dayjs(m.date).endOf("month").format("YYYY-MM-DD");
				return user.getMostPlayed({ from: new Date(start), to: new Date(end), limit: 10 });
			});

			if (timeline.length === 0) setStartIndex(-1);

			const data = await Promise.all(promises);
			return months.map((m, i) => ({
				month: dayjs(m.date).format("MMMM YYYY"),
				data: data[i],
			}));
		},
		{ initialValue: [] }
	);

	createEffect(() => setData((d) => [...d, ...fetcher()]));

	const isLoading = () => fetcher.loading;

	const loadNext = () => {
		setStartIndex((i) => i + 5);
	};

	return {
		loadNext,
		data,
		isLoading,
	};
};
