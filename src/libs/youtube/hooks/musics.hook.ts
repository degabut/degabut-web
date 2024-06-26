import { DelayUtil, useApi } from "@common";
import { createEffect, createMemo, createResource, createSignal } from "solid-js";
import { YouTubeMusicApi } from "../apis";

type Params = {
	debounce?: number;
};

export const useSearchYouTubeMusic = (params: Params = {}) => {
	const api = useApi();
	const youtubeMusic = new YouTubeMusicApi(api.youtubeClient);

	const [keyword, setKeyword] = createSignal("");
	const [debouncedKeyword, _setDebouncedKeyword] = createSignal("");

	const [result] = createResource(debouncedKeyword, youtubeMusic.search, { initialValue: [] });

	const flatResult = createMemo(() => {
		const data = result();
		if (!data)
			return {
				items: [],
				divider: {},
			};

		const items = data
			.map((i) => i.items)
			.flat()
			.filter((i) => !!i);

		let currentKey = 0;
		const divider = data.reduce((curr, item, index, arr) => {
			if (index > 0) currentKey += arr.at(index - 1)?.items.length || 0;
			curr[currentKey] = item.title;
			return curr;
		}, {} as Record<number, string>);

		return { items, divider };
	});

	const setDebouncedKeyword = DelayUtil.debounce((v: string) => _setDebouncedKeyword(v), params.debounce || 250);
	createEffect(() => setDebouncedKeyword(keyword()));

	const isLoading = () => result.loading;

	return {
		result,
		flatResult,
		keyword,
		setKeyword,
		debouncedKeyword,
		isLoading,
	};
};
